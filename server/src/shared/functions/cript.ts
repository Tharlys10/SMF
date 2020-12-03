import * as crypto from 'crypto'
import { constants } from 'src/modules/auth/auth.constants';

export function encrypt(value: any) {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(constants.cipher_key), iv);
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(value: any) {
  const [iv, encrypted] = value.split(':');
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(constants.cipher_key), ivBuffer);
  let content = decipher.update(Buffer.from(encrypted, 'hex'));
  content = Buffer.concat([content, decipher.final()]);
  return content.toString();
}