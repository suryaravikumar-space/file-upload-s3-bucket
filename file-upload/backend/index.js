import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import multer from "multer";
import { s3Uploadv3 } from "./s3Service.js";

const app = express();
app.use(cors()); // Add this line to enable CORS for all routes

const storage = multer.memoryStorage();

// re write with return
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 8 },
});

app.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const results = await s3Uploadv3(req.files);
    const objectUrls = results.map((result) => result.Location);
    return res.json({ objectUrls });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to upload files" });
  }
});


app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }
});

app.listen(4000, () => console.log("listening on port 4000"));
