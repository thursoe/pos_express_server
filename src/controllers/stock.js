const { catchAsyncError } = require("../middlewares");
const { Stock } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { validateStock } = require("../utils/validation/validation.js");
const { downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  const stockList = await Stock.find();
  res.status(200).json({ status: true, data: stockList });
});

const store = catchAsyncError(async (req, res) => {
  const data = await validateStock(req.body);
  const stock = new Stock(data);

  console.log(stock);
  await stock.save();
  res.status(200).send({
    status: true,
    message: "Stock created successfully!",
    data: [stock],
  });
});

const show = catchAsyncError(async (req, res, next) => {
  const stockId = req.params.id;
  const stock = await Stock.findById(stockId);
  if (!stock)
    return next(new ErrorHandler(`Not found Stock with id:${stockId}`, 404));

  res.status(200).json({ status: true, data: [stock] });
});

const update = catchAsyncError(async (req, res, next) => {
  const stockId = req.params.id;
  const updatedCatg = await validateStock(req.body);
  const stock = await Stock.findByIdAndUpdate(stockId, updatedCatg);
  if (!stock)
    return next(
      new ErrorHandler(
        `Cannot update stock with id:${stockId}. Maybe entry was not found!`,
        404
      )
    );
  await stock.save();
  res.status(200).send({
    status: true,
    message: "Stock updated successfully!",
  });
});

const destroy = catchAsyncError(async (req, res) => {
  const stockId = req.params.id;
  await Stock.findByIdAndDelete(stockId);
  res.send({
    message: "Stock deleted successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await Stock.find({});

  // Map the data to a new array, extracting relevant information
  // Destructure the document and exclude the 'product' field
  const jsonData = data.map((doc) => {
    const { product, ...obj } = doc.toJSON();
    obj.productName = product.name;
    return obj;
  });

  const excelFileName = "exported_stock_data.xlsx";

  downloadExcel(jsonData, excelFileName, res);
});

module.exports = { index, store, show, update, destroy, exportExcel };
