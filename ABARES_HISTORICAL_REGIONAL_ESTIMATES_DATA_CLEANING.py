## DATA CLEANING - ABARES_HISTORICAL_REGIONAL_ESTIMATES

# Import libraries
import pandas as pd

# Import dataset
df = pd.read_csv('ABARES_HISTORICAL_REGIONAL_ESTIMATES.csv')

# Rename columns
df_clean = df.rename(columns={'Variable': 'variable', 'Year': 'year', 'ABARES region': 'abares_region', 'Value': 'value', 'RSE': 'rse'})

# Remove duplicates
df_clean = df_clean.drop_duplicates()

# Remove rows with null in Value column
df_clean = df_clean.dropna()

# Set data types
df_clean = df_clean.astype({'variable': str, 'year': int, 'abares_region': str, 'value': float, 'rse': float})

# Export cleaned data to csv
df_clean.to_csv('ABARES_HISTORICAL_REGIONAL_ESTIMATES_CLEAN.csv', index = False)
