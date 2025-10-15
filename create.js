document.addEventListener("DOMContentLoaded", function() {
    const ncrId = `${new Date().getFullYear()} - ${Math.floor(Math.random() * 999)}`;
    document.getElementById('ncrId').innerText = ncrId;

    const ncrDateTime = new Date();
    document.getElementById('ncrDateTime').innerText = ncrDateTime.toLocaleString();


    function hasNumber(str) {
        return /\d/.test(str);
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

    document.getElementById('process').addEventListener("input", (e) => {
        if(e.target.value.length === 0) {
                document.getElementById('processError').innerText = "Process is required";
                document.getElementById('process').style.backgroundColor = "#ffdddd";
        } else {    
                document.getElementById('process').style.backgroundColor = "#ffffffff";
                document.getElementById('processError').innerText = "";
        }
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

    document.getElementById('defect').addEventListener("input", (e) => {
        if(e.target.value.length === 0) {
                document.getElementById('desDefectError').innerText = "Description of Defect is required";
                document.getElementById('defect').style.backgroundColor = "#ffdddd";
        } else {
                document.getElementById('defect').style.backgroundColor = "#ffffffff";
                document.getElementById('desDefectError').innerText = "";
            }
    });
    
    document.getElementById('quaReceived').addEventListener("input", (e) => {
        if(e.target.value.length === 0) {
                document.getElementById('quaReceivedError').innerText = "Quantity Received is required";
                document.getElementById('quaReceived').style.backgroundColor = "#ffdddd";
        } else {
                document.getElementById('quaReceived').style.backgroundColor = "#ffffffff";
                document.getElementById('quaReceivedError').innerText = "";
        }
    });
    document.getElementById('quaDefect').addEventListener("input", (e) => {
        if(e.target.value.length === 0) {
                document.getElementById('quaDefectError').innerText = "Quantity Defect is required";
                document.getElementById('quaDefect').style.backgroundColor = "#ffdddd";
        } else {
                document.getElementById('quaDefect').style.backgroundColor = "#ffffffff";
                document.getElementById('quaDefectError').innerText = "";
        }
    });

    document.getElementById('nonConforming').addEventListener("input", (e) => {
        document.getElementById('nonConforming').style.backgroundColor = "#ffffffff";
    });

    document.getElementById('repName').addEventListener("input", (e) => {
        if(e.target.value === "") {
                document.getElementById('repNameError').innerText = "Reported By name is required";
                document.getElementById('repName').style.backgroundColor = "#ffdddd";
        } else if(e.target.value.length < 3) {
                document.getElementById('repNameError').innerText = "Reported By name must be at at least 3 characters long";
                document.getElementById('repName').style.backgroundColor = "#ffdddd";
        } else {
                document.getElementById('repName').style.backgroundColor = "#ffffffff";
                document.getElementById('repNameError').innerText = "";
            }
    });
    
    document.getElementById('repDate').addEventListener("input", (e) => {
        if(e.target.value === "") {
                document.getElementById('repDateError').innerText = "Date is required";
                document.getElementById('repDate').style.backgroundColor = "#ffdddd";
        } else {
                document.getElementById('repDate').style.backgroundColor = "#ffffffff";
                document.getElementById('repDateError').innerText = "";
        }
    });

    document.querySelector(".save-btn").addEventListener("click", function () {
        const productId = document.getElementById('productId').value;
        const orderId = document.getElementById('orderId').value;
        const process = document.getElementById('process').value;
        const supplier = document.getElementById('supplier').value;
        const desItem = document.getElementById('desItem').value;
        const defect = document.getElementById('defect').value;
        const quaReceived = document.getElementById('quaReceived').value;
        const quaDefect = document.getElementById('quaDefect').value;
        const nonConforming = document.getElementById('nonConforming').value;
        const repName = document.getElementById('repName').value;
        const repDate = document.getElementById('repDate').value;

        if(productError.innerText.length !== 0){
            const element = document.getElementById('productId');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if(orderError.innerText.length !== 0){
            const element = document.getElementById('orderId');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(processError.innerText.length !== 0){
            const element = document.getElementById('process');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(supplierError.innerText.length !== 0){
            const element = document.getElementById('supplier');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(desItemError.innerText.length !== 0){
            const element = document.getElementById('desItem');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(desDefectError.innerText.length !== 0){
            const element = document.getElementById('defect');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(quaReceivedError.innerText.length !== 0){
            const element = document.getElementById('quaReceived');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(quaDefectError.innerText.length !== 0){
            const element = document.getElementById('quaDefect');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(repNameError.innerText.length !== 0){
            const element = document.getElementById('repName');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if(repDateError.innerText.length !== 0){
            const element = document.getElementById('repDate');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {

            const Object = {NCRId: ncrId, datetime: ncrDateTime, product: productId, order: orderId, 
                    process: process, supplier: supplier, defectI: desItem, defect: defect, Qreceive: quaReceived, 
                    Qdefect: quaDefect, nonConform: nonConforming, name: repName, date: repDate};

            localStorage.setItem(ncrId, JSON.stringify(Object));
            localStorage.setItem("lastId", JSON.stringify(ncrId));
            prompt('Please enter your email address:'); alert('Email has been sent to the engineer'); 
        window.location.href='details.html';

        }
    });
            

    document.querySelector(".cancel-btn").addEventListener("click", function () {
        let confirm = window.confirm('Are you sure you want to cancel?, Any changes will not be saved');
        if (confirm) {
            localStorage.removeItem(ncrId);
            location.href='homepage.html';
        } else {
            return;
        }

    });        
});