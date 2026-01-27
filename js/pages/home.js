import * as productService from "../services/productService.js";

//Examble
const subcategoriesContainer = document.querySelector(
  ".subcategories-container",
);

async function renderSubcategories() {
  if (!subcategoriesContainer) return;

  try {
    const subcategories = await productService.getAllSubcategories();

    subcategoriesContainer.innerHTML = "";

    subcategories.forEach((subcategory) => {
      const subcategoryElement = document.createElement("a");
      subcategoryElement.classList.add("subcategory");
      subcategoryElement.textContent = subcategory.name;
      subcategoryElement.href = `products.html?subcategory=${subcategory.id}`;

      subcategoriesContainer.appendChild(subcategoryElement);
    });
  } catch (error) {
    console.error("Error loading subcategories:", error);
  }
}

async function renderTopCategories() {
  if (!subcategoriesContainer) return;

  try {
    const categories = await productService.getAllCategories();

    categories.slice(0, 5).forEach((category) => {
      const categoryElement = document.createElement("a");
      categoryElement.classList.add("category");
      categoryElement.textContent = category.name;
      categoryElement.href = `products.html?category=${category.id}`;

      subcategoriesContainer.appendChild(categoryElement);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function renderTopdiscounts() {
  if (!subcategoriesContainer) return;
  try {
    //Get products with discounts
    const products =
      await productService.getProductsBySubcategory("subcat-006");
    //sort products by discount amount
    const topDiscounts = await productService.sortProducts(
      products,
      "discount",
    );
    const product = topDiscounts[0];

    if (!product) return;

    // Create link
    const productElement = document.createElement("a");
    productElement.classList.add("top-discount-product");
    productElement.href = `product.html?id=${product.id}`;
    productElement.textContent = `${product.name} - ${product.discount}% OFF`;

    // 5Add image (first image only)
    product.images.forEach((imgUrl) => {
      const imgElement = document.createElement("img");
      imgElement.src = imgUrl;
      imgElement.alt = product.name;
      productElement.appendChild(imgElement);
    });

    subcategoriesContainer.appendChild(productElement);
  } catch (error) {
    console.error("Error loading top discounts:", error);
  }
}

async function renderTopRatedProducts() {
  if (!subcategoriesContainer) return;
  try {
    //Get all products
    const products = await productService.getAllProducts();
    //sort products by rating
    const topRatedProducts = await productService.sortProducts(
      products,
      "rating",
    );
    topRatedProducts.slice(0, 10).forEach((product) => {
      const productElement = document.createElement("a");
      productElement.classList.add("top-rated-product");
      productElement.href = `product.html?id=${product.id}`;
      productElement.textContent = `${product.name} - Rating: ${product.rating}`;
      subcategoriesContainer.appendChild(productElement);
    });
  } catch (error) {
    console.error("Error loading top rated products:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  //   await renderSubcategories();
  //   await renderTopCategories();
  //   await renderTopdiscounts();
 await renderTopRatedProducts();
});
