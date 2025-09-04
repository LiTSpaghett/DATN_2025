describe("Chức năng đăng nhập", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login"); // trang login của React app
  });

  it("Đăng nhập thành công với email & password đúng", () => {
    cy.get('input[type="email"]').type("admin@example.com");
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();

    // Kiểm tra điều hướng sang trang chủ
    cy.url().should("eq", "http://localhost:5173/");

    // Kiểm tra localStorage có token
    cy.window().then((win) => {
      const userInfo = JSON.parse(win.localStorage.getItem("userInfo"));
      expect(userInfo).to.have.property("token");
    });
  });

  it("Hiển thị lỗi khi nhập sai mật khẩu", () => {
    cy.get('input[type="email"]').type("user@example.com");
    cy.get('input[type="password"]').type("sai_mat_khau");
    cy.get('button[type="submit"]').click();

    cy.get(".text-red-500").invoke("text").then((text) => {
  expect(text).to.match(/(Đăng nhập thất bại|Email hoặc mật khẩu không đúng)/);
});
  });

  it("Không cho phép bỏ trống email", () => {
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.get('input[type="email"]:invalid').should("exist");
  });

  it("Không cho phép bỏ trống mật khẩu", () => {
    cy.get('input[type="email"]').type("user@example.com");
    cy.get('button[type="submit"]').click();

    cy.get('input[type="password"]:invalid').should("exist");
  });

  it("Điều hướng sang trang đăng ký khi bấm link", () => {
    cy.contains("Đăng ký ngay").click();
    cy.url().should("include", "/register");
  });
});
