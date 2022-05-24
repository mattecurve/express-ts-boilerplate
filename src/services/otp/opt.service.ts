import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import randomize from 'randomatic';
import { IMobileVerification } from '../../db/interfaces';
import { IOtpService } from '../service.interface';
import { ISmsService } from '../sms';

export class OtpService implements IOtpService {
    mobileVerificationRepository: Model<IMobileVerification>;
    expirationInSeconds: number;
    smsService: ISmsService;

    constructor(params: {
        mobileVerificationRepository: Model<IMobileVerification>;
        expirationInSeconds: number;
        smsService: ISmsService;
    }) {
        this.mobileVerificationRepository = params.mobileVerificationRepository;
        this.expirationInSeconds = params.expirationInSeconds;
        this.smsService = params.smsService;
    }

    async sendOtp(mobileNumber: number, countryCode: number): Promise<{ requestId: string; expiration: Date }> {
        // step - generate expiration
        const expiration = DateTime.fromJSDate(new Date()).plus({
            seconds: this.expirationInSeconds,
        });

        // step - set IsUsed = true to avoid retry on the past otp on the same number
        await this.mobileVerificationRepository.updateOne(
            {
                mobile: `${countryCode}${mobileNumber}`,
            },
            {
                isUsed: true,
            },
        );

        // step - create otp and save
        const otp = randomize('0', 6);
        const mobileVerification = await this.mobileVerificationRepository.create({
            otp,
            mobile: `${countryCode}${mobileNumber}`,
            expiration: expiration.toJSDate(),
        });

        // send actual message
        await this.smsService.sendMessage({
            message: `OTP : ${otp} for verification. Please validate your account and continue your GMNG journey.`,
            numbers: [Number(`${countryCode}${mobileNumber}`)],
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
