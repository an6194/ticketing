import { HydratedDocument, Model, model, Schema } from 'mongoose';
import { OrderStatus } from '@ticketing-ms-project/common';

export { OrderStatus };

interface OrderAttrs {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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
  return new Order({
    _id: attrs.id,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
});

const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
