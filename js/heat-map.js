/* =====================================================
   HEATSHIELD — HEAT MAP JAVASCRIPT
===================================================== */


const API_URL = "http://localhost:5000";


let heatMap;

let selectedMarker = null;


const DEFAULT_LOCATION = {

    name: "World",

    latitude: 20,

    longitude: 0

};


/* =====================================================
   DOM ELEMENTS
===================================================== */


const searchInput =
    document.getElementById("locationSearch");

const searchButton =
    document.getElementById("searchButton");


const locationButton =
    document.getElementById("locationButton");

const locationText =
    document.getElementById("locationText");


const panel =
    document.getElementById("zonePanel");

const panelClose =
    document.getElementById("panelClose");


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


const panelWind =
    document.getElementById("panelWind");


const panelUV =
    document.getElementById("panelUV");


const panelHeatIndex =
    document.getElementById("panelHeatIndex");


const panelCoordinates =
    document.getElementById("panelCoordinates");


const panelRiskLevel =
    document.getElementById("panelRiskLevel");


const panelRiskIcon =
    document.getElementById("panelRiskIcon");


const panelSafety =
    document.getElementById("panelSafety");


const panelRiskButton =
    document.getElementById("panelRiskButton");


const trendSummary =
    document.getElementById("trendSummary");


const menuButton =
    document.getElementById("menuButton");


const navLinks =
    document.getElementById("navLinks");


/* =====================================================
   INITIALIZE MAP
===================================================== */


function initializeMap() {


    heatMap = L.map("mapWorld", {

        center: [
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude
        ],

        zoom: 2,

        minZoom: 2,

        maxZoom: 18,

        worldCopyJump: true

    });


    /* OpenStreetMap */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'

        }

    ).addTo(heatMap);


    setupMapControls();

}


/* =====================================================
   MAP CONTROLS
===================================================== */


function setupMapControls() {


    const zoomIn =
        document.getElementById("zoomIn");


    const zoomOut =
        document.getElementById("zoomOut");


    const resetMap =
        document.getElementById("resetMap");


    zoomIn.addEventListener("click", () => {

        heatMap.zoomIn();

    });


    zoomOut.addEventListener("click", () => {

        heatMap.zoomOut();

    });


    resetMap.addEventListener("click", () => {

        heatMap.flyTo(

            [
                DEFAULT_LOCATION.latitude,
                DEFAULT_LOCATION.longitude
            ],

            2,

            {

                duration: 1

            }

        );

    });

}


/* =====================================================
   SEARCH LOCATION
===================================================== */


async function searchLocation() {


    const searchText =
        searchInput.value.trim();


    if (!searchText) {

        alert("Please enter a location.");

        return;

    }


    searchButton.disabled = true;

    searchButton.textContent = "Searching...";


    try {


        const response = await fetch(

            `${API_URL}/api/search-location?city=${encodeURIComponent(searchText)}`

        );


        if (!response.ok) {

            throw new Error(
                "Location search failed"
            );

        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            alert(
                `No location found for "${searchText}".`
            );

            return;

        }


        const result =
            data.results[0];


        const location = {

            name:
                buildLocationName(result),

            latitude:
                Number(result.latitude),

            longitude:
                Number(result.longitude)

        };


        await selectLocation(location);


    }

    catch (error) {


        console.error(

            "Location search error:",

            error

        );


        alert(
            "Unable to search location. Make sure the backend is running."
        );


    }

    finally {


        searchButton.disabled = false;

        searchButton.textContent = "Search";

    }

}


/* =====================================================
   BUILD LOCATION NAME
===================================================== */


function buildLocationName(result) {


    const parts = [];


    if (result.name) {

        parts.push(result.name);

    }


    if (
        result.state &&
        result.state !== result.name
    ) {

        parts.push(result.state);

    }


    if (result.country) {

        parts.push(result.country);

    }


    return parts.join(", ");

}


/* =====================================================
   SELECT LOCATION
===================================================== */


