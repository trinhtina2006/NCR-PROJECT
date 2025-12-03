document.addEventListener('DOMContentLoaded', () => {
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
    setupRadioListeners();
});

function setupRadioListeners() {
    const carRadios = document.getElementsByName('carRaised');
    const carNumberContainer = document.getElementById('carNumberContainer');
    carRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const checked = Array.from(carRadios).find(r => r.checked)?.value;
            carNumberContainer.style.display = (checked === 'Yes') ? 'block' : 'none';
        });
    });

    const followUpRadios = document.getElementsByName('followUp');
    const indicateContainer = document.getElementById('indicateTypeContainer');
    followUpRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const checked = Array.from(followUpRadios).find(r => r.checked)?.value;
            indicateContainer.style.display = (checked === 'Yes') ? 'block' : 'none';
        });
    });

    const reInspectRadios = document.getElementsByName('re_Inspect');
    const newNcrContainer = document.getElementById('newNcrIdContainer');
    reInspectRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const checked = Array.from(reInspectRadios).find(r => r.checked)?.value;
            newNcrContainer.style.display = (checked === 'No') ? 'block' : 'none';
        });
    });
}


function populateForm(report, id) {
    document.getElementById("ncrId").innerText = id || "New";
    document.getElementById("ncrDateTime").innerText = report.date || new Date().toLocaleString();
    
    if(report.PP_Decision) checkRadio("PP_Decision", report.PP_Decision);
    if(report.carRaised) checkRadio("carRaised", report.carRaised);
    if(report.followUp) checkRadio("followUp", report.followUp);
    if(report.re_Inspect) checkRadio("re_Inspect", report.re_Inspect);

    document.getElementById("carNumber").value = report.carNumber || "";
    document.getElementById("indicateType").value = report.indicateType || "";
    document.getElementById("expDate").value = report.expDate || "";
    document.getElementById("operationsManager").value = report.operationsManager || "";
    document.getElementById('newNcrId').value = report.newNcrId || "";
    document.getElementById('inspectorName').value = report.inspectorName || "";
    document.getElementById('inspDate').value = report.inspDate || "";
    document.getElementById("opDate").value = report.opDate || "";

        if(report.carRaised === "Yes") document.getElementById('carNumberContainer').style.display = 'block';
    if(report.followUp === "Yes") document.getElementById('indicateTypeContainer').style.display = 'block';
    if(report.re_Inspect === "No") document.getElementById('newNcrIdContainer').style.display = 'block';
}

function confirmCancel() {
    if (confirm("Are you sure you want to cancel? Any changes will not be saved.")) {
        location.href = 'homepage.html';
    }
}

