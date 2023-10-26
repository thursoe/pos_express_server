const { catchAsyncError } = require("../middlewares");
const { Category } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { validateCategory } = require("../utils/validation/validation.js");
const { excelToJson, jsonToExcel, downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ status: true, data: categories });
});

const store = catchAsyncError(async (req, res) => {
  const data = await validateCategory(req.body);
  const category = new Category(data);

  await category.save();
  res.status(200).send({
    status: true,
    message: "Category created successfully!",
    data: [category],
  });
});

const show = catchAsyncError(async (req, res, next) => {
  const catgId = req.params.id;
  const category = await Category.findById(catgId);
  if (!category)
    return next(new ErrorHandler(`Not found Category with id:${catgId}`, 404));

  res.status(200).json({ status: true, data: [category] });
});

const update = catchAsyncError(async (req, res, next) => {
  const catgId = req.params.id;
  const updatedCatg = await validateCategory(req.body);
  const category = await Category.findByIdAndUpdate(catgId, updatedCatg);
  if (!category)
    return next(
      new ErrorHandler(
        `Cannot update category with id:${catgId}. Maybe entry was not found!`,
        404
      )
    );
  await category.save();
  res.status(200).send({
    status: true,
    message: "Category updated successfully!",
  });
});

const destroy = catchAsyncError(async (req, res) => {
  const catgId = req.params.id;
  await Category.findByIdAndDelete(catgId);
  res.send({
    message: "Category deleted successfully!",
  });
});

const importExcel = catchAsyncError(async (req, res) => {
  const jsonResult = excelToJson(req.file?.buffer);

  // Update existing documents and
  // insert new ones if necessary based on the name field.
  let bulkOps = [];

  for (const data of await Promise.all(jsonResult.map(validateCategory))) {
    bulkOps.push({
      updateOne: {
        filter: { name: data.name },
        update: { $set: data },
        upsert: true,
      },
    });
  }

  await Category.bulkWrite(bulkOps);

  res.status(200).send({
    status: true,
    message: "Category uploaded successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await Category.find({});
  const jsonData = data.map((doc) => doc.toJSON());
  const excelFileName = "exported_data.xlsx";

  downloadExcel(jsonData, excelFileName, res);
});

module.exports = {
  index,
  store,
  show,
  update,
  destroy,
  importExcel,
  exportExcel,
};