async function selectLocation(location) {


    const {
        name,
        latitude,
        longitude
    } = location;


    /* Save location */

    localStorage.setItem(

        "heatShieldSelectedLocation",

        JSON.stringify(location)

    );


    /* Move map */

    heatMap.flyTo(

        [
            latitude,
            longitude
        ],

        10,

        {

            duration: 1.3

        }

    );


    /* Remove previous marker */

    if (selectedMarker) {

        heatMap.removeLayer(

            selectedMarker

        );

    }


    /* Load risk data */

    try {


        const riskData =
            await getRiskData(

                latitude,

                longitude

            );


        createRiskMarker(

            latitude,

            longitude,

            riskData.riskLevel,

            name

        );


        updateRiskPanel(

            name,

            latitude,

            longitude,

            riskData

        );


        panel.scrollIntoView({

            behavior: "smooth",

            block: "nearest"

        });


    }

    catch (error) {


        console.error(

            "Risk data error:",

            error

        );


        alert(
            "Unable to load heat data. Make sure the backend is running."
        );

    }

}


/* =====================================================
   GET RISK DATA
===================================================== */


async function getRiskData(

    latitude,

    longitude

) {


    const response =
        await fetch(

            `${API_URL}/api/risk?lat=${latitude}&lon=${longitude}`

        );


    if (!response.ok) {

        throw new Error(
            "Risk API failed"
        );

    }


    return await response.json();

}


/* =====================================================
   CREATE RISK MARKER
===================================================== */


function createRiskMarker(

    latitude,

    longitude,

    riskLevel,

    locationName

) {


    const risk =
        String(riskLevel || "LOW")
            .toUpperCase();


    const color =
        getRiskColor(risk);


    selectedMarker =
        L.circleMarker(

            [

                latitude,

                longitude

            ],

            {

                radius: 12,

                color: "#ffffff",

                weight: 3,

                fillColor: color,

                fillOpacity: 0.95,

                className:
                    "heat-risk-marker"

            }

        ).addTo(heatMap);


    selectedMarker.bindPopup(

        createPopupContent(

            locationName,

            risk

        )

    );


    selectedMarker.on(

        "click",

        () => {

            panel.scrollIntoView({

                behavior: "smooth",

                block: "nearest"

            });

        }

    );


    selectedMarker.openPopup();

}


/* =====================================================
   POPUP
===================================================== */


function createPopupContent(

    locationName,

    riskLevel

) {


    return `

        <div style="
            min-width:190px;
            font-family:Inter,sans-serif;
        ">

            <strong style="
                display:block;
                font-size:15px;
                margin-bottom:7px;
                color:#f0f2f3;
            ">

                ${locationName}

            </strong>


            <span style="
                display:inline-block;
                padding:5px 8px;
                border-radius:6px;
                background:${getRiskColor(riskLevel)}22;
                color:${getRiskColor(riskLevel)};
                font-size:11px;
                font-weight:700;
            ">

                ${riskLevel} HEAT RISK

            </span>


            <p style="
                margin-top:9px;
                margin-bottom:0;
                color:#9ba4ad;
                font-size:11px;
            ">

                Click the marker to view heat conditions.

            </p>

        </div>

    `;

}


/* =====================================================
   RISK COLOR
===================================================== */


function getRiskColor(riskLevel) {


    switch (

        String(riskLevel).toUpperCase()

    ) {


        case "EXTREME":

            return "#d9534f";


        case "HIGH":

            return "#e8794c";


        case "MODERATE":

            return "#f2c94c";


        case "LOW":

        default:

            return "#56a986";

    }

}


/* =====================================================
   UPDATE RISK PANEL
===================================================== */


