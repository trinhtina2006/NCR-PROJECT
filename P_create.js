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
document.getElementById("opDate").value = dateStr;
document.getElementById("inspDate").value=dateStr;
document.getElementById("QD_Date").value=dateStr;

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

    existingNCR.PP_Decision = document.querySelector('input[name="PP_Decision"]:checked')?.value;
    existingNCR.carRaised = document.querySelector('input[name="carRaised"]:checked')?.value;
    if (existingNCR.carRaised === "Yes") {
        existingNCR.carNumber = document.getElementById("carNumber").value;
    } else {
        existingNCR.carNumber = null;}
    existingNCR.followUp = document.querySelector('input[name="followUp"]:checked')?.value;
    if (existingNCR.followUp === "Yes") {
        existingNCR.indicateType = document.getElementById("indicateType").value;
        existingNCR.expDate = document.getElementById("expDate").value;
    } else {
        existingNCR.indicateType = null;
        existingNCR.expDate = null;}
    existingNCR.operationsManager = document.getElementById("operationsManager").value;
    existingNCR.opDate = document.getElementById("opDate").value;
    existingNCR.re_Inspect = document.querySelector('input[name="re_Inspect"]:checked')?.value;
    // //Not sure whether to replace NCRId 
    if (existingNCR.re_inspect === "No") {
        existingNCR.newNcrId = document.getElementById("newNcrId")?.value;
    } else {
        existingNCR.newNcrId = null;}
    existingNCR.inspectorName = document.getElementById("inspectorName").value;
    existingNCR.inspDate = document.getElementById("inspDate").value;
    existingNCR.closed = document.querySelector('input[name="closed"]:checked')?.value;
    existingNCR.Q_Department = document.getElementById("Q_Department").value;
    existingNCR.QD_Date = document.getElementById("QD_Date").value;
    existingNCR.dept = "Purchasing";
    existingNCR.state = "PurchasingFilled";

    reports[ncrId] = existingNCR;
    localStorage.setItem("reports", JSON.stringify(reports));

    window.location.href = `details.html?id=${ncrId}`;
    })
    .catch(err => console.error("Cannot load reports.json:", err));
}

