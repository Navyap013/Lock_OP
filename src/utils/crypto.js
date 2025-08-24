// src/utils/crypto.js
// Utilities using Web Crypto API (SubtleCrypto). Works in modern browsers.

const enc = new TextEncoder();
const dec = new TextDecoder();

// helper: ArrayBuffer <-> base64
export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// generate random bytes (salt/iv)
export function randomBytes(length = 16) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr.buffer;
}

/*
 deriveKey:
 - password: string (master password)
 - salt: ArrayBuffer
 returns CryptoKey for AES-GCM (256)
*/
export async function deriveKey(password, salt, iterations = 250000) {
  const passKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    passKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return key;
}

/*
 encryptData: returns { ciphertext, iv, salt } all base64 strings
*/
export async function encryptData(plaintext, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12); // AES-GCM recommended 12-byte IV
  const key = await deriveKey(password, salt);
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    enc.encode(plaintext)
  );
  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
  };
}

/*
 decryptData: accepts base64 strings for ciphertext/iv/salt and returns decrypted string
*/
export async function decryptData({ ciphertext, iv, salt }, password) {
  try {
    const saltBuf = base64ToArrayBuffer(salt);
    const ivBuf = base64ToArrayBuffer(iv);
    const ctBuf = base64ToArrayBuffer(ciphertext);
    const key = await deriveKey(password, saltBuf);
    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(ivBuf) },
      key,
      ctBuf
    );
    return dec.decode(plainBuf);
  } catch (err) {
    throw new Error("Decryption failed. Wrong password or corrupted data.");
  }
}

// (optional) hash a string (e.g. fingerprinting master password)
export async function hashString(str) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return arrayBufferToBase64(buf);
}
