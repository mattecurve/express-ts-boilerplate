import { TrustSignalService } from './index';

const trustSignal = new TrustSignalService({
    apiUrl: 'https://api.trustsignal.io/v1',
    apiKey: 'deee00d8-02d6-4a77-a276-d2789f4119e2',
    senderId: 'GMNGET',
    otpTemplateId: 'A5FyX1bMg',
});

trustSignal
    .sendMessage({
        message: 'This is test message',
        numbers: [8740079540],
        isOtp: true,
    })
    .then(console.log)
    .catch((e) => {
        console.error(JSON.stringify(e));
    });
