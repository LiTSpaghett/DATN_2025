describe("Trang Shop", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/shop"); // sửa port nếu khác
  });

  it("Hiển thị tiêu đề Bộ sưu tập", () => {
    cy.contains("h2", "Bộ sưu tập").should("be.visible");
  });

  it("Load danh sách sản phẩm", () => {
    cy.get(".product-card").should("exist"); // thêm class vào ProductCard
  });

  it("Click vào ảnh sản phẩm để sang trang chi tiết", () => {
    cy.get(".product-card img").first().click({ force: true });
    cy.url().should("include", "/product/");
  });

  it("Thêm sản phẩm vào giỏ hàng", () => {
    cy.get(".product-card button").contains("Thêm vào giỏ").first().click();
    // kiểm tra thông báo hoặc giỏ hàng cập nhật
    cy.contains("đã được thêm vào giỏ hàng").should("be.visible");
  });
});