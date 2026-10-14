
// ========================================
// HEATSHIELD - HEAT RISK REPORT
// Reads the selected Heat Map location
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000";

    const emptyState = document.getElementById("emptyState");
    const riskReport = document.getElementById("riskReport");
    const loadError = document.getElementById("loadError");
    const updatedTime = document.getElementById("updatedTime");
    const dataSource = document.getElementById("dataSource");

    // Mobile navigation
    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");
                menuButton.textContent = "☰";
            });
        });
    }

    // Get the location selected on Heat Map.
    // Fall back to the older location key if it exists.
    function getSavedLocation() {
        const possibleKeys = [
            "heatShieldSelectedLocation",
            "heatShieldLocation"
        ];

        for (const key of possibleKeys) {
            try {
                const rawValue = localStorage.getItem(key);

                if (!rawValue) continue;

                const location = JSON.parse(rawValue);

                const latitude = Number(
                    location.latitude ?? location.lat
                );

                const longitude = Number(
                    location.longitude ?? location.lon ?? location.lng
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

    function showError(message) {
        emptyState.hidden = true;
        riskReport.hidden = true;
        loadError.hidden = false;
        loadError.textContent = message;
    }

    function showNoLocation() {
        emptyState.hidden = false;
        riskReport.hidden = true;
        loadError.hidden = true;
        updatedTime.textContent = "No location selected";
        dataSource.textContent = "Choose an area on Heat Map";
    }

    function displayValue(value, digits = 1) {
        const number = Number(value);

        if (value === null || value === undefined || value === "" ||
            !Number.isFinite(number)) {
            return "--";
        }

        return number.toFixed(digits).replace(/\.0$/, "");
    }

    function getRiskLevel(data) {
        // Prefer the risk level calculated by the backend.
        if (data.riskLevel) {
            return String(data.riskLevel).toUpperCase();
        }

        // Fallback thresholds match the existing prototype.
        const feelsLike = Number(data.feelsLike);

        if (!Number.isFinite(feelsLike)) return "UNKNOWN";
        if (feelsLike >= 45) return "EXTREME";
        if (feelsLike >= 40) return "HIGH";
        if (feelsLike >= 35) return "MODERATE";

        return "LOW";
    }

    function getRiskMessage(level, feelsLike) {
        switch (level) {
            case "EXTREME":
                return `The reported feels-like temperature is ${feelsLike}°C. Avoid strenuous outdoor activity and move to a cooler place when possible.`;
            case "HIGH":
                return `The reported feels-like temperature is ${feelsLike}°C. Limit prolonged outdoor exposure, take breaks and drink water regularly.`;
            case "MODERATE":
                return `The reported feels-like temperature is ${feelsLike}°C. Stay hydrated, seek shade and pay attention to signs of overheating.`;
            case "LOW":
                return `The reported feels-like temperature is ${feelsLike}°C. Continue sensible heat precautions, especially during prolonged outdoor activity.`;
            default:
                return "The risk level could not be determined from the available temperature data. Please check official local weather guidance.";
        }
    }

    function updateRiskDisplay(level) {
        const badge = document.getElementById("riskBadge");
        const levelText = document.getElementById("riskLevel");
        const marker = document.getElementById("scaleMarker");

        const styles = {
            LOW: {
                color: "#56c69a",
                background: "rgba(86, 198, 154, 0.10)",
                border: "rgba(86, 198, 154, 0.35)",
                position: "12.5%"
            },
            MODERATE: {
                color: "#eac65e",
                background: "rgba(234, 198, 94, 0.10)",
                border: "rgba(234, 198, 94, 0.35)",
                position: "37.5%"
            },
            HIGH: {
                color: "#f29a48",
                background: "rgba(242, 154, 72, 0.10)",
                border: "rgba(242, 154, 72, 0.35)",
                position: "62.5%"
            },
            EXTREME: {
                color: "#f16f58",
                background: "rgba(241, 111, 88, 0.10)",
                border: "rgba(241, 111, 88, 0.35)",
                position: "87.5%"
            }
        };

        const style = styles[level] || {
            color: "#aeb8c2",
            background: "rgba(174, 184, 194, 0.08)",
            border: "rgba(174, 184, 194, 0.3)",
            position: "50%"
        };

        levelText.textContent = level;
        badge.style.color = style.color;
        badge.style.background = style.background;
        badge.style.borderColor = style.border;
        marker.style.left = style.position;
        marker.style.background = style.color;
        marker.style.boxShadow = `0 0 0 4px ${style.background}`;
    }

    function renderReport(data, savedLocation) {
        const locationName =
            data.locationName ||
            (typeof data.location === "string" ? data.location : null) ||
            data.name ||
            savedLocation.name ||
            "Selected location";

        const temperature = data.temperature;
        const humidity = data.humidity;
        const uvIndex = data.uvIndex;
        const windSpeed = data.windSpeed ?? data.wind_speed_10m;
        const feelsLike = data.feelsLike;

        document.getElementById("locationName").textContent = locationName;
        document.getElementById("temperature").textContent =
            displayValue(temperature);
        document.getElementById("humidity").textContent =
            displayValue(humidity);
        document.getElementById("uvIndex").textContent =
            displayValue(uvIndex);
        document.getElementById("wind").textContent =
            displayValue(windSpeed);
        document.getElementById("feelsLike").textContent =
            displayValue(feelsLike);

        const level = getRiskLevel(data);

        updateRiskDisplay(level);

        document.getElementById("riskMessage").textContent =
            Number.isFinite(Number(feelsLike))
                ? getRiskMessage(level, displayValue(feelsLike))
                : "The backend did not return a valid feels-like temperature. Please try again.";

        updatedTime.textContent = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        dataSource.textContent = "Data returned by HeatShield backend";

        emptyState.hidden = true;
        loadError.hidden = true;
        riskReport.hidden = false;
    }

    async function loadRiskReport() {
        const savedLocation = getSavedLocation();

        if (!savedLocation) {
            showNoLocation();
            return;
        }

        emptyState.hidden = true;
        riskReport.hidden = true;
        loadError.hidden = false;
        loadError.textContent = "Loading the latest heat risk data…";

        const url = new URL(`${API_URL}/api/risk`);
        url.searchParams.set("lat", savedLocation.latitude);
        url.searchParams.set("lon", savedLocation.longitude);

        try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            renderReport(data, savedLocation);
        } catch (error) {
            console.error("Heat risk loading failed:", error);

            showError(
                "Could not load heat risk data. Check that your HeatShield " +
                "backend is running on port 5000, then refresh this page. " +
                "If it still fails, check the backend terminal for errors."
            );
        }
    }

    loadRiskReport();
});
