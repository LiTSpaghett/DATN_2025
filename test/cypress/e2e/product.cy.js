describe("📦 Quản lý sản phẩm (Admin)", () => {
  beforeEach(() => {
    // 🚀 Đăng nhập admin trước
    cy.visit("http://localhost:5173/login");

   cy.get('input[type="email"]').type("admin@example.com");
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();
  
    cy.window().its("localStorage.userInfo").should("exist");
    cy.visit("http://localhost:5173/admin/products");
  });

  it("Hiển thị danh sách sản phẩm", () => {
    cy.intercept("GET", "http://localhost:5000/api/products").as("getProducts");
    cy.wait("@getProducts");
    cy.get("table").should("exist");
    cy.get("table tbody tr").its("length").should("be.gte", 0);
  });

  it("Thêm sản phẩm mới", () => {
    cy.intercept("POST", "http://localhost:5000/api/products").as("createProduct");

    cy.contains("+ Thêm sản phẩm").click();
    cy.get("input[placeholder='Tên sản phẩm']").type("Áo test Cypress");
    cy.get("input[placeholder='Danh mục']").type("Thời trang");
    cy.get("input[placeholder='Màu sắc (phân tách bằng ,)']").type("Đỏ, Xanh");
    cy.get("input[placeholder='Giá']").type("250000");
    cy.get("textarea[placeholder='Mô tả']").type("Sản phẩm test với Cypress");

    cy.get("input[type='number']").eq(1).clear().type("10"); // size S
    cy.get("input[type='number']").eq(2).clear().type("5");  // size M
    cy.get("input[type='number']").eq(3).clear().type("2");  // size L

    cy.get("input[type='file']").selectFile("cypress/fixtures/shirt.jpg");

    cy.get("button[type='submit']").click();
    cy.wait("@createProduct").its("response.statusCode").should("eq", 200);
    cy.contains("✔️ Thêm sản phẩm thành công");
  });

  it("Sửa sản phẩm", () => {
    cy.intercept("PUT", "http://localhost:5000/api/products/*").as("updateProduct");

    cy.contains("Sửa").first().click();
    cy.get("input[placeholder='Tên sản phẩm']").clear().type("Áo test updated");
    cy.get("button[type='submit']").click();

    cy.wait("@updateProduct").its("response.statusCode").should("eq", 200);
    cy.contains("✔️ Sửa sản phẩm thành công");
  });

  it("Xóa sản phẩm", () => {
    cy.intercept("DELETE", "http://localhost:5000/api/products/*").as("deleteProduct");
    cy.on("window:confirm", () => true); // auto confirm

    cy.contains("Xóa").first().click();
    cy.wait("@deleteProduct").its("response.statusCode").should("eq", 200);
  });
});
