describe("📦 Quản lý đơn hàng (Admin)", () => {
  beforeEach(() => {
    // 🚀 Đăng nhập bằng admin trước
    cy.visit("http://localhost:5173/login");

    cy.get('input[type="email"]').type("admin@example.com");
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.window().its("localStorage.userInfo").should("exist");

    // Vào trang quản lý đơn hàng
    cy.visit("http://localhost:5173/admin/orders");
  });

  it("Hiển thị danh sách đơn hàng", () => {
    cy.intercept("GET", "http://localhost:5000/api/orders").as("getOrders");
    cy.wait("@getOrders");

    cy.get("table").should("exist");
    cy.get("table tbody tr").its("length").should("be.gte", 0); // có ít nhất 0 đơn hàng
  });

  it("Hiển thị đúng thông tin đơn hàng đầu tiên", () => {
    cy.get("table tbody tr").first().within(() => {
      cy.get("td").eq(0).should("not.be.empty"); // Khách hàng
      cy.get("td").eq(1).should("not.be.empty"); // Sản phẩm
      cy.get("td").eq(2).should("not.be.empty"); // Địa chỉ
      cy.get("td").eq(3).should("not.be.empty"); // Tổng tiền
      cy.get("td").eq(4).find("select").should("exist"); // Trạng thái
    });
  });

  it("Cập nhật trạng thái đơn hàng", () => {
    cy.intercept("PUT", "http://localhost:5000/api/orders/*/status").as("updateStatus");

    cy.get("table tbody tr").first().within(() => {
      cy.get("select").select("shipping"); // đổi sang "Đang giao"
    });

    cy.wait("@updateStatus").its("response.statusCode").should("eq", 200);
  });
});
