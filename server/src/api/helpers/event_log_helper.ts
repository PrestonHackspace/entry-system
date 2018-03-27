import Knex = require('knex');
import { NewEventLogRepository, InsertEventLogRecord } from '../../model/repositories/event_log';
import { pick, strip, UUID } from '../../common/lib';
import { NewConfigHelper } from './config_helper';
import { NewEmailSender } from '../../lib/email-sender';
import { EventLogRow } from '../../model/tables';

export interface EnqueueEmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
}

function getEmailAddressString(emails?: string[]) {
  if (!emails || emails.length === 0) return null;

  return emails.join(';');
}

export function NewEventLogHelper(trx: Knex, operatingUserId: UUID) {
  const eventLogRepository = NewEventLogRepository(trx, operatingUserId);

  const configHelper = NewConfigHelper(trx, operatingUserId);

  const emailSender = NewEmailSender();

  async function sendLog(log: EventLogRow) {
    const sesAccessKey = await configHelper.getSesAccessKey();

    try {
      await emailSender.send({
        sesAccessKey,
        from: log.from,
        to: log.to.split(';'),
        cc: log.cc ? log.cc.split(';') : [],
        bcc: log.bcc ? log.bcc.split(';') : [],
        subject: log.subject,
        html: log.html,
      });

      await eventLogRepository.setStatus(log.id, 'Sent');
    } catch (err) {
      console.error('NewEventLogHelper', 'sendLog', err);

      await eventLogRepository.setStatus(log.id, 'Failed');
    }
  }

  return {
    async enqueueEmail(req: EnqueueEmailRequest) {
      const from = await configHelper.getSystemFromEmail();

      const to = getEmailAddressString(req.to);

      if (!to) throw new Error('No "to" address specified');

      const toInsert: InsertEventLogRecord = strip({
        from,
        to,
        cc: getEmailAddressString(req.cc),
        bcc: getEmailAddressString(req.bcc),
        ...pick(req, 'subject', 'html'),
      });

      await eventLogRepository.insert(toInsert);
    },

    async sendPending() {
      const pending = await eventLogRepository.getByStatus('Pending');

      await Promise.all(pending.map(sendLog));
    },
  };
}
