import * as path from 'path';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || '5432';
export const DB_NAME = process.env.DB_NAME || 'lapas';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
export const JWT_SECRET = process.env.JWT_SECRET || 'lapaslamongan2024';
export const ASSET_PATH = process.env.ASSET_PATH || path.join(__dirname, '..', '..', 'assets');
export const HASH_SALT = process.env.HASH_SALT || 'hashSalt';
