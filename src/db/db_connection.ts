import { connect, ConnectOptions, Model, mongo, Mongoose } from 'mongoose';
import { Todo } from './models';

interface DBConnectionParams {
    uri: string;
    options?: ConnectOptions;
}

export class DBConnection {
    mongoose: Mongoose;
    params: DBConnectionParams;
    repository: { [key: string]: Model<any, {}> } = {};
    gfs: any;

    constructor(params: DBConnectionParams) {
        this.params = params;
    }

    async connect(debug: boolean = false) {
        this.mongoose = await connect(this.params.uri, this.params.options);
        // set debugging
        this.mongoose.set('debug', debug);
        // eslint-disable-next-line no-console
        console.log('db connection success');
    }

    async registerCollections() {
        this.repository.todo = Todo;
        this.gfs = new mongo.GridFSBucket(this.mongoose.connection.db, {
            chunkSizeBytes: 1024,
            bucketName: 'images',
        });
    }
}
