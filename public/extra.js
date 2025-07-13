// DOM Elements
        const pname = document.querySelector("#pname");
        const price = document.querySelector("#price");
        const quantity = document.querySelector("#quantity");
        const addBtn = document.querySelector("#submit");
        const tableBody = document.querySelector("#table_body");
        
        // Update form elements
        const updateForm = document.querySelector("#update");
        const upPname = document.querySelector("#up_pname");
        const upPrice = document.querySelector("#up_price");
        const upQuantity = document.querySelector("#up_quantity");
        const updateBtn = document.querySelector("#updating");
        const cancelBtn = document.querySelector("#cancel");
        const upId = document.querySelector("#up_id");

        // Initialize products array from localStorage or create empty array
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let currentId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        // Load products when page loads
        document.addEventListener('DOMContentLoaded', loadProducts);

        // Add product
        addBtn.addEventListener("click", function() {
            if (pname.value.trim() === '' || price.value.trim() === '' || quantity.value.trim() === '') {
                alert('Please fill all fields');
                return;
            }

            const product = {
                id: currentId++,
                name: pname.value.trim(),
                price: parseFloat(price.value),
                quantity: parseInt(quantity.value)
            };

            products.push(product);
            saveToLocalStorage();
            addProductToTable(product);
            
            // Clear input fields
            pname.value = '';
            price.value = '';
            quantity.value = '';
        });

        // Update product
        updateBtn.addEventListener("click", function() {
            const id = parseInt(upId.value);
            const product = products.find(p => p.id === id);
            
            if (product) {
                product.name = upPname.value.trim();
                product.price = parseFloat(upPrice.value);
                product.quantity = parseInt(upQuantity.value);
                
                saveToLocalStorage();
                loadProducts();
                updateForm.style.display = 'none';
            }
        });

        // Cancel update
        cancelBtn.addEventListener("click", function() {
            updateForm.style.display = 'none';
        });

        // Load products from localStorage
        function loadProducts() {
            tableBody.innerHTML = '';
            products = JSON.parse(localStorage.getItem('products')) || [];
            
            if (products.length === 0) return;
            
            products.forEach((product, index) => {
                addProductToTable(product, index + 1);
            });
        }

        // Add single product to table
        function addProductToTable(product, index) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index || products.length}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="editBtn" data-id="${product.id}">Edit</button>
                    <button class="delBtn" data-id="${product.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Add event listeners to the new buttons
            row.querySelector('.editBtn').addEventListener('click', function() {
                editProduct(product.id);
            });
            
            row.querySelector('.delBtn').addEventListener('click', function() {
                deleteProduct(product.id);
            });
        }

        // Edit product
        function editProduct(id) {
            const product = products.find(p => p.id === id);
            if (product) {
                upPname.value = product.name;
                upPrice.value = product.price;
                upQuantity.value = product.quantity;
                upId.value = product.id;
                updateForm.style.display = 'block';
            }
        }

        // Delete product
        function deleteProduct(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                products = products.filter(p => p.id !== id);
                saveToLocalStorage();
                loadProducts();
            }
        }

        // Save to localStorage
        function saveToLocalStorage() {
            localStorage.setItem('products', JSON.stringify(products));
        }