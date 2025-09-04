describe("Order Tracking Page E2E", () => {
  const baseUrl = "http://localhost:5173/ordertracking";

  it("Yêu cầu đăng nhập nếu chưa có userInfo", () => {
    localStorage.removeItem("userInfo");
    cy.visit(baseUrl);
    cy.contains("Bạn cần đăng nhập để xem đơn hàng").should("exist");
  });

  it("Hiển thị không có đơn hàng", () => {
    localStorage.setItem("userInfo", JSON.stringify({ token: "fake-jwt" }));

    cy.intercept("GET", "http://localhost:5000/api/orders/mine", []).as("getOrders");
    cy.visit(baseUrl);
    cy.wait("@getOrders");

    cy.contains("Bạn chưa có đơn hàng nào").should("exist");
  });

  it("Hiển thị danh sách đơn hàng", () => {
    localStorage.setItem("userInfo", JSON.stringify({ token: "fake-jwt" }));

    cy.intercept("GET", "http://localhost:5000/api/orders/mine", [
      {
        _id: "order123",
        status: "pending",
        createdAt: "2025-09-01T10:00:00.000Z",
        totalPrice: 300000,
        shippingAddress: { address: "123 Lê Lợi, HN", phone: "0123456789" },
        orderItems: [
          { product: { name: "Áo thun" }, size: "M", quantity: 2, price: 100000 },
          { product: { name: "Quần jeans" }, size: "32", quantity: 1, price: 100000 }
        ]
      }
    ]).as("getOrders");

    cy.visit(baseUrl);
    cy.wait("@getOrders");

    cy.contains("Mã đơn: order123").should("exist");
    cy.contains("pending").should("exist");
    cy.contains("Áo thun (Size: M) × 2 = 200,000₫").should("exist");
    cy.contains("Quần jeans (Size: 32) × 1 = 100,000₫").should("exist");
    cy.contains("Tổng tiền: 300,000₫").should("exist");
    cy.contains("Địa chỉ: 123 Lê Lợi, HN").should("exist");
    cy.contains("SĐT: 0123456789").should("exist");
  });

  it("Hiển thị đúng màu cho trạng thái đơn hàng", () => {
    localStorage.setItem("userInfo", JSON.stringify({ token: "fake-jwt" }));

    const statuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

    cy.intercept("GET", "http://localhost:5000/api/orders/mine", statuses.map((st, idx) => ({
      _id: "order" + idx,
      status: st,
      createdAt: "2025-09-01T10:00:00.000Z",
      totalPrice: 100000,
      shippingAddress: { address: "Test", phone: "000" },
      orderItems: []
    })));

    cy.visit(baseUrl);

    statuses.forEach(st => {
      cy.contains(st).should("exist");
    });
  });
});
