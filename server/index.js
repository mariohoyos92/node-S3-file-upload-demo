const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const multiparty = require("connect-multiparty");
const fs = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({ params: { Bucket: "devm-fileupload-demo" } });

// Import controllers

const app = express();

// SERVE FRONTEND
app.use(express.static(`${__dirname}/../build/`));

// Attach Middlewares
app.use(multiparty());
app.use(json());
app.use(cors());

// API Endpoints
app.post("/api/uploadToS3", (req, res, next) => {
  const file = req.files.file;

  fs.readFile(file.path, function(err, data) {
    if (err) throw err; // Something went wrong!
    var params = {
      Key: file.originalFilename,
      Body: data
    };

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
});

const port = 3001;

app.listen(port, () => console.log(`I'm all the way up! Running on: ${port}`));
