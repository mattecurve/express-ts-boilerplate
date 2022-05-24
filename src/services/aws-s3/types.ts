export interface IAwsS3ServiceParams {
    region: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
}

export interface IAwsS3Service {
    uploadFile(fileName: string, buffer: Buffer): Promise<{ id: string; url: string | null }>;
    loadFile(id: string): Promise<boolean>;
    removeFile(id: string): Promise<undefined>;
}
