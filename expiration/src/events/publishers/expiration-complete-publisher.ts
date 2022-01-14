import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@ticketing-ms-project/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
