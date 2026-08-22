/* =========================================================
   THE TORQUE THEORY — GARAGE SYSTEM
   ========================================================= */


/* ================= DATA ================= */

function getVehicle() {
    const data = localStorage.getItem("vehicle");

    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}


function getHistory() {
    const data = localStorage.getItem("history");

    if (!data) return [];

    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}


/* ================= SERVICE STATUS ================= */

function getServiceStatus(vehicle) {

    if (!vehicle) {
        return {
            text: "NOT SET",
            className: "status-soon"
        };
    }

    const remaining =
        Number(vehicle.nextService) -
        Number(vehicle.currentKm);

    if (remaining <= 0) {

        return {
            text: "DUE",
            className: "status-due"
        };

    }

    if (remaining <= 1000) {

        return {
            text: "SOON",
            className: "status-soon"
        };

    }

    return {
        text: "SAFE",
        className: "status-safe"
    };
}


/* ================= TOTAL SPENT ================= */

function calculateTotalSpent() {

    const history = getHistory();

    return history.reduce(
        (total, service) =>
            total + (Number(service.cost) || 0),
        0
    );
}


/* ================= SAVE VEHICLE ================= */

function saveVehicle() {

    const vehicle = {

        name:
            document.getElementById("vehicleName").value.trim(),

        registration:
            document.getElementById("registration").value.trim(),

        currentKm:
            Number(
                document.getElementById("vehicleCurrentKm").value
            ),

        lastService:
            Number(
                document.getElementById("lastService").value
            ),

        nextService:
            Number(
                document.getElementById("nextService").value
            ),

        insurance:
            document.getElementById("insurance").value,

        puc:
            document.getElementById("puc").value

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

    alert("Vehicle saved successfully.");
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const vehicle = getVehicle();

    const name =
        document.getElementById(
            "dashboardVehicleName"
        );

    const registration =
        document.getElementById(
            "dashboardRegistration"
        );

    const km =
        document.getElementById(
            "dashboardCurrentKm"
        );

    const service =
        document.getElementById(
            "dashboardServiceStatus"
        );

    const spent =
        document.getElementById(
            "dashboardTotalSpent"
        );


    if (!vehicle) {

        if (name)
            name.textContent = "YOUR VEHICLE";

        if (registration)
            registration.textContent =
                "Add your vehicle below.";

        if (km)
            km.textContent = "—";

        if (service)
            service.textContent = "—";

        if (spent)
            spent.textContent = "₹0";

        return;
    }


    if (name)
        name.textContent = vehicle.name;


    if (registration)
        registration.textContent =
            vehicle.registration;


    if (km)
        km.textContent =
            Number(vehicle.currentKm)
                .toLocaleString("en-IN") +
            " KM";


    if (service)
        service.textContent =
            getServiceStatus(vehicle).text;


    if (spent)
        spent.textContent =
            "₹" +
            calculateTotalSpent()
                .toLocaleString("en-IN");
}


/* ================= ADD SERVICE ================= */

function addService() {

    const type =
        document.getElementById(
            "serviceType"
        ).value.trim();

    const date =
        document.getElementById(
            "serviceDate"
        ).value;

    const cost =
        document.getElementById(
            "serviceCost"
        ).value;


    if (!type || !date || !cost) {

        alert(
            "Please fill all service details."
        );

        return;
    }


    const history = getHistory();


    history.push({

        type: type,

        date: date,

        cost: Number(cost)

    });


    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );


    document.getElementById(
        "serviceType"
    ).value = "";

    document.getElementById(
        "serviceDate"
    ).value = "";

    document.getElementById(
        "serviceCost"
    ).value = "";


    displayHistory();

    updateDashboard();
}


/* ================= HISTORY ================= */

function displayHistory() {

    const container =
        document.getElementById("history");


    if (!container) return;


    const history = getHistory();


    container.innerHTML = "";


    if (history.length === 0) {

        container.innerHTML = `

            <div class="empty">
                No maintenance records yet.
            </div>

        `;

        return;
    }


    history
        .slice()
        .reverse()
        .forEach((service, reverseIndex) => {

            const actualIndex =
                history.length -
                1 -
                reverseIndex;


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

                    <br><br>

                    <button
                        class="delete-btn"
                        onclick="deleteService(${actualIndex})">

                        DELETE

                    </button>

                </div>

            `;

        });
}


/* ================= DELETE SERVICE ================= */

function deleteService(index) {

    if (!confirm(
        "Delete this maintenance record?"
    )) {
        return;
    }


    const history = getHistory();


    history.splice(index, 1);


    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );


    displayHistory();

    updateDashboard();
}


/* ================= CLEAR ALL ================= */

function clearAllData() {

    if (!confirm(
        "Delete ALL Torque Theory data?"
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


/* ================= LOAD ================= */

function loadSavedData() {

    const vehicle = getVehicle();


    if (vehicle) {

        document.getElementById(
            "vehicleName"
        ).value = vehicle.name || "";


        document.getElementById(
            "registration"
        ).value = vehicle.registration || "";


        document.getElementById(
            "vehicleCurrentKm"
        ).value = vehicle.currentKm || "";


        document.getElementById(
            "lastService"
        ).value = vehicle.lastService || "";


        document.getElementById(
            "nextService"
        ).value = vehicle.nextService || "";


        document.getElementById(
            "insurance"
        ).value = vehicle.insurance || "";


        document.getElementById(
            "puc"
        ).value = vehicle.puc || "";

    }


    updateDashboard();

    displayHistory();
}


/* ================= START ================= */

window.addEventListener(
    "DOMContentLoaded",
    loadSavedData
);
