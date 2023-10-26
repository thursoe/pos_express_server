const { catchAsyncError } = require("../middlewares");
const { SaleOrderLine } = require("../models");
const { downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  const saleline = await SaleOrderLine.find().sort({ name: 1 });
  res.status(200).json({ status: true, data: saleline });
});

const show = catchAsyncError(async (req, res, next) => {
  const lineId = req.params.id;
  const saleline = await SaleOrderLine.findById(lineId);
  if (!saleline)
    return next(
      new ErrorHandler(`Not found SaleOrderLine with id:${lineId}`, 404)
    );

  res.status(200).json({ status: true, data: [saleline] });
});

const destroy = catchAsyncError(async (req, res) => {
  const lineId = req.params.id;
  await SaleOrderLine.findByIdAndDelete(lineId);
  res.send({
    message: "SaleOrderLine deleted successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await SaleOrderLine.find({});

  // Map the data to a new array, extracting relevant information
  // Destructure the document and exclude the 'product' field
  const jsonData = data.map((doc) => {
    const { product, ...obj } = doc.toJSON();
    return {
      productName: product.name,
      orderId: obj.orderId?.orderRef,
      ...obj,
    };
  });

  const excelFileName = "exported_order_data.xlsx";

  downloadExcel(jsonData, excelFileName, res);
});

module.exports = { index, show, destroy, exportExcel };
