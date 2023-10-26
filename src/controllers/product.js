const { catchAsyncError } = require("../middlewares");
const { Product } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { s3GetURL, uploadFileToS3 } = require("../utils/s3Helper.js");
const { validateProduct } = require("../utils/validation/validation.js");
const { excelToJson, downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    // Await the asynchronous operations to update the signed URL
    await Promise.all(
      products.map(async (product) => {
        product?.image && (product.image = await s3GetURL(product.image));
      })
    );

    res.status(200).json({ status: true, data: products });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving the product.",
    });
  }
});

const store = catchAsyncError(async (req, res) => {
  const data = await validateProduct(req.body);
  const product = new Product(data);

  // Upload image to S3 bucket
  product.image =
    req.file && (await uploadFileToS3("product", req.file, product.id));

  await new Product(product).save();
  res.status(200).json({ status: true, data: [product] });
});

const show = catchAsyncError(async (req, res, next) => {
  const id = req.params?.id;
  let product = await Product.findById(id).populate("category", "name");
  if (!product)
    return next(
      new ErrorHandler(
        `Cannot retrieve product with id:${id}. Maybe entry was not found!`,
        404
      )
    );

  // Update the image with the signedUrl
  product?.image && (product.image = await s3GetURL(product.image));

  res.status(200).json({ status: true, data: [product] });
});

const update = catchAsyncError(async (req, res, next) => {
  const id = req.params?.id;
  const updatedProduct = await validateProduct(req.body);
  const product = await Product.findByIdAndUpdate(id, updatedProduct);
  if (!product)
    return next(
      new ErrorHandler(
        `Cannot update product with id:${id}. Maybe entry was not found!`,
        404
      )
    );

  // Upload image to S3 bucket if it exists
  product.image =
    req.file && (await uploadFileToS3("product", req.file, product.id));

  res
    .status(200)
    .json({ status: true, message: "Product was updated successfully." });
});

const destroy = catchAsyncError(async (req, res) => {
  const id = req.params?.id;
  await Product.findByIdAndRemove(id);
  res.send({
    status: true,
    message: "Product deleted successfully!",
  });
});

const importExcel = catchAsyncError(async (req, res) => {
  const jsonResult = excelToJson(req.file?.buffer);

  // Update existing documents and
  // insert new ones if necessary based on the name field.
  let bulkOps = [];

  for (const data of await Promise.all(jsonResult.map(validateProduct))) {
    bulkOps.push({
      updateOne: {
        filter: { barcode: data.barcode },
        update: { $set: data },
        upsert: true,
      },
    });
  }

  await Product.bulkWrite(bulkOps);

  res.status(200).send({
    status: true,
    message: "Product uploaded successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await Product.find({});
  const jsonData = data.map((doc) => doc.toJSON());
  const excelFileName = "exported_product_data.xlsx";

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
