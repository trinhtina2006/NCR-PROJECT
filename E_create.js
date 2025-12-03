const date= new Date();
const params = new URLSearchParams(window.location.search);
const ncrId = params.get('id');

const reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};
const ncr = reportsLocal[ncrId];
loadQualitySummary(ncr);

document.getElementById('ncrId').innerText = ncrId;
document.getElementById('ncrDateTime').innerText = date.toLocaleString();

const today = new Date();
const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.getElementById("repDate").value = dateStr;
document.getElementById("revDate").value=dateStr;

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
    let reports = JSON.parse(localStorage.getItem("reports")) || {};
    const existingNCR = reports[ncrId] || {};

    existingNCR.CF_Engineering = document.querySelector('input[name="CF_Engineering"]:checked')?.value;
    existingNCR.customerNotification = document.querySelector('input[name="customerNotification"]:checked')?.value;
    if (existingNCR.customerNotification === "Yes") {
        existingNCR.customerNotificationDetails = document.getElementById("customerNotificationText").value;
    } else {
        existingNCR.customerNotificationDetails = null;}
    existingNCR.drawingUpdate = document.querySelector('input[name="drawingUpdate"]:checked')?.value;
    existingNCR.disposition = document.getElementById("disposition").value;
    existingNCR.revNumber = document.getElementById("revNumber")?.value;
    existingNCR.newRevNumber = document.getElementById("newRevNumber").value;
    existingNCR.revDate = document.getElementById("revDate").value;
    existingNCR.E_date = document.getElementById("repDate").value;
    existingNCR.E_name = document.getElementById("repName").value;
    existingNCR.dept = "Engineering";
    existingNCR.state = "EngineerFilled";  
    existingNCR.nextEmail= document.getElementById("nextEmail").value;

    reports[ncrId] = existingNCR;
    localStorage.setItem("reports", JSON.stringify(reports));

    window.location.href = `details.html?id=${ncrId}`;
    })
    .catch(err => console.error("Cannot load reports.json:", err));
}

function ValidateData() {
    let valid = true;
    let messages = [];

    const CF_Engineering = document.querySelector('input[name="CF_Engineering"]:checked');
    if (!CF_Engineering) {
        valid = false;
        messages.push("Please select an option from CF Engineering");
        document.getElementById("disposition").scrollIntoView({behavior:"smooth", block:"center"});
        
    }

    const disposition = document.getElementById("disposition").value.trim();
    if (disposition.length < 5 && (document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Repair" ||
    document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Rework")) {
        valid = false;
        messages.push("Disposition must be at least 5 characters");
        document.getElementById("disposition").scrollIntoView({behavior:"smooth", block:"center"});
    }

    const repName = document.getElementById("repName").value.trim();
    const repDate = document.getElementById("repDate").value;
    if (repName.length < 3) {
        valid = false;
        messages.push("Representative Name must be at least 3 characters");
        document.getElementById("repName").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (!repDate) {
        valid = false;
        messages.push("Please select a Representative Date");
        document.getElementById("repDate").scrollIntoView({behavior:"smooth", block:"center"});
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
    const email = document.getElementById("nextEmail").value;
    if (email.trim() === "") {
      alert("Please enter an email address!");
      return;
    }
    alert("Email has been sent to the Operation: " + email);
    closePopup();
    saveFormData();
}

function SaveWithDataValid() 
{
    if (!ValidateData()) return;

    openPopup();
} 

function hasNumber(str) {
        return /\d/.test(str);
}

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

const CF_EngineeringRadios = document.getElementsByName('CF_Engineering');
CF_EngineeringRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(CF_EngineeringRadios).some(r => r.checked);

        if (!checked) {
            CF_EngineeringError.innerText = "Please select an option";
        } 
        else if(document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Repair" ||
    document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Rework") {
            disposition.readOnly = false;
            disposition.style.backgroundColor = "#ffffff"; 
            disposition.style.color = "#000000";
            disposition.style.cursor = "text";
            disposition.placeholder = "Enter steps required";
        }
        else {
            disposition.readOnly = true;
            disposition.style.backgroundColor = "#e0e0e0"; 
            disposition.style.color = "#666666"; 
            disposition.style.cursor = "not-allowed";
            disposition.placeholder = "Not required for this option";
            disposition.value = ""; 
            document.getElementById('dispositionError').innerText = "";
        }
    });    
});

