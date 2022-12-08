const express = require("express");
const router = express.Router();
const multerServer = require("multer");
const fs = require("fs");

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

router.post("/server", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  const fileType = file.mimetype.split("/")[1];
  const newFileName = file.filename + "." + fileType;
  fs.rename(
    `./static/img/${file.filename}`,
    `./static/img/${newFileName}`,
    () => {}
  );
  const result = `http://localhost:3000/img/${newFileName}`;
  return res.json({ success: true, result });
});

router.post("/server/multiple", upload.array("files"), async (req, res) => {
  const files = req.files;
  try {
    if (files) {
      let couter = 1;
      let result = [];
      await files.map((file, index) => {
        const fileType = file.mimetype.split("/")[1];
        const newFileName = file.filename + "." + fileType;
        fs.rename(
          `./static/img/${req.files[index].filename}`,
          `./static/img/${newFileName}`,
          () => {}
        );

        if (couter === files.length) {
          result = result.concat(`http://localhost:3000/img/${newFileName}`);
          return res.status(200).json({ success: true, result });
        } else {
          result = result.concat(`http://localhost:3000/img/${newFileName}`);
          couter = couter + 1;
        }
      });
    } else {
      return res.status(400).send({ message: "Please upload a file!" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
