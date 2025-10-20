const params = new URLSearchParams(window.location.search);
const reportId = params.get('id');

const reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};

if (reportId && reportsLocal[reportId]) {
    displayReport(reportsLocal[reportId], reportId);
} else {
    fetch('reports.json')
      .then(response => response.json())
      .then(allReports => {
          if (reportId && allReports[reportId]) {
              displayReport(allReports[reportId], reportId);
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
}

let allReports = {};

fetch('reports.json')
    .then(response => response.json())
    .then(allReportsJson => {
        allReports = { ...allReportsJson, ...reportsLocal };
        renderList(allReports);

        document.getElementById("statusFilter").addEventListener("change", () => renderList(allReports));
        document.getElementById("sortOption").addEventListener("change", () => renderList(allReports));
    })
    .catch(err => console.error("Cannot load reports.json:", err));

function renderList(reports) {
    const container = document.getElementById('listreport');
    container.innerHTML = "";

    const statusFilter = document.getElementById("statusFilter").value;
    const sortOption = document.getElementById("sortOption").value;

    let reportArray = Object.entries(reports).map(([id, report]) => ({ id, ...report }));

    if (statusFilter !== "all") {
        reportArray = reportArray.filter(r => (r.depClosed === "Yes" ? "Closed" : "Active") === statusFilter);
    }

    if (sortOption === "date") {
        reportArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "name") {
        reportArray.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (reportArray.length === 0) {
        container.innerHTML = "<p>No reports found.</p>";
        return;
    }

    for (const r of reportArray) {
        const status = r.depClosed === "Yes" ? "Closed" : "Active";
        container.innerHTML += `
        <div class="list-item">
            <span class="list-id">${r.id}</span>
            <span class="list-name">${r.name}</span>
            <span class="list-time">${new Date(r.date).toLocaleDateString()}</span>
            <span class="list-status">${status}</span>
            <span class="list-actions">
                ${status === "Closed"
                    ? `<button class="action-btn details-btn" onclick="location.href='details.html?id=${r.id}'">Details</button>
                       <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">Delete</button>`
                    : `<button class="action-btn edit-btn" onclick="location.href='edit.html?id=${r.id}'">Edit</button>
                       <button class="action-btn details-btn" onclick="location.href='details.html?id=${r.id}'">Details</button>
                       <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">Delete</button>`}
            </span>
        </div>`;
    }
}

function deleteReport(id) {
    if (confirm("Are you sure you want to delete this report?")) {
        const reportsget = JSON.parse(localStorage.getItem("reports")) || {};
        if (reportsget[id]) {
            delete reportsget[id];
            localStorage.setItem("reports", JSON.stringify(reportsget));
        }
        location.reload();
    }
}