const Joi = require("joi");

const partnerSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string(),
  city: Joi.string(),
  phone: Joi.string(),
  image: Joi.any(),
  code: Joi.string().optional(),
  isCustomer: Joi.boolean().default(false),
  isCompany: Joi.boolean().default(false),
  active: Joi.boolean().default(true),
}).options({ abortEarly: false });

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  ref: Joi.string(),
  salePrice: Joi.number().required(),
  marginProfit: Joi.number(),
  purchasePrice: Joi.number(),
  barcode: Joi.string(),
  category: Joi.string(),
  tax: Joi.number().default(0.0),
  expiredAt: Joi.string(),
  image: Joi.any(),
  availableInPos: Joi.string(),
  active: Joi.boolean().default(true),
}).options({ abortEarly: false });

const lineSchema = Joi.object({
  product: Joi.string().required(),
  qty: Joi.number().default(0).required(),
  tax: Joi.number().default(0.0),
  subTaxTotal: Joi.number().default(0.0),
  unitPrice: Joi.number().default(0.0).required(),
  subTotal: Joi.number().default(0.0).required(),
}).options({ abortEarly: false });

const orderSchema = Joi.object({
  orderDate: Joi.date().default(Date.now),
  user: Joi.string().required(),
  partner: Joi.string().required(),
  location: Joi.string().required(),
  lines: Joi.array().items(lineSchema),
  state: Joi.string(),
  note: Joi.string(),
  taxTotal: Joi.number().required(),
  total: Joi.number().required(),
}).options({ abortEarly: false });

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).required(),
  image: Joi.any(),
  role: Joi.string().hex().length(24),
}).options({ abortEarly: false });

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  active: Joi.boolean().default(false),
}).options({ abortEarly: false });

const locationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  comment: Joi.string(),
  active: Joi.boolean().default(true),
}).options({ abortEarly: false });

const stockSchema = Joi.object({
  product: Joi.string().required(),
  onHand: Joi.number().required(),
}).options({ abortEarly: false });

const roleSchema = Joi.object({
  name: Joi.string().required(),
}).options({ abortEarly: false });

const adjustmentSchema = Joi.object({
  product: Joi.string(),
  productName: Joi.string(),
  productRef: Joi.string(),
  productBarcode: Joi.string().required(),
  quantity: Joi.number().required(),
  adjustmentReason: Joi.string(),
}).options({ abortEarly: false });

module.exports = {
  userSchema,
  categorySchema,
  locationSchema,
  partnerSchema,
  productSchema,
  orderSchema,
  stockSchema,
  roleSchema,
  adjustmentSchema,
};
