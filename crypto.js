function strToBuf(s) {
  return new TextEncoder().encode(s);
}
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

function getKeyMaterial(enroll) {
  return window.crypto.subtle.importKey(
    "raw",
    strToBuf(enroll),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
}

function getKey(keyMaterial) {
  const salt = strToBuf("ThaparWebKioskSalt_v1");
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 150000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptPassword(password, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const enc = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    strToBuf(password)
  );
  return { iv: Array.from(iv), data: Array.from(new Uint8Array(enc)) };
}

async function decryptPassword(encryptedObj, key) {
  const iv = new Uint8Array(encryptedObj.iv);
  const data = new Uint8Array(encryptedObj.data);
  const plainBuf = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return new TextDecoder().decode(plainBuf);
}
