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
df = df[df.lga_label.isin(['Aurukun', 'Burke', 'Cairns', 'Carpentaria', 'Cassowary Coast', 'Cook', 'Croydon', 'Doomadgee', 'Douglas', 'Etheridge', 'Hope Vale', 'Kowanyama', 'Lockhart River', 'Mapoon', 'Mareeba', 'Mornington', 'Napranum', 'Northern Peninsula Area', 'Pormpuraaw', 'Tablelands', 'Torres', 'Torres Strait Island', 'Weipa', 'Wujal Wujal', 'Yarrabah'])]

# Create a year column to be used in our plot
df['year'] = df.date.dt.year
df = df[['lga_label', 'state', 'year','total_business_count']]

# Create figure
fig = px.line(df, x="year", y="total_business_count", color="lga_label",
              title="Business Trends in FNQ <br><sup><i>Active agricultural businesses at the end of each financial year</i></sup>",
              labels={"year": "Year", "total_business_count": "Businesses", "lga_label": "Region"},
              template="plotly_white")

# Ensure year is shown as a category and ordered correctly
fig.update_xaxes(type='category', categoryorder='array', categoryarray= ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'])

# Get unique lga_labels
lga_labels = df['lga_label'].unique()

# Create dropdown buttons for lga_label
dropdown_buttons = [
    {
        "label": lga,
        "method": "update",
        "args": [
            {"visible": [lga == lg for lg in lga_labels]},
            {"title": f"Business Trends for {lga} <br><sup><i>Active agricultural businesses at the end of each financial year</i></sup>"}
        ]
    }
    for lga in lga_labels
]

# Add option to show all
dropdown_buttons.insert(0, {
    "label": "Select Region",
    "method": "update",
    "args": [
        {"visible": [True] * len(lga_labels)},
        {"title": "Business Trends in FNQ <br><sup><i>Active agricultural businesses at the end of each financial year</i></sup>"}
    ]
})

# Apply updates to layout
fig.update_layout(
    updatemenus=[
        {
            "active": 0,
            "buttons": dropdown_buttons,
            "direction": "down",
            "showactive": True,
            "x": 1.1,
            "xanchor": "left",
            "y": 1.15,
            "yanchor": "top"
        }
    ],
    yaxis=dict(
        title="Businesses",
        tickformat=",",  # Adds commas for thousands
    ),
    legend_title_text='Region',
    margin=dict(l=40, r=40, t=60, b=40)
)

# Export the figure as html
pio.write_html(fig, file="interactive_business_count.html", full_html=True, include_plotlyjs='cdn')
