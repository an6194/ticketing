import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@ticketing-ms-project/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