async function updateRiskPanel(

    name,

    latitude,

    longitude,

    data

) {


    const risk =
        String(

            data.riskLevel || "LOW"

        ).toUpperCase();


    const temperature =
        Number(data.temperature);


    const feelsLike =
        Number(data.feelsLike);


    const humidity =
        Number(data.humidity);


    const windSpeed =
        Number(data.windSpeed);


    const uvIndex =
        Number(data.uvIndex);


    /* Location */

    panelLocation.textContent =
        name;


    /* Risk */

    panelRiskLevel.textContent =
        `${risk} HEAT RISK`;


    panelRiskIcon.textContent =
        getRiskIcon(risk);


    const color =
        getRiskColor(risk);


    panelRiskLevel.style.color =
        color;


    panelRiskIcon.style.color =
        color;


    panelRiskLevel.style.background =
        `${color}18`;


    panelRiskIcon.style.background =
        `${color}18`;


    /* Description */

    panelDescription.textContent =
        getRiskMessage(risk);


    /* Temperature */

    panelTemperature.textContent =
        formatNumber(temperature) + "°C";


    /* Feels like */

    panelFeels.textContent =
        formatNumber(feelsLike) + "°C";


    /* Humidity */

    panelHumidity.textContent =
        formatNumber(humidity) + "%";


    /* Wind */

    panelWind.textContent =
        formatNumber(windSpeed) + " km/h";


    /* UV */

    panelUV.textContent =
        formatNumber(uvIndex);


    /* Heat index */

    panelHeatIndex.textContent =
        formatNumber(feelsLike) + "°C";


    /* Coordinates */

    panelCoordinates.textContent =
        `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;


    /* Safety */

    panelSafety.textContent =
        getSafetyMessage(risk);


    /* Trend */

    trendSummary.textContent =
        getTrendMessage(risk);


    // =================================================
    // LOAD REAL HOURLY HEAT TREND
    // =================================================

    await loadHourlyTrend(

        latitude,

        longitude

    );


    /* Show panel */

    panel.style.display = "block";

}


/* =====================================================
   FORMAT NUMBERS
===================================================== */


function formatNumber(value) {


    if (

        value === null ||

        value === undefined ||

        Number.isNaN(value)

    ) {

        return "--";

    }


    return Number(value).toFixed(1);

}


/* =====================================================
   RISK ICON
===================================================== */


function getRiskIcon(risk) {


    switch (risk) {


        case "EXTREME":

            return "⚠";


        case "HIGH":

            return "!";


        case "MODERATE":

            return "⚠";


        case "LOW":

        default:

            return "✓";

    }

}


/* =====================================================
   RISK MESSAGE
===================================================== */


function getRiskMessage(risk) {


    switch (risk) {


        case "EXTREME":

            return "Extreme heat conditions are present. Avoid prolonged outdoor exposure and take immediate precautions.";


        case "HIGH":

            return "High heat conditions are present. Stay hydrated and limit prolonged outdoor activity.";


        case "MODERATE":

            return "Moderate heat conditions are present. Stay hydrated and take regular breaks.";


        case "LOW":

        default:

            return "Heat conditions are currently low. Continue normal activities while staying aware of changing conditions.";

    }

}


/* =====================================================
   SAFETY MESSAGE
===================================================== */


function getSafetyMessage(risk) {


    switch (risk) {


        case "EXTREME":

            return "Avoid unnecessary outdoor activity. Stay indoors or in a cool place, drink water frequently, and watch for signs of heat illness.";


        case "HIGH":

            return "Drink plenty of water, avoid intense outdoor activity during the hottest hours, and take frequent cooling breaks.";


        case "MODERATE":

            return "Stay hydrated, wear light clothing, use shade when outdoors, and take regular breaks.";


        case "LOW":

        default:

            return "Stay hydrated and remain aware of increasing temperatures, especially during prolonged outdoor activity.";

    }

}

/* =====================================================
   REAL HOURLY HEAT TREND
===================================================== */



async function loadHourlyTrend(latitude, longitude) {
    try {
        const response = await fetch(
            `${API_URL}/api/hourly?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
            throw new Error("Hourly API failed");
        }

        const data = await response.json();
        const hourly = data.hourly;
        const current = data.current;

        if (
            !hourly ||
            !hourly.time ||
            !hourly.apparent_temperature
        ) {
            throw new Error("Hourly data is missing");
        }

        drawHeatTrend(
    hourly.time,
    hourly.temperature_2m,
    current?.time,
    current?.temperature_2m
);

    } catch (error) {
        console.error("Hourly trend error:", error);
    }
}



/* =====================================================
   DRAW HEAT TREND
===================================================== */


