import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { encryptPayload, decryptPayload } from '../src/crypto.js';

function key() {
  return randomBytes(32);
}

test('decryptPayload recovers the original plaintext', () => {
  const plaintext = Buffer.from('geo-catalog secret payload', 'utf8');
  const k = key();
  const payload = encryptPayload(plaintext, k);

  assert.equal(payload.v, 1);
  assert.deepEqual(decryptPayload(payload, k), plaintext);
});

test('encryptPayload uses a fresh IV each call, so ciphertexts differ', () => {
  const plaintext = Buffer.from('same input, different output', 'utf8');
  const k = key();

  const first = encryptPayload(plaintext, k);
  const second = encryptPayload(plaintext, k);

  assert.notEqual(first.iv, second.iv);
  assert.notEqual(first.ciphertext, second.ciphertext);
});

test('decryptPayload rejects a payload decrypted with the wrong key', () => {
  const payload = encryptPayload(Buffer.from('sensitive', 'utf8'), key());
  assert.throws(() => decryptPayload(payload, key()));
});

test('decryptPayload rejects tampered ciphertext', () => {
  const payload = encryptPayload(Buffer.from('sensitive', 'utf8'), key());
  const k = key();
  const original = encryptPayload(Buffer.from('sensitive', 'utf8'), k);

  const tampered = { ...original, ciphertext: Buffer.from(original.ciphertext, 'base64').map((b, i) => (i === 0 ? b ^ 0xff : b)).toString('base64') };
  assert.throws(() => decryptPayload(tampered, k));
  void payload;
});

test('decryptPayload rejects a tampered auth tag', () => {
  const k = key();
  const original = encryptPayload(Buffer.from('sensitive', 'utf8'), k);
  const tampered = { ...original, authTag: Buffer.from(original.authTag, 'base64').map((b, i) => (i === 0 ? b ^ 0xff : b)).toString('base64') };
  assert.throws(() => decryptPayload(tampered, k));
});

test('round-trips binary and empty payloads', () => {
  const k = key();
  for (const plaintext of [Buffer.alloc(0), Buffer.from([0, 1, 2, 255, 254]), randomBytes(4096)]) {
    const payload = encryptPayload(plaintext, k);
    assert.deepEqual(decryptPayload(payload, k), plaintext);
  }
});
