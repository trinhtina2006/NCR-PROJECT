const params = new URLSearchParams(window.location.search);
const reportId = params.get('id');

const reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};
const allReports = { ...reportsLocal };


if (reportId && allReports[reportId]) {
    displayReport(allReports[reportId], reportId);
} else {
    fetch('reports.json')
      .then(response => response.json())
      .then(allReports => {
                const combined = { ...allReports, ...reportsLocal};
            if (reportId && combined[reportId]) {
                displayReport(combined[reportId], reportId);
          }
      })
      .catch(err => console.error("Cannot load reports.json:", err));
}

function displayReport(report, id) {
    document.getElementById('productId').innerText = report.productId;
    document.getElementById('orderId').innerText = report.orderId;
    document.getElementById('process').innerText = report.process;
    document.getElementById('supplier').innerText = report.supplier;
    document.getElementById('desItem').innerText = report.desItem;
    document.getElementById('desDefect').innerText = report.desDefect;
    document.getElementById('quaReceived').innerText = report.quaReceived;
    document.getElementById('quaDefect').innerText = report.quaDefect;
    document.getElementById('nonConforming').innerText = report.nonConforming;
    document.getElementById('ncrDate').innerText = report.date;
    document.getElementById('name').innerText = report.name;
    document.getElementById('ncrId').innerText = id;

    const engineerSection = document.getElementById("engineeringInfo");
    if (report.status === "EngineerFilled") {
        engineerSection.innerHTML = `
            <h2>Section 3: Engineering Details</h2>
            <div class="card">
                <h3>Review</h3>
                <p>CF Engineering:<span>${report.CF_Engineering || "N/A"}</span></p>
                <p>Customer Notification:<span>${report.customerNotification || "N/A"}</span></p>
            </div>
            <div class="card-big">
                <h3>Revision</h3>
                <p>Disposition:<span>${report.disposition || "N/A"}</span></p>
                <p>Drawing Update:<span>${report.drawingUpdate || "N/A"}</span></p>
                <p>Revision Number:<span>${report.revNumber || "N/A"}</span></p>
                <p>New Revision Number:<span>${report.newRevNumber || "N/A"}</span></p>
                <p>Revision Date:<span>${report.revDate || "N/A"}</span></p>
            </div>
            <div class="card">
                <h3>Representative</h3>
                <p>Engineer Name:<span>${report.E_name || "N/A"}</span></p>
                <p>Engineer Date:<span>${report.E_date || "N/A"}</span></p>
            </div>


        `;
        engineerSection.style.display = "block";
    } else {
        engineerSection.style.display = "none";
    }
}


window.addEventListener('load', () => {
    window.onbeforeprint = () => 
        { document.querySelector('.form-btn').style.display = 'none'; }; 
    window.onafterprint = () => 
        { document.querySelector('.form-btn').style.display = 'flex'; };
});
