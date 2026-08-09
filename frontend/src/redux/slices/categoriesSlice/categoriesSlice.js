import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api.js";

export const fetchCategories = createAsyncThunk(
	"categories/fetchAll",
	async () => {
		try {
			const res = await api.category.getCategories();
			return res;
		}catch(e) {
		}
	}
);


const categoriesSlice = createSlice({
	name: "categories",
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default categoriesSlice.reducer;
