const { catchAsyncError } = require("../middlewares");
const { User, Role } = require("../models");
var bcrypt = require("bcryptjs");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { validateUser } = require("../utils/validation/validation.js");
const { s3GetURL, uploadFileToS3 } = require("../utils/s3Helper.js");

const index = catchAsyncError(async (req, res, next) => {
  try {
    const users = await User.find().populate("role", "name").lean().exec();

    // Await the asynchronous operations to update the signed URL for the image
    await Promise.all(
      users.map(async (user) => {
        user?.image && (user.image = await s3GetURL(user.image));
      })
    );

    res.status(200).json({ status: true, data: users });
  } catch (err) {
    return next(
      new ErrorHandler("Some error occurred while retrieving the user.", 500)
    );
  }
});

const store = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = await validateUser(req.body);
  const roleList = await Role.find({}).exec();
  const role = roleList.find(
    (r) => r.id === req.body.role || r.name === "user"
  );

  const user = new User({
    username: username,
    email: email,
    password: bcrypt.hashSync(
      typeof password !== "string" ? password.toString() : password,
      8
    ),
    role: role?.id,
  });

  // Upload image to S3 bucket
  user.image = req.file && (await uploadFileToS3("user", req.file, user.id));

  await user.save();
  res
    .status(200)
    .send({ status: true, message: "User created sucessfully!", data: [user] });
});

const show = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate("role", "name").exec();

  if (!user)
    return next(new ErrorHandler(`Not found User with id:${userId}`, 404));

  // Update the image with the signedUrl
  user?.image && (user.image = await s3GetURL(user.image));

  res.status(200).json({ status: true, data: [user] });
});

const update = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const updatedData = await validateUser(req.body);
  const user = await User.findByIdAndUpdate(userId, updatedData);
  if (!user) {
    return next(
      new ErrorHandler(
        `Cannot update user with id:${userId}. Maybe User was not found!`,
        404
      )
    );
  }

  // Update image
  req.file && (await uploadFileToS3("user", req.file, user.id));

  res
    .status(200)
    .json({ status: true, message: "User was updated successfully." });
});

const destroy = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndRemove(userId);
  if (!user)
    return next(
      new ErrorHandler(
        `Cannot delete user with id:${userId}. Maybe user was not found!`,
        404
      )
    );

  res.send({
    status: true,
    message: "User was deleted successfully!",
  });
});

module.exports = { index, store, show, update, destroy };
