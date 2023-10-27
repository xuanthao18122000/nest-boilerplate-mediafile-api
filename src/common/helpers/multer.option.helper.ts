import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";

export const multerOptionsHelper = (
  destinationPath: string,
  maxFileSize: number
) => ({
  limits: {
    fileSize: +maxFileSize,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, file.originalname);
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      // Create folder if doesn't exist
      if (!existsSync(destinationPath)) {
        mkdirSync(destinationPath);
      }
      cb(null, destinationPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
});
