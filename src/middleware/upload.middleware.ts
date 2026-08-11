import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import multer from 'multer';

import env from '../config/env.js';

const uploadDirectory = path.resolve(env.uploadPath);

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = extensionByMimeType[file.mimetype];

    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (
  _req,
  file,
  callback,
) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(new Error('Only JPEG, PNG, and WebP images are allowed'));
    return;
  }

  callback(null, true);
};

export const uploadVehiclePhoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
}).single('photo');