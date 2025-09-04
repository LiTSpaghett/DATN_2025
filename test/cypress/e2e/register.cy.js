describe("Chức năng Đăng ký", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/register"); // thay 5173 bằng port React của bạn
  });

  it("Hiển thị form đăng ký đầy đủ", () => {
    cy.contains("Đăng ký").should("be.visible");
    cy.get("input[placeholder='Nhập họ tên']").should("be.visible");
    cy.get("input[placeholder='Nhập email']").should("be.visible");
    cy.get("input[placeholder='Tạo mật khẩu']").should("be.visible");
    cy.get("button[type='submit']").should("contain", "Đăng ký");
  });

  it("Không cho phép bỏ trống các trường", () => {
  cy.get("button[type='submit']").click();

  cy.get("input[placeholder='Nhập họ tên']")
    .invoke("prop", "validationMessage")
    .should("not.be.empty");

  cy.get("input[placeholder='Nhập email']")
    .invoke("prop", "validationMessage")
    .should("not.be.empty");

  cy.get("input[placeholder='Tạo mật khẩu']")
    .invoke("prop", "validationMessage")
    .should("not.be.empty");
});


  it("Đăng ký thành công với thông tin hợp lệ", () => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.get("input[placeholder='Nhập họ tên']").type("Người Dùng Mới");
    cy.get("input[placeholder='Nhập email']").type(uniqueEmail);
    cy.get("input[placeholder='Tạo mật khẩu']").type("123456");

    cy.get("button[type='submit']").click();

    // Sau khi đăng ký xong, app chuyển về trang chủ
    cy.url().should("eq", "http://localhost:5173/");
    cy.window().then((win) => {
      const userInfo = JSON.parse(win.localStorage.getItem("userInfo"));
      expect(userInfo).to.have.property("email", uniqueEmail);
    });
  });

  it("Hiển thị lỗi khi email đã được sử dụng", () => {
    // Giả sử email này đã tồn tại trong DB
    const duplicateEmail = "test@example.com";

    cy.get("input[placeholder='Nhập họ tên']").type("Người Dùng Trùng");
    cy.get("input[placeholder='Nhập email']").type(duplicateEmail);
    cy.get("input[placeholder='Tạo mật khẩu']").type("123456");

    cy.get("button[type='submit']").click();

    cy.get(".text-red-500").should("contain", "Email đã được sử dụng");
  });
});
