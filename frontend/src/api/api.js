import axios from "axios";

const API_BASE_URL = (
	process.env.NEXT_PUBLIC_API_URL || "/backend-api"
).replace(/\/$/, "");

const httpRequest = async (method, url, data, config = {}) => {
	try {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		const headers = {
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(config.headers || {}),
		};

		const targetUrl = url.startsWith("http://") || url.startsWith("https://")
			? url
			: `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

		const response = await axios({
			method,
			url: targetUrl,
			data,
			headers,
			withCredentials: true,
			...config,
		});
		return response.data;
	} catch (error) {
		console.error(`${method} ${url}:`, {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data
		});
		throw error;
	}
};

const api = {
	products: {
		getProduct: (productId) => httpRequest("GET", `/products?product_id=${productId}`),
		getProductsList: (categoryId) => httpRequest("GET", `/products?category_id=${categoryId}`),
		getAllProductsSpecials: () => httpRequest("GET", `/products`),
	},
	category: {
		getCategories: () => httpRequest("GET", `/categories`),
	},
	cart: {
		postOrder: (orderData) => httpRequest("POST", `/order`, orderData),
	},
	auth: {
		login: (loginData) => httpRequest("POST", `/api/login`, loginData),
		register: (registerData) => httpRequest("POST", `/api/register`, registerData),
		me: () => httpRequest("GET", `/api/me`),
		logout: () => httpRequest("POST", `/api/logout`),
	},
	admin: {
		getStats: () => httpRequest("GET", `/api/admin/stats`),
		getOrders: () => httpRequest("GET", `/api/admin/orders`),
		deleteOrder: (id) => httpRequest("DELETE", `/api/admin/orders/${id}`),
		getProducts: () => httpRequest("GET", `/api/admin/products`),
		createProduct: (formData) => httpRequest("POST", `/api/admin/products`, formData),
		deleteProduct: (id) => httpRequest("DELETE", `/api/admin/products/${id}`),
		getCategories: () => httpRequest("GET", `/api/admin/categories`),
		createCategory: (params) => httpRequest("POST", `/api/admin/categories?${new URLSearchParams(params).toString()}`),
		deleteCategory: (id) => httpRequest("DELETE", `/api/admin/categories/${id}`),
	}
};

export { API_BASE_URL };
export default api;
