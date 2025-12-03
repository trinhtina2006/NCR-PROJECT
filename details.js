const params = new URLSearchParams(window.location.search);
const reportId = params.get('id');

const reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};
const allReports = { ...reportsLocal };


if (reportId && allReports[reportId]) {
    displayAllSections(allReports[reportId], reportId);
} else {
    fetch('reports.json')
      .then(response => response.json())
      .then(allReports => {
                const combined = { ...allReports, ...reportsLocal};
            if (reportId && combined[reportId]) {
                displayAllSections(combined[reportId], reportId);
          }
      })
      .catch(err => console.error("Cannot load reports.json:", err));
}

// --- GENERAL SECTION ---
function displayGeneral(report, id) {
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
}

// --- PURCHASING SECTION ---
function displayPurchasing(report) {
    const purchasingSection = document.getElementById("purchasingInfo");

    if (report.PP_Decision || report.carRaised || report.followUp || report.operationsManager) {
        const carNumberText = report.carRaised === "Yes" ? (report.carNumber || "") : "No";
        const followUpText = report.followUp === "Yes" ? (report.indicateType || "") : "No";

        purchasingSection.innerHTML = `
            <h2>Section 4: Purchasing Details</h2>
            <div class="card">
                <h3>Preliminary Decision</h3>
                <div class="two-cols">
                    <p>Decision:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.PP_Decision || "N/A"}</span></p>
                    <p>CAR Raised (Number):&nbsp;&nbsp;&nbsp;&nbsp;<span>${carNumberText}</span></p>
                </div>
                <div class="three-colls">
                    <p>Follow-up Required:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.followUp || "N/A"}</span></p>
                    <p>Follow-up Type:&nbsp;&nbsp;&nbsp;&nbsp;<span>${followUpText}</span></p>
                    <p>Expected Date:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.expDate}</span></p>
                </div>
            </div>
            <div class="card">
                <h3>Representative</h3>
                <div class="two-cols">
                    <p>Operations Manager:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.operationsManager || "N/A"}</span></p>
                    <p>Date:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.opDate || "N/A"}</span></p>
                </div>
            </div>
            <div class="card">
                <h3>Inspection</h3>
                <div class="two-cols">
                    <p>Re-inspected Acceptable:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.re_Inspect || "N/A"}</span></p>
                    <p>New NCR Number (if applicable):&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.newNcrId || "N/A"}</span></p>
                </div>
                <div class="two-cols">
                    <p>Inspector Name:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.inspectorName || "N/A"}</span></p>
                    <p>Date:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.inspDate || "N/A"}</span></p>
                </div>
            </div>
        `;
        purchasingSection.style.display = "block";
    } else {
        purchasingSection.style.display = "none";
    }
}

// --- ENGINEERING SECTION ---
function displayEngineering(report) {
    const engineerSection = document.getElementById("engineeringInfo");

    if (report.CF_Engineering || report.disposition || report.E_name) {
        const customerNotifText = report.customerNotification === "Yes" 
            ? (report.customerNotificationDetails || "") 
            : "No";

        engineerSection.innerHTML = `
            <h2>Section 3: Engineering Details</h2>
            <div class="card">
                <h3>Review</h3>
                <p>CF Engineering:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.CF_Engineering || "N/A"}</span></p>
                <p>Customer Notification:&nbsp;&nbsp;&nbsp;&nbsp;<span>${customerNotifText || "N/A"}</span></p>
            </div>
            <div class="card-big">
                <h3>Revision</h3>
                <div class="two-cols">
                    <p>Disposition:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.disposition || "N/A"}</span></p>
                    <p>Drawing Update:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.drawingUpdate || "N/A"}</span></p>
                </div>
                <div class="two-cols">
                    <p>Revision Number:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.revNumber || "N/A"}</span></p>
                    <p>New Revision Number:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.newRevNumber || "N/A"}</span></p>
                </div>
                <p>Revision Date:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.revDate || "N/A"}</span></p>
            </div>
            <div class="card">
                <h3>Representative</h3>
                <div class="two-cols">
                    <p>Engineer Name:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.E_name || "N/A"}</span></p>
                    <p>Engineer Date:&nbsp;&nbsp;&nbsp;&nbsp;<span>${report.E_date || "N/A"}</span></p>
                </div>
            </div>
        `;
        engineerSection.style.display = "block";
    } else {
        engineerSection.style.display = "none";
    }
}

// --- MAIN FUNCTION ---
function displayAllSections(report, id) {
    displayGeneral(report, id);
    displayEngineering(report);
    displayPurchasing(report);
}




window.addEventListener('load', () => {
    window.onbeforeprint = () => 
        { document.querySelector('.form-btn').style.display = 'none'; }; 
    window.onafterprint = () => 
        { document.querySelector('.form-btn').style.display = 'flex'; };
});