document.getElementById('revNumber').addEventListener("input", (event) => {
    const value = event.target.value;
    const error = document.getElementById('revNumberError');

    if (value.includes(" ")) {
        error.innerText = "Revision Number must not contain spaces";
        event.target.style.backgroundColor = "#ffdddd";
    } else if (!/\d/.test(value)) {
        error.innerText = "Revision Number must contain at least one number";
        event.target.style.backgroundColor = "#ffdddd";
    } else {
        error.innerText = "";
        event.target.style.backgroundColor = "#ffffff";
    }
});


document.getElementById('newRevNumber').addEventListener("input", (event) => {
    const value = event.target.value;
    const error = document.getElementById('newRevNumberError');

    if (value.includes(" ")) {
        error.innerText = "New Revision Number must not contain spaces";
        event.target.style.backgroundColor = "#ffdddd";
    } else if (!/\d/.test(value)) {
        error.innerText = "New Revision Number must contain at least one number";
        event.target.style.backgroundColor = "#ffdddd";
    } else {
        error.innerText = "";
        event.target.style.backgroundColor = "#ffffff";
    }
});


document.getElementById('revDate').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('revDateError');
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

document.getElementById('disposition').addEventListener("input", (e) => {
    if(e.target.value.length === 0 && document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Repair" ||
    document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Rework") {
            document.getElementById('dispositionError').innerText = "Disposition is required";
            document.getElementById('disposition').style.backgroundColor = "#ffdddd";
    }
    else if(e.target.value.length < 5) {
            document.getElementById('dispositionError').innerText = "Disposition must be at at least 5 characters long";
            document.getElementById('disposition').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('disposition').style.backgroundColor = "#ffffffff";
            document.getElementById('dispositionError').innerText = "";
        }
});

/*CUSTOMER NOTI */
const customerRadios = document.getElementsByName("customerNotification");
const customerDiv = document.getElementById("customerNotificationDiv");

customerRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "Yes" && radio.checked) {
            customerDiv.style.display = "block";
        } else if (radio.value === "No" && radio.checked) {
            customerDiv.style.display = "none";
            document.getElementById("customerNotificationText").value = ""; 
        }
    });
});

function saveDraft() {
    let reports = JSON.parse(localStorage.getItem("reports")) || {};

    reports[ncrId] = {
        ...reports[ncrId],  
        CF_Engineering: document.querySelector('input[name="CF_Engineering"]:checked')?.value || "",
        customerNotification: document.querySelector('input[name="customerNotification"]:checked')?.value || "",
        customerNotificationDetails: document.getElementById("customerNotificationText").value || "",
        drawingUpdate: document.querySelector('input[name="drawingUpdate"]:checked')?.value || "",
        disposition: document.getElementById("disposition").value || "",
        revNumber: document.getElementById("revNumber").value || "",
        newRevNumber: document.getElementById("newRevNumber").value || "",
        revDate: document.getElementById("revDate").value || "",
        E_date: document.getElementById("repDate").value || "",
        E_name: document.getElementById("repName").value || "",
        isDraft:true,
        nextEmail: document.getElementById("nextEmail").value
    };
    localStorage.setItem("reports", JSON.stringify(reports));

    alert("Draft saved successfully!");
    window.location.href = "homepage.html";
}

function loadQualitySummary(report) {
    document.getElementById("pr_id").textContent = report.productId || "";
    document.getElementById("or_id").textContent = report.orderId || "";
    document.getElementById("process").textContent = report.process || "";
    document.getElementById("supplier").textContent = report.supplier || "";
    document.getElementById("des_item").textContent = report.desItem || "";
    document.getElementById("des_defect").textContent = report.desDefect || "";
    document.getElementById("qua_received").textContent = report.quaReceived || "";
    document.getElementById("qua_defect").textContent = report.quaDefect || "";
}

document.getElementById("qualityHeader").addEventListener("click", () => {
    const content = document.getElementById("qualityContent");
    const arrow = document.querySelector("#qualityHeader .arrow");

    if (content.style.display === "block") {
        content.style.display = "none";
        arrow.classList.remove("open");
    } else {
        content.style.display = "block";
        arrow.classList.add("open");
    }
});

