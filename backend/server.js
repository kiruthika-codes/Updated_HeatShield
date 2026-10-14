
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.json({
        message: "HeatShield backend is running!"
    });
});

// =====================================================
// TEST
// =====================================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "HeatShield API is working!"
    });
});

// =====================================================
// SHARED WEATHER PARAMETERS
// =====================================================

const CURRENT_WEATHER_FIELDS =
    "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index";

// =====================================================
// WEATHER API
// GET /api/weather?lat=12.925&lon=79.333
// =====================================================

app.get("/api/weather", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (lat === undefined || lon === undefined ||
            lat === "" || lon === "") {
            return res.status(400).json({
                error: "Latitude and longitude are required"
            });
        }

        const response = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: CURRENT_WEATHER_FIELDS,
                    timezone: "auto"
                }
            }
        );

        const current = response.data.current;

        console.log("Weather data:", current);

        res.json({
            location: {
                latitude: Number(lat),
                longitude: Number(lon)
            },

            // Time of the latest current-weather data
            observationTime: current.time,
            timezone: response.data.timezone,

            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            feelsLike: current.apparent_temperature,
            windSpeed: current.wind_speed_10m,

            // Preserve existing frontend field names
            wind_speed_10m: current.wind_speed_10m,
            uvIndex: current.uv_index
        });

    } catch (error) {
        console.error("Weather API error:", error.message);

        res.status(500).json({
            error: "Unable to fetch weather data"
        });
    }
});

// =====================================================
// RISK API
// GET /api/risk?lat=12.925&lon=79.333
// =====================================================

app.get("/api/risk", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (lat === undefined || lon === undefined ||
            lat === "" || lon === "") {
            return res.status(400).json({
                error: "Latitude and longitude are required"
            });
        }

        const response = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: CURRENT_WEATHER_FIELDS,
                    timezone: "auto"
                }
            }
        );

        const current = response.data.current;

        const temperature = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const feelsLike = current.apparent_temperature;
        const windSpeed = current.wind_speed_10m;
        const uvIndex = current.uv_index;

        // =============================================
        // EXISTING HEAT RISK CALCULATION
        // =============================================

        let riskLevel;

        if (feelsLike >= 45) {
            riskLevel = "EXTREME";
        } else if (feelsLike >= 40) {
            riskLevel = "HIGH";
        } else if (feelsLike >= 35) {
            riskLevel = "MODERATE";
        } else {
            riskLevel = "LOW";
        }

        console.log("Risk data:", {
            temperature,
            humidity,
            feelsLike,
            windSpeed,
            uvIndex,
            riskLevel,
            observationTime: current.time,
            timezone: response.data.timezone
        });

        res.json({
            location: {
                latitude: Number(lat),
                longitude: Number(lon)
            },

            // New fields for checking data freshness
            observationTime: current.time,
            timezone: response.data.timezone,

            // Existing fields retained for your frontend
            temperature,
            humidity,
            feelsLike,
            windSpeed,
            wind_speed_10m: windSpeed,
            uvIndex,
            riskLevel
        });

    } catch (error) {
        console.error("Risk API error:", error.message);

        res.status(500).json({
            error: "Unable to calculate heat risk"
        });
    }
});

// =====================================================
// REVERSE LOCATION API
// GET /api/location?lat=12.925&lon=79.333
// =====================================================

app.get("/api/location", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (lat === undefined || lon === undefined ||
            lat === "" || lon === "") {
            return res.status(400).json({
                error: "Latitude and longitude are required"
            });
        }

        const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params: {
                    lat,
                    lon,
                    format: "json",
                    zoom: 10,
                    addressdetails: 1
                },
                headers: {
                    "User-Agent": "HeatShield/1.0"
                }
            }
        );

        const address = response.data.address || {};

        const city =
            address.city ||
            address.town ||
            address.municipality ||
            address.county ||
            address.village ||
            "Unknown location";

        const state = address.state || "";

        const locationName = state
            ? `${city}, ${state}`
            : city;

        console.log("Reverse location:", {
            latitude: lat,
            longitude: lon,
            locationName
        });

        res.json({
            city,
            state,
            locationName
        });

    } catch (error) {
        console.error("Location API error:", error.message);

        res.status(500).json({
            error: "Unable to find location"
        });
    }
});

// =====================================================
// SEARCH LOCATION
// GET /api/search-location?city=Ranipet
// =====================================================

app.get("/api/search-location", async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                error: "City or district is required"
            });
        }

        const response = await axios.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            {
                params: {
                    name: city,
                    count: 5,
                    language: "en",
                    format: "json"
                }
            }
        );

        if (!response.data.results ||
            response.data.results.length === 0) {
            return res.status(404).json({
                error: "Location not found"
            });
        }

        const results = response.data.results.map(place => ({
            name: place.name,
            state: place.admin1 || "",
            country: place.country || "",
            latitude: place.latitude,
            longitude: place.longitude
        }));

        res.json({ results });

    } catch (error) {
        console.error("Location search error:", error.message);

        res.status(500).json({
            error: "Unable to search location"
        });
    }
});

// =====================================================
// HOURLY WEATHER API
// GET /api/hourly?lat=12.925&lon=79.333
// =====================================================

app.get("/api/hourly", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (lat === undefined || lon === undefined ||
            lat === "" || lon === "") {
            return res.status(400).json({
                error: "Latitude and longitude are required"
            });
        }

        const response = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: lat,
                    longitude: lon,

                    current: "temperature_2m,apparent_temperature",

                    hourly:
                        "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index",

                    forecast_days: 1,
                    timezone: "auto"
                }
            }
        );

        res.json({
            location: {
                latitude: Number(lat),
                longitude: Number(lon)
            },

            timezone: response.data.timezone,
            current: response.data.current,
            hourly: response.data.hourly
        });

    } catch (error) {
        console.error("Hourly weather API error:", error.message);

        res.status(500).json({
            error: "Unable to fetch hourly weather data"
        });
    }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(
        `HeatShield backend running at http://localhost:${PORT}`
    );
});
