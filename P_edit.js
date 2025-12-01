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
    
    document.querySelector(`input[name="PP_Decision"][value="${report.PP_Decision}"]`).checked = true;
    document.querySelector(`input[name="carRaised"][value="${report.carRaised}"]`)?.checked = true;
    document.querySelector(`input[name="followUp"][value="${report.followUp}"]`)?.checked = true;
    document.querySelector(`input[name="re_Inspect"][value="${report.re_Inspect}"]`)?.checked = true;
    document.querySelector(`input[name="closed"][value="${report.closed}"]`)?.checked = true;


    document.getElementById("carNumber").value = report.carNumber;
    document.getElementById("indicateType").value = report.indicateType;
    document.getElementById("expDate").value = report.expDate;
    document.getElementById("operationsManager").value = report.operationsManager;
    document.getElementById("opDate").value = report.opDate;
    document.getElementById('newNcrId')?.value = report.newNcrId;
    document.getElementById('inspectorName').value = report.inspectorName;
    document.getElementById('inspDate').value = report.inspDate;
    document.getElementById('Q_department').value = report.Q_department;
    document.getElementById('QD_Date').value = report.QD_Date;    
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

document.querySelector("form").addEventListener("submit", function(event){
    event.preventDefault(); 
    if(!ValidateData()) return;
    const PP_Decision = document.querySelector(`input[name="PP_Decision"]:checked`)?.value;
    const carRaised = document.querySelector(`input[name="carRaised"]:checked`)?.value;
    const followUp = document.querySelector(`input[name="followUp"]:checked`)?.value;
    const re_Inspect = document.querySelector(`input[name="re_Inspect"]:checked`)?.value;
    const closed = document.querySelector(`input[name="closed"]:checked`)?.value;
    
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('id');

    let reports = JSON.parse(localStorage.getItem("reports")) || {};

    reports[reportId] = {
        PP_Decision: PP_Decision,
        carRaised: carRaised,
        followUp: followUp,
        re_Inspect: re_Inspect,
        closed: closed,
        newNcrId: document.getElementById("newNcrId")?.value,
        closed: document.querySelector('input[name="closed"]:checked')?.value,
        //change if included in html (just copied from E_edit.js, adjust if needed)
        inspectorName: document.getElementById("inspectorName").value,
        inspDate: document.getElementById("inspDate").value,
        Q_Department: document.getElementById("Q_Department").value,
        QD_Date: document.getElementById("QD_Date").value,
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

function hasNumber(str) {
        return /\d/.test(str);
    }

const PP_DecisionRadios = document.getElementsByName('PP_Decision');
const PP_DecisionError = document.getElementById('PP_DecisionError');

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
const carRaisedError = document.getElementById('carRaisedError');

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
const followUpError = document.getElementById('followUpError');
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
const re_InspectError = document.getElementById('re_InspectError');
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