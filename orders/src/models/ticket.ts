import { HydratedDocument, Model, model, Schema } from 'mongoose';

import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends TicketAttrs {
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): HydratedDocument<TicketDoc>;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<HydratedDocument<TicketDoc> | null>;
}

const ticketSchema = new Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
    // optimisticConcurrency: true,
  }
);

ticketSchema.pre('save', function (done) {
  // manual OCC version check
  this.$where = {
    version: this.get('version') - 1,
  };

  done();
});

ticketSchema.static('build', (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
});

ticketSchema.static('findByEvent', (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

ticketSchema.method('isReserved', async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
});

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
