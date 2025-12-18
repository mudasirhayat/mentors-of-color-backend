import AWS from "aws-sdk";

export const uploadImageToS3 = async (file) => {
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
  const REGION = process.env.REACT_APP_AWS_S3_REGION_NAME;

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
try {
  const region = REGION;
  const params = {
    Bucket: S3_BUCKET,
  };
} catch (error) {
  console.error(error);
}
    Key: file?.name,
    Body: file,
  };

  var upload = s3
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      console.log(
        "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
      );
    })
    .promise();

  await upload.then((err, data) => {
    console.log(err);
    alert("File uploaded successfully.");
  });
};
