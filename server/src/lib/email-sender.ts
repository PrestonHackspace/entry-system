import { Credentials, SES } from 'aws-sdk';
import { AppConfig } from '../config';


export interface SesAccessKey {
  AccessKeyID: string;
  SecretAccessKey: string;
}

interface EmailSendOptions {
  sesAccessKey: SesAccessKey;

  to: string[];
  cc: string[];
  bcc: string[];
  from: string;
  subject: string;
  // text: string;
  html: string;
}


export function NewEmailSender() {
  return {
    async send(options: EmailSendOptions): Promise<string> {
      return '';

      const credentials = new Credentials(options.sesAccessKey.AccessKeyID, options.sesAccessKey.SecretAccessKey);

      const ses = new SES({ credentials, region: AppConfig.SES.Region });

      const params: SES.SendEmailRequest = {
        Source: options.from,
        Destination: {
          ToAddresses: options.to,
          CcAddresses: options.cc,
          BccAddresses: options.bcc,
        },
        Message: {
          Body: {
            // Text: {
            //   Data: options.text,
            //   Charset: 'UTF-8',
            // },
            Html: {
              Data: options.html,
              Charset: 'UTF-8',
            },
          },
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8',
          },
        },
      };

      console.info(`Sending email from: "${options.from}" to: "${options.to.join(';')}" cc: "${options.cc.join(';')}" bcc: "${options.bcc.join(';')}"`);

      return (await ses.sendEmail(params).promise()).MessageId;
    },
  };
}
