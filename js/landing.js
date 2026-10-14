
/* ========================================
   HEATSHIELD HOME - LANDING PAGE LOGIC
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000";

    const elements = {
        menuButton: document.getElementById("menuButton"),
        navLinks: document.getElementById("navLinks"),
        location: document.getElementById("homeLocation"),
        feelsLike: document.getElementById("homeFeelsLike"),
        temperature: document.getElementById("homeTemperature"),
        humidity: document.getElementById("homeHumidity"),
        uv: document.getElementById("homeUV"),
        wind: document.getElementById("homeWind"),
        riskBadge: document.getElementById("homeRiskBadge"),
        riskMessage: document.getElementById("homeRiskMessage"),
        updated: document.getElementById("homeUpdated"),
        connectionDot: document.getElementById("connectionDot")
    };

    // MOBILE NAVIGATION
    if (elements.menuButton && elements.navLinks) {
        elements.menuButton.addEventListener("click", () => {
            const isOpen = elements.navLinks.classList.toggle("open");

            elements.menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            elements.menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            elements.menuButton.textContent = isOpen ? "✕" : "☰";
        });

        elements.navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                elements.navLinks.classList.remove("open");
                elements.menuButton.setAttribute("aria-expanded", "false");
                elements.menuButton.setAttribute("aria-label", "Open navigation");
                elements.menuButton.textContent = "☰";
            });
        });
    }

    // READ THE LOCATION SELECTED ON HEAT MAP
    function getSavedLocation() {
        const storageKeys = [
            "heatShieldSelectedLocation",
            "heatShieldLocation"
        ];

        for (const key of storageKeys) {
            try {
                const raw = localStorage.getItem(key);

                if (!raw) continue;

                const location = JSON.parse(raw);

                const latitude = Number(
                    location.latitude ?? location.lat
                );

                const longitude = Number(
                    location.longitude ??
                    location.lon ??
                    location.lng
                );

                if (
                    Number.isFinite(latitude) &&
                    Number.isFinite(longitude) &&
                    latitude >= -90 &&
                    latitude <= 90 &&
                    longitude >= -180 &&
                    longitude <= 180
                ) {
                    return {
                        latitude,
                        longitude,
                        name:
                            location.name ||
                            location.locationName ||
                            location.city ||
                            "Selected location"
                    };
                }
            } catch (error) {
                console.warn("Could not read saved location:", error);
            }
        }

        return null;
    }

    function formatValue(value, decimals = 1) {
        if (value === null || value === undefined || value === "") {
            return "--";
        }

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "--";
        }

        return number.toFixed(decimals).replace(/\.0$/, "");
    }

    // MATCHES THE HEATSHIELD BACKEND THRESHOLDS
    function determineRisk(data) {
        if (data.riskLevel) {
            return String(data.riskLevel).toUpperCase();
        }

        const feelsLike = Number(data.feelsLike);

        if (!Number.isFinite(feelsLike)) return "UNKNOWN";
        if (feelsLike >= 45) return "EXTREME";
        if (feelsLike >= 40) return "HIGH";
        if (feelsLike >= 35) return "MODERATE";

        return "LOW";
    }

    function getRiskMessage(level, feelsLike) {
        const messages = {
            LOW:
                "Conditions are below this prototype's heat-risk thresholds. " +
                "Continue sensible precautions during outdoor activities.",

            MODERATE:
                "Heat may cause discomfort during prolonged exposure. " +
                "Drink water, take breaks and seek shade.",

            HIGH:
                "Hot conditions may increase the risk of heat-related illness. " +
                "Reduce strenuous outdoor activity and take regular breaks.",

            EXTREME:
                "Very hot conditions may pose a serious risk. Avoid strenuous " +
                "outdoor activity and move to a cooler place when possible.",

            UNKNOWN:
                "The available data was insufficient to determine the heat-risk level."
        };

        if (!Number.isFinite(Number(feelsLike))) {
            return messages.UNKNOWN;
        }

        return messages[level] || messages.UNKNOWN;
    }

    function updateRiskBadge(level) {
        const badge = elements.riskBadge;

        badge.textContent = level === "UNKNOWN"
            ? "Unavailable"
            : `${level} RISK`;

        badge.className = "risk-badge";

        if (["LOW", "MODERATE", "HIGH", "EXTREME"].includes(level)) {
            badge.classList.add(level.toLowerCase());
        }
    }

    function showConnectionStatus(connected) {
        elements.connectionDot.classList.toggle("offline", !connected);
    }

    function showLoading() {
        elements.location.textContent = "Loading location…";
        elements.feelsLike.textContent = "--";
        elements.temperature.textContent = "--";
        elements.humidity.textContent = "--";
        elements.uv.textContent = "--";
        elements.wind.textContent = "--";
        elements.riskBadge.textContent = "Loading…";
        elements.riskBadge.className = "risk-badge";
        elements.riskMessage.textContent = "Fetching the latest available conditions…";
        elements.updated.textContent = "Connecting to backend";
        showConnectionStatus(false);
    }

    function showNoLocation() {
        elements.location.textContent = "No location selected";
        elements.feelsLike.textContent = "--";
        elements.temperature.textContent = "--";
        elements.humidity.textContent = "--";
        elements.uv.textContent = "--";
        elements.wind.textContent = "--";
        elements.riskBadge.textContent = "Awaiting data";
        elements.riskBadge.className = "risk-badge";
        elements.riskMessage.textContent =
            "Select an area on Heat Map to view its weather and heat-risk summary.";
        elements.updated.textContent = "No location selected";
        showConnectionStatus(false);
    }

    function showError() {
        elements.feelsLike.textContent = "--";
        elements.temperature.textContent = "--";
        elements.humidity.textContent = "--";
        elements.uv.textContent = "--";
        elements.wind.textContent = "--";
        elements.riskBadge.textContent = "Unavailable";
        elements.riskBadge.className = "risk-badge";
        elements.riskMessage.textContent =
            "Weather data could not be loaded. Check that your backend is running on port 5000.";
        elements.updated.textContent = "Unable to connect";
        showConnectionStatus(false);
    }

    function renderWeather(data, savedLocation) {
        const locationName =
            data.locationName ||
            (typeof data.location === "string" ? data.location : null) ||
            data.name ||
            savedLocation.name;

        const feelsLike = data.feelsLike;
        const level = determineRisk(data);

        elements.location.textContent = locationName;
        elements.feelsLike.textContent = formatValue(feelsLike);
        elements.temperature.textContent = formatValue(data.temperature);
        elements.humidity.textContent = formatValue(data.humidity);
        elements.uv.textContent = formatValue(data.uvIndex);

        elements.wind.textContent = formatValue(
            data.windSpeed ?? data.wind_speed_10m
        );

        updateRiskBadge(level);

        elements.riskMessage.textContent =
            getRiskMessage(level, feelsLike);

        elements.updated.textContent =
            "Updated at " + new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        showConnectionStatus(true);
    }

    async function loadHomeWeather() {
        const savedLocation = getSavedLocation();

        if (!savedLocation) {
            showNoLocation();
            return;
        }

        showLoading();

        const url = new URL(`${API_URL}/api/risk`);
        url.searchParams.set("lat", savedLocation.latitude);
        url.searchParams.set("lon", savedLocation.longitude);

        try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            renderWeather(data, savedLocation);
        } catch (error) {
            console.error("Home weather request failed:", error);
            showError();
        }
    }

    loadHomeWeather();
});
