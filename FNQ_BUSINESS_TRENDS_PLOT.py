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
collection = db['business_count']

# Convert collection into pandas dataframe
df = pd.DataFrame(list(collection.find()))

# Remove columns and rows not required for analysis
# We are only interested in the FNQ Agriculture industry
df = df[df['industry_code']=='A']
df = df[df['state']=='Queensland']
df = df[df.lga_label.isin(['Cairns', 'Cassowary Coast', 'Tablelands','Whitsunday'])]

# Create a year column to be used in our plot
df['year'] = df.date.dt.year
df = df[['lga_label', 'state', 'year','total_business_count']]

# Create stacked bar chart
fig = px.bar(df, x="year", y="total_business_count", color="lga_label",
              title="Trends in FNQ Top Fruit and Vegetable Production Areas <br><sup><i>Count of agricultural businesses active at the end of each financial year</i></sup>",
              labels={"year": "Financial Year", "total_business_count": "Businesses", "lga_label": "Region"},
              color_discrete_sequence= ['#1f77b4','#ff7f0e','#2ca02c','#9467bd'],
              template="plotly_white")

# Ensure year is shown as a category and ordered correctly
fig.update_xaxes(type='category', categoryorder='array', categoryarray= ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'])

# Update layout
fig.update_layout(
    font=dict(
        family="Geist, sans-serif", 
        size=14,  
        color="slategrey"
    ),
    yaxis=dict(
        title="Businesses",
        tickformat=",", 
    ),
    legend_title_text='Region',
    margin=dict(l=100, r=100, t=100, b=150),
    bargap=0.5,          
    bargroupgap=0.15 
)

# Add total figure to the top of each bar
total = df.groupby("year")["total_business_count"].sum().reset_index()
fig.add_trace(
    go.Scatter(
        x=total["year"],
        y=total["total_business_count"],
        text=total["total_business_count"],
        mode="text",
        textposition="top center",
        showlegend=False,
        cliponaxis=False
    )
)

# Add data reference
fig.add_annotation(
    text="<a href='https://www.abs.gov.au/statistics/economy/business-indicators/counts-australian-businesses-including-entries-and-exits/latest-release' target='_blank'>Source: Australian Bureau of Statistics (Jul2020-Jun2024), Counts of Australian Businesses including Entries and Exits</a>",
    xref="paper", yref="paper",
    x=0.5, y=-0.2, 
    showarrow=False,
    font=dict(size=12, color="slategrey"),
    align="center"
)

# Export the figure as html
pio.write_html(fig, file="plot_3_fnq_business_counts.html", full_html=True, include_plotlyjs='cdn')
