import { Schema, model } from 'mongoose';
import { ITodo } from '../interfaces';

const todoSchema = new Schema<ITodo>(
    {
        name: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        collection: 'todo',
    },
);

export const Todo = model<ITodo>('todo', todoSchema);