function ValidateData() {
    let valid = true;
    let messages = [];

    //remove if DOMContentLoaded event doesnt work
    document.addEventListener("DOMContentLoaded", (event) => {
    
    const PP_Decision = document.querySelector('input[name="PP_Decision"]:checked');
    if (!PP_Decision) {
        valid = false;
        messages.push("Please select an option from Purchasing Preliminary Decision");
        document.getElementsByName("PP_Decision").scrollIntoView({behavior:"smooth", block:"center"});
    }

    const carRaised = document.querySelector('input[name="carRaised"]:checked');
    if (!carRaised) {
        valid = false;
        messages.push("Please select an option from Car Raised");
        document.getElementsByName("carRaised").scrollIntoView({behavior:"smooth", block:"center"});
    }

    const followUp = document.querySelector('input[name="followUp"]:checked');
    if (!followUp) {
        valid = false;
        messages.push("Please select an option for Follow-up");
        document.getElementsByName("followUp").scrollIntoView({behavior:"smooth", block:"center"});
    }

    const re_Inspect = document.querySelector('input[name="re_Inspect"]:checked');
    if (!re_Inspect) {
        valid = false;
        messages.push("Please select an option for Re-inspected Acceptable");
        document.getElementsByName("re_Inspect").scrollIntoView({behavior:"smooth", block:"center"});
    }

    const closed = document.querySelector('input[name="closed"]:checked');
    if (!closed) {
        valid = false;
        messages.push("Please select checkbox for NCR closed");
        document.getElementsByName("closed").scrollIntoView({behavior:"smooth", block:"center"});
    }

    //decide if to include or exclude scrollIntoView in validateData() function. Unsure if scrollIntoView() works on my end
    const carNumber = document.getElementById("carNumber").value.trim();
    const indicateType = document.getElementById("indicateType").value.trim();
    const operationsManager = document.getElementById("operationsManager").value.trim();
    const inspectorName = document.getElementById("inspectorName").value.trim();
    const Q_department = document.getElementById("Q_department").value.trim();    
    const expDate = document.getElementById("expDate").value;
    const opDate = document.getElementById("opDate").value;
    const inspDate = document.getElementById("inspDate").value;
    const QD_Date = document.getElementById("QD_Date").value;    
    if (carNumber.length < 8) {
        valid = false;
        messages.push("Car Number must be at least 8 characters");
        document.getElementById("carNumber").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (indicateType.length < 3) {
        valid = false;
        messages.push("type of follow-up must be at least 3 characters");
        document.getElementById("indicateType").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (operationsManager.length < 3) {
        valid = false;
        messages.push("Operations manager's name must be at least 3 characters");
        document.getElementById("operationsManager").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (inspectorName.length < 3) {
        valid = false;
        messages.push("Inspector's name must be at least 3 characters");
        document.getElementById("inspectorName").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (Q_department.length < 3) {
        valid = false;
        messages.push("Q_department must be at least 3 characters");
        document.getElementById("Q_department").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (!expDate) {
        valid = false;
        messages.push("Please select an Expected Date");
        document.getElementById("expDate").scrollIntoView({behavior:"smooth", block:"center"});
    }

    if (!opDate) {
        valid = false;
        messages.push("Please select an Operations Date");
        document.getElementById("opDate").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (!inspDate) {
        valid = false;
        messages.push("Please select an Inspections Date");
        document.getElementById("inspDate").scrollIntoView({behavior:"smooth", block:"center"});
    }
    if (!QD_Date) {
        valid = false;
        messages.push("Please select a Qaulity Department Date");
        document.getElementById("QD_Date").scrollIntoView({behavior:"smooth", block:"center"});
    }

    if (!valid) {
        alert(messages.join("\n"));
    }
    return valid;
    })
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


const closedCheckbox = document.getElementsByName('closed');
closedCheckbox.forEach(cb => {
    cb.addEventListener("change", () => {
        const anyChecked = Array.from(closedCheckbox).some(box => box.checked);
        if (!anyChecked) {
            document.getElementById('closedError').innerText = "Please select the checkbox";
        } else {
            document.getElementById('closedError').innerText = "";
        }
    });
});

document.getElementById('Q_department').addEventListener("input", (e) => {
    if(e.target.value === "") {
            document.getElementById('Q_departmentError').innerText = "Name is required";
            document.getElementById('Q_department').style.backgroundColor = "#ffdddd";
    } else if(e.target.value.length < 3) {
            document.getElementById('Q_departmentError').innerText = "Name must be at at least 3 characters long";
            document.getElementById('Q_department').style.backgroundColor = "#ffdddd";
    } else {
            document.getElementById('Q_department').style.backgroundColor = "#ffffffff";
            document.getElementById('Q_departmentError').innerText = "";
        }
});

document.getElementById('QD_Date').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('QD_DateError');
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

//
function saveDraft() {
    let reports = JSON.parse(localStorage.getItem("reports")) || {};

    reports[ncrId] = {
        ...reports[ncrId],  
        PP_Decision: document.querySelector('input[name="PP_Decision"]:checked')?.value || "",
        carRaised: document.querySelector('input[name="carRaised"]:checked')?.value || "",
        carNumber: document.getElementById("carNumber").value || "",
        followUp: document.querySelector('input[name="followUp"]:checked')?.value || "",
        indicateType: document.getElementById("indicateType").value || "",
        expDate: document.getElementById("expDate").value || "",
        operationsManager: document.getElementById("operationsManager").value || "",
        opDate: document.getElementById("opDate").value || "",
        re_Inspect: document.querySelector('input[name="re_Inspect"]:checked')?.value || "",
        newNcrId: document.getElementById("newNcrId").value || "",
        inspectorName: document.getElementById("inspectorName").value || "",
        inspDate: document.getElementById("inspDate").value || "",
        //might change due to the input type is checkbox
        closed: document.querySelector('input[name="closed"]:checked')?.value || "",
        Q_department: document.getElementById("Q_department").value || "",
        QD_Date: document.getElementById("QD_Date").value || "",
        isDraft:true
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
    //recently added
    document.getElementById("notif_details").textContent = report.customerNotificationDetails || "";
    document.getElementById("disposition").textContent = report.disposition || "";
    document.getElementById("rev_num").textContent = report.revNumber || "";
    document.getElementById("new_rev_num").textContent = report.newRevNumber || "";
    document.getElementById("revDate").textContent = report.revDate || "";
    document.getElementById("repDate").textContent = report.E_date || "";
    document.getElementById("E_name").textContent = report.E_name || "";    
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

