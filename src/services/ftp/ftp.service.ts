import * as ftp from 'basic-ftp';
import _ from 'lodash';
import path from 'path';
import { IFtpConfig, IFtpService } from './types';

export class FtpService implements IFtpService {
    config: IFtpConfig;

    constructor(config: IFtpConfig) {
        this.config = config;
    }

    async upload(file: string): Promise<void> {
        const client = await this.getClient();
        try {
            await client.uploadFrom(file, path.basename(file));
            client.close();
        } catch (e) {
            client.close();
            throw e;
        }
    }

    private async getClient(): Promise<ftp.Client> {
        const client = new ftp.Client();
        client.ftp.verbose = this.config.verbose;
        await client.access(_.omit(this.config, 'debug'));
        return client;
    }
}
