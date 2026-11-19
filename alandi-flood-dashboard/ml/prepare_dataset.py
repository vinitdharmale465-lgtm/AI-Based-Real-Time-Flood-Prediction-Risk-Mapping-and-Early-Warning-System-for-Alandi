
import pandas as pd

# Load historical hourly data
data = pd.read_csv(
    "../../backend/data/alandi_historical_hourly_clean.csv"
)

# Convert time
data["time_ist"] = pd.to_datetime(data["time_ist"])

# Sort data
data = data.sort_values("time_ist").copy()

# Create rainfall features
data["rainfall_3h"] = data["rain_mm"].rolling(3).sum()
data["rainfall_6h"] = data["rain_mm"].rolling(6).sum()
data["rainfall_24h"] = data["rain_mm"].rolling(24).sum()

# Remove incomplete rolling records
data = data.dropna().copy()

# Select ML input features
features = [
    "temperature_2m_c",
    "relative_humidity_2m_percent",
    "precipitation_mm",
    "rain_mm",
    "soil_moisture_0_to_7cm",
    "rainfall_3h",
    "rainfall_6h",
    "rainfall_24h"
]

# Create dataset
ml_data = data[features].copy()

# Save prepared dataset
ml_data.to_csv("prepared_dataset.csv", index=False)

print("Dataset preparation completed!")
print("Total records:", len(ml_data))
print("Total features:", len(features))
print("\nDataset preview:")
print(ml_data.head())
