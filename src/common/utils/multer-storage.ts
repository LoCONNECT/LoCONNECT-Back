import { Request } from 'express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

type MulterCallback = (error: Error | null, destination: string) => void;

export const createStorage = (folderName: string) =>
  diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: MulterCallback,
    ) => {
      const uploadPath = `./uploads/${folderName}`;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: MulterCallback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
