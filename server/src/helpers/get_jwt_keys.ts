import fs from "node:fs";
import path from "node:path";

/**
 * @description Function that reads from jwt-file and export it's keys
 * @function getJwtKeys
 * @returns {{privateKey: string; publicKey: string}} Returns the Response object
 */

export function getJwtKeys(): { privateKey: string; publicKey: string } {
  // Path to the key file
  const privateKeyPath = path.join(__dirname, "../../jwtRS256.key");
  // Read the key file
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  // Path to the key file
  const publicKeyPath = path.join(__dirname, "../../jwtRS256.key.pub");
  // Read the key file
  const publicKey = fs.readFileSync(publicKeyPath, "utf8");

  return { privateKey, publicKey };
}
