## DATA VISUALISATION - ABS_CABEE_BY_LGA

# Import libraries
import pandas as pd
from pymongo import MongoClient
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio

# Connect to MongoDB to access dataset
# Define database username, password and connection string
db_username = ''
db_password = ''
connect_str = 'mongodb+srv://' + db_username + ':' + db_password + '@buyinggood.jxdin83.mongodb.net/'

# MongoDB connection
client = MongoClient(connect_str)
db = client['analytics']
collection = db['crop_production']

# Convert collection into pandas dataframe
df = pd.DataFrame(list(collection.find()))

# Remove columns and rows not required for analysis
df = df[['region_label', 'produce_type', 'item','financial_year','farm_gate_value_in_millions','production_tonnes']]

# Add new column for cost per tonne
df['cost_per_tonne'] = df['production_tonnes']/df['farm_gate_value_in_millions']

# Create a pie chart
fig = px.pie(df, names='region_label', values='production_tonnes',
              title="Fruit and Vegetable Production in Australia 2024 <br><sup><i>Measured in tonnes</i></sup>",
              template="plotly_white")

# Update layout
fig.update_layout(
    font=dict(
        family="Geist, sans-serif", 
        size=14,  
        color="slategrey"
    ),
    margin=dict(l=100, r=100, t=100, b=150),
    showlegend=False
)

# Add region labels
fig.update_traces(
    textinfo="label+percent",
    textposition="outside"
)
# Add data reference
fig.add_annotation(
    text="<a href='https://www.abs.gov.au/statistics/industry/agriculture/australian-agriculture-horticulture/latest-release' target='_blank'>Source: Australian Bureau of Statistics (2023-24), Australian Agriculture: Horticulture</a>",
    xref="paper", yref="paper",
    x=0.5, y=-0.2, 
    showarrow=False,
    font=dict(size=12, color="slategrey"),
    align="center"
)

# Export the figure as html
pio.write_html(fig, file="plot_1_crop_production_by_tonne.html", full_html=True, include_plotlyjs='cdn')

# Create df just for QLD
df_qld = df[df['region_label']=='Queensland']
df_qld = df_qld.groupby("financial_year")["cost_per_tonne"].sum().reset_index()
df_qld['cost_per_tonne'] = df_qld['cost_per_tonne'].round(0).astype(int)

# Create a bar chart
fig = px.line(df_qld, x='financial_year', y='cost_per_tonne',
              title="Queensland Fruit and Vegetables - Farm Gate Value by Tonne <br><sup><i>Measured in millions</i></sup>",
              labels={"financial_year": "Financial Year", "cost_per_tonne": "Value per Tonne (millions $)"},
              template="plotly_white")

# Add buffer to y axis
max_y = df_qld["cost_per_tonne"].max()
min_y = df_qld["cost_per_tonne"].min()
buffer_max = max_y * 0.1
buffer_min = min_y * 0.1
fig.update_yaxes(range=[min_y - buffer_min, max_y + buffer_max])

# Update layout
fig.update_layout(
    font=dict(
        family="Geist, sans-serif", 
        size=14,  
        color="slategrey"
    ),
    margin=dict(l=100, r=100, t=100, b=150),
    bargap=0.5,          
    bargroupgap=0.15 
)

fig.add_trace(go.Scatter(
    x=df_qld['financial_year'],
    y=df_qld['cost_per_tonne'],
    mode='markers',           
    name='Farm Gate Value per Tonne',
    showlegend=False,
    line=dict(color='blue', width=2),
    marker=dict(size=8, color='blue') 
))

# Add data reference
fig.add_annotation(
    text="<a href='https://www.abs.gov.au/statistics/industry/agriculture/australian-agriculture-horticulture/latest-release' target='_blank'>Source: Australian Bureau of Statistics (2023-24), Australian Agriculture: Horticulture</a>",
    xref="paper", yref="paper",
    x=0.5, y=-0.2, 
    showarrow=False,
    font=dict(size=12, color="slategrey"),
    align="center"
)

# Export the figure as html
pio.write_html(fig, file="plot_2_crop_production_value.html", full_html=True, include_plotlyjs='cdn')
