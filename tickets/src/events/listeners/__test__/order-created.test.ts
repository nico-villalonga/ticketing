import { OrderCreatedEvent, OrderStatus } from "@tickex/common";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/helpers/auth";
import { OrderCreatedListener } from "../order-created";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: generateId(),
  });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: generateId(),
    version: 0,
    status: OrderStatus.Created,
    userId: generateId(),
    expiresAt: "",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg, ticket };
};

describe("order created listener", () => {
  it("should set the userId of the ticket", async () => {
    const { data, listener, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id);
  });

  it("should ack the message", async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
