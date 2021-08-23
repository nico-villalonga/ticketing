import { Ticket } from "../ticket";

describe("ticket model", () => {
  it("should implement optimistic concurrency control", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
      userId: "123",
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance?.set({ price: 10 });
    firstInstance?.set({ price: 15 });

    await firstInstance?.save();

    try {
      await secondInstance?.save();
    } catch (err) {
      return;
    }

    throw new Error("should not reach this point.");
  });

  it("should increments version number on multiple saves", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
      userId: "123",
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});
