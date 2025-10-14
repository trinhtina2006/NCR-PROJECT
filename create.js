const date= new Date();
const year = new Date().getFullYear(); 
const ran = Math.floor(Math.random() * 999); 

const ncrId = `${year}-${ran}`;
document.getElementById('ncrId').innerText = ncrId;

document.getElementById('ncrDateTime').innerText = date.toLocaleString();

function saveFormData() {
    fetch('reports.json') 
    .then(response => response.json())
    .then(allReports => {
        const process = Array.from(document.querySelectorAll('input[name="process"]:checked'))
                             .map(cb => cb.nextSibling.textContent.trim())
                             .join(', ');

        const nonConforming = document.querySelector('input[name="nonConforming"]:checked')?.value;

        const ncr = {
            date: document.getElementById("repDate").value,
            name: document.getElementById("repName").value,
            productId: document.getElementById("productId").value,
            orderId: document.getElementById("orderId").value,
            process: process,
            supplier: document.getElementById("supplier").value,
            desItem: document.getElementById("desItem").value,
            desDefect: document.getElementById("desDefect").value,
            quaReceived: document.getElementById("quaReceived").value,
            quaDefect: document.getElementById("quaDefect").value,
            nonConforming: nonConforming
        };

    let reports = JSON.parse(localStorage.getItem("reports")) || {};
    reports[ncrId] = ncr;   
    localStorage.setItem("reports", JSON.stringify(reports));

    window.location.href = `details.html?id=${ncrId}`;
    })
    .catch(err => console.error("Cannot load reports.json:", err));
}

function ValidateData() {
    let valid = true;
    let messages = [];

    const productId = document.getElementById("productId").value.trim();
    if (!/^PR\d{8}$/.test(productId)) {
        valid = false;
        messages.push("Product ID must be in format PR########");
    }

    const orderId = document.getElementById("orderId").value.trim();
    if (!/^OR\d{8}$/.test(orderId)) {
        valid = false;
        messages.push("Order ID must be in format OR########");
    }

    const supplier = document.getElementById("supplier").value.trim();
    if (supplier.length < 3) {
        valid = false;
        messages.push("Supplier name must be at least 3 characters");
    }

    const desItem = document.getElementById("desItem").value.trim();
    if (desItem.length < 3) {
        valid = false;
        messages.push("Description of item must be at least 3 characters");
    }

    const quaReceived = parseInt(document.getElementById("quaReceived").value);
    if (quaReceived < 0) {
        valid = false;
        messages.push("Quantity Received must be a number > 0");
    }

    const quaDefect = parseInt(document.getElementById("quaDefect").value);
    if (quaDefect < 0 || quaDefect > quaReceived) {
        valid = false;
        messages.push("Quantity Defect must be a number >= 0 and <= Quantity Received");
    }

    const nonConforming = document.querySelector('input[name="nonConforming"]:checked');
    if (!nonConforming) {
        valid = false;
        messages.push("Please select if item is non-conforming");
    }

    const process = document.querySelectorAll('input[name="process"]:checked');
    if (process.length === 0) {
        valid = false;
        messages.push("Please select at least one process");
    }

    const repName = document.getElementById("repName").value.trim();
    const repDate = document.getElementById("repDate").value;
    if (repName.length < 3) {
        valid = false;
        messages.push("Representative Name must be at least 3 characters");
    }
    if (!repDate) {
        valid = false;
        messages.push("Please select a Representative Date");
    }

    if (!valid) {
        alert(messages.join("\n"));
    }
    return valid;
}

function openPopup() {
    document.getElementById("emailPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("emailPopup").style.display = "none";
}

function sendEmail() 
{
    const email = document.getElementById("emailInput").value;
    if (email.trim() === "") {
      alert("Please enter an email address!");
      return;
    }
    alert("Email has been sent to the engineer: " + email);
    closePopup();
    saveFormData();
}

function SaveWithDataValid() 
{
    if (!ValidateData()) return;

    openPopup();
}
