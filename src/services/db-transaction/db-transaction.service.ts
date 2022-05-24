import { Logger } from 'winston';
import { ClientSession, Mongoose, mongo } from 'mongoose';
import { IDbTransactionService } from './types';

export class DbTransactionService implements IDbTransactionService {
    db: Mongoose;
    logger: Logger;

    constructor(params: { db: Mongoose; logger: Logger }) {
        this.db = params.db;
        this.logger = params.logger;
    }

    async runTransaction(callback: Function): Promise<any> {
        const session = await this.db.startSession();
        // set Infinity event listeners
        session.setMaxListeners(Infinity);
        this.logger.info(`db transaction session id - ${JSON.stringify(session.id)}`);
        let error: Error | null = null;
        let result: any;

        try {
            result = await this.executeCallback(callback, session);
        } catch (err) {
            this.logger.error(err);
            error = err as Error;
        } finally {
            session.endSession();
            if (error) {
                // eslint-disable-next-line no-unsafe-finally
                throw error;
            } else {
                // eslint-disable-next-line no-unsafe-finally
                return result;
            }
        }
    }

    async executeCallback(callback: Function, session: ClientSession): Promise<any> {
        session.startTransaction({
            // For operations in multi-document transactions, read concern "majority" provides its guarantees
            // only if the transaction commits with write concern "majority".
            // Otherwise, the "majority" read concern provides no guarantees about the data read in transactions.
            readConcern: { level: 'majority' },
            writeConcern: { w: 'majority' },
            // transaction with read should have always read preferences primary
            readPreference: new mongo.ReadPreference('primary'),
        });
        let result: any;
        try {
            result = await callback(session);
            await session.commitTransaction();
        } catch (error) {
            this.logger.info('aborting session');
            const abort = await session.abortTransaction();
            this.logger.error(error);
            this.logger.error(abort);
            if (this.canRetryTransaction(error)) {
                await this.executeCallback(callback, session);
            } else if (this.canRetryCommitTransaction(error)) {
                this.retryCommitTransaction(session);
            } else {
                throw error;
            }
        }

        return result;
    }

    retryCommitTransaction(session: ClientSession) {
        try {
            session.commitTransaction();
        } catch (error) {
            if (this.canRetryCommitTransaction(error)) {
                this.retryCommitTransaction(session);
            } else {
                throw error;
            }
        }
    }

    canRetryCommitTransaction(error: any) {
        return error.errorLabels && error.errorLabels.includes('UnknownTransactionCommitResult');
    }

    canRetryTransaction(error: any) {
        return error.errorLabels && error.errorLabels.includes('TransientTransactionError');
    }
}
