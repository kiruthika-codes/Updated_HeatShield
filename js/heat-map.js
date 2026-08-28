// =====================================================
// HEATSHIELD — HEAT MAP
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const navLinks =
    document.getElementById("navLinks");

const menuButton =
    document.getElementById("menuButton");

const locationButton =
    document.getElementById("locationButton");

const locationText =
    document.getElementById("locationText");

const locationSearch =
    document.getElementById("locationSearch");

const searchButton =
    document.getElementById("searchButton");

const mapWorld =
    document.getElementById("mapWorld");

const heatZones =
    document.querySelectorAll(".heat-zone");

const mapFilters =
    document.querySelectorAll(".map-filter");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const resetMap =
    document.getElementById("resetMap");

const currentLocation =
    document.getElementById("currentLocation");

const zonePanel =
    document.getElementById("zonePanel");

const panelClose =
    document.getElementById("panelClose");

const panelRiskIcon =
    document.getElementById("panelRiskIcon");

const panelRiskLevel =
    document.getElementById("panelRiskLevel");

const panelLocation =
    document.getElementById("panelLocation");

const panelDescription =
    document.getElementById("panelDescription");

const panelTemperature =
    document.getElementById("panelTemperature");

const panelFeels =
    document.getElementById("panelFeels");

const panelHumidity =
    document.getElementById("panelHumidity");

const panelUV =
    document.getElementById("panelUV");

const panelSafetyButton =
    document.getElementById("panelSafetyButton");


// =====================================================
// ZONE DATA
// =====================================================

const zoneData = {

    "Greenfield": {

        risk: "low",

        level: "LOW RISK",

        temperature: "31°",

        feels: "33°C",

        humidity: "52%",

        uv: "5",

        description:
            "Heat conditions are currently manageable. Basic precautions are recommended."

    },


    "Lakeside": {

        risk: "moderate",

        level: "MODERATE RISK",

        temperature: "35°",

        feels: "38°C",

        humidity: "55%",

        uv: "7",

        description:
            "Heat is becoming noticeable. Stay hydrated and take regular breaks."

    },


    "Central City": {

        risk: "high",

        level: "HIGH RISK",

        temperature: "39°",

        feels: "43°C",

        humidity: "48%",

        uv: "8",

        description:
            "Heat conditions are elevated. Limit prolonged outdoor activity during the hottest hours."

    },


    "East District": {

        risk: "extreme",

        level: "EXTREME RISK",

        temperature: "42°",

        feels: "47°C",

        humidity: "51%",

        uv: "10",

        description:
            "Dangerously high heat conditions are present. Avoid unnecessary outdoor exposure."

    },


    "South Market": {

        risk: "high",

        level: "HIGH RISK",

        temperature: "38°",

        feels: "42°C",

        humidity: "57%",

        uv: "9",

        description:
            "High heat is expected. Reduce outdoor exposure and stay hydrated."

    },


    "West Park": {

        risk: "moderate",

        level: "MODERATE RISK",

        temperature: "34°",

        feels: "37°C",

        humidity: "50%",

        uv: "7",

        description:
            "Moderate heat conditions are present. Keep water nearby and take regular breaks."

    },


    "Industrial Area": {

        risk: "extreme",

        level: "EXTREME RISK",

        temperature: "43°",

        feels: "48°C",

        humidity: "46%",

        uv: "11",

        description:
            "Extreme heat conditions are present. Outdoor workers should take frequent cooling breaks."

    }

};


// =====================================================
// NAVIGATION
// =====================================================

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "open"
            );

        }
    );

}


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "open"
                );

            }
        );

    });


// =====================================================
// MAP ZOOM
// =====================================================

let mapScale = 1;

const MIN_ZOOM = 1;

const MAX_ZOOM = 1.8;

const ZOOM_STEP = 0.2;


function updateMapZoom() {

    mapWorld.style.transform =
        `scale(${mapScale})`;

}


zoomIn.addEventListener(
    "click",
    () => {

        if (
            mapScale < MAX_ZOOM
        ) {

            mapScale =
                Math.min(
                    mapScale + ZOOM_STEP,
                    MAX_ZOOM
                );

            updateMapZoom();

        }

    }
);


zoomOut.addEventListener(
    "click",
    () => {

        if (
            mapScale > MIN_ZOOM
        ) {

            mapScale =
                Math.max(
                    mapScale - ZOOM_STEP,
                    MIN_ZOOM
                );

            updateMapZoom();

        }

    }
);


resetMap.addEventListener(
    "click",
    () => {

        mapScale = 1;

        updateMapZoom();

    }
);


// =====================================================
// MAP FILTER
// =====================================================