function checkRadio(name, reportValue) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(radio => {
        if (radio.value === reportValue) {
            radio.checked = true;
        }
    });
}
function openPopup() {
    document.getElementById("emailPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("emailPopup").style.display = "none";
}

function sendEmail() {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('id');

    let reports = JSON.parse(localStorage.getItem("reports")) || {};
    const email = document.getElementById("nextEmail").value.trim();

    if (!email) {
        alert("Please enter an email!");
        return;
    }

    if (reports[reportId]) {
        reports[reportId].nextEmail = email;
        localStorage.setItem("reports", JSON.stringify(reports));
    }

    alert("Email has been sent to: " + email);
    closePopup();

    window.location.href = `details.html?id=${reportId}`;
}
function saveFormData() {
    if(!ValidateData()) return;

    const ncrId = new URLSearchParams(window.location.search).get('id');
    let reports = JSON.parse(localStorage.getItem("reports")) || {};
    const existingNCR = reports[ncrId] || {};

    existingNCR.PP_Decision = document.querySelector('input[name="PP_Decision"]:checked')?.value || null;
    existingNCR.carRaised = document.querySelector('input[name="carRaised"]:checked')?.value || null;
    existingNCR.carNumber = existingNCR.carRaised === "Yes" ? document.getElementById("carNumber").value : null;

    existingNCR.followUp = document.querySelector('input[name="followUp"]:checked')?.value || null;
    existingNCR.indicateType = existingNCR.followUp === "Yes" ? document.getElementById("indicateType").value : null;
    existingNCR.expDate = existingNCR.followUp === "Yes" ? document.getElementById("expDate").value : null;

    existingNCR.operationsManager = document.getElementById("operationsManager").value || null;
    existingNCR.opDate = document.getElementById("opDate").value || null;

    existingNCR.re_Inspect = document.querySelector('input[name="re_Inspect"]:checked')?.value || null;
    existingNCR.newNcrId = existingNCR.re_Inspect === "No" ? document.getElementById("newNcrId")?.value : null;

    existingNCR.inspectorName = document.getElementById("inspectorName").value || null;
    existingNCR.inspDate = document.getElementById("inspDate").value || null;

    existingNCR.dept = "Purchasing";
    existingNCR.state = "PurchasingFilled"; 
    existingNCR.depClosed = existingNCR.depClosed || "No";

    reports[ncrId] = existingNCR;
    localStorage.setItem("reports", JSON.stringify(reports));

    openPopup();
}

function SaveWithDataValid() {
    if(!ValidateData()) return;
    saveFormData();
}

function ValidateData() {
    let valid = true;
    let messages = [];

    const scrollFocus = (selector) => {
        const a = document.querySelector(selector);
        if (a) {
            a.scrollIntoView({ behavior: "smooth", block: "center" });
            a.focus();
        }
    };

    const PP_Decision = document.querySelector('input[name="PP_Decision"]:checked');
    if (!PP_Decision) {
        valid = false;
        messages.push("Please select an option from Purchasing Preliminary Decision");
        scrollFocus('input[name="PP_Decision"]');
    }

    const carRaised = document.querySelector('input[name="carRaised"]:checked');
    if (!carRaised) {
        valid = false;
        messages.push("Please select an option from Car Raised");
        scrollFocus('input[name="carRaised"]');
    }

    const followUp = document.querySelector('input[name="followUp"]:checked');
    if (!followUp) {
        valid = false;
        messages.push("Please select an option for Follow-up");
        scrollFocus('input[name="followUp"]');
    }

    const re_Inspect = document.querySelector('input[name="re_Inspect"]:checked');
    if (!re_Inspect) {
        valid = false;
        messages.push("Please select an option for Re-inspected Acceptable");
        scrollFocus('input[name="re_Inspect"]');
    }

    const carNumber = document.getElementById("carNumber")?.value.trim() || "";
    const indicateType = document.getElementById("indicateType")?.value.trim() || "";
    const operationsManager = document.getElementById("operationsManager")?.value.trim() || "";
    const inspectorName = document.getElementById("inspectorName")?.value.trim() || "";
    const expDate = document.getElementById("expDate")?.value || "";
    const opDate = document.getElementById("opDate")?.value || "";

    if (carRaised?.value === "Yes" && carNumber.length < 8) {
        valid = false;
        messages.push("Car Number must be at least 8 characters");
        scrollFocus("#carNumber");
    }

    if (followUp?.value === "Yes" && indicateType.length < 3) {
        valid = false;
        messages.push("Type of follow-up must be at least 3 characters");
        scrollFocus("#indicateType");
    }

    if (operationsManager.length < 3) {
        valid = false;
        messages.push("Operations manager's name must be at least 3 characters");
        scrollFocus("#operationsManager");
    }

    if (inspectorName.length < 3) {
        valid = false;
        messages.push("Inspector's name must be at least 3 characters");
        scrollFocus("#inspectorName");
    }

    if (followUp?.value === "Yes" && !expDate) {
        valid = false;
        messages.push("Please select an Expected Date");
        scrollFocus("#expDate");
    }

    if (!opDate) {
        valid = false;
        messages.push("Please select an Operations Date");
        scrollFocus("#opDate");
    }

    if (!valid) {
        alert(messages.join("\n"));
    }

    return valid;
}


const PP_DecisionRadios = document.getElementsByName('PP_Decision');
PP_DecisionRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(PP_DecisionRadios).some(r => r.checked);

        if (!checked) {
            PP_DecisionError.innerText = "Please select an option";
        } 
        else {            
            document.getElementsByName('PP_Decision').style.backgroundColor = "#ffdddd";
            document.getElementById('PP_DecisionError').innerText = "";
        }
    });    
});

