
import sys
import json
import joblib
import pandas as pd

model = joblib.load("flood_risk_model.pkl")
encoder = joblib.load("risk_encoder.pkl")

try:
    input_data = json.load(sys.stdin)

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

    data = pd.DataFrame([input_data], columns=features)

    prediction = model.predict(data)
    risk = encoder.inverse_transform(prediction)

    print(json.dumps({
        "success": True,
        "predicted_risk": risk[0]
    }))

except Exception as e:
    print(json.dumps({
        "success": False,
        "error": str(e)
    }))
