const date= new Date();
const year = new Date().getFullYear(); 
const ran = Math.floor(Math.random() * 999); 

const ncrId = `${year}-${ran}`;
document.getElementById('ncrId').innerText = ncrId;

document.getElementById('ncrDateTime').innerText = date.toLocaleString();

const today = new Date();
const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.getElementById("repDate").value = dateStr;

function confirmCancel() {
    const userconfirm = confirm("Are you sure you want to cancel?, Any changes will not be saved.");
    if (userconfirm) {
        location.href = 'homepage.html';
    }
}

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
            dept: "Quality",
            nonConforming: nonConforming,
            status:"PendingEngineer"
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

document.getElementById('productId').addEventListener("input", (event) => {
    if(event.target.value.length === 0) {
        document.getElementById('productError').innerText = "Product ID is required";
        document.getElementById('productId').style.backgroundColor = "#ffdddd";
    } else if (!event.target.value.startsWith('PR')) {
        document.getElementById('productError').innerText = "Product ID must include 'PR' in the ID";
        document.getElementById('productId').style.backgroundColor = "#ffdddd";
    } else if(event.target.value.includes(" ")) {
        document.getElementById('productError').innerText = "Product ID must remove any spaces";
        document.getElementById('productId').style.backgroundColor = "#ffdddd";
    }  else if(event.target.value.length != 10) {
        document.getElementById('productError').innerText = "Product ID must include 8 numbers";
        document.getElementById('productId').style.backgroundColor = "#ffdddd";
        for(let i = 2; i < event.target.value.length; i++) { //check each character after "PR" except the first two and 9th character
            if (!hasNumber(event.target.value[i])) {
                document.getElementById('productError').innerText = "Product ID can only contain numbers after 'PR'";
                document.getElementById('productId').style.backgroundColor = "#ffdddd";
            }
        }

    } 
    else {
        document.getElementById('productId').style.backgroundColor = "#ffffffff";
        document.getElementById('productError').innerText = "";
    }

});

document.getElementById('orderId').addEventListener("input", (event) => {
    if(event.target.value.length === 0) {
            document.getElementById('orderError').innerText = "Order ID is required";
            document.getElementById('orderId').style.backgroundColor = "#ffdddd";
    } else if (!event.target.value.startsWith('OR')) {
            document.getElementById('orderError').innerText = "Order ID must include 'OR' in the ID";
            document.getElementById('orderId').style.backgroundColor = "#ffdddd";
        } else if(event.target.value.includes(" ")) {
            document.getElementById('orderError').innerText = "Order ID must remove any spaces";
            document.getElementById('orderId').style.backgroundColor = "#ffdddd";
        } else if(event.target.value.length < 10) {
            document.getElementById('orderError').innerText = "Order ID must include 8 numbers";
            document.getElementById('orderId').style.backgroundColor = "#ffdddd";
            for(let i = 2; i < event.target.value.length; i++) {
                if (!hasNumber(event.target.value[i])) {
                    document.getElementById('orderError').innerText = "Order ID can only contain numbers after 'OR'";
                    document.getElementById('orderId').style.backgroundColor = "#ffdddd";
                    return;
                }
            }
        } 
        else {
            document.getElementById('orderId').style.backgroundColor = "#ffffffff";
            document.getElementById('orderError').innerText = "";
        }

});

const processCheckboxes = document.getElementsByName('process');
processCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        const anyChecked = Array.from(processCheckboxes).some(box => box.checked);
        if (!anyChecked) {
            document.getElementById('processError').innerText = "Please select at least one process";
        } else {
            document.getElementById('processError').innerText = "";
        }
    });
});

document.getElementById('supplier').addEventListener("input", (e) => {
    if(e.target.value.length === 0) {
            document.getElementById('supplierError').innerText = "Supplier name is required";
            document.getElementById('supplier').style.backgroundColor = "#ffdddd";
    } else if(e.target.value.length < 3) {
            document.getElementById('supplierError').innerText = "Supplier name must be at at least 3 characters long";
            document.getElementById('supplier').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('supplier').style.backgroundColor = "#ffffffff";
            document.getElementById('supplierError').innerText = "";
        }
});

document.getElementById('desItem').addEventListener("input", (e) => {
    if(e.target.value.length === 0) {
            document.getElementById('desItemError').innerText = "Description of Item is required";
            document.getElementById('desItem').style.backgroundColor = "#ffdddd";
    }
    else if(e.target.value.length < 5) {
            document.getElementById('desItemError').innerText = "Description of Item must be at at least 5 characters long";
            document.getElementById('desItem').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('desItem').style.backgroundColor = "#ffffffff";
            document.getElementById('desItemError').innerText = "";
        }
});

