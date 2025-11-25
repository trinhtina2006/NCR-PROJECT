const params = new URLSearchParams(window.location.search);
const reportId = params.get('id');

let reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};

if (reportId && reportsLocal[reportId]) {
    populateForm(reportsLocal[reportId], reportId);
} else {
    fetch('reports.json')
        .then(res => res.json())
        .then(allReports => {
            if (reportId && allReports[reportId]) {
                populateForm(allReports[reportId], reportId);
            }
        });
}


function populateForm(report, id) {
    loadQualitySummary(report);
    document.getElementById("ncrId").innerText = id;
    document.getElementById("ncrDateTime").innerText = report.date || "";

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    document.getElementById("repDate").value = dateStr;
    document.getElementById("revDate").value=dateStr;

    let cfValue = report.CF_Engineering;
    if (cfValue) {
        cfValue = cfValue.trim(); 
        const radio = Array.from(document.getElementsByName("CF_Engineering"))
                        .find(r => r.value === cfValue);
        if (radio) radio.checked = true;}

    if (report.customerNotification) {
        const radio = document.querySelector(`input[name="customerNotification"][value="${report.customerNotification}"]`);
        if (radio) radio.checked = true;

        if (report.customerNotification === "Yes") {
            document.getElementById("customerNotificationDiv").style.display="block";
            document.getElementById("customerNotificationText").value = report.customerNotificationDetails || "";
        }
    }

    if (report.drawingUpdate) {
        const r = document.querySelector(`input[name="drawingUpdate"][value="${report.drawingUpdate}"]`);
        if (r) r.checked = true;
    }
    document.getElementById("disposition").value = report.disposition || "";
    document.getElementById("revNumber").value = report.revNumber || "";
    document.getElementById("newRevNumber").value = report.newRevNumber || "";
    document.getElementById("revDate").value = report.revDate || "";

    document.getElementById("repDate").value = report.E_date || "";
    document.getElementById("repName").value = report.E_name || "";

    const customerRadios = Array.from(document.getElementsByName("customerNotification"));
    const customerDiv = document.getElementById("customerNotificationDiv");
    customerRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "Yes" && radio.checked) {
                customerDiv.style.display = "block";
            } else if (radio.value === "No" && radio.checked) {
                customerDiv.style.display = "none";
            }
        });
    });
    updateDispositionState();
}


function ValidateData() {
    let valid = true;
    let messages = [];

    const CF_Engineering = document.querySelector('input[name="CF_Engineering"]:checked');
    if (!CF_Engineering) {
        valid = false;
        messages.push("Please select an option from CF Engineering");
    }

    const disposition = document.getElementById("disposition").value.trim();
    if ((CF_Engineering?.value === "Repair" || CF_Engineering?.value === "Rework") && disposition.length < 5) {
        valid = false;
        messages.push("Disposition must be at least 5 characters");
    }

    const repName = document.getElementById("repName").value.trim();
    if (repName.length < 3) {
        valid = false;
        messages.push("Representative Name must be at least 3 characters");
    }

    const repDate = document.getElementById("repDate").value;
    if (!repDate) {
        valid = false;
        messages.push("Representative Date is required");
    }

    if (!valid) {
        alert(messages.join("\n"));
    }
    return valid;
}

function SaveWithDataValid() 
{
    let reports = JSON.parse(localStorage.getItem("reports")) || {};
    if (!ValidateData() && reports[reportId].isDraft===true) return;

    reports[reportId] = {
        ...reports[reportId],
        CF_Engineering: document.querySelector('input[name="CF_Engineering"]:checked')?.value,
        drawingUpdate: document.querySelector('input[name="drawingUpdate"]:checked')?.value,
        customerNotification: document.querySelector('input[name="customerNotification"]:checked')?.value,
        disposition: document.getElementById("disposition").value,
        revNumber: document.getElementById("revNumber").value,
        newRevNumber: document.getElementById("newRevNumber").value,
        revDate: document.getElementById("revDate").value,
        E_date: document.getElementById("repDate").value,
        E_name: document.getElementById("repName").value,
        state: "EngineerFilled",
        customerNotificationDetails: document.querySelector('input[name="customerNotification"]:checked')?.value === "Yes" 
                            ? document.getElementById("customerNotificationText").value 
                            : "",
        dept: "Engineering",
        isDraft:false
    };

    localStorage.setItem("reports", JSON.stringify(reports));
    window.location.href = `details.html?id=${reportId}`;
}

function confirmCancel() {
    if (confirm("Are you sure you want to cancel? Any changes will not be saved.")) {
        window.location.href = 'homepage.html';
    }
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

function updateDispositionState() {
    const cfValue = document.querySelector('input[name="CF_Engineering"]:checked')?.value;
    const disposition = document.getElementById('disposition');

    if (cfValue === "Repair" || cfValue === "Rework") {
        disposition.readOnly = false;
        disposition.style.backgroundColor = "#ffffff";
        disposition.style.color = "#000000";
        disposition.style.cursor = "text";
        disposition.placeholder = "Enter steps required";
    } else {
        disposition.readOnly = true;
        disposition.style.backgroundColor = "#e0e0e0";
        disposition.style.color = "#666666";
        disposition.style.cursor = "not-allowed";
        disposition.placeholder = "Not required for this option";
        disposition.value = "";
        document.getElementById('dispositionError').innerText = "";
    }
}

const CF_EngineeringRadios = document.getElementsByName('CF_Engineering');
CF_EngineeringRadios.forEach(radio => {
    radio.addEventListener("change", updateDispositionState);
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
