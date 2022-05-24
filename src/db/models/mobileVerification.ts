import { Schema, model } from 'mongoose';
import { IMobileVerification } from '../interfaces';

const mobileVerificationSchema = new Schema<IMobileVerification>(
    {
        otp: {
            type: Number,
        },
        mobile: {
            type: String,
        },
        expiration: {
            type: Date,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const MobileVerification = model<IMobileVerification>('mobileVerification', mobileVerificationSchema);