document.getElementById('desDefect').addEventListener("input", (e) => {
    if (e.target.value.trim().length === 0) {
        document.getElementById('desDefectError').innerText = "Description of Defect is required";
        document.getElementById('desDefect').style.backgroundColor = "#ffdddd";
    } else if (e.target.value.trim().length < 5) {
        document.getElementById('desDefectError').innerText = "Description of Defect must be at least 5 characters long";
        document.getElementById('desDefect').style.backgroundColor = "#ffdddd";
    } else {
        document.getElementById('desDefect').style.backgroundColor = "#ffffffff";
        document.getElementById('desDefectError').innerText = "";
    }
});


const quaReceived = document.getElementById('quaReceived');
const quaDefect = document.getElementById('quaDefect');
const quaReceivedError = document.getElementById('quaReceivedError');
const quaDefectError = document.getElementById('quaDefectError');

quaReceived.addEventListener("input", () => {
    const receivedValue = parseInt(quaReceived.value);
    const defectValue = parseInt(quaDefect.value);

    if (isNaN(receivedValue) || receivedValue <= 0) {
        quaReceivedError.innerText = "Quantity Received must be greater than 0";
        quaReceived.style.backgroundColor = "#ffdddd";
    } else {
        quaReceivedError.innerText = "";
        quaReceived.style.backgroundColor = "#ffffffff";
    }

    if (!isNaN(defectValue) && defectValue > receivedValue) {
        quaDefectError.innerText = "Quantity Defect cannot be greater than Received";
        quaDefect.style.backgroundColor = "#ffdddd";
    } else if (!isNaN(defectValue) && defectValue >= 0) {
        quaDefectError.innerText = "";
        quaDefect.style.backgroundColor = "#ffffffff";
    }
});

quaDefect.addEventListener("input", () => {
    const receivedValue = parseInt(quaReceived.value);
    const defectValue = parseInt(quaDefect.value);

    if (isNaN(defectValue)) {
        quaDefectError.innerText = "Quantity Defect is required";
        quaDefect.style.backgroundColor = "#ffdddd";
    } else if (defectValue < 0) {
        quaDefectError.innerText = "Quantity Defect cannot be negative";
        quaDefect.style.backgroundColor = "#ffdddd";
    } else if (!isNaN(receivedValue) && defectValue > receivedValue) {
        quaDefectError.innerText = "Quantity Defect cannot be greater than Received";
        quaDefect.style.backgroundColor = "#ffdddd";
    } else {
        quaDefectError.innerText = "";
        quaDefect.style.backgroundColor = "#ffffffff";
    }
});


document.getElementById('repName').addEventListener("input", (e) => {
    if(e.target.value === "") {
            document.getElementById('repNameError').innerText = "Name is required";
            document.getElementById('repName').style.backgroundColor = "#ffdddd";
    } else if(e.target.value.length < 3) {
            document.getElementById('repNameError').innerText = "Name must be at at least 3 characters long";
            document.getElementById('repName').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('repName').style.backgroundColor = "#ffffffff";
            document.getElementById('repNameError').innerText = "";
        }
});

document.getElementById('repDate').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('repDateError');
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (!input.value) {
        error.innerText = "Date is required";
        input.style.backgroundColor = "#ffdddd";
    } else if (selectedDate > today) {
        error.innerText = "Date cannot be in the future";
        input.style.backgroundColor = "#ffdddd";
    } else {
        error.innerText = "";
        input.style.backgroundColor = "#ffffffff";
    }
});

const nonConformingRadios = document.getElementsByName('nonConforming');
const nonConformingError = document.getElementById('nonConformingError');

nonConformingRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(nonConformingRadios).some(r => r.checked);
        if (!checked) {
            nonConformingError.innerText = "Please select Yes or No";
        } else {
            nonConformingError.innerText = "";
        }
    });
});

function saveDraft() {
    const productId = document.getElementById("productId").value.trim();
    const orderId = document.getElementById("orderId").value.trim();

    if (!productId || !orderId) {
        alert("Please fill in Product ID and Order ID to save draft.");
        return;
    }
    
    const report = {
        date: document.getElementById("repDate").value,
        name: document.getElementById("repName").value,
        productId: document.getElementById("productId").value,
        orderId: document.getElementById("orderId").value,
        process: getCheckedValues("process"),
        supplier: document.getElementById("supplier").value,
        desItem: document.getElementById("desItem").value,
        desDefect: document.getElementById("desDefect").value,
        quaReceived: document.getElementById("quaReceived").value,
        quaDefect: document.getElementById("quaDefect").value,
        nonConforming: getRadioValue("nonConforming"),
        date: document.getElementById("repDate").value,
        name: document.getElementById("repName").value,
        isDraft: "Draft",
        dept:"Quality"
    };

    const reports = JSON.parse(localStorage.getItem("reports")) || {};
    reports[ncrId] = report;
    localStorage.setItem("reports", JSON.stringify(reports));

    alert("Draft saved successfully!");

    window.location.href = "homepage.html";
}

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                .map(cb => cb.value)
                .join(", ");
}

function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "";
}