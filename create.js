document.addEventListener("DOMContentLoaded", function () {
    const ncrId = `${new Date().getFullYear()} - ${Math.floor(Math.random() * 999)}`;
    document.getElementById('ncrId').innerText = ncrId;

    const ncrDateTime = new Date();
    document.getElementById('ncrDateTime').innerText = ncrDateTime.toLocaleString();
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

            const Object = {NCRId: ncrId, datetime: ncrDateTime, product: productId, order: orderId, 
                    process: process, supplier: supplier, defectI: desItem, defect: defect, Qreceive: quaReceived, 
                    Qdefect: quaDefect, nonConform: nonConforming, name: repName, date: repDate};

            localStorage.setItem(ncrId, JSON.stringify(Object));
            localStorage.setItem("lastId", JSON.stringify(ncrId));

            document.querySelector(".cancel-btn").addEventListener("click", function () {
                localStorage.removeItem(ncrId);
            });
    });
});
