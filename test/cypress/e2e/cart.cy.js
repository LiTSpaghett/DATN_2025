describe("Cart Page E2E", () => {
  beforeEach(() => {
    // Giả lập user đã đăng nhập (set localStorage token)
    localStorage.setItem("userInfo", JSON.stringify({ token: "fake-jwt-token" }));
  });

  it("Hiển thị giỏ hàng rỗng", () => {
    cy.intercept("GET", "http://localhost:5000/api/cart", { items: [] });
    cy.visit("http://localhost:5173/cart");

    cy.contains("Giỏ hàng trống").should("exist");
    cy.contains("Đi mua sắm")
      .should("have.attr", "href", "/shop");
  });

  it("Hiển thị sản phẩm trong giỏ", () => {
    cy.intercept("GET", "http://localhost:5000/api/cart", {
      items: [
        {
          product: {
            _id: "1",
            name: "Áo thun trắng",
            price: 100000,
            images: ["uploads/test.jpg"]
          },
          size: "M",
          quantity: 2
        }
      ]
    }).as("getCart");

    cy.visit("http://localhost:5173/cart");
    cy.wait("@getCart");

    cy.contains("Áo thun trắng").should("exist");
    cy.contains("200,000 đ").should("exist"); // 100k * 2
  });

  it("Tăng số lượng sản phẩm", () => {
    cy.intercept("GET", "http://localhost:5000/api/cart", {
      items: [
        {
          product: {
            _id: "1",
            name: "Áo thun trắng",
            price: 100000,
            images: ["uploads/test.jpg"]
          },
          size: "M",
          quantity: 2
        }
      ]
    });

    cy.intercept("PUT", "http://localhost:5000/api/cart/update", { success: true }).as("updateCart");

    cy.visit("http://localhost:5173/cart");
    cy.contains("+").click();
    cy.wait("@updateCart");
    cy.contains("3"); // quantity update trên UI
  });

  it("Giảm số lượng sản phẩm", () => {
    cy.intercept("GET", "http://localhost:5000/api/cart", {
      items: [
        {
          product: {
            _id: "1",
            name: "Áo thun trắng",
            price: 100000,
            images: ["uploads/test.jpg"]
          },
          size: "M",
          quantity: 2
        }
      ]
    });

    cy.intercept("PUT", "http://localhost:5000/api/cart/update", { success: true }).as("updateCart");

    cy.visit("http://localhost:5173/cart");
    cy.contains("-").click();
    cy.wait("@updateCart");
    cy.contains("1"); // quantity giảm
  });

  it("Xóa sản phẩm khỏi giỏ", () => {
    cy.intercept("GET", "http://localhost:5000/api/cart", {
      items: [
        {
          product: {
            _id: "1",
            name: "Áo thun trắng",
            price: 100000,
            images: ["uploads/test.jpg"]
          },
          size: "M",
          quantity: 1
        }
      ]
    });

    cy.intercept("DELETE", "http://localhost:5000/api/cart/remove", { success: true }).as("removeCart");

    cy.visit("http://localhost:5173/cart");
    cy.contains("Xóa").click();
    cy.wait("@removeCart");
    cy.contains("Giỏ hàng trống").should("exist");
  });

  it("Điều hướng sang Checkout", () => {
    cy.intercept("GET", "http://localhost:5000/api/cart", {
      items: [
        {
          product: {
            _id: "1",
            name: "Áo khoác trắng",
            price: 200000,
            images: ["uploads/test.jpg"]
          },
          size: "L",
          quantity: 1
        }
      ]
    });

    cy.visit("http://localhost:5173/cart");
    cy.contains("Thanh toán").click();
    cy.url().should("include", "/checkout");
  });
});
