/**
 * Product response schema validation using JSON Schema (ajv).
 */
const Ajv = require('ajv');
const { readFileSync } = require('fs');
const { join } = require('path');

const schemaPath = join(__dirname, '..', 'schemas', 'product.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

const ajv = new Ajv({ strict: false });
const validateProduct = ajv.compile(schema);


function validateProductSchema(product) {
  const valid = validateProduct(product);
  if (!valid) {
    return { valid: false, errors: validateProduct.errors.map((e) => `${e.instancePath} ${e.message}`) };
  }
  return { valid: true };
}

module.exports = { validateProductSchema };
