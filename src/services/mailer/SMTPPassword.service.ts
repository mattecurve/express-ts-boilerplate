import * as crypto from 'crypto';

interface ISMTPPasswordServiceParams {
    algorithm: string;
    key: string;
}

export class SMTPPasswordService {
    private algorithm: string;
    // the length of key is depend on the provided algorithm
    // for aes256 it should be 32
    // for aes192 it should be 24
    private key: string;
    private ivLength: number = 16;

    constructor(params: ISMTPPasswordServiceParams) {
        this.algorithm = params.algorithm;
        this.key = params.key;
        // if this works than key length is correct.
        try {
            this.encrypt('random');
        } catch (e) {
            throw new Error('Invalid key length. Please provide correct key length as per the algorithm.');
        }
    }

    encrypt(password: string) {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
        let encrypted = cipher.update(Buffer.from(password));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decrypt(encryptedString: string) {
        const textParts = encryptedString.split(':');
        const iv = Buffer.from(textParts.shift() as string, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
