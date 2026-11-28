
const API_URL = 'https://alandi-flood-backend.onrender.com/';

// =====================================
// 1. SUBMIT COMMUNITY REPORT
// =====================================

export async function submitReport(data) {
    const response = await fetch(`${API_URL}/reports`, {
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
    const response = await fetch(`${API_URL}/reports`);

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
        `${API_URL}/weather/history/hourly?limit=500`
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
        `${API_URL}/weather/history/daily?limit=500`
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
    const response = await fetch(`${API_URL}/weather/current`);

    if (!response.ok) {
        throw new Error("Failed to fetch current weather");
    }

    return response.json();
}


// =====================================
// 6. GET WEATHER FORECAST
// =====================================

export async function getWeatherForecast() {
    const response = await fetch(`${API_URL}/weather/forecast`);

    if (!response.ok) {
        throw new Error("Failed to fetch weather forecast");
    }

    return response.json();
}


// =====================================
// 7. GET HISTORICAL WEATHER
// =====================================

export async function getHistoricalWeather() {
    const response = await fetch(`${API_URL}/weather/historical`);

    if (!response.ok) {
        throw new Error("Failed to fetch historical weather");
    }

    return response.json();
}
