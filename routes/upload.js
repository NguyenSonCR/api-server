const express = require("express");
const router = express.Router();
const multerServer = require("multer");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

// upload to google storage
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

let projectId = "probable-net-364908";
let keyFilename = "mykey.json";
const storage = new Storage({
  projectId,
  keyFilename,
});

const bucket = storage.bucket("nhatbinhshop");

router.post(
  "/google-storage/multiple",
  multer.array("files"),
  async (req, res) => {
    const files = req.files;
    try {
      if (files) {
        let couter = 1;
        let result = [];
        await files.map((file) => {
          const blob = bucket.file(file.originalname);
          const blobStream = blob.createWriteStream();
          blobStream.on("finish", () => {
            if (couter === files.length) {
              result = result.concat(
                `https://storage.googleapis.com/nhatbinhshop/${file.originalname}`
              );
              return res.status(200).json({ success: true, result });
            } else {
              result = result.concat(
                `https://storage.googleapis.com/nhatbinhshop/${file.originalname}`
              );
              couter = couter + 1;
            }
          });

          blobStream.end(file.buffer);
        });
      } else {
        return res.status(400).send({ message: "Please upload a file!" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/google-storage", multer.single("file"), async (req, res) => {
  try {
    if (req.file) {
      const file = req.file;
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        return res.status(200).json({
          success: true,
          result: `https://storage.googleapis.com/nhatbinhshop/${file.originalname}`,
        });
      });
      blobStream.end(file.buffer);
    }
  } catch (error) {
    console.log(error);
  }
});

// upload to server
const diskStorage = multerServer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multerServer({ storage: diskStorage });

router.post("/", upload.array("files"), (req, res) => {
  const files = req.files;
  let result = [];
  files.map((file, index) => {
    console.log(file);
    const fileType = file.mimetype.split("/")[1];
    const newFileName = file.filename + "." + fileType;

    fs.rename(
      `./static/img/${req.files[index].filename}`,
      `./static/img/${newFileName}`,
      () => {
        console.log("ok");
      }
    );
    return (result = result.concat(`/img/${newFileName}`));
  });
  return res.json({ success: true, result });
});

module.exports = router;
