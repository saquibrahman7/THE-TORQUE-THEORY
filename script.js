/* =========================================================
   THE TORQUE THEORY — V2
   GARAGE / DASHBOARD SYSTEM
   ========================================================= */


/* ================= VEHICLE DATA ================= */

function getVehicle() {

    const data = localStorage.getItem("vehicle");

    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Vehicle data error:", error);
        return null;
    }
}


/* ================= SERVICE HISTORY ================= */

function getHistory() {

    const data = localStorage.getItem("history");

    if (!data) return [];

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("History data error:", error);
        return [];
    }
}


/* ================= DOCUMENT STATUS ================= */

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
        (expiry - today) /
        (1000 * 60 * 60 * 24)
    );


    if (daysRemaining < 0) {

        return {
            text: "EXPIRED",
            className: "status-due"
        };

    }


    if (daysRemaining <= 30) {

        return {
            text:
                "EXPIRING SOON — " +
                daysRemaining +
                " days remaining",

            className: "status-soon"
        };

    }


    return {
        text:
            "VALID — " +
            daysRemaining +
            " days remaining",

        className: "status-safe"
    };
}


/* ================= SERVICE STATUS ================= */

function getServiceStatus(vehicle) {

    if (!vehicle) {

        return {
            text: "NO VEHICLE",
            className: "status-soon"
        };

    }


    const remaining =
        Number(vehicle.nextService) -
        Number(vehicle.currentKm);


    if (remaining <= 0) {

        return {
            text: "SERVICE DUE",
            className: "status-due"
        };

    }


    if (remaining <= 1000) {

        return {
            text:
                "SERVICE SOON — " +
                remaining +
                " KM",

            className: "status-soon"
        };

    }


    return {
        text:
            "SERVICE SAFE — " +
            remaining +
            " KM",

        className: "status-safe"
    };
}


/* ================= TOTAL SPENT ================= */

function calculateTotalSpent() {

    const history = getHistory();

    let total = 0;

    history.forEach(service => {

        total += Number(service.cost) || 0;

    });

    return total;
}


/* ================= UPDATE DASHBOARD ================= */

function updateDashboard() {

    const vehicle = getVehicle();


    /* ---------- Vehicle ---------- */

    const vehicleName =
        document.getElementById("vehicleName");

    const vehicleDetails =
        document.getElementById("vehicleDetails");

    const currentKm =
        document.getElementById("currentKm");

    const serviceStatus =
        document.getElementById("serviceStatus");

    const totalSpent =
        document.getElementById("totalSpent");


    if (!vehicle) {

        if (vehicleName) {

            vehicleName.textContent =
                "YOUR VEHICLE";

        }


        if (vehicleDetails) {

            vehicleDetails.textContent =
                "Add your vehicle to get started.";

        }


        if (currentKm) {

            currentKm.textContent =
                "—";

        }


        if (serviceStatus) {

            serviceStatus.textContent =
                "—";

        }


        if (totalSpent) {

            totalSpent.textContent =
                "₹0";

        }

        return;
    }


    /* ---------- Vehicle Name ---------- */

    if (vehicleName) {

        vehicleName.textContent =
            vehicle.name;

    }


    /* ---------- Vehicle Details ---------- */

    if (vehicleDetails) {

        vehicleDetails.textContent =
            vehicle.registration;

    }


    /* ---------- KM ---------- */

    if (currentKm) {

        currentKm.textContent =
            Number(vehicle.currentKm).toLocaleString("en-IN") +
            " KM";

    }


    /* ---------- Service ---------- */

    if (serviceStatus) {

        const status =
            getServiceStatus(vehicle);

        serviceStatus.textContent =
            status.text.replace(
                "SERVICE ",
                ""
            );

    }


    /* ---------- Total Spent ---------- */

    if (totalSpent) {

        totalSpent.textContent =
            "₹" +
            calculateTotalSpent()
                .toLocaleString("en-IN");

    }
}


