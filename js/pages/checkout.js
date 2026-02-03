// ---- Mock products (normally from API) ----
const products = {
  101: {
    id: 101,
    name: "Pineapple Macbook Pro 2022",
    price: 1746.50
  },
  102: {
    id: 102,
    name: "iPhone 15 Pro",
    price: 1299
  }
};

// ---- Get productId from URL ----
const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

const product = products[productId];
const orderSummary = document.getElementById("orderSummary");

if (!product) {
  orderSummary.innerHTML = "<p>Product not found</p>";
} else {
  orderSummary.innerHTML = `
    <div class="order-item">
      <span>${product.name}</span>
      <span>$${product.price}</span>
    </div>
    <div class="total">
      Total: $${product.price}
    </div>
  `;
}

// ---- Handle form submit ----
document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const billingDetails = Object.fromEntries(formData.entries());

  const orderData = {
    product,
    billingDetails,
    createdAt: new Date().toISOString()
  };

  // ---- Save to localStorage ----
  localStorage.setItem("checkoutOrder", JSON.stringify(orderData));

  alert("Order saved to localStorage ✔");
  console.log(orderData);
});
