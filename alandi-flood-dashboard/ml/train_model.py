
import pandas as pd

# Load dataset
data = pd.read_csv(
    "../../backend/data/alandi_historical_hourly_clean.csv"
)

# Convert time into datetime
data["time_ist"] = pd.to_datetime(data["time_ist"])

# Sort data by time
data = data.sort_values("time_ist")

# Create rainfall features
data["rainfall_3h"] = (
    data["rain_mm"].rolling(3).sum()
)

data["rainfall_6h"] = (
    data["rain_mm"].rolling(6).sum()
)

data["rainfall_24h"] = (
    data["rain_mm"].rolling(24).sum()
)

# Remove rows with missing rolling values
data = data.dropna().copy()

# Display result
print(data[[
    "time_ist",
    "rain_mm",
    "rainfall_3h",
    "rainfall_6h",
    "rainfall_24h"
]].head())

print("\nTotal records:", len(data))
print("\nFeature creation completed!")

# Rainfall statistics
print("\nRainfall Statistics:")

print(data[[
    "rain_mm",
    "rainfall_3h",
    "rainfall_6h",
    "rainfall_24h"
]].describe())

# Maximum rainfall values
print("\nMaximum 3-hour rainfall:",
      data["rainfall_3h"].max())

print("Maximum 6-hour rainfall:",
      data["rainfall_6h"].max())

print("Maximum 24-hour rainfall:",
      data["rainfall_24h"].max())

# Calculate rainfall percentiles

print("\nRainfall Percentiles:")

for column in [
    "rainfall_3h",
    "rainfall_6h",
    "rainfall_24h"
]:
    print("\n", column)

    print("90th Percentile:",
          data[column].quantile(0.90))

    print("95th Percentile:",
          data[column].quantile(0.95))

    print("99th Percentile:",
          data[column].quantile(0.99))

