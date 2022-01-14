import { HydratedDocument, Model, model, Schema } from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends PaymentAttrs {}

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs): HydratedDocument<PaymentDoc>;
}

const paymentSchema = new Schema<PaymentDoc, PaymentModel>(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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
  }
);

paymentSchema.static('build', (attrs: PaymentAttrs) => {
  return new Payment(attrs);
});

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
