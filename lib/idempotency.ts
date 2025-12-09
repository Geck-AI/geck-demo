/**
 * Idempotency utility for API operations
 * Ensures that operations can be safely retried without side effects
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const IDEMPOTENCY_DIR = path.join(process.cwd(), 'data', 'idempotency');

interface IdempotencyRecord {
  key: string;
  statusCode: number;
  response: unknown;
  createdAt: string;
  expiresAt: string;
}

// Ensure idempotency directory exists
function ensureIdempotencyDirectory() {
  if (!fs.existsSync(IDEMPOTENCY_DIR)) {
    fs.mkdirSync(IDEMPOTENCY_DIR, { recursive: true });
  }
}

/**
 * Get idempotency key from request headers
 */
export function getIdempotencyKey(request: Request): string | null {
  const idempotencyKey = request.headers.get('Idempotency-Key') || 
                         request.headers.get('idempotency-key') ||
                         request.headers.get('X-Idempotency-Key');
  return idempotencyKey;
}

/**
 * Generate a hash from the idempotency key for storage
 */
function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Get idempotency record file path
 */
function getRecordPath(key: string): string {
  const hashedKey = hashKey(key);
  return path.join(IDEMPOTENCY_DIR, `${hashedKey}.json`);
}

/**
 * Store idempotency record
 */
export function storeIdempotencyRecord(
  key: string,
  statusCode: number,
  response: unknown,
  ttlSeconds: number = 24 * 60 * 60 // Default 24 hours
): void {
  ensureIdempotencyDirectory();
  
  const record: IdempotencyRecord = {
    key,
    statusCode,
    response,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
  };
  
  const filePath = getRecordPath(key);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2));
}

/**
 * Get existing idempotency record
 */
export function getIdempotencyRecord(key: string): IdempotencyRecord | null {
  ensureIdempotencyDirectory();
  
  const filePath = getRecordPath(key);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const record: IdempotencyRecord = JSON.parse(data);
    
    // Check if record has expired
    if (new Date(record.expiresAt) < new Date()) {
      // Clean up expired record
      fs.unlinkSync(filePath);
      return null;
    }
    
    return record;
  } catch (error) {
    console.error('Error reading idempotency record:', error);
    return null;
  }
}

/**
 * Clean up expired idempotency records
 */
export function cleanupExpiredRecords(): void {
  ensureIdempotencyDirectory();
  
  const files = fs.readdirSync(IDEMPOTENCY_DIR);
  const now = new Date();
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    try {
      const filePath = path.join(IDEMPOTENCY_DIR, file);
      const data = fs.readFileSync(filePath, 'utf-8');
      const record: IdempotencyRecord = JSON.parse(data);
      
      if (new Date(record.expiresAt) < now) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignore errors during cleanup
    }
  }
}

/**
 * Handle idempotent request
 * Returns the cached response if the key exists, otherwise returns null
 */
export function handleIdempotentRequest(
  request: Request,
  operation: () => Promise<{ statusCode: number; response: unknown }>,
  ttlSeconds?: number
): Promise<{ statusCode: number; response: unknown; fromCache: boolean }> {
  const idempotencyKey = getIdempotencyKey(request);
  
  if (!idempotencyKey) {
    // No idempotency key provided, execute operation normally
    return operation().then(result => ({
      ...result,
      fromCache: false,
    }));
  }
  
  // Check for existing record
  const existingRecord = getIdempotencyRecord(idempotencyKey);
  
  if (existingRecord) {
    // Return cached response
    return Promise.resolve({
      statusCode: existingRecord.statusCode,
      response: existingRecord.response,
      fromCache: true,
    });
  }
  
  // Execute operation and store result
  return operation().then(result => {
    storeIdempotencyRecord(idempotencyKey, result.statusCode, result.response, ttlSeconds);
    return {
      ...result,
      fromCache: false,
    };
  });
}

