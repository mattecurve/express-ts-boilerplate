import mongoose from 'mongoose';

export class MongoHelper {
    static createObjectId() {
        return new mongoose.Types.ObjectId();
    }
}
