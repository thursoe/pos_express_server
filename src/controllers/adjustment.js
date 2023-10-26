const { catchAsyncError } = require("../middlewares");
const { Adjustment, Stock, Product } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { validateAdjustment } = require("../utils/validation/validation.js");
const { excelToJson, downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  const categories = await Adjustment.find().sort({ name: 1 });
  res.status(200).json({ status: true, data: categories });
});

const importExcel = catchAsyncError(async (req, res) => {
  const jsonResult = excelToJson(req.file?.buffer);

  for (const data of await Promise.all(jsonResult.map(validateAdjustment))) {
    // Find product based on barcode
    const condition = { barcode: data.productBarcode };
    const product = await Product.findOne(condition);

    if (!product) throw new ErrorHandler("Oops! Product Lookup Error", 400);

    // Update stock and create adjustment concurrently
    const updateStockPromise = Stock.updateOne(
      { product: product.id },
      { $inc: { onHand: data?.quantity } },
      { upsert: true }
    );

    const createAdjustmentPromise = Adjustment.create(data);

    await Promise.all([updateStockPromise, createAdjustmentPromise]);
  }

  res.status(200).send({
    status: true,
    message: "Adjustment Completed: Inventory Updated!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await Adjustment.find({});
  const jsonData = data.map((doc) => doc.toJSON());
  const excelFileName = "inventory_adjustment-data.xlsx";

  downloadExcel(jsonData, excelFileName, res);
});

module.exports = { index, importExcel, exportExcel };
