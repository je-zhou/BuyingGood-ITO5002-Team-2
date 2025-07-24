## DATA CLEANING - ABARES_HISTORICAL_REGIONAL_ESTIMATES

# We want to isolate the total freight costs per area for this dataset

# Import libraries
import pandas as pd

# Import dataset
df = pd.read_csv('ABARES_HISTORICAL_REGIONAL_ESTIMATES.csv')

# Rename columns
df_clean = df.rename(columns={'Variable': 'item', 'Year': 'year', 'ABARES region': 'abares_region', 'Value': 'cost', 'RSE': 'rse'})

# Remove duplicates
df_clean = df_clean.drop_duplicates()

# Remove rows with null in Value column
df_clean = df_clean.dropna()

# Set data types
df_clean = df_clean.astype({'year': int, 'abares_region': str, 'cost': float})

# Filter by only 'Total freight ($)'
df_clean = df_clean[df_clean['item']=='Total freight ($)']

# Select only required columns
df_clean = df_clean[['abares_region','year','cost']]

# Export cleaned data to csv
df_clean.to_csv('ABARES_HISTORICAL_REGIONAL_ESTIMATES_CLEAN.csv', index = False)
