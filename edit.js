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

