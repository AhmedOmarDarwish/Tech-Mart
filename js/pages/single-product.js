const MAX_SUB_IMAGES = 3;
const MAX_REVIEWS = 5;

function isWithin60Days(isoString) {
  // isoString is in format "YYYY-MM-DD", make it a date
  const targetDate = new Date(isoString);
  // get current date
  const currentDate = new Date();
  // calculate difference in milliseconds
  const diffInMs = Math.abs(currentDate - targetDate);
  // convert difference from milliseconds to days
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  // return true if difference is less than 60 days
  return diffInDays < 60;
}

class ProductSection {
  constructor(productId) {
    this.productId = productId;
    this.product = null;

    this.elements = {
      mainImage: null,
      subImageContainer: null,
      productInfo: null,
      productPrice: null,
      quantityBtns: null,
      addToCartBtn: null,
    };
  }

  cacheElements() {
    this.elements.mainImage = document.querySelector(
      ".single-product__gallery-image--main",
    );
    this.elements.subImageContainer = document.querySelector(
      ".single-product__gallery-image--sub-container",
    );
    this.elements.productInfo = document.querySelector(".single-product__info");
    this.elements.productPrice = document.querySelector(
      ".single-product__purchase-price",
    );
    this.elements.quantityBtns = document.querySelector(
      ".single-product__quant-btn",
    );
    this.elements.addToCartBtn = document.querySelector(
      ".single-product__add-btn",
    );
  }

  async init() {
    try {
      await this.fetchProduct();
      this.cacheElements();
      await this.render();
      this.attachEventListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchProduct() {
    try {
      const response = await fetch("../data/products.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.product = data.find((product) => product.id === this.productId);
      if (!this.product) throw new Error("product not found");
    } catch (error) {
      this.handleError(error);
    }
  }

  async render() {
    await Promise.all([
      this.renderImages(),
      this.renderInfo(),
      this.renderPurchase(),
      this.addToCart(),
    ]);
  }

  renderImages() {
    // select main image
    const mainImage = this.elements.mainImage;
    // select container of sub images if exists
    const subImageContainer = this.elements.subImageContainer;
    // set src of main image
    mainImage.src = `${this.product.thumbnail}`;

    // set src of sub images if exists
    if (this.product.images.length > 1) {
      this.product.images.forEach((element, index) => {
        if (index === 0 || index > MAX_SUB_IMAGES) return;
        const subImage = document.createElement("img");
        subImage.classList.add("single-product__gallery-image--sub");
        subImage.src = `${element}`;
        subImage.addEventListener("mouseenter", () => {
          mainImage.src = `${element}`;
        });
        subImage.addEventListener("mouseleave", () => {
          mainImage.src = `${this.product.thumbnail}`;
        });
        subImageContainer.appendChild(subImage);
      });
      subImageContainer.style.visibility = "visible";
    }
    // select element to contain new tag
    const newTag = document.querySelector(".single-product__gallery-tag");
    const dataString = this.product.createdAt;
    if (isWithin60Days(dataString)) {
      newTag.style.visibility = "visible";
    }
  }

  renderInfo() {
    // product info
    this.elements.productInfo.innerHTML = `
    <h2 class="single-product__info-name">${this.product.name}</h2>
    <h3 class="single-product__info-price">${this.product.price.toLocaleString(
      "en-US",
      { minimumFractionDigits: 0, maximumFractionDigits: 2 },
    )} $</h3>
    <p class="single-product__info-description">${this.product.description}</p>
    <hr>
    <p class="single-product__info-features"><strong>features:</strong> 
    <ul style="list-style-type:disc">${
      this.product.features
        ? this.product.features
            .map((item) => {
              return `<li>${item}</li>`;
            })
            .join("")
        : ""
    }</ul></p>`;
    this.elements.productInfo.innerHTML += `<h6>CATEGORY: ${this.product.tags[0]}</h6>
    <h6>Brand: ${this.product.brand}</h6>`;
  }

  renderPurchase() {
    // product purchase
    this.elements.productPrice.innerText = `${this.product.price.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    )} $`;
  }

  addToCart() {
    const addToCartBtn = this.elements.addToCartBtn;
    /**
     *  ADD TO CARD FUNCTION
     */
  }

  attachEventListeners() {
    const btn = document.querySelectorAll(".single-product__quant-btn");
    btn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const quant = document.querySelector(".single-product__quant-value");
        if (btn.innerText === "+") {
          if (Number(quant.innerText) === this.product.stock) return;
          quant.innerText = Number(quant.innerText) + 1;
        } else {
          if (Number(quant.innerText) === 1) return;
          quant.innerText = Number(quant.innerText) - 1;
        }
        this.elements.productPrice.innerText = `${(
          this.product.price * quant.innerText
        ).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })} $`;
      });
    });
  }

  handleError(error) {
    console.error("ProductPage Error:", error);
  }
}

