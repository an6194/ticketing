import mongoose from 'mongoose';

import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    expect(err).toBeInstanceOf(mongoose.Error.VersionError);

    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on save with changes', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);

  ticket.set({ price: 15 });

  await ticket.save();

  expect(ticket.version).toEqual(1);
});
