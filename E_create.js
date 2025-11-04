const date= new Date();
const year = new Date().getFullYear(); 
reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};
const ncrId = reportsLocal.id;

document.getElementById('ncrId').innerText = ncrId;
document.getElementById('ncrDateTime').innerText = date.toLocaleString();

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
        const CF_Engineering = document.querySelector('input[name="CF_Engineering"]:checked')?.value;
        const customerNotification = document.querySelector('input[name="customerNotification"]:checked')?.value;
        const drawingUpdate = document.querySelector('input[name="drawingUpdate"]:checked')?.value;


        const ncr = {
            CF_Engineering: CF_Engineering,
            customerNotification: customerNotification,
            drawingUpdate: drawingUpdate,
            disposition: document.getElementById("disposition").value,
            revNumber: document.getElementById("revNumber")?.value,
            newRevNumber: document.getElementById("newRevNumber").value,
            revDate: document.getElementById("revDate").value,
            //change if included in html
            engineerName: document.getElementById("engineerName").value,
            date: document.getElementById("repDate").value,
            name: document.getElementById("repName").value     
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

    const CF_Engineering = document.querySelector('input[name="CF_Engineering"]:checked');
    if (!CF_Engineering) {
        valid = false;
        messages.push("Please select an option from CF Engineering");
        CF_Engineering.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }

    //change condition and min and max length to test
    const disposition = document.getElementById("disposition").value.trim();
    if (disposition.length < 5 && document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Repair" ||
    document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Rework") {
        valid = false;
        messages.push("Disposition must be at least 5 characters");
        disposition.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const repName = document.getElementById("repName").value.trim();
    const repDate = document.getElementById("repDate").value;
    if (repName.length < 3) {
        valid = false;
        messages.push("Representative Name must be at least 3 characters");
        repName.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!repDate) {
        valid = false;
        messages.push("Please select a Representative Date");
        repDate.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

function hasNumber(str) {
        return /\d/.test(str);
    }

const CF_EngineeringRadios = document.getElementsByName('CF_Engineering');
const CF_EngineeringError = document.getElementById('CF_EngineeringError');

CF_EngineeringRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const checked = Array.from(CF_EngineeringRadios).some(r => r.checked);
        if (!checked) {
            CF_EngineeringError.innerText = "Please select an option";
        } else if(document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Repair" ||
    document.querySelector('input[name="CF_Engineering"]:checked')?.value === "Rework") {
            document.getElementById('disposition').readOnly = false;
        }else {
            CF_EngineeringError.innerText = "";
            document.getElementById('disposition').readOnly = true;
            document.getElementById('disposition').style.backgroundColor = "#ffffffff";
            document.getElementById('dispositionError').innerText = "";
        }
    });    
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
//edit rev number conditions
document.getElementById('revNumber').addEventListener("input", (event) => {
    if(event.target.value.includes(" ")) {
        document.getElementById('revNumberError').innerText = "Revision Number must remove any spaces";
        document.getElementById('revNumber').style.backgroundColor = "#ffdddd";
    }  else if(Number.isInteger(parseInt(event.target.value))) {
        document.getElementById('revNumberError').innerText = "Revision Number must include numbers";
        document.getElementById('revNumber').style.backgroundColor = "#ffdddd";
    } else {
        document.getElementById('revNumber').style.backgroundColor = "#ffffffff";
        document.getElementById('revNumberError').innerText = "";
    }

});

//edit new rev number conditions
document.getElementById('newRevNumber').addEventListener("input", (event) => {
    if(event.target.value.includes(" ")) {
        document.getElementById('newRevNumberError').innerText = "Revision Number must remove any spaces";
        document.getElementById('newRevNumber').style.backgroundColor = "#ffdddd";
    }  else if(Number.isInteger(event.target.value)) {
        document.getElementById('newRevNumberError').innerText = "Revision Number must include numbers";
        document.getElementById('newRevNumber').style.backgroundColor = "#ffdddd";
    } else {
        document.getElementById('newRevNumber').style.backgroundColor = "#ffffffff";
        document.getElementById('newRevNumberError').innerText = "";
    }

});

document.getElementById('revDate').addEventListener("input", (e) => {
    const input = e.target;
    const error = document.getElementById('revDateError');
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    if (selectedDate > today) {
        error.innerText = "Date cannot be in the future";
        input.style.backgroundColor = "#ffdddd";
    } else {
        error.innerText = "";
        input.style.backgroundColor = "#ffffffff";
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


});
