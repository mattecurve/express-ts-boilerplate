import { IBaseModel } from './IBase';

export interface IMobileVerification extends IBaseModel {
    otp: number;
    mobile: string;
    expiration: Date;
    isUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
