import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@ticketing-ms-project/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
