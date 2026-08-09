import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api.js";

// Normalizer ensures consistent product shape
const normalizeProduct = (product) => ({
  id: product.id,
  title: product.name,
  price: parseFloat(product.price),
  discount: product.discount || null,
  image: `data:image/png;base64,${product.image}`,
  category: product.categoryName,
  specialOffers: product.specialOffers || false,
});

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (catId, { getState }) => {
    const state = getState();
    const cached = state.products.byCategory[catId];
    if (cached?.status === "succeeded") {
      return { catId, products: cached.products };
    }
    const res = await api.products.getProductsList(catId);
    return { catId, products: res.map(normalizeProduct) };
  }
);

export const fetchProductsSpecials = createAsyncThunk(
  "products/fetchSpecials",
  async (_, { getState }) => {
    const state = getState();
    if (
      state.products.specialItems.length &&
      state.products.specialStatus === "succeeded"
    ) {
      return state.products.specialItems; 
    }
    const res = await api.products.getAllProductsSpecials();
    return res.map(normalizeProduct);
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    byCategory: {},
    items: [], 
    specialItems: [],
    specialStatus: "idle",
    loading: false, 
    error: null, 
  },
  reducers: {
    clearProductsCache(state) {
      state.byCategory = {};
      state.items = [];
      state.specialItems = [];
      state.specialStatus = "idle";
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        const catId = action.meta.arg;
        state.byCategory[catId] = {
          ...state.byCategory[catId],
          status: "loading",
          error: null,
        };
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        const { catId, products } = action.payload;
        state.byCategory[catId] = {
          products,
          status: "succeeded",
          error: null,
        };
        state.items = products;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        const catId = action.meta.arg;
        state.byCategory[catId] = {
          ...state.byCategory[catId],
          status: "failed",
          error: action.error.message,
        };
        state.loading = false;
        state.error = action.error.message;
      })

      // Specials fetch
      .addCase(fetchProductsSpecials.pending, (state) => {
        state.specialStatus = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsSpecials.fulfilled, (state, action) => {
        state.specialStatus = "succeeded";
        state.specialItems = action.payload; // already normalized
        state.loading = false;
      })
      .addCase(fetchProductsSpecials.rejected, (state, action) => {
        state.specialStatus = "failed";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProductsCache } = productsSlice.actions;
export default productsSlice.reducer;
