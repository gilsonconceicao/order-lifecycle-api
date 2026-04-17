import { OrderService } from "@/modules/order/order.service";

describe("Optimize Assignment", () => {
  it("sem entregadores disponíveis", async () => {
    const orderRepository = {
      findReadyOrders: async () => [
        {
          id: "1",
          deliveryAddress: "Rua A",
          latitude: -23.5,
          longitude: -46.6,
        },
      ],
    };

    const deliveryRepository = {
      findAvailable: async () => [],
    };
    //@ts-ignore
    const service = new OrderService(orderRepository, deliveryRepository, {}, {});

    const result = await service.optimizeAssignment();

    expect(result.assignments.length).toBe(0);
    expect(result.unassigned.length).toBe(1);
  });

  it("com entregador disponível", async () => {
    const orderRepository = {
      findReadyOrders: async () => [
        {
          id: "1",
          deliveryAddress: "Rua A",
          latitude: -23.5,
          longitude: -46.6,
        },
      ],
      assignDeliveryPerson: async () => {},
      updateStatus: async () => {},
    };

    const deliveryRepository = {
      findAvailable: async () => [
        {
          id: "d1",
          name: "João",
          currentLatitude: -23.5,
          currentLongitude: -46.6,
        },
      ],
    };

    //@ts-ignore
    const service = new OrderService(orderRepository, deliveryRepository, {}, {});

    const result = await service.optimizeAssignment();

    expect(result.assignments.length).toBe(1);
  });
});
