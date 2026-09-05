const KEY_ENV_VAR = 'GEO_CATALOG_DECRYPTION_KEY';

export function getDecryptionKey() {
  const raw = process.env[KEY_ENV_VAR];
  if (!raw) {
    throw new Error(
      `Missing ${KEY_ENV_VAR} environment variable. Set it to a base64-encoded 32-byte AES-256 key (see .env.example).`
    );
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error(
      `${KEY_ENV_VAR} must decode to exactly 32 bytes for AES-256-GCM (got ${key.length}).`
    );
  }
  return key;
}
