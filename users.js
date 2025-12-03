const users = [
    { email: "quality@gmail.com", password: "123", Role: "Quality" },
    { email: "engineer@gmail.com", password: "123", Role: "Engineer" },
    { email: "operations@gmail.com", password: "123", Role: "Purchasing" },
    { email: "admin@gmail.com", password: "123", Role: "Admin" }
];
localStorage.setItem("users", JSON.stringify(users));
