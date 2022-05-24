import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface ITodo extends IBaseModel {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
