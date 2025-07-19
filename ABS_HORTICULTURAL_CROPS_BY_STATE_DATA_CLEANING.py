## DATA CLEANING - ABS_HORTICULTURAL_CROPS_BY_STATE

# Import libraries
import pandas as pd

# Import Table 1 sheet from excel document
xlsx = pd.ExcelFile('ABS_HORTICULTURAL_CROPS_BY_STATE.xlsx')
df_1 = pd.read_excel(xlsx, 'Table 2') # Fruit data
df_2 = pd.read_excel(xlsx, 'Table 3') # Vegetable data

# Create empty dataframe to append both fruit and vegetable data together
df_comb = pd.DataFrame()

# Loop through df_1 and then df_2 and perform same cleaning process

for df in (df_1,df_2):
    # Define header as row 5 and remove top 6 rows
    header = df.iloc[5] 
    df_clean = df.iloc[6:] 
    df_clean.columns = header

    # Rename columns - years will be set to second year indicating financial year
    df_clean.columns = ['region_code','region_label','item','2021','2022','2023','2024']

    # Remove duplicates
    df_clean = df_clean.drop_duplicates()

    # Remove rows with null in Value column
    df_clean = df_clean.dropna()
    
    # Remove rows for region_label 'Australia' as we are only interested in state data
    df_clean = df_clean[df_clean['region_label']!='Australia']
    
    # Add row to label fruit or vegetable
    if df.equals(df_1):
        df_clean['produce_type'] = 'Fruit'
    else:
        df_clean['produce_type'] = 'Vegetable'

    # Set data types
    df_clean = df_clean.astype({'region_code':int,'region_label':str,'item':str,'2021':float,'2022':float,'2023':float,'2024':float, 'produce_type':str})
    
    # Melt df to bring year data into it's own column
    melt_df_clean = df_clean.melt(id_vars=['region_code','region_label','produce_type','item'], var_name='financial_year', value_name='amount')
    
    # Split item column into item and amount_type
    melt_df_clean[['item', 'amount_type']] = melt_df_clean['item'].str.split(' - ', expand=True)
    
    # Pivot amount_type to become new columns
    pivot_df_clean = melt_df_clean.pivot(index=['region_code','region_label','produce_type','item','financial_year'],  columns='amount_type', values='amount').reset_index()

    # Rename new columns 
    pivot_df_clean.columns = ['region_code','region_label','produce_type','item','financial_year','farm_gate_value_in_millions','production_tonnes']

    # Add to combined df
    df_comb = df_comb.append(pivot_df_clean, ignore_index=True)
    
# Export cleaned data to csv
df_comb.to_csv('ABS_HORTICULTURAL_CROPS_BY_STATE_CLEAN.csv', index = False)
