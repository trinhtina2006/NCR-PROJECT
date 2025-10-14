window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    const access = localStorage.getItem("lastId");
    const accessKey = JSON.parse(access);
    console.log(accessKey);

    const ObjectString2 = localStorage.getItem(accessKey);
    console.log("Raw NCR string:", ObjectString2);
    if (!ObjectString2) {
        console.error("No NCR data found in localStorage");
        return;
    }

    const myObject2 = JSON.parse(ObjectString2);
    console.log("Parsed report:", myObject2);
    console.log(myObject2);

    const reportId = accessKey;
    const dateTime = myObject2.datetime;

    const reports = {
        [reportId]: {
        productId: myObject2.product,
        orderId: myObject2.order,
        process: myObject2.process,
        supplier: myObject2.supplier,
        desItem: myObject2.defectI,
        desDefect: myObject2.defect,
        quaReceived: parseInt(myObject2.Qreceive),
        quaDefect: parseInt(myObject2.Qdefect),
        nonConforming: myObject2.nonConform,
        date: myObject2.date,
        name: myObject2.name,
        depClosed: "yes"
      }
    };    

    const report = reports[reportId];
    if (!report) return;

    document.getElementById('productId').value = report.productId;
    document.getElementById('orderId').value = report.orderId;
    const checkboxes = document.querySelectorAll('input[name="process"]');
    checkboxes.forEach(cb => {
    if(cb.nextSibling.textContent.trim() === report.process) {
        cb.checked = true;
    } else {
        cb.checked = false;
    }
    });
    document.getElementById('supplier').value = report.supplier;
    document.getElementById('desItem').value = report.desItem;
    document.getElementById('desDefect').value = report.desDefect;
    document.getElementById('quaReceived').value = report.quaReceived;
    document.getElementById('quaDefect').value = report.quaDefect;
    document.querySelector(`input[name="nonConforming"][value="${report.nonConforming.toLowerCase()}"]`).checked = true;
    document.getElementById('repName').value = report.name;
    document.getElementById('repDate').value = report.date;

    document.getElementById('ncrId').innerText = reportId;
    document.getElementById('ncrDateTime').innerText = new Date().toLocaleString();

    document.querySelector(".save-btn").addEventListener("click", function () {
        const productId = document.getElementById('productId').value;
        const orderId = document.getElementById('orderId').value;
        const process = document.querySelector('input[name="process"]:checked') ? document.querySelector('input[name="process"]:checked').nextSibling.textContent.trim() : '';
        const supplier = document.getElementById('supplier').value;
        const desItem = document.getElementById('desItem').value;
        const defect = document.getElementById('desDefect').value;
        const quaReceived = document.getElementById('quaReceived').value;
        const quaDefect = document.getElementById('quaDefect').value;
        const nonConforming = document.querySelector('input[name="nonConforming"]:checked') ? document.querySelector('input[name="nonConforming"]:checked').value : '';
        const repName = document.getElementById('repName').value;
        const repDate = document.getElementById('repDate').value;
    

        const updatedObject = {NCRId: reportId, datetime: dateTime, product: productId, order: orderId, 
                    process: process, supplier: supplier, defectI: desItem, defect: defect, Qreceive: quaReceived, 
                    Qdefect: quaDefect, nonConform: nonConforming, name: repName, date: repDate};
        localStorage.setItem(reportId, JSON.stringify(updatedObject));
    });
});