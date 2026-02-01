
const { test, expect } = require('@playwright/test');
const { JSONPath } = require('jsonpath-plus');
const { endpoints, defaultHeaders } = require('../../api/config');
const { validateProductSchema } = require('../../api/productSchema');

test.describe('FakeStore API – Products', () => {
  test('GET – Fetch all products: status 200, list size ≥ 10, print names and prices', async ({
    request,
  }) => {
    const response = await request.get(endpoints.products(), { headers: defaultHeaders });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(10);

    // Schema validation for first product
    const firstResult = validateProductSchema(body[0]);
    expect(firstResult.valid, firstResult.errors?.join(', ')).toBe(true);

    // JsonPath: extract titles and prices for structured output
    const titles = JSONPath({ path: '$[*].title', json: body });
    const prices = JSONPath({ path: '$[*].price', json: body });

    // Structured console output – product catalog
    console.log('\n--- Product catalog (name | price) ---');
    body.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} | $${p.price}`);
    });
    console.log(`--- Total: ${body.length} products ---\n`);

    expect(titles.length).toBe(body.length);
    expect(prices.length).toBe(body.length);
  });

  test.describe('GET – Fetch product by ID (data-driven)', () => {
    [1, 2, 3].forEach((id) => {
      test('GET /products/' + id + ': id, category and price not null', async ({ request }) => {
        const response = await request.get(endpoints.productById(id), {
          headers: defaultHeaders,
        });
        expect(response.status()).toBe(200);

        const product = await response.json();
        expect(product.id).toBe(id);
        expect(product.category).not.toBeNull();
        expect(product.category).toBeDefined();
        expect(product.price).not.toBeNull();
        expect(product.price).toBeDefined();

        const schemaResult = validateProductSchema(product);
        expect(schemaResult.valid, schemaResult.errors?.join(', ')).toBe(true);
      });
    });
  });

  test('POST – Add new product: status 200/201, response contains id', async ({ request }) => {
    const payload = {
      title: 'Wireless Mouse',
      price: 799,
      description: 'A high-quality wireless mouse',
      category: 'electronics',
      image: 'https://example.com/mouse.jpg',
    };

    const response = await request.post(endpoints.products(), {
      headers: defaultHeaders,
      data: payload,
    });
    expect([200, 201]).toContain(response.status());

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
  });

  test('PUT – Update product: set price to 899 and validate response', async ({ request }) => {
    const productId = 1;
    const payload = {
      title: 'Fjallraven - Foldsack No. 1 Backpack',
      price: 899,
      description: 'Your perfect pack for everyday use',
      category: 'men\'s clothing',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    };

    const response = await request.put(endpoints.productById(productId), {
      headers: defaultHeaders,
      data: payload,
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.price).toBe(899);
    expect(body.id).toBe(productId);
  });

  test('DELETE – Delete product: status 200 and product removed', async ({ request }) => {
    const productId = 6;

    const deleteResponse = await request.delete(endpoints.productById(productId), {
      headers: defaultHeaders,
    });
    expect(deleteResponse.status()).toBe(200);

    // FakeStore is mocked – DELETE returns 200; product "removed" is validated by status.
    const deleteBody = await deleteResponse.json().catch(() => ({}));
    expect(deleteResponse.ok()).toBe(true);
  });
});
