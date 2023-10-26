const { catchAsyncError } = require("../middlewares");
const { Partner } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { uploadFileToS3, s3GetURL } = require("../utils/s3Helper.js");
const { validatePartner } = require("../utils/validation/validation.js");
const { excelToJson, downloadExcel } = require("../utils/xlsx");

const index = catchAsyncError(async (_, res) => {
  try {
    const partners = await Partner.find().sort({ name: 1 });

    // Await the asynchronous operations to update the signed URL
    await Promise.all(
      partners.map(async (partner) => {
        partner?.image && (partner.image = await s3GetURL(partner.image));
      })
    );

    res.status(200).json({ status: true, data: partners });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving the partner.",
      errors: err.message,
    });
  }
});

const store = catchAsyncError(async (req, res) => {
  const updatedParter = await validatePartner(req.body);
  const partner = new Partner(updatedParter);

  // Upload image to S3 bucket
  partner.image =
    req.file && (await uploadFileToS3("partner", req.file, partner.id));

  await partner.save();
  res.status(200).send({
    status: true,
    message: "Partner created successfully!",
    data: [partner],
  });
});

const show = catchAsyncError(async (req, res) => {
  const id = req.params.id;
  const partner = await Partner.findById(id);
  if (!partner)
    return next(new ErrorHandler(`Not found partner with id:${id}`, 404));

  // Update the image with the signedUrl
  partner?.image && (partner.image = await s3GetURL(partner.image));

  res.status(200).json({ status: true, data: [partner] });
});

const update = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const data = await validatePartner(req.body);
  const partner = await Partner.findByIdAndUpdate(id, data);
  if (!partner)
    return next(
      new ErrorHandler(
        `Cannot update partner with id:${id}. Maybe entry was not found!`,
        404
      )
    );
  // Upload image to S3 bucket if it exists
  req.file && (await uploadFileToS3("partner", req.file, partner.id));

  await partner.save();
  res
    .status(200)
    .send({ status: true, message: "Partner updated successfully!" });
});

const destroy = catchAsyncError(async (req, res) => {
  const id = req.params.id;
  await Partner.findByIdAndDelete(id);
  res.send({
    status: true,
    message: "Partner deleted successfully!",
  });
});

const importExcel = catchAsyncError(async (req, res) => {
  const jsonResult = excelToJson(req.file?.buffer);

  // Update existing documents and
  // insert new ones if necessary based on the name field.
  let bulkOps = [];

  for (const data of await Promise.all(jsonResult.map(validatePartner))) {
    bulkOps.push({
      updateOne: {
        filter: { code: data.code },
        update: { $set: data },
        upsert: true,
      },
    });
  }

  await Partner.bulkWrite(bulkOps);

  res.status(200).send({
    status: true,
    message: "Partner uploaded successfully!",
  });
});

const exportExcel = catchAsyncError(async (req, res) => {
  const data = await Partner.find({});
  const jsonData = data.map((doc) => doc.toJSON());
  const excelFileName = "exported_partner_data.xlsx";

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
