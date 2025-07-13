//loggeduser
const loggeduser = document.querySelector(".loggeduser");
const nowLogged = document.createElement("span");
let currentuser = " ";
let currentUserId = " ";
let session_id = " ";
loggeduser.appendChild(nowLogged);
const userlog = JSON.parse(sessionStorage.getItem("loggeduser"));
for (let i = 0; i < 1; i++) {
  currentuser = userlog[i].username;
  currentUserId = userlog[i].user_id;
  session_id = userlog[i].session_id;
  nowLogged.innerText = currentuser;
}

const allProduct = document.querySelector(".allProduct");
//  const product_box=document.querySelector(".product_box");
// //ajax
// function fetching_product()
// {
//     const fetch_btn=document.querySelector("#fetch-btn");
// const all_product=document.querySelector(".allProduct");
//     const xhttp=new XMLHttpRequest();
//     const URL="https://fakestoreapiserver.reactbd.org/api/amazonproducts?page=1&perPage=50";

//     xhttp.onload=()=>{
//         const response=JSON.parse(xhttp.responseText);
//         const products=response.data;
//         products.forEach(product => {

//             // const productdetail=document.createElement("div");
//             // productdetail.classList.add("product-box");
//             // productdetail.innerHTML= `
//             // <img src="${product.image}"/>
//             // <h1>${product.title}</h1>
//             // <p>${product.description}</p>
//             // <h2>Rs.${product.price}</h2>
//             // `;
//             // all_product.appendChild(productdetail);

//     });
//         console.log(products);

//     }

//     xhttp.open("GET",URL,true);
//     xhttp.send();

// }

document.addEventListener("DOMContentLoaded", fetching_product);

// //  const product_box=document.querySelector(".product_box");

// //         const pname = document.querySelector("#pname");
// //         const price = document.querySelector("#price");
// //         const quantity = document.querySelector("#quantity");
// //         const addBtn = document.querySelector("#submit");
// //         const tableBody = document.querySelector("#table_body");

// //         // Initialize products array from localStorage or create empty array
// //         let products = JSON.parse(localStorage.getItem('products')) || [];
// //         let currentId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

//         // Load products when page loads
//         // document.addEventListener('DOMContentLoaded', loadProducts);

//         // Cancel update
//         // cancelBtn.addEventListener("click", function() {
//         //     updateForm.style.display = 'none';
//         // });
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function checkcart(product) {
  console.log("checking...");
  return fetch(`http://localhost:3000/api/${currentUserId}/carts`)
    .then(res => res.json())
    .then(cart => {
      const exists = cart.find(
        c => c.product_name === product.title && c.user_id === currentUserId
      );
      return exists || null; 
    })
    .catch(error => {
      console.error("Error checking cart:", error);
      return null;
    });
}
//         // Load products from localStorage
//         // function loadProducts(productList=products) {
//         //     allProduct.innerHTML = '';
//         //     // products = JSON.parse(localStorage.getItem('products')) || [];

//         //     if (productList.length === 0) return;

//         //     productList.forEach((product) => {
//         //         addProductToTable(product);
//         //     });
//         // }

