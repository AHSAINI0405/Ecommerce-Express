//login
//loggeduser
const loggeduser=document.querySelector(".loggeduser");
const nowLogged=document.createElement("span");
let currentuser=" ";
let currentUserId=" ";
let session_id=" ";
loggeduser.appendChild(nowLogged);
const userlog=JSON.parse(sessionStorage.getItem("loggeduser"));
for(let i=0;i<1;i++)
{
    currentuser=userlog[i].username;
    currentUserId=userlog[i].user_id;
    session_id=userlog[i].session_id;
    nowLogged.innerText=currentuser;
}
const order=document.querySelector(".order");
const order_prod=document.querySelector(".order-product");
const product_list=document.querySelector(".product-list");
// const product=document.querySelector(".product");
const prod_img=document.querySelector(".prod-img");
const prod_detail=document.querySelector(".product-detail");

let cart=JSON.parse(localStorage.getItem("cart"))||[];
function removeItem(deleteItemId)
{
    fetch(`http://localhost:3000/api/${currentUserId}/carts/${deleteItemId}`,{
        method:"DELETE"})
    .then(res=>{return res.json()})
    .then((cart)=>{
    console.log("delete called",deleteItemId);
    buyNow();
    })
    
    
}let grand_total=0;
function buyNow()
{
    
    product_list.innerHTML=``;

    fetch(`http://localhost:3000/api/${currentUserId}/carts`)
    .then(res=>{return res.json()})
    .then((cart)=>{
    cart.forEach((eachCart) => {
        if(eachCart.user_id===currentUserId)
        {

            let total_price=Number(eachCart.quantity)*Number(eachCart.product_price);
            
        const product = document.createElement("div");
        product.classList.add("product");
        grand_total+=total_price;
        
        product.innerHTML = `
            <div class="prod-img"><img src="${eachCart.image}"></div>
                        <div class="product-detail">
                        <h2>${eachCart.product_name}</h2>
                        <h2>Price</h2><p> ${eachCart.product_price}</p>
                        <h3>Quantity </h2><p>${eachCart.quantity}</p>
                        <h2>${total_price}</h2>
                        <button class="fa-solid fa-trash deleteItem" onclick="removeItem(${eachCart.id})"></button>
                        
        `
        
        product_list.appendChild(product);
        }})
        if (grand_total > 0) {
        const grandTotalBox = document.createElement("div");
        grandTotalBox.classList.add("g-total");
        grandTotalBox.innerHTML = `<h2>Grand Total: ₹${grand_total}</h2>`;
        product_list.appendChild(grandTotalBox);
    }
    })
    

}
const final_order=document.querySelector(".final-order");
const place_btn=document.querySelector(".place-btn");

// const c_name=document.querySelector("#c-name").value.trim();
// const c_phone=document.querySelector("#c-phone").value.trim();
// const c_mail=document.querySelector("#c-mail").value.trim();
// const c_city=document.querySelector("#c-city").value.trim();
// const c_add=document.querySelector("#c-add").value.trim();
place_btn.addEventListener("click",placeOrder)
function placeOrder(){
const c_name=document.querySelector("#c-name").value.trim();
const c_phone=document.querySelector("#c-phone").value.trim();
const c_mail=document.querySelector("#c-mail").value.trim();
const c_city=document.querySelector("#c-city").value.trim();
const c_add=document.querySelector("#c-add").value.trim();
const c_state=document.querySelector("#c-state").value.trim();
const c_mode=document.querySelector("#mode").value;
    const date=new Date();
    console.log(date);
    const estimated_Delivery = `${String(date.getDate()+7).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    // console.log(today);  // Example: 13-07-2025

    // console.log(today);
    order.style.display="none";
    final_order.style.display="flex";
    final_order.innerHTML=
    `<h1 style="font-size: 50px">Order Summmary</h1>
    <h2>Order Id: ${Date.now()}</h2>
        <h2>Customer Name: ${c_name}</h2>
        <h3>Email: ${c_mail}</h3>
        <h3>Mobile No.: ${c_phone}</h3>
        <p>Address: ${c_add}</p>
        <p>City: ${c_city}, State:${c_state}</p>
        <h3>Estimated Delivery: ${estimated_Delivery}</h3>
        <h3>Mode of Payment: ${c_mode}</h3>
        <h1>Grand Total:Rs.${grand_total}</h1>
        <button class="close">Close</button>
    `;
let newOrder={
    name:c_name,
    email:c_mail,
    city:c_city,
    state:c_state,
    address:c_add,
    grand_total:grand_total,
    mobile:c_phone,
    estimated:estimated_Delivery,
    mode:c_mode,
    user_id:currentUserId
}
fetch(`http://localhost:3000/api/orders`,{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(newOrder)
})
.then((res)=>{return res.json()})
.then((order)=>{console.log("Orders",order)
     return fetch(`http://localhost:3000/api/carts/${currentUserId}`, {
            method: "DELETE"
        });
    })
    .then(res => res.json())
    .then(deletionResult => {
        console.log("Cart cleared:", deletionResult);
        setTimeout(() => {
    window.location.href = "customer.html";
}, 500);
    })
    .catch(err => {
        console.error("Error:", err.message);
        alert("Something went wrong. Please try again.");
})
    
c_name.value='';
c_add.value='';
c_city.value='';
c_phone.value='';
c_mail.value='';
c_state.value='';

console.log("place called")
const close=document.querySelector(".close");
close.addEventListener("click",()=>{
    console.log("clicked")
    order.style.display="block";
    final_order.style.display="none";
})

}






const productRefresh=document.querySelector(".productRefresh");
productRefresh.addEventListener("click",function()
    {
        console.log("called product")
        // document.querySelector(".mycart").style.display="none";
         window.location="customer.html";
    });
// MakeCart();
document.querySelector(".logout").addEventListener("click", function () {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem("loggeduser");
        window.location = "../../index.html";
    }
});
document.addEventListener("DOMContentLoaded",buyNow)