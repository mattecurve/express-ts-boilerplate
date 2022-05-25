import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IRole extends IBaseModel {
    name: string;
    isAdmin: boolean;
    isSystemGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
