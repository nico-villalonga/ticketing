import { TicketCreatedEvent } from "@tickex/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { generateId } from "../../../test/helpers/auth";
import { TicketCreatedListener } from "../ticket-created";

const setup = () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: generateId(),
    version: 0,
    title: "concert",
    price: 10,
    userId: generateId(),
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg };
};

describe("ticket created listener", () => {
  it("should create and save ticket", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
    expect(ticket?.price).toEqual(data.price);
  });

  it("should ack the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
