import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import { IMobileVerification } from '../../db/interfaces';
import { IOtpService } from '../service.interface';

const OTP = 123456;

export class FakeOtpService implements IOtpService {
    mobileVerificationRepository: Model<IMobileVerification>;
    expirationInSeconds: number;

    constructor(params: { mobileVerificationRepository: Model<IMobileVerification>; expirationInSeconds: number }) {
        this.mobileVerificationRepository = params.mobileVerificationRepository;
        this.expirationInSeconds = params.expirationInSeconds;
    }

    async sendOtp(mobileNumber: number, countryCode: number): Promise<{ requestId: string; expiration: Date }> {
        const expiration = DateTime.fromJSDate(new Date()).plus({
            seconds: this.expirationInSeconds,
        });
        const mobileVerification = await this.mobileVerificationRepository.create({
            otp: OTP,
            mobile: `${countryCode}${mobileNumber}`,
            expiration: expiration.toJSDate(),
        });
        return { requestId: mobileVerification._id, expiration: expiration.toJSDate() };
    }

    async verifyOtp(requestId: string, otp: number): Promise<{ success: true }> {
        const mobileVerification = await this.mobileVerificationRepository.findById(requestId);
        if (!mobileVerification || mobileVerification.otp !== otp || mobileVerification.isUsed) {
            throw new Error('Invalid OTP value');
        }

        if (DateTime.fromJSDate(mobileVerification.expiration).diffNow().toMillis() < 0) {
            throw new Error('OTP has expired');
        }

        // set IsUsed = true to avoid retry on the same otp
        await this.mobileVerificationRepository.updateOne(
            {
                _id: mobileVerification._id,
            },
            {
                isUsed: true,
            },
        );

        return {
            success: true,
        };
    }
}
