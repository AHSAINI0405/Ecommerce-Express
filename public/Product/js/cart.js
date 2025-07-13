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
document.addEventListener("DOMContentLoaded",MakeCart);



const mycart=document.querySelector("#mycart");
// document.querySelector(".mycart").style.display="none";
function MakeCart(){
    mycart.innerHTML=``;
    let srNo=0;
    let existingcart=[];
    fetch(`http://localhost:3000/api/${currentUserId}/carts`)
    .then(res=>{return res.json()})
    .then((cart)=>{
        if(cart.length==0)
        {
            const tr = document.createElement("tr");
        
        tr.innerHTML = `<td colspan="6" style="text-align:center">Empty</td>`;

        mycart.appendChild(tr);
            console.log("cart is empty");
        }
             cart.forEach((eachCart) => {
        if(eachCart.user_id===currentUserId)
        {
            let total_price=Number(eachCart.quantity)*Number(eachCart.product_price);
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td>${++srNo}</td><td>${eachCart.product_name}</td>
            <td>${eachCart.quantity}</td><td>${eachCart.product_price}
            </td><td>${total_price}</td><td><button class="fa-solid fa-trash deleteItem" onclick="removeItem(${eachCart.id})"></button></td>
        `
        
        mycart.appendChild(tr);
        }
    })
        
    })
   
//deleting item from cart
}
function removeItem(deleteItemId)
{
    fetch(`http://localhost:3000/api/${currentUserId}/carts/${deleteItemId}`,{
        method:"DELETE"
    })
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        MakeCart();
    })
    console.log("delete called",deleteItemId);
    
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

