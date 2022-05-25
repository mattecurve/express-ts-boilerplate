import { Schema, model } from 'mongoose';
import { IPermission } from '../interfaces';

const permissionSchema = new Schema<IPermission>(
    {
        name: { type: String, required: true, unique: true },
        code: { type: String, required: true, unique: true },
        description: { type: String },
    },
    {
        collection: 'permission',
    },
);

export const Permission = model<IPermission>('permission', permissionSchema);
