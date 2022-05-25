import { Schema, model } from 'mongoose';
import { IRole } from '../interfaces';

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        collection: 'role',
    },
);

export const Role = model<IRole>('role', roleSchema);
