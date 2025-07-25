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
df_locality_clean = df_locality_clean[['locality_pid','locality_name']]

# Set data types
df_locality_clean = df_locality_clean.astype({'locality_pid': str, 'locality_name': str})

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

# Select only required columns for address details
df_street_clean = df_street_clean[['street_locality_pid','street_name','street_type_code']]

# Set data types
df_street_clean = df_street_clean.astype({'street_locality_pid': str, 'street_name': str, 'street_type_code': str})

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
df_geocode_clean = df_geocode_clean[['address_site_geocode_pid','address_site_pid','latitude','longitude']]

# Set data types
df_geocode_clean = df_geocode_clean.astype({'address_site_geocode_pid': str, 'address_site_pid': str, 'latitude': float, 'longitude': float})

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

# Only keep rows with data relating to Far North Queensland area
fnq_postcode_list = ('4680', '4814', '4823', '4825', '4830', '4852', '4854', '4855', '4856', '4857', '4858', '4859', '4860','4865', '4868', '4869', '4870', '4871', '4872', '4873', '4874', '4875', '4876', '4877', '4878', '4879','4880', '4881', '4882', '4883', '4884', '4885', '4886', '4887', '4888', '4890', '4891', '4892', '4895')
df_detail_clean = df_detail_clean[df_detail_clean['postcode'].isin(fnq_postcode_list)]

# Drop columns not required for address details
df_detail_clean = df_detail_clean.drop(['date_created','date_last_modified','date_retired','location_description', 'alias_principal','private_street','legal_parcel_id','confidence','level_geocoded_code','property_pid','gnaf_property_pid','primary_secondary'], axis=1)

# Set data types
df_detail_clean = df_detail_clean.astype({'address_site_pid': str, 'locality_pid': str, 'street_locality_pid': str})

# We now need to join all 4 tables together
# We can join each table to the df_detail_clean table

# Join df_locality_clean on locality_pid
df_merge = pd.merge(df_detail_clean, df_locality_clean, on='locality_pid', how='inner') 

# Join df_street_clean on street_locality_pid
df_merge = pd.merge(df_merge, df_street_clean, on='street_locality_pid', how='inner') 

# Join df_geocode_clean on address_site_pid
df_merge = pd.merge(df_merge, df_geocode_clean, on='address_site_pid', how='inner') 

# Drop foreign key columns not required for address details
df_merge = df_merge.drop(['locality_pid','street_locality_pid', 'address_site_pid'], axis=1)

# Export cleaned data to csv
df_merge.to_csv('QLD_ADDRESS_DETAIL_CLEAN.csv', index = False)

## INSERT TO MONGODB

from pymongo import MongoClient

# Define database username, password and connection string
db_username = ''
db_password = ''
connect_str = 'mongodb+srv://' + db_username + ':' + db_password + '@buyinggood.jxdin83.mongodb.net/'

# MongoDB connection
client = MongoClient(connect_str)
db = client['analytics']
collection = db['national_address_file']

# Delete all documents in the collection
delete = collection.delete_many({})

# Loop through 50k rows to avoid timeout error
rows = 50000
i = 0
j = 0

while j < len(df_merge):
    # Define j row
    j = min(i + rows, len(df_merge))
    
    # Select only rows from i to j
    df = df_merge.iloc[i:j]

    # Insert updated documents to collection
    collection.insert_many(df.to_dict('records'))
    
    # Update i 
    i = i + rows
