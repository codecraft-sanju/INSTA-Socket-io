import DataUriParser from 'datauri/parser.js';
import path from 'path';

const getDataUri = (file) => {
  if (!file || !file.buffer) {
    throw new Error('Invalid file data. Buffer is missing.');
  }

  const parser = new DataUriParser();
  const extname = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.webm'];
  if (!allowedExtensions.includes(extname)) {
    throw new Error(`Unsupported file format: ${extname}`);
  }

  return parser.format(extname, file.buffer);
};

export default getDataUri;

