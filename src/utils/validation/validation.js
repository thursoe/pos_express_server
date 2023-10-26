const {
  userSchema,
  categorySchema,
  locationSchema,
  partnerSchema,
  productSchema,
  orderSchema,
  stockSchema,
  roleSchema,
  adjustmentSchema,
} = require("./schema.js");

const createValidator = (schema) => async (data) =>
  await schema.validateAsync(data);

module.exports = {
  validateUser: createValidator(userSchema),
  validateCategory: createValidator(categorySchema),
  validateLocation: createValidator(locationSchema),
  validatePartner: createValidator(partnerSchema),
  validateProduct: createValidator(productSchema),
  validateOrder: createValidator(orderSchema),
  validateStock: createValidator(stockSchema),
  validateRole: createValidator(roleSchema),
  validateAdjustment: createValidator(adjustmentSchema),
};
