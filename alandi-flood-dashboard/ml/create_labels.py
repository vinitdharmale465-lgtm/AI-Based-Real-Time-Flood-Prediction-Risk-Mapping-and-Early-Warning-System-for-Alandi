
import pandas as pd

# Load prepared dataset
data = pd.read_csv("prepared_dataset.csv")

# Create provisional rainfall risk labels
def classify_risk(row):

    if (
        row["rainfall_3h"] >= 6.6
        or row["rainfall_6h"] >= 11.7
        or row["rainfall_24h"] >= 38.512
    ):
        return "High"

    elif (
        row["rainfall_3h"] >= 1.6
        or row["rainfall_6h"] >= 3.5
        or row["rainfall_24h"] >= 13.6
    ):
        return "Medium"

    else:
        return "Low"


# Generate labels
data["risk_level"] = data.apply(classify_risk, axis=1)

# Save labeled dataset
data.to_csv("labeled_dataset.csv", index=False)

# Display category counts
print("Risk Category Distribution:")
print(data["risk_level"].value_counts())

print("\nLabeled dataset created successfully!")
