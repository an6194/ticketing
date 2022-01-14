import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@ticketing-ms-project/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
