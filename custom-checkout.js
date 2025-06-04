/////////Run The following Console Log in order to find all buttons classes and Ids in the current page (For dynamically loaded Buttons)

// console.log("All buttons on page:", document.querySelectorAll("button"));

////////////

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
script.async = true;
document.head.appendChild(script);

document
  .getElementById("CartDrawer-Checkout")
  .addEventListener("click", myFunction);

const page_btn = document.getElementById("checkout");

if (page_btn) {
  page_btn.addEventListener("click", myFunction);
}

function myFunction(e) {
  e.preventDefault();
  window.location.href = "/pages/checkout";
}

/////////////////////////////////Checkout Button in Cart popup

document.addEventListener("click", function (e) {
  if (e.target.matches(".cart__checkout-button.button")) {
    e.preventDefault();
    // console.log("Dynamically loaded button clicked!");
    window.location.href = "/pages/checkout";
  }
});

//////////////////////Buy It Now Button

document.addEventListener(
  "click",
  async function (e) {
    if (
      e.target.matches(
        ".shopify-payment-button__button.shopify-payment-button__button--unbranded"
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      // console.log("Dynamically loaded button clicked!");
      await BuyNowRedirect();
    }
  },
  true // This ensures the event is captured before Shopify's event
);

async function BuyNowRedirect() {
  const backend_url = "https://shopifyapp.montypay.com:8081";
  // const backend_url = "http://localhost:8081";
  const currentURL = new URL(window.location.href);

  const shop_url = "https://example.myshopify.com";
  const pathSegments = currentURL.pathname.split("/");
  const handle = pathSegments[pathSegments.length - 1];

  try {
    const response = await axios.post(
      `${backend_url}/Merchant/getItemByHandle`,
      { shop_url: shop_url, handle: handle },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: response.data.product.variants[0].id,
        quantity: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = "/pages/checkout";
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  } catch (error) {
    console.error(
      "Error creating MontyPay session:",
      error.response ? error.response.data : error.message
    );
  }
}

///////////// Buy It Now V2

// document.addEventListener(
//   "click",
//   async function (e) {
//     const button = e.target.closest(
//       ".shopify-payment-button__button.shopify-payment-button__button--unbranded"
//     );
//     if (button) {
//       e.preventDefault();
//       e.stopPropagation();
//       // console.log("Dynamically loaded button clicked!");

//       const shopifyCheckout = button.closest("form");
//       if (shopifyCheckout) {
//         // console.log("Form:", shopifyCheckout);

//         // Get the required input with name="id"
//         const inputId = shopifyCheckout.querySelector(
//           'input[name="id"][required]'
//         );

//         if (inputId) {
//           // console.log("Found required input with name='id':", inputId);
//           // console.log("Value:", inputId.value);
//           const quantityId = shopifyCheckout.querySelector(
//             'input[name="quantity"]'
//           );

//           if (quantityId) {
//             // console.log("Found input with name='quantity':", quantityId);
//             // console.log("Value:", quantityId.value);

//             fetch("/cart/add.js", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 id: inputId.value, // Replace with actual variant ID
//                 quantity: quantityId.value,
//               }),
//             })
//               .then((res) => res.json())
//               .then((data) => {
//                  window.location.href = "/pages/checkout";
//               })
//               .catch((err) => console.error("Cart add error:", err));
//           } else {
//             console.log("No input with name='quantity' found.");
//           }
//         } else {
//           console.log("No required input with name='id' found.");
//         }
//       } else {
//         console.log("No <form> element found.");
//       }
//       // await BuyNowRedirect();
//     }
//   },
//   true // This ensures the event is captured before Shopify's event
// );
