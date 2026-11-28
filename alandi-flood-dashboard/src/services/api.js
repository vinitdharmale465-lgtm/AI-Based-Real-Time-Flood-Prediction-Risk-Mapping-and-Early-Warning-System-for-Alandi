
const API_URL = (
    import.meta.env.VITE_API_URL ||
    'https://alandi-flood-backend.onrender.com'
).replace(/\/+$/, '');

const REPORTS_URL = `${API_URL}/api/reports`;
const WEATHER_URL = `${API_URL}/api/weather`;

// =====================================
// 1. SUBMIT COMMUNITY REPORT
// =====================================

export async function submitReport(data) {
    const response = await fetch(`${REPORTS_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to submit report");
    }

    return result;
}

// =====================================
// 2. GET COMMUNITY REPORTS
// =====================================

export async function getReports() {
    const response = await fetch(`${REPORTS_URL}`);

    if (!response.ok) {
        throw new Error("Failed to fetch reports");
    }

    return response.json();
}

// =====================================
// 3. GET HOURLY HISTORICAL RAINFALL
// =====================================

export async function getHourlyRainfall() {
    const response = await fetch(
        `${WEATHER_URL}/history/hourly?limit=500`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch hourly rainfall");
    }

    return response.json();
}

// =====================================
// 4. GET DAILY HISTORICAL RAINFALL
// =====================================

export async function getDailyRainfall() {
    const response = await fetch(
        `${WEATHER_URL}/history/daily?limit=500`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch daily rainfall");
    }

    return response.json();
}

// =====================================
// 5. GET CURRENT WEATHER
// =====================================

export async function getCurrentWeather() {
    const response = await fetch(`${WEATHER_URL}/current`);

    if (!response.ok) {
        throw new Error("Failed to fetch current weather");
    }

    return response.json();
}

// =====================================
// 6. GET WEATHER FORECAST
// =====================================

export async function getWeatherForecast() {
    const response = await fetch(`${WEATHER_URL}/forecast`);

    if (!response.ok) {
        throw new Error("Failed to fetch weather forecast");
    }

    return response.json();
}

// =====================================
// 7. GET HISTORICAL WEATHER
// =====================================

export async function getHistoricalWeather() {
    const response = await fetch(`${WEATHER_URL}/historical`);

    if (!response.ok) {
        throw new Error("Failed to fetch historical weather");
    }

    return response.json();
}
