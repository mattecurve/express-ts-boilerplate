import { App, initializeApp, Credential, cert, ServiceAccount } from 'firebase-admin/app';
import { BatchResponse, getMessaging, Message, Messaging } from 'firebase-admin/messaging';
import { IFirebaseService } from './types';

export class FirebaseService implements IFirebaseService {
    firebaseApp: App;
    messagingApp: Messaging;
    credential: Credential;

    constructor(params: { serviceAccount: ServiceAccount }) {
        this.credential = cert(params.serviceAccount);
    }

    async init(): Promise<void> {
        /**
         * const serviceAccount = require("path/to/serviceAccountKey.json");
         * credential = cert(serviceAccount);
         */
        this.firebaseApp = initializeApp({
            credential: this.credential,
        });
        this.messagingApp = getMessaging(this.firebaseApp);
    }

    async sendNotification(message: Message): Promise<string> {
        return this.messagingApp.send(message);
    }

    async sendNotifications(messages: Message[]): Promise<BatchResponse> {
        if (messages.length > 500) {
            throw new Error('More than 500 messages are not allowed in single batch call');
        }

        return this.messagingApp.sendAll(messages);
    }
}
