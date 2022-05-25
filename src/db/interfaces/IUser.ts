import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IUser extends IBaseModel {
    username: string | null;
    password: string | null;
    mobile: {
        countryCode: number;
        number: number;
        isVerified: boolean;
    } | null;
    name: {
        first: string;
        last: string;
    } | null;
    fullName: string | null;
    email: {
        address: string;
        isVerified: boolean;
    } | null;
    about: string | null;
    photo: {
        id: string;
        url: string;
    } | null;
    device: {
        fcmId: string | null;
        info: string | null;
        type: string | null;
        version: string | null;
    } | null;
    role: string;
    permissions: { permissionId: string; allowed: boolean }[];
    status: string;
    statusMessage: string | null;
    otpRequestId: string | null;
    createdBy: Schema.Types.ObjectId | null;
    updatedBy: Schema.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}
