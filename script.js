function saveVehicle() {

    const vehicle = {
        name: document.getElementById("vehicleName").value,
        registration: document.getElementById("registration").value,
        currentKm: Number(document.getElementById("currentKm").value),
        lastService: Number(document.getElementById("lastService").value),
        nextService: Number(document.getElementById("nextService").value),
        insurance: document.getElementById("insurance").value,
        puc: document.getElementById("puc").value
    };

    if (!vehicle.name || !vehicle.registration) {
        alert("Please enter vehicle name and registration number.");
        return;
    }

    localStorage.setItem("vehicle", JSON.stringify(vehicle));

    displayStatus();
    updateDashboard();

    alert("Vehicle details saved successfully.");
}


function getDocumentStatus(expiryDate) {

    if (!expiryDate) {
        return {
            text: "DATE NOT SET",
            className: "status-soon"
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const daysRemaining = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) {
        return {
            text: "EXPIRED",
            className: "status-due"
        };
    }

    if (daysRemaining <= 30) {
        return {
            text: "EXPIRING SOON — " + daysRemaining + " days remaining",
            className: "status-soon"
        };
    }

    return {
        text: "VALID — " + daysRemaining + " days remaining",
        className: "status-safe"
    };
}


function displayStatus() {

    const data = localStorage.getItem("vehicle");

    if (!data) return;

    const vehicle = JSON.parse(data);

    const remaining =
        vehicle.nextService - vehicle.currentKm;

    let serviceMessage;
    let statusClass;

    if (remaining <= 0) {
        serviceMessage = "SERVICE DUE";
        statusClass = "status-due";
    }
    else if (remaining <= 1000) {
        serviceMessage =
            "SERVICE SOON — " + remaining + " KM remaining";
        statusClass = "status-soon";
    }
    else {
        serviceMessage =
            "SERVICE SAFE — " + remaining + " KM remaining";
        statusClass = "status-safe";
    }

    const insuranceStatus =
        getDocumentStatus(vehicle.insurance);

    const pucStatus =
        getDocumentStatus(vehicle.puc);

    document.getElementById("status").innerHTML = `

        <div class="status-box">
            <strong>Vehicle:</strong>
            ${vehicle.name}
        </div>

        <div class="status-box">
            <strong>Registration:</strong>
            ${vehicle.registration}
        </div>

        <div class="service-indicator ${statusClass}">
            ${serviceMessage}
        </div>

        <div class="service-indicator ${insuranceStatus.className}">
            INSURANCE: ${insuranceStatus.text}
        </div>

        <div class="service-indicator ${pucStatus.className}">
            PUC: ${pucStatus.text}
        </div>
    `;
}


function addService() {

    const type =
        document.getElementById("serviceType").value;

    const date =
        document.getElementById("serviceDate").value;

    const cost =
        document.getElementById("serviceCost").value;

    if (!type || !date || !cost) {
        alert("Please fill all service details.");
        return;
    }

    const service = {
        type: type,
        date: date,
        cost: Number(cost)
    };

    let history =
        JSON.parse(localStorage.getItem("history")) || [];

    history.push(service);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();
    updateDashboard();

    document.getElementById("serviceType").value = "";
    document.getElementById("serviceDate").value = "";
    document.getElementById("serviceCost").value = "";
}


function displayHistory() {

    const history =
        JSON.parse(localStorage.getItem("history")) || [];

    const container =
        document.getElementById("history");

    container.innerHTML = "";

    if (history.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No maintenance records yet.
            </div>
        `;

        return;
    }

    history.forEach((service, index) => {

        container.innerHTML += `

            <div class="service">

                <strong>${service.type}</strong>

                <br>

                Date: ${service.date}

                <br>

                Cost: ₹${service.cost}

                <br>

                <button
                    class="delete-btn"
                    onclick="deleteService(${index})">

                    Delete

                </button>

            </div>
        `;
    });
}


function deleteService(index) {

    if (!confirm("Delete this maintenance record?")) {
        return;
    }

    let history =
        JSON.parse(localStorage.getItem("history")) || [];

    history.splice(index, 1);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();
    updateDashboard();
}


function calculateTotalSpent() {

    const history =
        JSON.parse(localStorage.getItem("history")) || [];

    let total = 0;

    history.forEach(service => {

        total += Number(service.cost) || 0;

    });

    return total;
}


function updateDashboard() {

    const vehicleData =
        localStorage.getItem("vehicle");

    if (vehicleData) {

        const vehicle =
            JSON.parse(vehicleData);

        document.getElementById(
            "dashboardVehicle"
        ).textContent = vehicle.name;

        document.getElementById(
            "dashboardKm"
        ).textContent = vehicle.currentKm + " KM";

        const remaining =
            vehicle.nextService - vehicle.currentKm;

        let serviceStatus;

        if (remaining <= 0) {
            serviceStatus = "DUE";
        }
        else if (remaining <= 1000) {
            serviceStatus = "SOON";
        }
        else {
            serviceStatus = "SAFE";
        }

        document.getElementById(
            "dashboardService"
        ).textContent = serviceStatus;
    }

    const totalSpent =
        calculateTotalSpent();

    document.getElementById(
        "dashboardSpent"
    ).textContent =
        "₹" + totalSpent.toLocaleString("en-IN");
}


function clearAllData() {

    if (!confirm(
        "Are you sure you want to delete ALL data?"
    )) {
        return;
    }

    localStorage.removeItem("vehicle");
    localStorage.removeItem("history");

    location.reload();
}


function loadSavedData() {

    const vehicleData =
        localStorage.getItem("vehicle");

    if (vehicleData) {

        const vehicle =
            JSON.parse(vehicleData);

        document.getElementById("vehicleName").value =
            vehicle.name;

        document.getElementById("registration").value =
            vehicle.registration;

        document.getElementById("currentKm").value =
            vehicle.currentKm;

        document.getElementById("lastService").value =
            vehicle.lastService;

        document.getElementById("nextService").value =
            vehicle.nextService;

        document.getElementById("insurance").value =
            vehicle.insurance;

        document.getElementById("puc").value =
            vehicle.puc;
    }

    displayStatus();
    displayHistory();
    updateDashboard();
}


window.onload = loadSavedData;