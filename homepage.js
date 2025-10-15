document.addEventListener("DOMContentLoaded", function() {

    const container = document.getElementById('listContainer');
    const lastId = JSON.parse(localStorage.getItem("lastId"));
    const ap = JSON.parse(localStorage.getItem(lastId));
    for (let i = 1; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === "lastId") continue;

    const raw = localStorage.getItem(key);
    try {
        const report = JSON.parse(raw);
        if (!report || typeof report !== "object") continue;

        container.innerHTML += `
        <div class="list-item">
            <span class="list-id">${key}</span>
            <span class="list-name">${report.name}</span>
            <span class="list-time">${report.date}</span>
            <span class="list-status">${report.depClosed === "yes" ? "Closed" : "Active"}</span>
            <span class="list-actions">
            ${report.depClosed === "yes"
                ? `<button class="action-btn details-btn" onclick="location.href='details.html?id=${key}'">Details</button>`
                : `<button class="action-btn edit-btn" onclick="location.href='edit.html?id=${key}'">Edit</button>
                <button class="action-btn details-btn" onclick="location.href='details.html?id=${key}'">Details</button>
                <button class="action-btn delete-btn" onclick="if(confirm('Are you sure you want to delete NCR ${key}?')) 
                { localStorage.removeItem('${key}'); location.reload(); }">Delete</button>`}
            </span>
        </div>`;
    } catch (err) {
        console.warn("Skipping invalid entry:", key);
    }
    }
});