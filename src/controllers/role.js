const { catchAsyncError } = require("../middlewares");
const { Role } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { validateRole } = require("../utils/validation/validation.js");

const index = catchAsyncError(async (_, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.status(200).json({ status: true, data: roles });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving the role.",
      errors: err.message,
    });
  }
});

const store = catchAsyncError(async (req, res) => {
  const data = await validateRole(req.body);
  const role = new Role(data);

  await role.save();
  res.status(200).send({
    status: true,
    message: "Role created successfully!",
    data: [role],
  });
});

const show = catchAsyncError(async (req, res, next) => {
  const id = req.params?.id;
  const role = await Role.findById(id);
  if (!role)
    return next(new ErrorHandler(`Not found role with id:${id}`, 404));

  res.status(200).json({ status: true, data: [role] });
});

const update = catchAsyncError(async (req, res, next) => {
  const id = req.params?.id;
  const updatedLocation = await validateRole(req.body);
  const role = await Role.findByIdAndUpdate(id, updatedLocation);
  if (!role)
    return next(
      new ErrorHandler(
        `Cannot update role with id:${id}. Maybe entry was not found!`,
        404
      )
    );
  await role.save();
  res.status(200).send({
    status: true,
    message: "Role updated successfully!",
  });
});

const destroy = catchAsyncError(async (req, res) => {
  const id = req.params?.id;
  await Role.findByIdAndDelete(id);
  res.send({
    status: true,
    message: "Role deleted successfully!",
  });
});

module.exports = { index, store, show, update, destroy };
