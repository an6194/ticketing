import { HydratedDocument, Model, model, Schema } from 'mongoose';
import { OrderStatus } from '@ticketing-ms-project/common';

import { TicketDoc } from './ticket';

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends OrderAttrs {
  version: number;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): HydratedDocument<OrderDoc>;
}

const orderSchema = new Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    versionKey: 'version',
    optimisticConcurrency: true,
  }
);

orderSchema.static('build', (attrs: OrderAttrs) => {
  return new Order(attrs);
});

const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
