import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces';
import { UserStatus } from '../types';

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            unique: true,
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
        mobile: {
            _id: false,
            type: {
                countryCode: {
                    type: Number,
                },
                number: {
                    type: Number,
                },
                isVerified: {
                    type: Boolean,
                },
            },
            default: null,
        },
        name: {
            _id: false,
            type: {
                first: {
                    type: String,
                },
                last: {
                    type: String,
                },
            },
            default: null,
        },
        email: {
            _id: false,
            type: {
                address: {
                    type: String,
                },
                isVerified: {
                    type: Boolean,
                },
            },
            default: null,
        },
        about: {
            type: String,
            default: null,
        },
        photo: {
            _id: false,
            type: {
                id: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
            default: null,
        },
        device: {
            _id: false,
            type: new Schema({
                fcmId: {
                    type: String,
                    default: null,
                },
                info: {
                    type: String,
                    default: null,
                },
                type: {
                    type: String,
                },
                version: {
                    type: String,
                    default: null,
                },
            }),
            default: null,
        },
        role: {
            type: String,
        },
        permissions: {
            _id: false,
            type: [
                {
                    permissionId: {
                        type: String,
                    },
                    allowed: {
                        type: Boolean,
                    },
                },
            ],
            default: [],
        },
        status: {
            type: String,
            default: UserStatus.New,
            enum: [UserStatus.New, UserStatus.Active, UserStatus.Blocked],
        },
        otpRequestId: {
            type: String,
            default: null,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: 'user',
    },
);

userSchema.virtual('fullName').get(function getFullName(this: IUser) {
    return this.name ? `${this.name?.first} ${this.name?.last}` : null;
});

export const User = model<IUser>('user', userSchema);
