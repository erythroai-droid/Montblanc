// utils/format.js
export const formatForUrl = (str) =>
	str
		?.toLowerCase()
		?.replace(/[,]/g, '')
		?.replace(/[^a-z0-9]+/g, '-')
		?.replace(/-+/g, '-')
		?.replace(/^-|-$/g, '');

export const formatPrice = (price) => parseFloat(price)?.toFixed(2);