const carRaisedRadios = document.getElementsByName('carRaised');
carRaisedRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(carRaisedRadios).some(r => r.checked);

        if (!checked) {
            carRaisedError.innerText = "Please select an option";
        } 
        else {            
            document.getElementsByName('carRaised').style.backgroundColor = "#ffdddd";
            document.getElementById('carRaisedError').innerText = "";
        }
    });    
});

document.getElementById('carNumber').addEventListener("input", (e) => {
    if(e.target.value.length === 0 && document.querySelector('input[name="carRaised"]:checked')?.value === "Yes") {
            document.getElementById('carNumberError').innerText = "Car Number is required";
            document.getElementById('carNumber').style.backgroundColor = "#ffdddd";
    }
    else if(e.target.value.length < 8) {
            document.getElementById('carNumberError').innerText = "Car Number must be at at least 8 characters long";
            document.getElementById('carNumber').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('carNumber').style.backgroundColor = "#ffffffff";
            document.getElementById('carNumberError').innerText = "";
        }
});

const followUpRadios = document.getElementsByName('followUp');
followUpRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(followUpRadios).some(r => r.checked);

        if (!checked) {
            followUpError.innerText = "Please select an option";
        } 
        else {            
            document.getElementsByName('followUp').style.backgroundColor = "#ffdddd";
            document.getElementById('followUpError').innerText = "";
        }
    });    
});

document.getElementById('indicateType').addEventListener("input", (e) => {
    if(e.target.value.length === 0 && document.querySelector('input[name="carRaised"]:checked')?.value === "Yes") {
            document.getElementById('indicateTypeError').innerText = "Follow-up type is required";
            document.getElementById('indicateType').style.backgroundColor = "#ffdddd";
    }
    else if(e.target.value.length < 3) {
            document.getElementById('indicateTypeError').innerText = "Follow-up type must be at at least 3 characters long";
            document.getElementById('indicateType').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('indicateType').style.backgroundColor = "#ffffffff";
            document.getElementById('indicateTypeError').innerText = "";
        }
});

document.getElementById('expDate').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('expDateError');
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (!input.value) {
        error.innerText = "Date is required";
        input.style.backgroundColor = "#ffdddd";
    } else if (selectedDate < today) {
        error.innerText = "Date cannot be in the past";
        input.style.backgroundColor = "#ffdddd";
    } else {
        error.innerText = "";
        input.style.backgroundColor = "#ffffffff";
    }
});

document.getElementById('operationsManager').addEventListener("input", (e) => {
    if(e.target.value === "") {
            document.getElementById('operationsManagerError').innerText = "Name is required";
            document.getElementById('operationsManager').style.backgroundColor = "#ffdddd";
    } else if(e.target.value.length < 3) {
            document.getElementById('operationsManagerError').innerText = "Name must be at at least 3 characters long";
            document.getElementById('operationsManager').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('operationsManager').style.backgroundColor = "#ffffffff";
            document.getElementById('operationsManagerError').innerText = "";
        }
});

document.getElementById('opDate').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('opDateError');
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


const re_InspectRadios = document.getElementsByName('re_Inspect');
re_InspectRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(re_InspectRadios).some(r => r.checked);

        if (!checked) {
            re_InspectError.innerText = "Please select an option";
        } 
        else {            
            document.getElementsByName('re_Inspect').style.backgroundColor = "#ffdddd";
            document.getElementById('re_InspectError').innerText = "";
        }
    });    
});

document.getElementById('inspectorName').addEventListener("input", (e) => {
    if(e.target.value === "") {
            document.getElementById('inspectorNameError').innerText = "Name is required";
            document.getElementById('inspectorName').style.backgroundColor = "#ffdddd";
    } else if(e.target.value.length < 3) {
            document.getElementById('inspectorNameError').innerText = "Name must be at at least 3 characters long";
            document.getElementById('inspectorName').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('inspectorName').style.backgroundColor = "#ffffffff";
            document.getElementById('inspectorNameError').innerText = "";
        }
});

document.getElementById('inspDate').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('inspDateError');
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