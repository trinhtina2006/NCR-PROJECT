const date= new Date();
const year = new Date().getFullYear(); 
const ran = Math.floor(Math.random() * 999); 
document.getElementById('ncrId').innerText = `${year} - ${ran}`;

document.getElementById('ncrDateTime').innerText = date.toLocaleString();