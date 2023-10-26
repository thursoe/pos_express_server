const { catchAsyncError } = require("../middlewares");
const { Location } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { excelToJson, downloadExcel } = require("../utils/xlsx.js");
const { validateLocation } = require("../utils/validation/validation.js");

const index = catchAsyncError(async (_, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.status(200).json({ status: true, data: locations });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving the location.",
      errors: err.message,
    });
  }
});

const store = catchAsyncError(async (req, res) => {
  const data = await validateLocation(req.body);
  const location = new Location(data);

  await location.save();
  res.status(200).send({
    status: true,
    message: "Location created successfully!",
    data: [location],
  });
});

const show = catchAsyncError(async (req, res, next) => {
  const id = req.params?.id;
  const location = await Location.findById(id);
  if (!location)
    return next(new ErrorHandler(`Not found location with id:${id}`, 404));

  res.status(200).json({ status: true, data: [location] });
});

const update = catchAsyncError(async (req, res, next) => {
  const id = req.params?.id;
  const updatedLocation = await validateLocation(req.body);
  const location = await Location.findByIdAndUpdate(id, updatedLocation);
  if (!location)
    return next(
      new ErrorHandler(
        `Cannot update location with id:${id}. Maybe entry was not found!`,
        404
      )
    );
  await location.save();
  res.status(200).send({
    status: true,
    message: "Location updated successfully!",
  });
});

const destroy = catchAsyncError(async (req, res) => {
  const id = req.params?.id;
  await Location.findByIdAndDelete(id);
  res.send({
    status: true,
    message: "Location deleted successfully!",
  });
});

const importExcel = catchAsyncError(async (req, res) => {
  const jsonResult = excelToJson(req.file?.buffer);

  for (const data of await Promise.all(jsonResult.map(validateLocation))) {
    await new Location(data).save();
  }

  res.status(200).send({
    status: true,
    message: "Location uploaded successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await Location.find({});
  const jsonData = data.map((doc) => doc.toJSON());
  const excelFileName = "exported_location_data.xlsx";

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
