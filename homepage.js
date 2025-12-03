const params = new URLSearchParams(window.location.search);
const reportId = params.get('id');

const reportsLocal = JSON.parse(localStorage.getItem("reports")) || {};

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    alert("You must login first!");
    window.location.href = "login.html";
} else {
    console.log("Logged in as:", currentUser.role);
}

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

        document.getElementById("deptFilter").addEventListener("change", () => renderList(allReports));
        document.getElementById("statusFilter").addEventListener("change", () => renderList(allReports));
        document.getElementById("sortOption").addEventListener("change", () => renderList(allReports));
        document.getElementById("pageSize").addEventListener("change", () => {
            currentPage = 1; 
            renderList(allReports);
});
    })
    .catch(err => console.error("Cannot load reports.json:", err));

let currentPage = 1;
let reportsPerPage = 5;

function renderList(reports) {
    const pageSizeSelect = document.getElementById("pageSize");
    const container = document.getElementById('listreport');
    const paging = document.getElementById('paging')
    container.innerHTML = "";
    paging.innerHTML = "";

    const deptFilter = document.getElementById("deptFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;
    const sortOption = document.getElementById("sortOption").value;

    let reportArray = Object.entries(reports).map(([id, report]) => ({ id, ...report }));

    if (statusFilter !== "all") {
        reportArray = reportArray.filter(r => {
            if (r.depClosed === "Yes") return statusFilter === "Closed";
            if (r.depClosed === "Draft") return statusFilter === "Draft";
            return statusFilter === "Active";
        });
    }
    if (deptFilter !== "all") {
        reportArray = reportArray.filter(r => r.dept === deptFilter);
    }
    if (sortOption === "date") {
        reportArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "name") {
        reportArray.sort((a, b) => a.supplier.localeCompare(b.supplier));
    }

    reportsPerPage = pageSizeSelect.value === "all" ? reportArray.length : parseInt(pageSizeSelect.value);

    if (reportArray.length === 0) {
        container.innerHTML = "<p>No reports found.</p>";
        return;
    }

    //paging
    const totalPages = Math.ceil(reportArray.length / reportsPerPage);
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    const reportsToShow = reportArray.slice(startIndex, endIndex);

    for (const r of reportsToShow) {
        const status = r.isDraft ? "Draft" : (r.depClosed === "Yes" ? "Closed" : "Active");

        container.innerHTML += `
        <div class="list-item">
            <span class="list-id">${r.id}</span>
            <span class="list-supply">${r.supplier}</span>
            <span class="list-name">${r.dept}</span>
            <span class="list-time">${new Date(r.date).toLocaleDateString()}</span>
            <span class="list-status">${status}</span>
            <span class="list-actions">
            ${
                status === "Closed"
                    ? `
                        <button class="action-btn details-btn" onclick="location.href='details.html?id=${r.id}'">
                            <i class="bi bi-eye"></i> Details
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `
                    : status === "Draft" && r.dept=="Quality"
                    ? `
                        <button class="action-btn edit-btn" onclick="location.href='edit.html?id=${r.id}'">
                            <i class="bi bi-pencil-square"></i> Resume
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `
                    : r.state === "EngineerFilled"
                    ? `
                        <button class="action-btn edit-btn" onclick="location.href='E_Edit.html?id=${r.id}'">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button class="action-btn details-btn" onclick="location.href='details.html?id=${r.id}'">
                            <i class="bi bi-eye"></i> Details
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `
                    : r.state === "PurchasingFilled"
                    ? `
                        <button class="action-btn edit-btn" onclick="location.href='P_Edit.html?id=${r.id}'">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button class="action-btn details-btn" onclick="location.href='details.html?id=${r.id}'">
                            <i class="bi bi-eye"></i> Details
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `
                    : `
                        <button class="action-btn edit-btn" onclick="location.href='edit.html?id=${r.id}'">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button class="action-btn details-btn" onclick="location.href='details.html?id=${r.id}'">
                            <i class="bi bi-eye"></i> Details
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteReport('${r.id}')">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    `
            }
            </span>
        </div>`;
    }

    paging.innerHTML = `
        <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">Next</button>
    `;
}

function changePage(page) {
    const statusFilter = document.getElementById("statusFilter").value;
    const sortOption = document.getElementById("sortOption").value;

    const reports = allReports;
    const reportArray = Object.entries(reports).map(([id, report]) => ({ id, ...report }));

    const totalPages = Math.ceil(reportArray.length / reportsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderList(allReports);
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

/* ENGINEER LIST */
function renderEngineerList() {
    const reports = JSON.parse(localStorage.getItem("reports")) || {};
    const pendingNCRs = Object.entries(reports)
        .filter(([id, ncr]) => ncr.state === "PendingEngineer")
        .filter(([id, ncr]) => currentUser.Role === "Admin" || ncr.nextEmail === currentUser.email);
    const container = document.getElementById("engineerNCR");
    container.innerHTML = "";

    if (pendingNCRs.length === 0) {
        container.innerHTML = "<p>No pending NCRs</p>";
    } else {
        pendingNCRs.forEach(([id, ncr]) => {
            const status = ncr.isDraft ? "Draft" : (ncr.depClosed === "Yes" ? "Closed" : "Active");
            const fillLabel = ncr.isDraft ? "Resume" : "Fill In";
            const fillLink = ncr.isDraft ? `E_Edit.html?id=${id}` : `E_Create.html?id=${id}`;

            container.innerHTML += `
            <div class="list-item">
                <span class="list-id">${id}</span>
                <span class="list-supply">${ncr.supplier}</span>
                <span class="list-name">${ncr.dept}</span>
                <span class="list-time">${new Date(ncr.date).toLocaleDateString()}</span>
                <span class="list-status">${status}</span>
                <span class="list-actions">
                    <button class="action-btn fill-btn" onclick="location.href='${fillLink}'">
                        <i class="bi bi-journal-text"></i> ${fillLabel}
                    </button>
                    <button class="action-btn details-btn" onclick="location.href='details.html?id=${id}'">
                        <i class="bi bi-eye"></i> Details
                    </button>
                    <button class="action-btn close-btn" onclick="closeNCR('${id}')">
                        <i class="bi bi-x-lg"></i> Close
                    </button>
                </span>
            </div>
            `;
        });
    }
}

function closeNCR(id) {
    if (!confirm("Are you sure you want to close this NCR?")) return;

    const reports = JSON.parse(localStorage.getItem("reports")) || {};
    if (reports[id]) {
        reports[id].status = "Closed";
        reports[id].state = "";
        reports[id].depClosed = "Yes"; 
        localStorage.setItem("reports", JSON.stringify(reports));
        alert("NCR closed successfully!");

        if (allReports[id]) {
            allReports[id].status = "Closed";
            allReports[id].depClosed = "Yes";
        }

        renderEngineerList(); 
        renderPurchasingList();
        renderList(allReports);
    }
}


/* PURCHASING LIST */
function renderPurchasingList() {
    const reports = JSON.parse(localStorage.getItem("reports")) || {};
    const pendingNCRs = Object.entries(reports)
        .filter(([id, ncr]) => ncr.state === "EngineerFilled")
        .filter(([id, ncr]) => currentUser.Role === "Admin" || ncr.nextEmail === currentUser.email);
    const container = document.getElementById("purchasingNCR");
    container.innerHTML = "";

    if (pendingNCRs.length === 0) {
        container.innerHTML = "<p>No pending NCRs</p>";
        return;
    }

    pendingNCRs.forEach(([id, ncr]) => {
        const status = ncr.isDraft ? "Draft" : (ncr.depClosed === "Yes" ? "Closed" : "Active");
        const fillLink = `P_Create.html?id=${id}`;
        const fillLabel = "Fill in";

        container.innerHTML += `
        <div class="list-item">
            <span class="list-id">${id}</span>
            <span class="list-supply">${ncr.supplier}</span>
            <span class="list-name">${ncr.dept}</span>
            <span class="list-time">${new Date(ncr.date).toLocaleDateString()}</span>
            <span class="list-status">${status}</span>
            <span class="list-actions">
                <button class="action-btn fill-btn" onclick="location.href='${fillLink}'">
                    <i class="bi bi-journal-text"></i> ${fillLabel}
                </button>
                <button class="action-btn details-btn" onclick="location.href='details.html?id=${id}'">
                    <i class="bi bi-eye"></i> Details
                </button>
                <button class="action-btn close-btn" onclick="closeNCR('${id}')">
                    <i class="bi bi-x-lg"></i> Close
                </button>
            </span>
        </div>
        `;
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }
});


const engineerSection = document.getElementById("engineerSection");
if (currentUser && (currentUser.Role === "Admin" || currentUser.Role === "Engineer")) {
    engineerSection.style.display = "block";
    renderEngineerList();
} else {
    engineerSection.style.display = "none";
}

const purchasingSection = document.getElementById("purchasingSection");
if (currentUser && (currentUser.Role === "Admin" || currentUser.Role === "Purchasing")) {
    purchasingSection.style.display = "block";
    renderPurchasingList();
} else {
    purchasingSection.style.display = "none";
}


