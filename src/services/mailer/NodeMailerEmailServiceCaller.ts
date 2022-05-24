import * as NodeMailer from 'nodemailer';
import { NodeMailerEmailService } from '.';

/**
 * {
  user: 'tdw5qch6mxmegwlm@ethereal.email',
  pass: '7ZMeznYZsEtQRqpZn5',
  smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
  imap: { host: 'imap.ethereal.email', port: 993, secure: true },
  pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
  web: 'https://ethereal.email'
}
 */

// Use below code to create test account on nodemailer
// nodemailer.createTestAccount((err, account) => {
//     console.log(account);
// });

const transporter = NodeMailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'tdw5qch6mxmegwlm@ethereal.email',
        pass: '7ZMeznYZsEtQRqpZn5',
    },
});
const mailer = new NodeMailerEmailService(transporter);
mailer
    .sendEmail({
        from: 'testemail@gmail.com',
        to: 'testemail@gmail.com',
        subject: 'Subject',
        html: '<h1>Hello SMTP Email</h1>',
    })
    .then(console.log);
