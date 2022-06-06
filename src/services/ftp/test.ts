/* eslint-disable no-console */
import { FtpService } from './ftp.service';

const ftpService = new FtpService({
    host: 'localhost',
    port: 21,
    user: 'test',
    password: 'test',
    verbose: true,
});

const file = '/Users/onkarjanwa/Downloads/20 - FAN Speed Unit-20220524-0531.xlsx';

ftpService.upload(file).then(console.log).catch(console.error);
