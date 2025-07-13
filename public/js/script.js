
function signup() {
    document.querySelector(".login-form-container").style.display = "none";
    document.querySelector(".signup-form-container").style.display = "block";
    document.querySelector(".container").style.background = "linear-gradient(to bottom, rgb(56, 189, 149), rgb(28, 139, 106))";
    document.querySelector(".button-1").style.display = "none";
    document.querySelector(".button-2").style.display = "block";
}

function login() {
    document.querySelector(".signup-form-container").style.display = "none";
    document.querySelector(".login-form-container").style.display = "block";
    document.querySelector(".container").style.background = "linear-gradient(to bottom, rgb(6, 108, 224), rgb(14, 48, 122))";
    document.querySelector(".button-2").style.display = "none";
    document.querySelector(".button-1").style.display = "block";
}

// Element references
const sign_error = document.querySelector(".signup-form-container #error");
const login_error = document.querySelector(".login-form-container #error");
const log_user = document.querySelector("#log-user");
const pass = document.querySelector("#log-pass");
const loginbtn = document.querySelector('.login-button');
const sign_up = document.querySelector("#signup-btn");

// Login button click
loginbtn.addEventListener("click", performLogin);

// Signup button click
sign_up.addEventListener("click", performSignup);

// Handle Enter Key Globally
document.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        const loginFormVisible = document.querySelector(".login-form-container").style.display !== "none";
        if (loginFormVisible) {
            performLogin();
        } else {
            performSignup();
        }
    }
});

// Perform Login with Validation
function performLogin() {
    login_error.innerHTML = "";  // Clear previous errors
    const emailVal = log_user.value.trim();
    const passVal = pass.value.trim();

    if (emailVal === "" || passVal === "") {
        loginError("Please fill all fields.");
        return;
    }

    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(data => {
            const user = data.find(u => u.email === emailVal && u.password === passVal);
            if (user) {
                const loggeduser = [{
                    session_id: "s_10" + user.id,
                    user_id: user.id,
                    username: user.username
                }];
                sessionStorage.setItem("loggeduser", JSON.stringify(loggeduser));

                if (user.role.toLowerCase() === "user") {
                    window.location = "../Product/customer.html";
                } else {
                    window.location = "../Admin/admin.html";  // Optional for admin role
                }
            } else {
                loginError("Incorrect email or password.");
            }
        })
        .catch(() => loginError("Server error. Try again later."));
}

// Perform Signup with Validation
function performSignup() {
    sign_error.innerHTML = ``;  // Clear previous errors
    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const passwd = document.querySelector("#passwd").value.trim();
    const role = document.querySelector("#users").value;

    if (!username || !email || !passwd || !role) {
        signupError("All fields are required.");
        return;
    }

    if (!validateEmail(email)) {
        signupError("Invalid email format.");
        return;
    }

    if (passwd.length <8 ) {
        signupError("Password must be at least 8 characters.");
        return;
    }

    const userData = { username, email, password: passwd, role };
    

    fetch('http://localhost:3000/api/users', {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(userData)
    })
         .then(response => {
            if (!response.ok) {
                alert("signup failed");
                signupError("signup failed");
                return Error;
                    
                
            }
            return response.json();
        })
        .then(() => {
            alert("Signup successful. Please login.");
            login();  // Switch to login form
        })

        // .then(response => response.json())
        // .then(() => {
        //     alert("Signup successful. Please login.");
        //     login();  // Switch to login form
        // })
        .catch(() => signupError("Signup failed. Try again later."));

    document.querySelector("#username").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#passwd").value = "";
}

// Utility function: Show error message
function signupError(message) {
    sign_error.innerHTML = ``;
    const errorSpan = document.createElement("span");
    errorSpan.innerText = message;
    errorSpan.style.color = "red";
    
    sign_error.appendChild(errorSpan);
}
function loginError(message) {
    login_error.innerHTML = ``;
    const errorSpan = document.createElement("span");
    errorSpan.innerText = message;
    errorSpan.style.color = "red";
    
    login_error.appendChild(errorSpan);
}

// Utility function: Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