//         // Add single product to table
function addProductToTable(product, index) {
  const product_box = document.createElement("div");
  product_box.classList.add("product-box");
  // if(product.quantity===0)
  // {
  //     const outofStock=document.createElement("p").innerText="Out of Stock";
  //     const stock=document.querySelector(".outofStock");
  //     outofStock.appendChild(stock);
  // }
  let new_desc = "";
  const word_length = 50;
  if (product.description.length <= word_length) {
    new_desc = product.description;
  } else {
    new_desc = product.description.slice(0, word_length) + "...";
  }
  product_box.innerHTML = ` 
            <img src="${product.image}"/>
                <h2>${product.title}</h2>
                <p>${new_desc}</p>
                <h3>Rs.${product.price}</h3>
                
                <span class="outofStock"></span>
                <button class="fa-solid fa-cart-shopping buy">  Add To Cart</button>
            `;
  //const buy_qty=product_box.querySelector(".buy_qty");
  const addToCart = product_box.querySelector(".buy");
  const buying_qt = document.createElement("input");
  buying_qt.setAttribute("type", "number");
  buying_qt.min = 1;
  buying_qt.max = 10;
  buying_qt.style.display = "none";
  let existingProduct = checkcart(product);
  product_box.appendChild(buying_qt);
  if (existingProduct) {
    addToCart.style.display = "none";
    buying_qt.style.display = "block";
    buying_qt.value = Number(existingProduct.quantity);

    // console.log(buying_qt.value)

    buying_qt.addEventListener("change", function () {
      const newQty = Number(buying_qt.value);
      if (newQty >= 1 && newQty <= 10) {
        existingProduct.quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        // MakeCart();
        console.log("successfuly done");
      } else {
        alert("invalid quantity");
        buying_qt.value = existingProduct.quantity;
      }
    });
  } else {
    buying_qt.value = 1;

    addToCart.addEventListener("click", function () {
      addingToCart(product.title,product.price,buying_qt.value,product.image);
    });
  }

  allProduct.appendChild(product_box);
}

// const all_Product=document.querySelector(".allProduct");
const product_box = document.querySelector(".product_box");
//ajax
function fetching_product() {
  const fetch_btn = document.querySelector("#fetch-btn");
  const all_product = document.querySelector(".allProduct");
  fetch("http://localhost:3000/api/products")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      res.forEach((product) => {
        addProductToTable(product);
      });

      console.log(res);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}

function addingToCart(product_name, product_price, buying_qt, image_ad) {
  // let cart_id=Date.now;


let cart = {
    id: Date.now(),
    product_name: product_name,
    product_price: product_price,
    quantity: parseInt(buying_qt),
    image: image_ad,
    user_id: currentUserId,
    username: currentuser,
  };
  console.log("button clicked");
  fetch(`http://localhost:3000/api/${currentUserId}/carts`,{
    method:"POST",
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify(cart)
  })
  .then((res=>{
    return res.json();
  }))
.then(data=>{
    console.log("cart: ",data);
})
//   console.log(product_name);
//   console.log(product_price);
//   let cart = {
//     id: Date.now(),
//     product_name: product_name,
//     product_price: product_price,
//     quantity: parseInt(buying_qt),
//     image: image_ad,
//     user_id: currentUserId,
//     username: currentuser,
//   };
//   cart.push(carts);
//   localStorage.setItem("cart", JSON.stringify(cart));
//   checkcart(product_name);

  // loadProducts(visibleItem);
}

// //pagination
// let page=1;
// const pages=document.querySelector(".pages");
// const buttons=document.createElement("div");
// const total_rows=products.length;
// const rowPerpage=6;
// const numberOfPages=Math.ceil(total_rows/rowPerpage);

// displayRecords(page);
// function displayRecords(page)
// {
//     const startIndex=(page-1)*rowPerpage;
//     const endIndex=page*rowPerpage;
//     visibleItem=products.slice(startIndex,endIndex);
//     loadProducts(visibleItem);
// //     visibleItem.forEach(function(item)
// // {
// //     console.log("i=",item);
// // })
// }

// function currentPage(page)
// {
//     page=page;
//     displayRecords(page);
// }
// buttons.innerHTML=``;
//     for(let i=1;i<=numberOfPages;i++)
// {

//     buttons.innerHTML+=`
//     <button onclick="currentPage(${i})">${i}</button>`;

//     pages.appendChild(buttons);
// }

// //MY cart
const myCartBtn = document.querySelector(".mycartBtn");
if (myCartBtn) {
  myCartBtn.addEventListener("click", function () {
    window.location = "cart.html";
  });
}

const productRefresh = document.querySelector(".productRefresh");
productRefresh.addEventListener("click", function () {
  console.log("called product");
  // document.querySelector(".mycart").style.display="none";
  window.location = "customer.html";
});
// // MakeCart();
document.querySelector(".logout").addEventListener("click", function () {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggeduser");
    window.location = "../../index.html";
  }
});