function drawHeatTrend(
    times,
    temperatures,
    currentTime = null,
    currentTemperature = null
) { 


    const chart =
        document.querySelector(".trend-chart");


    if (!chart) {

        console.warn(
            "Trend chart container not found."
        );

        return;

    }


    
    const validData = [];

    // Keep only hourly readings up to the selected
    // location's current local time.
    for (let i = 0; i < times.length; i++) {
        const time = times[i];

        if (currentTime && time > currentTime) {
            continue;
        }

        const rawTemperature = temperatures[i];

        if (
            rawTemperature === null ||
            rawTemperature === undefined ||
            rawTemperature === ""
        ) {
            continue;
        }

        const temperature = Number(rawTemperature);

        if (Number.isFinite(temperature)) {
            validData.push({
                time,
                temperature
            });
        }
    }

    // Append the latest current reading, so the graph
    // can end at the current time rather than at the
    // last completed hour.
    if (
        currentTime &&
        currentTemperature !== null &&
        currentTemperature !== undefined &&
        Number.isFinite(Number(currentTemperature))
    ) {
        const latest = {
            time: currentTime,
            temperature: Number(currentTemperature)
        };

        const lastPoint = validData[validData.length - 1];

        if (!lastPoint || currentTime > lastPoint.time) {
            validData.push(latest);
        } else if (currentTime === lastPoint.time) {
            lastPoint.temperature = latest.temperature;
        }
    }

    if (validData.length === 0) {
        return;
    }



    // -------------------------------------------------
    // CHART SIZE
    // -------------------------------------------------

    const width = 900;

    const height = 180;


    const paddingLeft = 20;

    const paddingRight = 20;

    const paddingTop = 20;

    const paddingBottom = 35;


    // -------------------------------------------------
    // TEMPERATURE RANGE
    // -------------------------------------------------

    const values =
        validData.map(

            item =>
                item.temperature

        );


    const minTemp =
        Math.floor(

            Math.min(...values) - 1

        );


    const maxTemp =
        Math.ceil(

            Math.max(...values) + 1

        );


    const range =
        Math.max(

            maxTemp - minTemp,

            1

        );


    // -------------------------------------------------
    // CREATE POINTS
    // -------------------------------------------------

    const points =
        validData.map(

            (item, index) => {


                const x =

                    paddingLeft +

                    (

                        index /

                        Math.max(

                            validData.length - 1,

                            1

                        )

                    ) *

                    (

                        width -

                        paddingLeft -

                        paddingRight

                    );


                const y =

                    paddingTop +

                    (

                        (

                            maxTemp -

                            item.temperature

                        ) /

                        range

                    ) *

                    (

                        height -

                        paddingTop -

                        paddingBottom

                    );


                return {

                    x,

                    y,

                    temperature:
                        item.temperature,

                    time:
                        item.time

                };

            }

        );


    // -------------------------------------------------
    // SVG PATH
    // -------------------------------------------------

    const pathData =

        points

            .map(

                (point, index) =>

                    `${

                        index === 0

                            ? "M"

                            : "L"

                    } ${point.x} ${point.y}`

            )

            .join(" ");


    // -------------------------------------------------
    // TIME LABELS
    // -------------------------------------------------

    const firstTime =

        new Date(

            validData[0].time

        );


    const middleTime =

        new Date(

            validData[

                Math.floor(

                    validData.length / 2

                )

            ].time

        );


    const lastTime =

        new Date(

            validData[

                validData.length - 1

            ].time

        );


    const formatTime = (date) => {


        return date.toLocaleTimeString(

            [],

            {

                hour: "numeric",

                minute: "2-digit"

            }

        );

    };


    // -------------------------------------------------
    // BUILD CHART
    // -------------------------------------------------

    chart.innerHTML = `

        <svg

            viewBox="0 0 ${width} ${height}"

            width="100%"

            height="100%"

            preserveAspectRatio="none"

        >


            <!-- GRID -->


            <line

                x1="${paddingLeft}"

                y1="50"

                x2="${width - paddingRight}"

                y2="50"

                stroke="rgba(255,255,255,0.06)"

                stroke-width="1"

            />


            <line

                x1="${paddingLeft}"

                y1="90"

                x2="${width - paddingRight}"

                y2="90"

                stroke="rgba(255,255,255,0.06)"

                stroke-width="1"

            />


            <line

                x1="${paddingLeft}"

                y1="130"

                x2="${width - paddingRight}"

                y2="130"

                stroke="rgba(255,255,255,0.06)"

                stroke-width="1"

            />


            <!-- HEAT LINE -->


            <path

                d="${pathData}"

                fill="none"

                stroke="#ff7043"

                stroke-width="3"

                stroke-linecap="round"

                stroke-linejoin="round"

            />


            <!-- DATA POINTS -->


            ${points.map(point => `

                <circle

                    cx="${point.x}"

                    cy="${point.y}"

                    r="3.5"

                    fill="#ff7043"

                >

                    <title>

                        ${formatTime(

                            new Date(point.time)

                        )}

                        -

                        ${point.temperature.toFixed(1)}°C

                    </title>

                </circle>

            `).join("")}


            <!-- TIME LABELS -->


            <text

                x="${paddingLeft}"

                y="${height - 8}"

                fill="#7f8b96"

                font-size="11"

            >

                ${formatTime(firstTime)}

            </text>


            <text

                x="${width / 2}"

                y="${height - 8}"

                fill="#7f8b96"

                font-size="11"

                text-anchor="middle"

            >

                ${formatTime(middleTime)}

            </text>


            <text

                x="${width - paddingRight}"

                y="${height - 8}"

                fill="#7f8b96"

                font-size="11"

                text-anchor="end"

            >

                ${formatTime(lastTime)}

            </text>


        </svg>

    `;

}


