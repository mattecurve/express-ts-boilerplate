import { Duplex } from 'stream';
import { Response } from 'express';
import mongoose from 'mongoose';
import mime from 'mime-types';
import { IFileService } from './service.interface';

export class FileService implements IFileService {
    gfs: any;

    constructor(params: { gfs: any }) {
        this.gfs = params.gfs;
    }

    async uploadFile(fileName: string, buffer: Buffer): Promise<{ id: string; url: string | null }> {
        return new Promise((resolve, reject) => {
            try {
                const writeStream = this.gfs.openUploadStream(fileName);
                const readableStream = new Duplex();
                readableStream.push(buffer);
                readableStream.push(null);
                readableStream.pipe(writeStream);

                writeStream.on('close', async () => {
                    const fileId = writeStream.id.toString();
                    resolve({
                        id: fileId,
                        url: `/asset/${fileId}/${fileName}`,
                    });
                });

                writeStream.on('error', (err: any) => {
                    reject(err);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    async loadFile(id: string, res: Response): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const gridFsFile = this.gfs.find({
                _id: new mongoose.Types.ObjectId(id),
            });
            if (gridFsFile.count) {
                gridFsFile.forEach((doc: any) => {
                    res.set('Content-Type', mime.contentType(doc.filename) as string);
                    const downloadStream = this.gfs.openDownloadStream(new mongoose.Types.ObjectId(id)).pipe(res);
                    downloadStream.on('finish', () => {
                        resolve(true);
                    });
                    downloadStream.on('error', (err: any) => {
                        reject(err);
                    });
                });
            } else {
                throw new Error('not found');
            }
        });
    }

    removeFile(id: string): Promise<undefined> {
        return this.gfs.delete(new mongoose.Types.ObjectId(id));
    }
}
