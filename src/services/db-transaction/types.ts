export interface IDbTransactionService {
    runTransaction(callback: Function): Promise<any>;
}
