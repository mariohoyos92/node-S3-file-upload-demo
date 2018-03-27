const fs = require("fs");
const AWS = require("aws-sdk");

// Instantiate your S3 bucket
const s3 = new AWS.S3({ params: { Bucket: "devm-fileupload-demo" } });

module.exports = {
  uploadToS3: (req, res, next) => {
    const file = req.files.file;
    console.log("File:", file);

    fs.readFile(file.path, function(err, data) {
      if (err) throw err; // Something went wrong!

      // Parameters that we will use to upload the file to S3
      var params = {
        Key: file.originalFilename,
        Body: data
      };

      console.log("DATA:", data);

      s3.upload(params, function(err, data) {
        // Whether there is an error or not, delete the temp file
        fs.unlink(file.path, function(err) {
          if (err) {
            console.error(err);
          }
          console.log("Temp File Delete");
        });

        console.log("PRINT FILE:", file);

        if (err) {
          console.log("ERROR MSG: ", err);
          res.status(500).send(err);
        } else {
          console.log("Successfully uploaded data");
          res.status(200).end();
        }
      });
    });
  }
};
