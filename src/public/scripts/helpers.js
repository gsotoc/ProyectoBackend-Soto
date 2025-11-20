export const inc = (value) => parseInt(value) + 1;
export const dec = (value) => parseInt(value) - 1;
export const gt = (a, b) => a > b;
export const lt = (a, b) => a < b;
export const eq = (a, b) => a === b;

export const buildUrl = (originalUrl, page) => {
  const url = new URL(`http://localhost${originalUrl}`);
  url.searchParams.set('page', page);
  return url.search ? url.pathname + url.search : url.pathname;
};

export const multiply = (a, b) => a * b;

export const calculateTotal = (products) => {
  if (!products || products.length === 0) return '0.00';
  
  const total = products.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);
  
  return total.toFixed(2);
};

export function countCartItems(cart) {
  if (!cart || !cart.products) return 0;
  
  return cart.products.reduce((total, item) => total + item.quantity, 0);
}