/* ================= OLD DASHBOARD COMPATIBILITY ================= */

function updateOldDashboard() {

    const vehicle = getVehicle();

    const dashboardVehicle =
        document.getElementById("dashboardVehicle");

    const dashboardKm =
        document.getElementById("dashboardKm");

    const dashboardService =
        document.getElementById("dashboardService");

    const dashboardSpent =
        document.getElementById("dashboardSpent");


    if (vehicle) {

        if (dashboardVehicle) {

            dashboardVehicle.textContent =
                vehicle.name;

        }


        if (dashboardKm) {

            dashboardKm.textContent =
                vehicle.currentKm +
                " KM";

        }


        if (dashboardService) {

            const status =
                getServiceStatus(vehicle);

            dashboardService.textContent =
                status.text;

        }

    }


    if (dashboardSpent) {

        dashboardSpent.textContent =
            "₹" +
            calculateTotalSpent()
                .toLocaleString("en-IN");

    }
}


/* ================= OLD STATUS COMPATIBILITY ================= */

function displayStatus() {

    const vehicle = getVehicle();

    const statusContainer =
        document.getElementById("status");


    if (!vehicle || !statusContainer) {
        return;
    }


    const service =
        getServiceStatus(vehicle);

    const insurance =
        getDocumentStatus(
            vehicle.insurance
        );

    const puc =
        getDocumentStatus(
            vehicle.puc
        );


    statusContainer.innerHTML = `

        <div class="status-box">

            <strong>Vehicle:</strong>

            ${vehicle.name}

        </div>


        <div class="status-box">

            <strong>Registration:</strong>

            ${vehicle.registration}

        </div>


        <div class="service-indicator ${service.className}">

            ${service.text}

        </div>


        <div class="service-indicator ${insurance.className}">

            INSURANCE:
            ${insurance.text}

        </div>


        <div class="service-indicator ${puc.className}">

            PUC:
            ${puc.text}

        </div>

    `;
}


/* ================= OLD FORM SUPPORT ================= */

function saveVehicle() {

    const nameInput =
        document.getElementById("vehicleName");

    const registrationInput =
        document.getElementById("registration");

    const currentKmInput =
        document.getElementById("currentKm");

    const lastServiceInput =
        document.getElementById("lastService");

    const nextServiceInput =
        document.getElementById("nextService");

    const insuranceInput =
        document.getElementById("insurance");

    const pucInput =
        document.getElementById("puc");


    /*
       If the new dashboard is being used,
       there is no form to save yet.
    */

    if (!nameInput || !registrationInput) {
        return;
    }


    const vehicle = {

        name:
            nameInput.value,

        registration:
            registrationInput.value,

        currentKm:
            Number(
                currentKmInput?.value || 0
            ),

        lastService:
            Number(
                lastServiceInput?.value || 0
            ),

        nextService:
            Number(
                nextServiceInput?.value || 0
            ),

        insurance:
            insuranceInput?.value || "",

        puc:
            pucInput?.value || ""

    };


    if (!vehicle.name ||
        !vehicle.registration) {

        alert(
            "Please enter vehicle name and registration number."
        );

        return;
    }


    localStorage.setItem(
        "vehicle",
        JSON.stringify(vehicle)
    );


    updateDashboard();

    displayStatus();

    updateOldDashboard();


    alert(
        "Vehicle details saved successfully."
    );
}


/* ================= SERVICE SYSTEM ================= */

function addService() {

    const typeInput =
        document.getElementById("serviceType");

    const dateInput =
        document.getElementById("serviceDate");

    const costInput =
        document.getElementById("serviceCost");


    if (!typeInput ||
        !dateInput ||
        !costInput) {

        return;
    }


    const type =
        typeInput.value;

    const date =
        dateInput.value;

    const cost =
        costInput.value;


    if (!type || !date || !cost) {

        alert(
            "Please fill all service details."
        );

        return;
    }


    const service = {

        type: type,

        date: date,

        cost: Number(cost)

    };


    const history =
        getHistory();


    history.push(service);


    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );


    displayHistory();

    updateDashboard();

    updateOldDashboard();


    typeInput.value = "";

    dateInput.value = "";

    costInput.value = "";
}


