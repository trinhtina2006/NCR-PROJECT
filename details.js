document.addEventListener("DOMContentLoaded", function() {
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

  const ncrId = accessKey;

  const reports = {
      [ncrId]: {
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
    
    const params = new URLSearchParams(window.location.search);
    const reportId = ncrId;
    
    if (reportId && reports[reportId]) {
      const report = reports[reportId];
    
      document.getElementById('productId').innerText = report.productId;
      console.log("Product ID:", report.productId);
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
    
      document.getElementById('ncrId').innerText = reportId;
    } 

});
