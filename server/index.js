const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const multiparty = require("connect-multiparty");

const { uploadToS3 } = require("./controllers/s3Controller");

const app = express();

// multiparty gives us access to files on req.files
app.use(multiparty());

app.use(json());
app.use(cors());

// API Endpoints
app.post("/api/uploadToS3", uploadToS3);

const port = 3001;

app.listen(port, () => console.log(`I'm all the way up! Running on: ${port}`));
