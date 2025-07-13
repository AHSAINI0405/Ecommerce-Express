const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static("public"));


app.use(express.json());


app.get("/api/users", (req, res) => {
    const filePath = path.join(__dirname, 'database', 'users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).json({ message: "Failed to read users." });
        }

        const users = JSON.parse(data || '[]');
        res.status(200).json(users);
    });
});

app.post("/api/users", (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const filePath = path.join(__dirname, 'database', 'users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) 
            {
            console.error("Error reading file:", err);
            return res.status(500).json({ message: "Error reading users file." });
        }

        let users = [];
        
            users = JSON.parse(data || '[]');
            const existingUser=users.find(u=>u.email===email);
            if(existingUser)
            {
                return res.status(409).json({ error: "Email already registered" });
            }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            role
        };

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ message: "Error saving user." });
            }

            res.status(201).json({ message: "User registered successfully", user: newUser });
        });
    });
});
//products
app.get("/api/products",(req,res)=>{
    const filePath="database/products.json";
    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)
        {
            console.log("Error in reading file:",err);
        }
        const products=JSON.parse(data || '[]');
        res.status(200).json(products);
    })
})
//CARTS
app.get("/api/:currentUserID/carts",(req,res)=>
{
    const currentUserID = req.params.currentUserID;
    const filePath='database/carts.json';
    fs.readFile(filePath,'utf8',(err,data)=>
    {
        if(err)
        {
            console.log("Error in the fetching of cart:",err)
            return;
        }
        
        const cart=JSON.parse(data || '[]');
        res.status(200).json(cart);
        
    })
});

app.post("/api/:currentUserID/carts",(req,res)=>
{
    const filePath="database/carts.json";
    const currentUserID = req.params.currentUserID;
    const cart={product_name,
    product_price,
    quantity,
    image,
    user_id,
    username}=req.body;
    
    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        let carts=[];
        carts=JSON.parse(data || '[]');
        const existingProduct=carts.find(c=>c.product_name===product_name && c.user_id===user_id);
        if(existingProduct)
        {
           existingProduct.quantity+=1;
           fs.writeFile(filePath,JSON.stringify(carts,null,2),(err)=>{
            if(err)
            {
                console.log("error at updating:",err);
            }
            else{
                console.log("product quantity increased");
                return res.json({ message: "Product already exists in the cart quantity incresesd." });
            }
           })
            
            
        }
        else{
        cart.id=Date.now();
        carts.push(cart);
        fs.writeFile(filePath,JSON.stringify(carts,null,2),(err)=>{
            if(err)
            {
                console.log("Error at addeing item to cart:",err);
                return;
            }
            res.status(201).json(carts);
        });
    }
    });
});
//delete cart
app.delete("/api/:userId/carts/:cartId",(req,res)=>
{
    const filePath="database/carts.json";
    const cartId = Number(req.params.cartId);
    const userId=Number(req.params.userId);
    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        carts=JSON.parse(data || '[]');
        const updatedCart = carts.filter(c => !(c.id === cartId && c.user_id === userId));
        console.log(updatedCart);


        if(updatedCart)
        {
           fs.writeFile(filePath,JSON.stringify(updatedCart,null,2),(err)=>{
            if(err)
            {
                console.log("error at updating:",err);
            }
            else{
                console.log("product quantity increased");
                return res.json({ message: "Product Deleted" });
            }
        });
        }
            
    //     }
    //     else{
    //     cart.id=Date.now();
    //     carts.push(cart);
    //     fs.writeFile(filePath,JSON.stringify(carts,null,2),(err)=>{
    //         if(err)
    //         {
    //             console.log("Error at addeing item to cart:",err);
    //             return;
    //         }
    //         res.status(201).json(carts);
    //     });
    // }
    

});
});
//Orders
app.get("/api/orders",(req,res)=>{
// const userId=req.params.userId;/
const filePath = path.join(__dirname, 'database', 'orders.json')
fs.readFile(filePath,"utf8",(err,data)=>{
    if(err)
    {
        console.log("Error",err);
        return;
    }
    else{
        const orders=JSON.parse(data || '[]')
        res.json(orders);
    }
});
});

app.post("/api/orders",(req,res)=>{
    
    const {name,email,city,state,address,grand_total,mobile,estimated,mode,user_id}=req.body;
     const filePath = path.join(__dirname, "database", "orders.json");
    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)
        {
            console.log("Error is:",err);
            return res.status(500).json({ error: "Could not read orders file" });
        }
        let orders=[];
        orders=JSON.parse(data || '[]');
        const newOrder={
            order_id:Date.now(),
            name,
            email,
            city,
            state,
            address,
            grand_total,
            mobile,
            estimated,
            mode,
            user_id
        };
        orders.push(newOrder);
        fs.writeFile(filePath,JSON.stringify(orders,null,2),(err)=>
        {
            if(err)
            {
                console.log("error:",err)
               return res.status(500).json({ error: "Failed to save order" });
            }
            return res.status(201).json({ message: "Order created", order: newOrder });
        })
    })
})


app.delete("/api/carts/:user_id", (req, res) => {
    const userId = req.params.user_id;
    const filePath = path.join(__dirname, "database", "carts.json");

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Cannot read cart data" });

        let carts = JSON.parse(data || '[]');
        const newCarts = carts.filter(item => item.user_id != userId);

        fs.writeFile(filePath, JSON.stringify(newCarts, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to clear cart" });
            res.json({ message: "Cart cleared successfully" });
        });
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
