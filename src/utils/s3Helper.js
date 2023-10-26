require("dotenv").config();
const AWS = require("aws-sdk");

// Set up AWS credentials
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: "ap-southeast-1",
});

// Create an S3 instance
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.S3_BUCKET_NAME

async function s3GetURL(filepath) {
  // Set up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: filepath,
    Expires: 120,
  };

  // Get object URL from S3
  // This methods will sometime generate error signed URL
  var url = await s3.getSignedUrlPromise("getObject", params);
  return url;
}

async function uploadFileToS3(prefix, file, key) {
  const s3Upload = async (prefix, file) => {
    // Set up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${prefix}/${file.originalname}`,
      Body: file.buffer,
    };

    // Upload the file to S3
    var uploadData = await s3.upload(params).promise();
    return uploadData;
  };

  // Generates a unique filename with userId and updates the original file name.
  file.originalname =
    key + file.originalname.match(/\.([a-z]+)$/)?.[0] || ".png";

  const s3Response = await s3Upload(prefix, file);
  console.log("File uploaded to:", s3Response);

  return s3Response.Key;
}

module.exports = { uploadFileToS3, s3GetURL };
