document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "homepage.html";
    } else {
        alert("Invalid credentials");
    }
});