mapFilters.forEach(
    filter => {

        filter.addEventListener(
            "click",
            () => {

                mapFilters.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                filter.classList.add(
                    "active"
                );


                const selectedRisk =
                    filter.dataset.risk;


                heatZones.forEach(
                    zone => {

                        const risk =
                            zone.dataset.risk;


                        if (
                            selectedRisk ===
                            "all"
                        ) {

                            zone.style.display =
                                "flex";

                        }

                        else {

                            zone.style.display =
                                risk ===
                                selectedRisk
                                    ? "flex"
                                    : "none";

                        }

                    }
                );

            }
        );

    }
);


// =====================================================
// RISK COLORS
// =====================================================

function getRiskColor(risk) {

    const colors = {

        low: "#56a986",

        moderate: "#c4a85b",

        high: "#e8794c",

        extreme: "#c85d53"

    };

    return colors[risk];

}


// =====================================================
// SHOW AREA
// =====================================================

function showZone(location) {

    const data =
        zoneData[location];


    if (!data) {
        return;
    }


    const color =
        getRiskColor(
            data.risk
        );


    panelLocation.textContent =
        location;


    panelRiskLevel.textContent =
        data.level;


    panelDescription.textContent =
        data.description;


    panelTemperature.textContent =
        data.temperature;


    panelFeels.textContent =
        data.feels;


    panelHumidity.textContent =
        data.humidity;


    panelUV.textContent =
        data.uv;


    panelRiskIcon.style.color =
        color;


    panelRiskIcon.style.background =
        `${color}18`;


    panelRiskLevel.style.color =
        color;


    panelRiskLevel.style.background =
        `${color}14`;


    if (
        data.risk === "low"
    ) {

        panelRiskIcon.textContent =
            "✓";

    }

    else if (
        data.risk === "moderate"
    ) {

        panelRiskIcon.textContent =
            "•";

    }

    else {

        panelRiskIcon.textContent =
            "!";

    }

}


// =====================================================
// HEAT ZONE CLICK
// =====================================================

heatZones.forEach(
    zone => {

        zone.addEventListener(
            "click",
            () => {

                const location =
                    zone.dataset.location;


                showZone(location);


                // Small visual feedback

                zone.animate(
                    [
                        {
                            transform:
                                "translate(-50%, -50%) scale(1)"
                        },

                        {
                            transform:
                                "translate(-50%, -50%) scale(1.5)"
                        },

                        {
                            transform:
                                "translate(-50%, -50%) scale(1)"
                        }

                    ],
                    {
                        duration: 500
                    }
                );

            }
        );

    }
);


// =====================================================
// CLOSE PANEL
// =====================================================

panelClose.addEventListener(
    "click",
    () => {

        panelLocation.textContent =
            "Select an area";

        panelDescription.textContent =
            "Click any heat zone on the map to see detailed conditions.";

        panelTemperature.textContent =
            "--";

        panelFeels.textContent =
            "--";

        panelHumidity.textContent =
            "--";

        panelUV.textContent =
            "--";

        panelRiskLevel.textContent =
            "NO AREA SELECTED";

        panelRiskIcon.textContent =
            "•";

        panelRiskIcon.style.color =
            "#69737d";

        panelRiskIcon.style.background =
            "rgba(255,255,255,0.04)";

    }
);


// =====================================================
// SEARCH
// =====================================================

function searchLocation() {

    const query =
        locationSearch.value
            .trim()
            .toLowerCase();


    if (!query) {

        locationSearch.focus();

        return;

    }


    const location =
        Object.keys(zoneData)
            .find(
                name =>
                    name
                        .toLowerCase()
                        .includes(query)
            );


    if (!location) {

        alert(
            "No matching area found on the HeatShield demo map."
        );

        return;

    }


    showZone(location);


    const zone =
        [...heatZones]
            .find(
                item =>
                    item.dataset.location ===
                    location
            );


    if (zone) {

        zone.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(1)"
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1.7)"
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1)"
                }

            ],
            {
                duration: 700
            }
        );

    }

}


searchButton.addEventListener(
    "click",
    searchLocation
);


locationSearch.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            searchLocation();

        }

    }
);


// =====================================================
// LOCATION
// =====================================================

locationButton.addEventListener(
    "click",
    () => {

        if (
            !navigator.geolocation
        ) {

            locationText.textContent =
                "Unavailable";

            return;

        }


        locationText.textContent =
            "Detecting...";


        navigator.geolocation.getCurrentPosition(

            position => {

                localStorage.setItem(
                    "heatShieldLocation",
                    JSON.stringify({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude

                    })
                );


                locationText.textContent =
                    "Location detected";


                currentLocation.style.display =
                    "flex";

            },


            () => {

                locationText.textContent =
                    "Try again";

            }

        );

    }
);


// =====================================================
// SAFETY BUTTON
// =====================================================

panelSafetyButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "safety.html";

    }
);


// =====================================================
// INITIALIZE
// =====================================================

updateMapZoom();

showZone(
    "Central City"
);


console.log(
    "HeatShield Heat Map loaded successfully."
);