class ReviewSection {
  constructor(productId) {
    this.productId = productId;
    this.reviews = [];
    this.elements = {
      reviewContainer: null,
    } 
  }

  cacheElements(){
    this.elements.reviewContainer = document.querySelector(".reviews__container");
  }
  async init() {
    await this.fetchReviews();
    this.cacheElements();
    this.render();
  }

  async fetchReviews() {
    try {
      const response = await fetch("../data/reviews.json");
      if(!response.ok) throw Error (`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if(!data) throw Error ("data not found");
      this.reviews = data.filter(
        (reviews) => reviews.productId === this.productId,
      );
    } catch (error) {
      handleError(error);
    }
  }


  async render()
  {
    const reviewContainer = this.elements.reviewContainer;
    this.reviews.forEach((review, index) => {
        if(index > MAX_REVIEWS) return;
        const user = getUserById(review.userId);
        const rev_body = document.createElement("div");
        rev_body.classList.add("review__body");
            const user_info = document.createElement("div");
            user_info.classList.add("review__user-info");
                const img_container = document.createElement("div");
                img_container.classList.add("review__user-info--img-container");
                    const img= document.createElement("img");                    
                    img.src = `${user.img? user.img : "../assets/images/users/default-avatar.png"}`;
                    img_container.appendChild(img);    
                user_info.appendChild(img_container);
                const user_name = document.createElement("div");
                user_name.classList.add("review__user-info--name");
                user_name.innerText = `${user.name === undefined ? "Anonymous" : user.name}`;
                user_info.appendChild(user_name);
            rev_body.appendChild(user_info);
            const rev_info = document.createElement("div");
            rev_info.classList.add("review__info");
                const rating = document.createElement("span");
                rating.classList.add("review__info--rating");
                    const rating_stars = document.createElement("span");
                    rating_stars.classList.add("review__info__stars");
                        setRating(rating_stars, review.rating);
                    rating.appendChild(rating_stars);
                    const rating_value = document.createElement("span");
                    rating_value.classList.add("review__info--ratings-value");
                    rating_value.innerText = `${review.rating}`;
                    rating.appendChild(rating_value);
                rev_info.appendChild(rating);
                const title = document.createElement("div");
                title.classList.add("review__info--title");
                title.innerText = `${review.title}`;
                rev_info.appendChild(title);
                const date = document.createElement("div");
                date.classList.add("review__info--date");
                date.innerText = `${review.createdAt}`;
                rev_info.appendChild(date);
                const verified = document.createElement("div");
                verified.classList.add("review__info--verified");
                verified.innerText = `${review.verifiedPurchase ? "Verified Purchase" : ""}`;
                rev_info.appendChild(verified);
            const content = document.createElement("div");
            content.classList.add("review__info--content");
            content.innerText = `${review.comment}`;
            rev_body.appendChild(rev_info);
            rev_body.appendChild(content);
            
            this.elements.reviewContainer.appendChild(rev_body);
    })
  }
}

async function getUserById(userId) {
  try {
    const response = await fetch("../data/users.json");
    const users = await response.json();    
    const user = users.find((u) => u.id === userId);
    if(!user)return null;    
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

function setRating(stars_con,rating)
{   rating = 3.5;
    for(let i = 0; i < 5; i++)
    {
        const star = document.createElement("span");
        star.innerText = `★`;
        star.classList.add("review__star");
        // Check if this star should be full, partial, or empty
        let fill = 0;
        if (rating >= i + 1) {
            fill = 100; // Full star
        } else if (rating > i) {
            fill = (rating - i) * 100; // Partial star (e.g., 0.5 * 100 = 50%)
        }
        star.style.setProperty('--percent', fill + '%');
        stars_con.appendChild(star);
    }
}

// run when page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // get product id from URL
  const productId = new URLSearchParams(window.location.search).get(
    "productId",
  );
  const prod = new ProductSection(productId);
  await prod.init();

  const rev = new ReviewSection(productId);
  await rev.init();
});
