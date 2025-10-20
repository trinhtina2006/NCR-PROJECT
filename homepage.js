const reports = {
    "2023-213": {
      productId: "PR10015923",
      orderId: "OR13445283",
      process: "Supplier or Rec-Insp",
      supplier: "The Coop Supply",
      desItem: "Motherboard",
      desDefect: "Damage on surface",
      quaReceived: 100,
      quaDefect: 5,
      nonConforming: "Yes",
      date: "2023-01-03",
      name: "Dwayne Alcala",
      depClosed: "Yes",
    },
    "2025-375": {
      productId: "PR29418492",
      orderId: "OR20493002",
      process: "WIP (Production Order)",
      supplier: "HardwareSup",
      desItem: "PowerSupplier",
      desDefect: "Didnt work properly",
      quaReceived: 150,
      quaDefect: 4,
      nonConforming: "No",
      date: "2025-02-12",
      name: "Amgalan Bilguunbold",
      depClosed: "No",
    },
    "2024-738": {
        productId: "PR93291820",
        orderId: "OR20120493",
        process: "WIP (Production Order)",
        supplier: "Tech",
        desItem: "RAM 32GB",
        desDefect: "Inactive function",
        quaReceived: 50,
        quaDefect: 7,
        nonConforming: "Yes",
        date: "2024-06-28",
        name: "Lam Phat Tran",
        depClosed: "No",
    },
    "2025-821": {
        productId: "PR10420137",
        orderId: "OR44929211",
        process: "WIP (Production Order)",
        supplier: "Component Supplies",
        desItem: "CPU",
        desDefect: "loose screws",
        quaReceived: 130,
        quaDefect: 3,
        nonConforming: "Yes",
        date: "2025-08-30",
        name: "Huyen Trinh Tran",
        depClosed: "No",
    },
    "2022-883": {
        productId: "PR03291058",
        orderId: "OR23049204",
        process: "Supplier or Rec-Insp",
        supplier: "SmartHardware",
        desItem: "Canon Printer",
        desDefect: "paper jams",
        quaReceived: 200,
        quaDefect: 30,
        nonConforming: "No",
        date: "2022-01-13",
        name: "Dave Kendall",
        depClosed: "Yes",
    },
    "2024-834": {
        productId: "PR020492014",
        orderId: "OR22940184",
        process: "WIP (Production Order) ",
        supplier: "GraphicsBuy",
        desItem: "Epson Scanners",
        desDefect: "connection issues, fail for data transfer",
        quaReceived: 700,
        quaDefect: 2,
        nonConforming: "No",
        date: "2024-06-14",
        name: "John Brown",
        depClosed: "Yes",
    },
    "2025-239": {
        productId: "PR040203492",
        orderId: "OR29139403",
        process: "Supplier or Rec-Insp",
        supplier: "Coder",
        desItem: "AMD Graphics Card",
        desDefect: "overheating, outdated drivers",
        quaReceived: 100,
        quaDefect: 10,
        nonConforming: "Yes",
        date: "2025-04-04",
        name: "Kyle Son",
        depClosed: "No",
    },     
    "2024-119": {
        productId: "PR010220493",
        orderId: "OR00482894",
        process: "Supplier or Rec-Insp",
        supplier: "Best Tech Ever",
        desItem: "Portable SSD 1TB",
        desDefect: "back blocks, problematic updates and read/write",
        quaReceived: 150,
        quaDefect: 15,
        nonConforming: "Yes",
        date: "2024-03-30",
        name: "Taylor Williams",
        depClosed: "No",
    },
    "2025-442": {
        productId: "PR02884373",
        orderId: "OR29213477",
        process: "WIP (Production Order)",
        supplier: "EcoSup",
        desItem: "Logitech Silent Mouse",
        desDefect: "keep jumping randomly, difficult for scrolling",
        quaReceived: 200,
        quaDefect: 5,
        nonConforming: "Yes",
        date: "2025-08-22",
        name: "Joe Kenedy",
        depClosed: "No",
    }, 
    "2025-100": {
        productId: "PR39902340",
        orderId: "OR04259587",
        process: "WIP (Production Order)",
        supplier: "Hightech Supply",
        desItem: "Sandisk USB",
        desDefect: "USB is not recognized, failure in request",
        quaReceived: 350,
        quaDefect: 28,
        nonConforming: "No",
        date: "2025-07-15",
        name: "Anna Louis",
        depClosed: "Yes",
    },
    "2024-244": {
        productId: "PR49103947",
        orderId: "OR29494837",
        process: "Supplier or Rec-Insp",
        supplier: "Hardware Intel",
        desItem: "4K HDMI Cable",
        desDefect: "can not be connected, shows no signal message, loose cables",
        quaReceived: 250,
        quaDefect: 30,
        nonConforming: "Yes",
        date: "2025-05-12",
        name: "Isaac Anderson",
        depClosed: "No",
    },
  };    
  
    const params = new URLSearchParams(window.location.search);
  const reportId = params.get('id');
  
  if (reportId && reports[reportId]) {
    const report = reports[reportId];
  
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
  
    const now = new Date();
    document.getElementById('ncrId').innerText = reportId;
  } 

const container = document.getElementById('listContainer');

for (const id in reports) {
    const report = reports[id];

    container.innerHTML += `
    <div class="list-item">
        <span class="list-id">${id}</span>
        <span class="list-name">${report.name}</span>
        <span class="list-time">${report.date}</span>
        <span class="list-status">${report.depClosed === "Yes" ? "Closed" : "Active"}</span>
        <span class="list-actions">
            ${report.depClosed == "Yes" 
                ? `<button class="action-btn details-btn" onclick="location.href='details.html?id=${id}'">Details</button>` 
                : `<button class="action-btn edit-btn" onclick="location.href='edit.html?id=${id}'">Edit</button>
                   <button class="action-btn details-btn" onclick="location.href='details.html?id=${id}'">Details</button>`
            }
        </span>
    </div>`;
}
