## DATA CLEANING - G-NAF QLD only

# To obtain a complete address for our address search feature on the website we need the details from the below tables:
# 1. Locality/Subrub (not null) from QLD_LOCALITY table
# 2. Street name (not null) and street type code (null ok) from QLD_STREET_LOCALITY
# 3. Longitude and latitude (not null) from QLD_ADDRESS_SITE_GEOCODE
# 4. Address details from QLD_ADDRESS_DETAIL

# Import libraries
import pandas as pd

## QLD_LOCALITY CLEANING

# Import dataset
df_locality = pd.read_csv('G-NAF_AUSTRALIAN_ADDRESS_DATA\G-NAF\G-NAF MAY 2025\Standard\QLD_LOCALITY_psv.psv', sep='|')

# Lowercase column names
df_locality_clean = df_locality
df_locality_clean.columns = df_locality_clean.columns.str.lower()

# Remove duplicates
df_locality_clean = df_locality_clean.drop_duplicates()

# Remove rows with null primary key values (locality_pid)
df_locality_clean = df_locality_clean.dropna(subset=['locality_pid'])

# Select only required columns for address details
df_locality_clean = df_locality_clean[['locality_pid', 'date_created','date_retired','locality_name']]

# Set data types
df_locality_clean['date_created'] = df_locality_clean['date_created'].astype('datetime64[ns]')
df_locality_clean['date_retired'] = df_locality_clean['date_retired'].astype('datetime64[ns]')
df_locality_clean = df_locality_clean.astype({'locality_pid': str, 'locality_name': str})

# Export cleaned data to csv
df_locality_clean.to_csv('QLD_LOCALITY_CLEAN.csv', index = False)

## ---------------------------------------------------------------------------------------------------------------

## QLD_STREET_LOCALITY CLEANING

# Import dataset
df_street = pd.read_csv('G-NAF_AUSTRALIAN_ADDRESS_DATA\G-NAF\G-NAF MAY 2025\Standard\QLD_STREET_LOCALITY_psv.psv', sep='|')

# Lowercase column names
df_street_clean = df_street
df_street_clean.columns = df_street_clean.columns.str.lower()

# Remove duplicates
df_street_clean = df_street_clean.drop_duplicates()

# Remove rows with null primary key values (street_locality_pid)
df_street_clean = df_street_clean.dropna(subset=['street_locality_pid'])

# Remove rows with null foreign key values (locality_pid)
df_street_clean = df_street_clean.dropna(subset=['locality_pid'])

# Select only required columns for address details
df_street_clean = df_street_clean[['street_locality_pid', 'date_created','date_retired','street_name','street_type_code','locality_pid']]

# Set data types
df_street_clean['date_created'] = df_street_clean['date_created'].astype('datetime64[ns]')
df_street_clean['date_retired'] = df_street_clean['date_retired'].astype('datetime64[ns]')
df_street_clean = df_street_clean.astype({'street_locality_pid': str, 'street_name': str, 'street_type_code': str})

# Export cleaned data to csv
df_street_clean.to_csv('QLD_STREET_LOCALITY_CLEAN.csv', index = False)

## ---------------------------------------------------------------------------------------------------------------

## QLD_ADDRESS_SITE_GEOCODE CLEANING

# Import dataset
df_geocode = pd.read_csv('G-NAF_AUSTRALIAN_ADDRESS_DATA\G-NAF\G-NAF MAY 2025\Standard\QLD_ADDRESS_SITE_GEOCODE_psv.psv', sep='|')

# Lowercase column names
df_geocode_clean = df_geocode
df_geocode_clean.columns = df_geocode_clean.columns.str.lower()

# Remove duplicates
df_geocode_clean = df_geocode_clean.drop_duplicates()

# Remove rows with null primary key values (address_site_geocode_pid)
df_geocode_clean = df_geocode_clean.dropna(subset=['address_site_geocode_pid'])

# Remove rows with null foreign key values (address_site_pid)
df_geocode_clean = df_geocode_clean.dropna(subset=['address_site_pid'])

# Select only required columns for address details
df_geocode_clean = df_geocode_clean[['address_site_geocode_pid', 'date_created','date_retired','address_site_pid','latitude','longitude']]

# Set data types
df_geocode_clean['date_created'] = df_geocode_clean['date_created'].astype('datetime64[ns]')
df_geocode_clean['date_retired'] = df_geocode_clean['date_retired'].astype('datetime64[ns]')
df_geocode_clean = df_geocode_clean.astype({'address_site_geocode_pid': str, 'address_site_pid': str, 'latitude': float, 'longitude': float})

# Export cleaned data to csv
df_geocode_clean.to_csv('QLD_ADDRESS_SITE_GEOCODE_CLEAN.csv', index = False)

## ---------------------------------------------------------------------------------------------------------------

## QLD_ADDRESS_DETAIL CLEANING

# Import dataset
df_detail = pd.read_csv('G-NAF_AUSTRALIAN_ADDRESS_DATA\G-NAF\G-NAF MAY 2025\Standard\QLD_ADDRESS_DETAIL_psv.psv', sep='|')

# Lowercase column names
df_detail_clean = df_detail
df_detail_clean.columns = df_detail_clean.columns.str.lower()

# Remove duplicates
df_detail_clean = df_detail_clean.drop_duplicates()

# Remove rows with null primary key values (address_detail_pid)
df_detail_clean = df_detail_clean.dropna(subset=['address_detail_pid'])

# Remove rows with null foreign key values (address_site_pid, street_locality_pid, locality_pid)
df_detail_clean = df_detail_clean.dropna(subset=['address_site_pid','street_locality_pid','locality_pid'])

# Drop columns not required for address details
df_detail_clean = df_detail_clean.drop(['location_description', 'alias_principal','private_street','legal_parcel_id','confidence','level_geocoded_code','property_pid','gnaf_property_pid','primary_secondary'], axis=1)

# Set data types for dates
df_detail_clean['date_created'] = df_detail_clean['date_created'].astype('datetime64[ns]')
df_detail_clean['date_last_modified'] = df_detail_clean['date_last_modified'].astype('datetime64[ns]')
df_detail_clean['date_retired'] = df_detail_clean['date_retired'].astype('datetime64[ns]')

# Export cleaned data to csv
df_detail_clean.to_csv('QLD_ADDRESS_SITE_GEOCODE_CLEAN.csv', index = False)