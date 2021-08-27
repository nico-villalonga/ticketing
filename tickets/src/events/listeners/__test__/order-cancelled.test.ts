import { OrderCancelledEvent } from "@tickex/common";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/helpers/auth";
import { OrderCancelledListener } from "../order-cancelled";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = generateId();
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: generateId(),
  });

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg, orderId, ticket };
};

describe("order cancelled listener", () => {
  it("should set the userId of the ticket", async () => {
    const { data, listener, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).not.toBeDefined();
  });

  it("should ack the message", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("should publish ticket updated event", async () => {
    const { data, listener, msg, orderId } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(data.id).toEqual(orderId);
  });
});
