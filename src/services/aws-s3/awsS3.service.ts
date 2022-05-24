import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { IAwsS3Service, IAwsS3ServiceParams } from './types';

export class AwsS3Service implements IAwsS3Service {
    private bucketName: string;
    private s3Client: S3;

    constructor(params: IAwsS3ServiceParams) {
        this.bucketName = params.bucketName;
        this.s3Client = new S3({
            region: params.region,
            credentials: {
                accessKeyId: params.accessKeyId,
                secretAccessKey: params.secretAccessKey,
            },
        });
    }

    async uploadFile(fileName: string, buffer: Buffer): Promise<{ id: string; url: string | null }> {
        const id = `${v4()}_${fileName}`;
        const putObjectCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: id,
            Body: buffer,
        });
        await this.s3Client.send(putObjectCommand);
        return Promise.resolve({ id, url: `${this.bucketName}/${id}` });
    }

    async loadFile(id: string): Promise<any> {
        const object = await this.s3Client.getObject({
            Bucket: this.bucketName,
            Key: id,
        });
        return Promise.resolve(object);
    }

    async removeFile(id: string): Promise<undefined> {
        await this.s3Client.deleteObject({
            Bucket: this.bucketName,
            Key: id,
        });
        return Promise.resolve(undefined);
    }
}
