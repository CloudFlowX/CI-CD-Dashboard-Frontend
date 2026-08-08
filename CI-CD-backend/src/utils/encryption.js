import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

// Ensure the key is 32 bytes (256 bits)
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY || "CloudOrchestratorDefaultSecretKey123!";
  return crypto.createHash("sha256").update(String(key)).digest("base64").substr(0, 32);
};

export const encrypt = (text) => {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getEncryptionKey()), iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text) => {
  if (!text) return text;
  
  try {
    const textParts = text.split(":");
    if (textParts.length !== 2) return text; // If it's not encrypted format, return as is (for backwards compatibility)

    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(getEncryptionKey()), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return text; // Return original text on failure to prevent app crash
  }
};
