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
};

module.exports = { FAKESTORE_BASE_URL, endpoints, defaultHeaders };