/* ================= HISTORY ================= */

function displayHistory() {

    const container =
        document.getElementById("history");


    if (!container) {
        return;
    }


    const history =
        getHistory();


    container.innerHTML = "";


    if (history.length === 0) {

        container.innerHTML = `

            <div class="empty">

                No maintenance records yet.

            </div>

        `;

        return;
    }


    history.forEach(
        (service, index) => {

            container.innerHTML += `

                <div class="service">

                    <strong>
                        ${service.type}
                    </strong>

                    <br>

                    Date:
                    ${service.date}

                    <br>

                    Cost:
                    ₹${Number(service.cost)
                        .toLocaleString("en-IN")}

                    <br>

                    <button
                        class="delete-btn"
                        onclick="deleteService(${index})">

                        Delete

                    </button>

                </div>

            `;

        }
    );
}


/* ================= DELETE SERVICE ================= */

function deleteService(index) {

    if (!confirm(
        "Delete this maintenance record?"
    )) {

        return;
    }


    const history =
        getHistory();


    history.splice(
        index,
        1
    );


    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );


    displayHistory();

    updateDashboard();

    updateOldDashboard();
}


/* ================= LOAD SAVED DATA ================= */

function loadSavedData() {

    const vehicle =
        getVehicle();


    /*
       Only populate old form fields
       if they actually exist.
    */

    if (vehicle) {

        const name =
            document.getElementById("vehicleName");

        const registration =
            document.getElementById("registration");

        const currentKm =
            document.getElementById("currentKm");

        const lastService =
            document.getElementById("lastService");

        const nextService =
            document.getElementById("nextService");

        const insurance =
            document.getElementById("insurance");

        const puc =
            document.getElementById("puc");


        /*
           IMPORTANT:
           New dashboard uses vehicleName
           as a text element, not an input.
        */

        if (name && name.tagName === "INPUT") {

            name.value =
                vehicle.name;

        }


        if (registration &&
            registration.tagName === "INPUT") {

            registration.value =
                vehicle.registration;

        }


        if (currentKm &&
            currentKm.tagName === "INPUT") {

            currentKm.value =
                vehicle.currentKm;

        }


        if (lastService &&
            lastService.tagName === "INPUT") {

            lastService.value =
                vehicle.lastService;

        }


        if (nextService &&
            nextService.tagName === "INPUT") {

            nextService.value =
                vehicle.nextService;

        }


        if (insurance &&
            insurance.tagName === "INPUT") {

            insurance.value =
                vehicle.insurance;

        }


        if (puc &&
            puc.tagName === "INPUT") {

            puc.value =
                vehicle.puc;

        }

    }


    updateDashboard();

    updateOldDashboard();

    displayStatus();

    displayHistory();
}


/* ================= CLEAR DATA ================= */

function clearAllData() {

    if (!confirm(
        "Are you sure you want to delete ALL Torque Theory data?"
    )) {

        return;
    }


    localStorage.removeItem("vehicle");

    localStorage.removeItem("history");


    location.reload();
}


/* ================= NAVIGATION ================= */

function scrollToSection(id) {

    const section =
        document.getElementById(id);


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* ================= MOBILE MENU ================= */

function toggleMenu() {

    const nav =
        document.getElementById("mainNav");


    if (nav) {

        nav.classList.toggle("show");

    }
}


/* ================= ADD VEHICLE ================= */

function addVehicle() {

    /*
       The proper vehicle-management screen
       will be added in the Garage module.

       For now, this keeps the dashboard stable.
    */

    alert(
        "Vehicle management will be added in MY GARAGE."
    );
}


/* ================= START ================= */

window.addEventListener(
    "DOMContentLoaded",
    loadSavedData
);
