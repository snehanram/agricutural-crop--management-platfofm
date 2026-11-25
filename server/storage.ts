import fs from 'fs';
import path from 'path';
import multer from 'multer';

export const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');
const PEST_UPLOADS_DIR = path.join(UPLOADS_ROOT, 'pests');

if (!fs.existsSync(PEST_UPLOADS_DIR)) {
  fs.mkdirSync(PEST_UPLOADS_DIR, { recursive: true });
}

/**
 * Storage abstraction structured so local disk uploads can be swapped
 * for Firebase Storage or S3 without changing API route logic.
 */
export interface ImageStorageProvider {
  getPublicUrl(filename: string): string;
  deleteByUrl(publicUrl: string | null | undefined): Promise<void>;
}

class LocalDiskStorageProvider implements ImageStorageProvider {
  getPublicUrl(filename: string): string {
    return `/uploads/pests/${filename}`;
  }

  async deleteByUrl(publicUrl: string | null | undefined): Promise<void> {
    if (!publicUrl || !publicUrl.startsWith('/uploads/pests/')) return;
    const filename = path.basename(publicUrl);
    const fullPath = path.join(PEST_UPLOADS_DIR, filename);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }
}

export const imageStorage: ImageStorageProvider = new LocalDiskStorageProvider();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PEST_UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `pest-${uniqueSuffix}${safeExt}`);
  },
});

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp|gif|bmp|heic|heif|avif)$/i;

function isAcceptedImageFile(file: Express.Multer.File): boolean {
  if (file.mimetype && file.mimetype.toLowerCase().startsWith('image/')) {
    return true;
  }
  return IMAGE_EXT_REGEX.test(file.originalname || '');
}

export const pestImageUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter: (_req, file, cb) => {
    if (!isAcceptedImageFile(file)) {
      cb(new Error('Only image files are allowed (JPG, PNG, WEBP, HEIC).'));
      return;
    }
    cb(null, true);
  },
});

export const pestAnalyzeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB max
  },
  fileFilter: (_req, file, cb) => {
    if (!isAcceptedImageFile(file)) {
      cb(new Error('Only image files are allowed (JPG, PNG, WEBP, HEIC).'));
      return;
    }
    cb(null, true);
  },
});
