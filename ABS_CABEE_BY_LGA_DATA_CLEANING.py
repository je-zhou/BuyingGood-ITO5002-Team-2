## DATA CLEANING - ABS_CABEE_BY_LGA

# Import libraries
import pandas as pd

# Import Table 1,3 and 5 sheet from excel document
# Each table represents a different year of data
xlsx = pd.ExcelFile('ABS_CABEE_BY_LGA.xlsx')
df_1 = pd.read_excel(xlsx, 'Table 1') # Jun24
df_2 = pd.read_excel(xlsx, 'Table 3') # Jun23
df_3 = pd.read_excel(xlsx, 'Table 5') # Jun22

# Create empty dataframe to append both fruit and vegetable data together
df_comb = pd.DataFrame()

# Loop through df_1, df_2 and then df_3 and perform same cleaning process

for df in (df_1,df_2,df_3):
    # Define header as row 5 and remove top 6 rows
    header = df.iloc[4] 
    df_clean = df.iloc[6:] 
    df_clean.columns = header

    # Rename columns
    df_clean.columns = ['state','lga_code','lga_label','industry_code','industry_label','non_employing','1_4_employees','5_19_employees','20_199_employees','200_plus_employees','total']

    # Remove duplicates
    df_clean = df_clean.drop_duplicates()

    # Remove rows with null in Value column
    df_clean = df_clean.dropna()

    # Set data types
    df_clean = df_clean.astype({'state':str,'lga_code':int,'lga_label':str,'industry_code':str,'industry_label':str,'non_employing':int,'1_4_employees':int,'5_19_employees':int,'20_199_employees':int,'200_plus_employees':int,'total':int})

    # Add row to label date
    if df.equals(df_1):
        df_clean['date'] = pd.to_datetime('2024-06-30')
    elif df.equals(df_2):
        df_clean['date'] = pd.to_datetime('2023-06-30')
    else:
        df_clean['date'] = pd.to_datetime('2022-06-30')
    
    # There is a data inconsistency where the sum of employee range columns do not equal the total column. This is occurring in 40% of the dataset.
    # For our website analysis we are only interested in the total number
    # To address this I will take the maximum of the total value and the sum of employee ranges and use this as our total value
    df_clean['total_emp_range'] = df_clean['non_employing']+df_clean['1_4_employees']+df_clean['5_19_employees']+df_clean['20_199_employees']+df_clean['200_plus_employees']
    df_clean['total_max'] = df_clean[['total_emp_range', 'total']].max(axis=1)

    # Drop columns that are no longer required
    df_clean = df_clean.drop(['non_employing','1_4_employees','5_19_employees','20_199_employees','200_plus_employees','total','total_emp_range'], axis=1) 

    # Rename total_max column to total column
    df_clean = df_clean.rename(columns={'total_max': 'total_business_count'})
        
    # Add to combined df
    df_comb = pd.concat([df_comb, df_clean], ignore_index=True)
    
# Export cleaned data to csv
df_comb.to_csv('ABS_CABEE_BY_LGA_CLEAN.csv', index = False)

## INSERT TO MONGODB

from pymongo import MongoClient

# Define database username, password and connection string
db_username = ''
db_password = ''
connect_str = 'mongodb+srv://' + db_username + ':' + db_password + '@buyinggood.jxdin83.mongodb.net/'

# MongoDB connection
client = MongoClient(connect_str)
db = client['analytics']
collection = db['business_count']

# Delete all documents in the collection
delete = collection.delete_many({})

# Insert updated documents to collection
collection.insert_many(df_comb.to_dict('records'))
