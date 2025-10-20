const params = new URLSearchParams(window.location.search);
const reportId = params.get('id');

let reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};

if (reportId && reportsLocal[reportId]) {
    populateForm(reportsLocal[reportId], reportId);
} else {
    fetch('reports.json')
      .then(response => response.json())
      .then(allReports => {
          if (reportId && allReports[reportId]) {
              populateForm(allReports[reportId], reportId);
          }
      });
}

function populateForm(report, id) {
    document.getElementById("ncrId").innerText =id;
    document.getElementById("ncrDateTime").innerText =report.date;
    document.getElementById("productId").value = report.productId;
    document.getElementById("orderId").value = report.orderId;
    document.getElementById("supplier").value = report.supplier;
    document.getElementById("desItem").value = report.desItem;
    document.getElementById("desDefect").value = report.desDefect;
    document.getElementById("quaReceived").value = report.quaReceived;
    document.getElementById("quaDefect").value = report.quaDefect;
    document.getElementById('repDate').value = report.date;
    document.getElementById('repName').value = report.name;
    
    document.querySelector(`input[name="nonConforming"][value="${report.nonConforming}"]`).checked = true;

    const processes = report.process.split(', '); 
    document.querySelectorAll('input[name="process"]').forEach(cb => {
        const labelText = cb.parentNode.textContent.trim(); 
        cb.checked = processes.includes(labelText);
    });
}

document.querySelector("form").addEventListener("submit", function(event){
    event.preventDefault(); 

    const process = Array.from(document.querySelectorAll('input[name="process"]:checked'))
                         .map(cb => cb.parentNode.textContent.trim())
                         .join(', ');

    const nonConforming = document.querySelector('input[name="nonConforming"]:checked')?.value;

    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('id');

    let reports = JSON.parse(localStorage.getItem("reports")) || {};

    reports[reportId] = {
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

    localStorage.setItem("reports", JSON.stringify(reports));

    // Chuyển về details
    window.location.href = `details.html?id=${reportId}`;
});

function confirmCancel() {
    const userconfirm = confirm("Are you sure you want to cancel?, Any changes will not be saved.");
    if (userconfirm) {
        location.href = 'homepage.html';
    }
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
    }  else if(event.target.value.length < 10) {
        document.getElementById('productError').innerText = "Product ID must include 8 numbers";
        document.getElementById('productId').style.backgroundColor = "#ffdddd";
        for(let i = 2; i < event.target.value.length; i++) { //check each character after "PR" except the first two and 9th character
            if (!hasNumber(event.target.value[i])) {
                document.getElementById('productError').innerText = "Product ID can only contain numbers after 'PR'";
                document.getElementById('productId').style.backgroundColor = "#ffdddd";
            }
        }

    } else if(!hasNumber(event.target.value[9])) { // Check if the 9th character is a number
        document.getElementById('productError').innerText = "Product ID can only contain 8 numbers after 'PR'";
        document.getElementById('productId').style.backgroundColor = "#ffdddd";
    } else {
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
        } else if(!hasNumber(event.target.value[9])) { // Check if the 9th character is a number
            document.getElementById('orderError').innerText = "Order ID can only contain 8 numbers after 'OR'";
            document.getElementById('orderId').style.backgroundColor = "#ffdddd";
        } else {
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
