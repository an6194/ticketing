import { Model, HydratedDocument, Schema, model } from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends UserAttrs {}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): HydratedDocument<UserDoc>;
}

const userSchema = new Schema<UserDoc, UserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));

    this.set('password', hashed);
  }

  done();
});

userSchema.static('build', (attrs: UserAttrs) => {
  return new User(attrs);
});

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };
