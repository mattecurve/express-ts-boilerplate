import { BatchResponse, Message } from 'firebase-admin/messaging';

export interface MessageParams {
    title: string;
    body: string;
}

export interface UserMessageParams extends MessageParams {
    userId: string;
    token: string;
}

export interface IFirebaseService {
    init(): Promise<void>;
    sendNotification(message: Message): Promise<string>;
    sendNotifications(messages: Message[]): Promise<BatchResponse>;
}

export interface IMessageService {}
