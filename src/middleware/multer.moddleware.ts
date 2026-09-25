import multer from "multer";
import type { Request } from "express";

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, callback) => {
    callback(null, "public/temp");
  },

  filename: (_req: Request, file: Express.Multer.File, callback) => {
    const uniqueFileName =
      Date.now() +
      "_" +
      Math.floor(Math.random() * 100) +
      "_" +
      file.originalname;

    callback(null, uniqueFileName);
  },
});

export const upload = multer({
  storage,
});
