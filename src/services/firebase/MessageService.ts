import _ from 'lodash';
import { IFirebaseService, IMessageService, UserMessageParams } from './types';

const BulkLimit = 500;

export class MessageService implements IMessageService {
    firebaseService: IFirebaseService;

    constructor(firebaseService: IFirebaseService) {
        this.firebaseService = firebaseService;
    }

    sendMessage(param: UserMessageParams): Promise<string> {
        return this.firebaseService.sendNotification({
            notification: {
                title: param.title,
                body: param.body,
            },
            token: param.token,
        });
    }

    async sendMessages(params: UserMessageParams[]): Promise<void> {
        const messagesGroups = _.chunk(params, BulkLimit);
        const groupsCount = messagesGroups.length;

        for (let messagesGroupIndex = 0; messagesGroupIndex < groupsCount; messagesGroupIndex += 1) {
            const messagesGroup = messagesGroups[messagesGroupIndex];
            try {
                // step - prepare message
                const messages = messagesGroup.map((messageGroup) => {
                    const message = {
                        notification: {
                            title: messageGroup.title,
                            body: messageGroup.body,
                        },
                        token: messageGroup.token,
                    };
                    return message;
                });

                // make a call to process batch
                // eslint-disable-next-line no-await-in-loop
                await this.firebaseService.sendNotifications(messages);
            } catch (e) {
                // do nothing
            }
        }
    }
}
