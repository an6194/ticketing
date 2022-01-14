import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@ticketing-ms-project/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