/* =====================================================
   TREND MESSAGE
===================================================== */


function getTrendMessage(risk) {


    switch (risk) {


        case "EXTREME":

            return "Very high heat";


        case "HIGH":

            return "High heat";


        case "MODERATE":

            return "Moderate heat";


        case "LOW":

        default:

            return "Lower heat";

    }

}


/* =====================================================
   CURRENT LOCATION
===================================================== */


async function useCurrentLocation() {


    if (!navigator.geolocation) {


        alert(

            "Geolocation is not supported by this browser."

        );


        return;

    }


    locationText.textContent =
        "Finding location...";


    navigator.geolocation.getCurrentPosition(


        async (position) => {


            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            try {


                let locationName =
                    "Current Location";


                const response =
                    await fetch(

                        `${API_URL}/api/location?lat=${latitude}&lon=${longitude}`

                    );


                if (response.ok) {


                    const data =
                        await response.json();


                    if (data.name) {


                        locationName =
                            data.name;

                    }

                }


                locationText.textContent =
                    locationName;


                await selectLocation({

                    name:
                        locationName,

                    latitude,

                    longitude

                });


            }

            catch (error) {


                console.error(

                    "Current location error:",

                    error

                );


                locationText.textContent =
                    "Your Location";

            }

        },


        (error) => {


            console.error(

                "Geolocation error:",

                error

            );


            locationText.textContent =
                "Your Location";


            alert(

                "Unable to determine your current location. You can search for your city instead."

            );

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 300000

        }

    );

}


/* =====================================================
   LOAD SAVED LOCATION
===================================================== */


async function loadSavedLocation() {


    const saved =
        localStorage.getItem(

            "heatShieldSelectedLocation"

        );


    if (!saved) {

        return;

    }


    try {


        const location =
            JSON.parse(saved);


        if (

            !location ||

            !location.latitude ||

            !location.longitude

        ) {

            return;

        }


        searchInput.value =
            location.name || "";


        await selectLocation(
            location
        );


    }

    catch (error) {


        console.error(

            "Saved location error:",

            error

        );

    }

}


/* =====================================================
   PANEL CLOSE
===================================================== */


function closePanel() {


    panel.style.display =
        "none";

}


/* =====================================================
   DETAILED RISK PAGE
===================================================== */


function openDetailedRisk() {


    const saved =
        localStorage.getItem(

            "heatShieldSelectedLocation"

        );


    if (!saved) {


        alert(

            "Please select a location first."

        );


        return;

    }


    window.location.href =
        "risk.html";

}


/* =====================================================
   MOBILE MENU
===================================================== */


function setupMobileMenu() {


    if (!menuButton || !navLinks) {

        return;

    }


    menuButton.addEventListener(

        "click",

        () => {


            navLinks.classList.toggle(

                "open"

            );

        }

    );

}


/* =====================================================
   EVENT LISTENERS
===================================================== */


searchButton.addEventListener(

    "click",

    searchLocation

);


searchInput.addEventListener(

    "keydown",

    (event) => {


        if (

            event.key === "Enter"

        ) {


            searchLocation();

        }

    }

);


locationButton.addEventListener(

    "click",

    useCurrentLocation

);


panelClose.addEventListener(

    "click",

    closePanel

);


panelRiskButton.addEventListener(

    "click",

    openDetailedRisk

);


/* =====================================================
   START APPLICATION
===================================================== */


initializeMap();


setupMobileMenu();


loadSavedLocation();


/* Refresh the graph periodically so its endpoint
   follows the current time. */

setInterval(() => {
    try {
        const saved = localStorage.getItem(
            "heatShieldSelectedLocation"
        );

        if (!saved) {
            return;
        }

        const location = JSON.parse(saved);

        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);

        if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        ) {
            loadHourlyTrend(latitude, longitude);
        }

    } catch (error) {
        console.error(
            "Heat trend refresh error:",
            error
        );
    }
}, 5 * 60 * 1000);
