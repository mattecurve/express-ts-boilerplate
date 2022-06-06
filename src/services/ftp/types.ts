import { AccessOptions } from 'basic-ftp';

/**
 * host - ftp://yourdomain.com or http://yourdomain.com
 * port - 21 (default)
 * encryption - ?
 * loginType - Anonymous / Basic / Custom
 * user - test
 * password - test
 */
export interface IFtpConfig extends AccessOptions {
    verbose: boolean;
}

export interface IFtpService {
    upload(file: string): Promise<void>;
}
