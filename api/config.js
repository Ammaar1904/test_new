/**
 * FakeStore API – base URL and reusable request configuration.
 * https://fakestoreapi.com/
 */
const FAKESTORE_BASE_URL = 'https://fakestoreapi.com';

const endpoints = {
  products: () => `${FAKESTORE_BASE_URL}/products`,
  productById: (id) => `${FAKESTORE_BASE_URL}/products/${id}`,
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

module.exports = { FAKESTORE_BASE_URL, endpoints, defaultHeaders };
