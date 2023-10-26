const { catchAsyncError } = require("../middlewares");
const { PurchaseOrderLine } = require("../models");
const { downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  const purchaseLine = await PurchaseOrderLine.find().sort({ name: 1 });
  res.status(200).json({ status: true, data: purchaseLine });
});

const show = catchAsyncError(async (req, res, next) => {
  const lineId = req.params.id;
  const purchaseLine = await PurchaseOrderLine.findById(lineId);
  if (!purchaseLine)
    return next(
      new ErrorHandler(`Not found PurchaseOrderLine with id:${lineId}`, 404)
    );

  res.status(200).json({ status: true, data: [purchaseLine] });
});

const destroy = catchAsyncError(async (req, res) => {
  const lineId = req.params.id;
  await PurchaseOrderLine.findByIdAndDelete(lineId);
  res.send({
    message: "PurchaseOrderLine deleted successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await PurchaseOrderLine.find({});

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

  const excelFileName = "exported_purchase_order_data.xlsx";

  downloadExcel(jsonData, excelFileName, res);
});

module.exports = { index, show, destroy, exportExcel };
