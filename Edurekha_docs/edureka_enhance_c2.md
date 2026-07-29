# Edureka Generative AI Masters Program
# Course 2: Data Visualization with Python - Enhanced Content
## Modules 13-16 | Complete Use Cases, Projects & Design Patterns

---

# Module 13: Interactive Visualization with Plotly

## 13.1 Module Overview

Plotly is a powerful open-source graphing library that makes interactive, publication-quality graphs. This module covers scatter plots, bar charts, line charts, 3D visualizations, animations, and subplot compositions.

### Learning Objectives
- Master Plotly Express and Graph Objects
- Create interactive scatter, bar, line, and area charts
- Build 3D visualizations and animated plots
- Compose multi-panel subplot layouts
- Implement custom tooltips, legends, and annotations

---

## 13.2 Design Principles for Interactive Visualization

### 13.2.1 Dashboard Architecture for Plotly Applications

```
+------------------------------------------------------------------+
|                    PLOTLY APPLICATION ARCHITECTURE                 |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------------+    +-------------------+                   |
|  |   DATA LAYER      |    |  BUSINESS LOGIC   |                   |
|  |                   |    |                   |                   |
|  |  +-------------+  |    |  +-------------+  |                   |
|  |  | CSV/Excel   |--->|  | Transform   |  |                   |
|  |  | Files       |  |    |  | Functions   |  |                   |
|  |  +-------------+  |    |  +------+------+  |                   |
|  |  +-------------+  |    |         |         |                   |
|  |  | Database    |  |    |  +------+------+  |                   |
|  |  | Connection  |  |    |  | Aggregation |  |                   |
|  |  +-------------+  |    |  | & Filtering |  |                   |
|  |  +-------------+  |    |  +------+------  |                   |
|  |  | API Data    |  |    |         |         |                   |
|  |  | Sources     |  |    |         v         |                   |
|  |  +-------------+  |    |  +------+------+  |                   |
|  +--------+----------+    |  | Validation |  |                   |
|           |               |  | & Cleaning |  |                   |
|           v               |  +------+------  |                   |
|  +-------------------+    |         |         |                   |
|  |  VISUALIZATION    |<---|---------+         |                   |
|  |  LAYER            |                         |                   |
|  |  +-------------+  |    +-------------------+                   |
|  |  | Plotly      |  |                                             |
|  |  | Express     |  |    +-------------------+                   |
|  |  +-------------+  |    |  INTERACTION      |                   |
|  |  +-------------+  |    |  LAYER            |                   |
|  |  | Graph       |  |    |  +-------------+  |                   |
|  |  | Objects     |  |    |  | Callbacks   |  |                   |
|  |  +-------------+  |    |  | & Events    |  |                   |
|  |  +-------------+  |    |  +-------------+  |                   |
|  |  | Subplots    |  |    |  +-------------+  |                   |
|  |  | Module      |  |    |  | Tooltips   |  |                   |
|  |  +-------------+  |    |  | & Hover    |  |                   |
|  +--------+----------+    |  +-------------+  |                   |
|           |               |  +-------------+  |                   |
|           v               |  | Zoom/Pan    |  |                   |
|  +-------------------+    |  | Controls    |  |                   |
|  |  RENDERING        |    |  +-------------+  |                   |
|  |  LAYER            |    +--------+----------+                   |
|  |  +-------------+  |             |                               |
|  |  | HTML/JS     |  |             v                               |
|  |  | Rendering   |  |    +-------------------+                   |
|  |  +-------------+  |    |  OUTPUT LAYER     |                   |
|  |  +-------------+  |    |  +-------------+  |                   |
|  |  | WebGL       |  |    |  | HTML File   |  |                   |
|  |  | Accelerated |  |    |  +-------------+  |                   |
|  |  +-------------+  |    |  +-------------+  |                   |
|  |  +-------------+  |    |  | Dashboard   |  |                   |
|  |  | SVG Fallback|  |    |  | App         |  |                   |
|  |  +-------------+  |    |  +-------------+  |                   |
|  +-------------------+    +-------------------+                   |
+------------------------------------------------------------------+
```

### 13.2.2 Data Flow for Visualization Pipelines

```
  RAW DATA          PROCESSING         VISUALIZATION       OUTPUT
  +--------+       +----------+       +-----------+      +--------+
  | CSV    |------>| Clean    |------>| Transform |----->| HTML   |
  | JSON   |       | Filter   |       | Aggregate |      | Chart  |
  | DB     |       | Validate |       | Reshape   |      |        |
  | API    |       |          |       |           |      |        |
  +--------+       +----------+       +-----------+      +--------+
       |                |                  |                  |
       v                v                  v                  v
  +--------+       +----------+       +-----------+      +--------+
  | Missing |       | Outlier  |       | Color     |      | Static |
  | Values  |       | Detection|       | Mapping   |      | Image  |
  | Handling|       |          |       |           |      |        |
  +--------+       +----------+       +-----------+      +--------+
       |                |                  |                  |
       v                v                  v                  v
  +--------+       +----------+       +-----------+      +--------+
  | Type    |       | Data     |       | Layout    |      | Inter- |
  | Casting |       | Enrichment|      | Engine    |      | active |
  |         |       |          |       |           |      | Web    |
  +--------+       +----------+       +-----------+      +--------+
```

### 13.2.3 Color Theory for Visualization

```
+------------------------------------------------------------------+
|                  COLOR PALETTE SELECTION GUIDE                     |
+------------------------------------------------------------------+
|                                                                    |
|  DATA TYPE           RECOMMENDED PALETTE          EXAMPLE          |
|  --------           -------------------          -------          |
|                                                                    |
|  Sequential          Viridis, Plasma,             Low -> High      |
|  (Continuous)        YlOrRd, Blues                values           |
|                                                                    |
|  Diverging           RdBu, PiYG, Coolwarm         Center ->        |
|  (Bipolar)                                          Extremes        |
|                                                                    |
|  Categorical         Set1, Set2, Pastel,          Distinct         |
|  (Discrete)         Dark2, Paired                 groups           |
+------------------------------------------------------------------+

ACCESSIBILITY GUIDELINES:
+------------------------------------------------------------------+
|  1. Never rely solely on color to convey information              |
|  2. Use patterns/textures as secondary indicators                 |
|  3. Ensure minimum contrast ratio of 4.5:1 for text              |
|  4. Test with colorblind simulation (deuteranopia, protanopia)    |
|  5. Use colorblind-friendly palettes (viridis, cividis)          |
|  6. Provide legend with clear labels                              |
+------------------------------------------------------------------+
```

### 13.2.4 Responsive Design for Visualizations

```
+------------------------------------------------------------------+
|              RESPONSIVE VISUALIZATION LAYOUT                       |
+------------------------------------------------------------------+
|                                                                    |
|  DESKTOP (>1200px):                                                |
|  +----------+----------+----------+                               |
|  | Chart 1  | Chart 2  | Chart 3  |                               |
|  +----------+----------+----------+                               |
|  | Chart 4  | Chart 5  | Chart 6  |                               |
|  +----------+----------+----------+                               |
|                                                                    |
|  TABLET (768px-1200px):                                            |
|  +----------+----------+                                           |
|  | Chart 1  | Chart 2  |                                           |
|  +----------+----------+                                           |
|  +----------+----------+                                           |
|  | Chart 3  | Chart 4  |                                           |
|  +----------+----------+                                           |
|  +-------------------+                                            |
|  | Chart 5           |                                            |
|  +-------------------+                                            |
|                                                                    |
|  MOBILE (<768px):                                                  |
|  +-------------------+                                            |
|  | Chart 1           |                                            |
|  +-------------------+                                            |
|  +-------------------+                                            |
|  | Chart 2           |                                            |
|  +-------------------+                                            |
+------------------------------------------------------------------+
```

---

## 13.3 Use Case 1: Financial Market Analysis Dashboard

### Problem Statement
Analyze stock market data with interactive candlestick charts, volume analysis, and technical indicators.

### Complete Implementation

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range(start='2024-01-01', periods=200, freq='B')
price = 100 + np.cumsum(np.random.randn(200) * 2)
volume = np.random.randint(1000000, 5000000, 200)

df = pd.DataFrame({
    'Date': dates,
    'Open': price + np.random.randn(200) * 0.5,
    'High': price + abs(np.random.randn(200) * 1.5),
    'Low': price - abs(np.random.randn(200) * 1.5),
    'Close': price,
    'Volume': volume
})

df['SMA_20'] = df['Close'].rolling(window=20).mean()
df['SMA_50'] = df['Close'].rolling(window=50).mean()
df['BB_upper'] = df['SMA_20'] + 2 * df['Close'].rolling(window=20).std()
df['BB_lower'] = df['SMA_20'] - 2 * df['Close'].rolling(window=20).std()

fig = make_subplots(
    rows=3, cols=1, shared_xaxes=True, vertical_spacing=0.03,
    row_heights=[0.6, 0.2, 0.2],
    subplot_titles=('Stock Price with Bollinger Bands', 'Volume', 'RSI')
)

fig.add_trace(
    go.Candlestick(x=df['Date'], open=df['Open'], high=df['High'],
                   low=df['Low'], close=df['Close'], name='OHLC',
                   increasing_line_color='#26a69a',
                   decreasing_line_color='#ef5350'),
    row=1, col=1
)

fig.add_trace(go.Scatter(x=df['Date'], y=df['BB_upper'],
    line=dict(color='rgba(173,216,230,0.5)', width=1),
    name='BB Upper', showlegend=False), row=1, col=1)

fig.add_trace(go.Scatter(x=df['Date'], y=df['BB_lower'],
    line=dict(color='rgba(173,216,230,0.5)', width=1),
    fill='tonexty', name='BB Lower', showlegend=False), row=1, col=1)

fig.add_trace(go.Scatter(x=df['Date'], y=df['SMA_20'],
    line=dict(color='orange', width=1.5), name='SMA 20'), row=1, col=1)

fig.add_trace(go.Scatter(x=df['Date'], y=df['SMA_50'],
    line=dict(color='blue', width=1.5), name='SMA 50'), row=1, col=1)

colors = ['#26a69a' if c >= o else '#ef5350'
          for c, o in zip(df['Close'], df['Open'])]
fig.add_trace(go.Bar(x=df['Date'], y=df['Volume'],
    marker_color=colors, name='Volume', showlegend=False), row=2, col=1)

delta = df['Close'].diff()
gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
rs = gain / loss
df['RSI'] = 100 - (100 / (1 + rs))

fig.add_trace(go.Scatter(x=df['Date'], y=df['RSI'],
    line=dict(color='purple', width=1.5),
    name='RSI', showlegend=False), row=3, col=1)

fig.add_hline(y=70, line_dash="dash", line_color="red",
              opacity=0.5, row=3, col=1)
fig.add_hline(y=30, line_dash="dash", line_color="green",
              opacity=0.5, row=3, col=1)

fig.update_layout(
    title='Interactive Stock Analysis Dashboard',
    height=800, template='plotly_dark', showlegend=True,
    xaxis_rangeslider_visible=False, hovermode='x unified'
)
fig.update_yaxes(title_text="Price ($)", row=1, col=1)
fig.update_yaxes(title_text="Volume", row=2, col=1)
fig.update_yaxes(title_text="RSI", row=3, col=1)

fig.write_html('stock_analysis.html')
fig.show()
```

### Alternative Approach (Plotly Express)

```python
import plotly.express as px
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range(start='2024-01-01', periods=100, freq='B')
df = pd.DataFrame({
    'Date': dates,
    'Price': 100 + np.cumsum(np.random.randn(100) * 2),
    'Category': np.random.choice(['Tech', 'Finance', 'Healthcare'], 100)
})

fig = px.line(df, x='Date', y='Price', color='Category',
    title='Stock Prices by Sector', template='plotly_white',
    labels={'Price': 'Stock Price ($)', 'Date': 'Trading Date'})
fig.update_traces(mode='lines+markers')
fig.update_layout(hovermode='x unified')
fig.show()
```

---

## 13.4 Use Case 2: Customer Segmentation 3D Scatter

### Problem Statement
Visualize customer segments in 3D space using RFM analysis for marketing analytics.

### Complete Implementation

```python
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n_customers = 500

segments = {
    'High Value': {'recency': (1, 15), 'frequency': (15, 30), 'monetary': (500, 1000)},
    'Regular': {'recency': (5, 25), 'frequency': (8, 20), 'monetary': (200, 600)},
    'At Risk': {'recency': (30, 90), 'frequency': (3, 10), 'monetary': (100, 400)},
    'New': {'recency': (1, 10), 'frequency': (1, 5), 'monetary': (50, 200)},
    'Dormant': {'recency': (60, 180), 'frequency': (1, 3), 'monetary': (20, 100)}
}

data = []
for segment, params in segments.items():
    n = n_customers // len(segments)
    for _ in range(n):
        data.append({
            'Recency': np.random.randint(*params['recency']),
            'Frequency': np.random.randint(*params['frequency']),
            'Monetary': np.random.uniform(*params['monetary']),
            'Segment': segment
        })

df = pd.DataFrame(data)
scaler = StandardScaler()
features_scaled = scaler.fit_transform(df[['Recency', 'Frequency', 'Monetary']])
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df['Cluster'] = kmeans.fit_predict(features_scaled)

fig = go.Figure()
colors = {'High Value': '#26a69a', 'Regular': '#42a5f5',
          'At Risk': '#ef5350', 'New': '#ffa726', 'Dormant': '#78909c'}

for segment in df['Segment'].unique():
    mask = df['Segment'] == segment
    fig.add_trace(go.Scatter3d(
        x=df[mask]['Recency'], y=df[mask]['Frequency'],
        z=df[mask]['Monetary'], mode='markers', name=segment,
        marker=dict(size=5, color=colors[segment], opacity=0.7,
                    line=dict(width=0.5, color='white')),
        text=df[mask].apply(
            lambda r: f"Recency: {r['Recency']}d<br>"
                      f"Frequency: {r['Frequency']}<br>"
                      f"Monetary: ${r['Monetary']:.2f}", axis=1),
        hoverinfo='text+name'
    ))

centers = scaler.inverse_transform(kmeans.cluster_centers_)
fig.add_trace(go.Scatter3d(
    x=centers[:, 0], y=centers[:, 1], z=centers[:, 2],
    mode='markers+text', name='Cluster Centers',
    marker=dict(size=12, color='gold', symbol='diamond',
                line=dict(width=2, color='black')),
    text=['C1', 'C2', 'C3', 'C4', 'C5'], textposition='top center'
))

fig.update_layout(
    title='Customer Segmentation - RFM Analysis (3D)',
    scene=dict(xaxis_title='Recency (Days)', yaxis_title='Frequency',
               zaxis_title='Monetary ($)',
               camera=dict(eye=dict(x=1.5, y=1.5, z=1.5))),
    height=700, template='plotly_white'
)
fig.show()
```

---

## 13.5 Use Case 3: Animated Time Series

### Problem Statement
Create animated visualizations showing how sales metrics evolve over time.

### Complete Implementation

```python
import plotly.express as px
import pandas as pd
import numpy as np

np.random.seed(42)
months = pd.date_range('2023-01-01', periods=24, freq='M')
categories = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports']
bases = {'Electronics': 50000, 'Clothing': 35000, 'Food': 45000,
         'Home': 30000, 'Sports': 25000}

data = []
for month in months:
    for cat in categories:
        seasonal = np.sin(month.month / 12 * 2 * np.pi) * bases[cat] * 0.2
        trend = (month - months[0]).days * 10
        noise = np.random.randn() * bases[cat] * 0.1
        data.append({
            'Month': month, 'Category': cat,
            'Sales': bases[cat] + seasonal + trend + noise,
            'Units_Sold': int((bases[cat] + seasonal + trend + noise) /
                            np.random.uniform(50, 200))
        })

df = pd.DataFrame(data)

fig = px.bar(df, x='Category', y='Sales', color='Category',
    animation_frame=df['Month'].dt.strftime('%Y-%m'),
    range_y=[0, df['Sales'].max() * 1.2],
    title='Monthly Sales by Category (Animated)',
    template='plotly_white', text='Sales')

fig.update_traces(texttemplate='$%{text:,.0f}', textposition='outside')
fig.update_layout(height=500, showlegend=False)
fig.layout.updatemenus[0].buttons[0].args[1]['frame']['duration'] = 500
fig.show()
```

---

## 13.6 Use Case 4: Multi-Axis Financial Dashboard

### Problem Statement
Create multi-axis charts showing correlated financial metrics.

### Complete Implementation

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=365, freq='D')

df = pd.DataFrame({
    'Date': dates,
    'Stock_Price': 100 + np.cumsum(np.random.randn(365) * 1.5),
    'Interest_Rate': 5 + np.cumsum(np.random.randn(365) * 0.02),
    'Volume': np.random.randint(1000000, 5000000, 365),
    'Sentiment': np.cumsum(np.random.randn(365) * 0.1)
})

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=('Stock Price & Interest Rate', 'Trading Volume',
                    'Sentiment Analysis', 'Correlation Heatmap'),
    specs=[[{"secondary_y": True}, {"secondary_y": False}],
           [{"secondary_y": False}, {"type": "heatmap"}]]
)

fig.add_trace(go.Scatter(x=df['Date'], y=df['Stock_Price'],
    name='Stock Price', line=dict(color='#1f77b4', width=2),
    fill='tozeroy', fillcolor='rgba(31,119,180,0.1)'),
    row=1, col=1, secondary_y=False)

fig.add_trace(go.Scatter(x=df['Date'], y=df['Interest_Rate'],
    name='Interest Rate', line=dict(color='#ff7f0e', width=2, dash='dash')),
    row=1, col=1, secondary_y=True)

colors = ['#26a69a' if df['Stock_Price'].iloc[i] >=
          df['Stock_Price'].iloc[max(0, i-1)] else '#ef5350'
          for i in range(len(df))]

fig.add_trace(go.Bar(x=df['Date'], y=df['Volume'],
    name='Volume', marker_color=colors, opacity=0.7), row=1, col=2)

fig.add_trace(go.Scatter(x=df['Date'], y=df['Sentiment'],
    name='Sentiment', line=dict(color='#9467bd', width=2),
    fill='tozeroy'), row=2, col=1)

corr = df[['Stock_Price', 'Interest_Rate', 'Volume', 'Sentiment']].corr()
fig.add_trace(go.Heatmap(z=corr.values, x=corr.columns, y=corr.index,
    colorscale='RdBu', zmin=-1, zmax=1,
    text=np.round(corr.values, 2), texttemplate='%{text}'),
    row=2, col=2)

fig.update_layout(height=800, title_text="Multi-Axis Financial Dashboard",
                  template='plotly_white', showlegend=True)
fig.update_yaxes(title_text="Price ($)", row=1, col=1, secondary_y=False)
fig.update_yaxes(title_text="Rate (%)", row=1, col=1, secondary_y=True)
fig.show()
```

---

## 13.7 Use Case 5: Geographic Bubble Map

### Problem Statement
Visualize global sales distribution with interactive bubble maps.

### Complete Implementation

```python
import plotly.express as px
import pandas as pd

data = {
    'Country': ['United States', 'United Kingdom', 'Germany', 'France',
                'Japan', 'China', 'India', 'Brazil', 'Australia', 'Canada',
                'South Korea', 'Netherlands', 'Sweden', 'Singapore', 'UAE'],
    'Lat': [37.09, 55.38, 51.17, 46.23, 36.20, 35.86, 20.59, -14.24,
            -25.27, 56.13, 35.91, 52.13, 46.82, 1.35, 23.42],
    'Lon': [-95.71, -3.44, 10.45, 2.21, 138.25, 104.20, 78.96, -51.93,
            133.78, -63.42, 127.77, 5.29, 8.23, 103.82, 53.85],
    'Sales': [2500000, 1800000, 1500000, 1200000, 900000,
              2100000, 800000, 600000, 700000, 1100000,
              500000, 400000, 350000, 450000, 300000],
    'Region': ['North America', 'Europe', 'Europe', 'Europe', 'Asia',
               'Asia', 'Asia', 'South America', 'Oceania', 'North America',
               'Asia', 'Europe', 'Europe', 'Asia', 'Middle East']
}
df = pd.DataFrame(data)

fig = px.scatter_geo(df, lat='Lat', lon='Lon', size='Sales', color='Region',
    hover_name='Country', size_max=40, projection='natural earth',
    title='Global Sales Distribution', template='plotly_white',
    color_discrete_sequence=px.colors.qualitative.Set2)

fig.update_layout(
    geo=dict(showframe=False, showcoastlines=True, coastlinecolor='gray',
             showland=True, landcolor='rgb(243,243,243)',
             countrycolor='rgb(204,204,204)'),
    height=600
)
fig.show()
```

---

## 13.8 Use Case 6: Sunburst Hierarchical Data

### Problem Statement
Visualize organizational hierarchy with drill-down capability.

### Complete Implementation

```python
import plotly.graph_objects as go
import pandas as pd

org_data = {
    'ids': ['CEO', 'CTO', 'CFO', 'CMO', 'COO',
            'Engineering', 'IT', 'R&D',
            'Frontend', 'Backend', 'DevOps', 'Data',
            'Infrastructure', 'Security', 'Support',
            'AI/ML', 'Analytics', 'Product Research',
            'Finance', 'Accounting', 'Legal',
            'Marketing', 'Sales', 'Customer Success',
            'Operations', 'Supply Chain', 'Quality'],
    'labels': ['CEO Office', 'CTO', 'CFO', 'CMO', 'COO',
               'Engineering', 'IT', 'R&D',
               'Frontend', 'Backend', 'DevOps', 'Data',
               'Infrastructure', 'Security', 'Support',
               'AI/ML', 'Analytics', 'Product Research',
               'Finance', 'Accounting', 'Legal',
               'Marketing', 'Sales', 'Customer Success',
               'Operations', 'Supply Chain', 'Quality'],
    'parents': ['', 'CEO', 'CEO', 'CEO', 'CEO',
                'CTO', 'CTO', 'CTO',
                'Engineering', 'Engineering', 'Engineering', 'Engineering',
                'IT', 'IT', 'IT', 'R&D', 'R&D', 'R&D',
                'CFO', 'CFO', 'CFO', 'CMO', 'CMO', 'CMO',
                'COO', 'COO', 'COO'],
    'values': [0, 0, 0, 0, 0, 0, 0, 0,
               50, 65, 35, 45, 30, 25, 40, 35, 30, 25,
               0, 0, 0, 0, 0, 0, 0, 0, 0],
    'budget': [5000, 1500, 800, 600, 700, 500, 300, 400,
               150, 200, 100, 120, 90, 80, 100, 120, 100, 80,
               300, 250, 150, 200, 250, 100, 200, 250, 150]
}
df = pd.DataFrame(org_data)

fig = go.Figure(go.Sunburst(
    ids=df['ids'], labels=df['labels'], parents=df['parents'],
    values=df['values'], branchvalues='total',
    marker=dict(colors=df['budget'], colorscale='Viridis',
                line=dict(width=2, color='white')),
    hovertemplate='<b>%{label}</b><br>Budget: $%{value:,.0f}K<extra></extra>',
    textinfo='label+percent parent', insidetextorientation='radial'
))
fig.update_layout(title='Organizational Structure - Budget Allocation',
                  height=600, margin=dict(t=50, l=0, r=0, b=0))
fig.show()
```

---

## 13.9 Use Case 7: Parallel Coordinates

### Problem Statement
Analyze multiple performance metrics simultaneously.

### Complete Implementation

```python
import plotly.graph_objects as go
import pandas as pd
import numpy as np

np.random.seed(42)
n = 200

df = pd.DataFrame({
    'Technical': np.random.uniform(40, 100, n),
    'Communication': np.random.uniform(40, 100, n),
    'Leadership': np.random.uniform(30, 100, n),
    'Innovation': np.random.uniform(30, 100, n),
    'Teamwork': np.random.uniform(50, 100, n),
    'Experience': np.random.randint(1, 20, n),
    'Salary': np.random.uniform(50000, 150000, n),
    'Satisfaction': np.random.uniform(3, 10, n),
    'Level': np.random.choice([0, 1, 2, 3], n, p=[0.3, 0.4, 0.2, 0.1])
})

fig = go.Figure(data=go.Parcoords(
    line=dict(color=df['Level'],
              colorscale=[[0,'#2196F3'],[0.33,'#4CAF50'],
                          [0.66,'#FF9800'],[1,'#F44336']],
              showscale=True, cmin=0, cmax=3,
              colorbar=dict(title="Level", tickvals=[0,1,2,3],
                           ticktext=['Junior','Mid','Senior','Lead'])),
    dimensions=[
        dict(range=[40,100], label='Technical', values=df['Technical']),
        dict(range=[40,100], label='Communication',
             values=df['Communication']),
        dict(range=[30,100], label='Leadership', values=df['Leadership']),
        dict(range=[30,100], label='Innovation', values=df['Innovation']),
        dict(range=[50,100], label='Teamwork', values=df['Teamwork']),
        dict(range=[1,20], label='Experience', values=df['Experience']),
        dict(range=[50000,150000], label='Salary', values=df['Salary']),
        dict(range=[3,10], label='Satisfaction', values=df['Satisfaction'])
    ]
))

fig.update_layout(title='Employee Performance - Parallel Coordinates',
                  height=600, margin=dict(l=80, r=80))
fig.show()
```

---

## 13.10 Use Case 8: Radar Chart Comparison

### Problem Statement
Compare product features across multiple dimensions.

### Complete Implementation

```python
import plotly.graph_objects as go

categories = ['Price', 'Quality', 'Features', 'Support',
              'Reliability', 'Innovation', 'User Experience']

products = {
    'Product A': [85, 90, 75, 80, 88, 70, 92],
    'Product B': [70, 85, 90, 75, 82, 88, 78],
    'Product C': [92, 78, 82, 85, 76, 95, 85],
    'Our Product': [78, 95, 88, 92, 90, 82, 95]
}

fig = go.Figure()
colors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336']

for (product, values), color in zip(products.items(), colors):
    fig.add_trace(go.Scatterpolar(
        r=values + [values[0]], theta=categories + [categories[0]],
        fill='toself', name=product, line=dict(color=color, width=2)
    ))

fig.update_layout(
    polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
    showlegend=True,
    title='Competitive Product Comparison', height=600,
    template='plotly_white'
)
fig.show()
```

---

## 13.11 Design Patterns for Plotly

### MVC Pattern

```
+------------------------------------------------------------------+
|                    MVC PATTERN FOR PLOTLY                          |
+------------------------------------------------------------------+
|                                                                    |
|  MODEL (Data Layer)                                                |
|  +------------------------------------------------------------+  |
|  |  class DataModel:                                           |  |
|  |      - load_data()                                          |  |
|  |      - transform_data()                                     |  |
|  |      - aggregate_data()                                     |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  VIEW (Visualization Layer)                                       |
|  +------------------------------------------------------------+  |
|  |  class PlotlyView:                                          |  |
|  |      - create_scatter()                                     |  |
|  |      - create_bar()                                         |  |
|  |      - create_line()                                        |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  CONTROLLER (Interaction Layer)                                   |
|  +------------------------------------------------------------+  |
|  |  class ChartController:                                     |  |
|  |      - handle_hover()                                       |  |
|  |      - handle_click()                                       |  |
|  |      - update_data()                                        |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Template Pattern for Consistent Styling

```python
import plotly.graph_objects as go

class ChartTemplate:
    COLORS = {
        'primary': '#1f77b4', 'secondary': '#ff7f0e',
        'success': '#2ca02c', 'danger': '#d62728',
    }
    LAYOUT_DEFAULTS = dict(
        height=500, template='plotly_white',
        font=dict(family='Arial, sans-serif', size=12),
        margin=dict(l=60, r=30, t=60, b=60)
    )

    @classmethod
    def create_bar(cls, x, y, title, **kwargs):
        layout = {**cls.LAYOUT_DEFAULTS, 'title': title}
        return go.Figure(
            data=[go.Bar(x=x, y=y,
                        marker_color=kwargs.get('color', cls.COLORS['primary']),
                        text=kwargs.get('text', y), textposition='outside')],
            layout=layout
        )

    @classmethod
    def create_line(cls, x, y, title, **kwargs):
        layout = {**cls.LAYOUT_DEFAULTS, 'title': title}
        return go.Figure(
            data=[go.Scatter(x=x, y=y, mode='lines+markers',
                            line=dict(color=kwargs.get('color', cls.COLORS['primary']),
                                     width=2))],
            layout=layout
        )
```

---

## 13.12 Project Idea 1: Real-Time Stock Portfolio Tracker

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime

class PortfolioTracker:
    def __init__(self):
        self.portfolio = {}

    def add_stock(self, symbol, shares, avg_cost):
        self.portfolio[symbol] = {
            'shares': shares, 'avg_cost': avg_cost,
            'current_price': avg_cost * np.random.uniform(0.8, 1.3)
        }

    def generate_price_history(self, symbol, days=90):
        np.random.seed(hash(symbol) % 2**32)
        dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
        base = self.portfolio[symbol]['avg_cost']
        prices = base + np.cumsum(np.random.randn(days) * base * 0.02)
        return pd.DataFrame({'Date': dates, 'Close': prices,
                            'Volume': np.random.randint(1000000, 10000000, days)})

    def calculate_metrics(self):
        metrics = []
        for symbol, data in self.portfolio.items():
            cv = data['shares'] * data['current_price']
            cb = data['shares'] * data['avg_cost']
            metrics.append({
                'Symbol': symbol, 'Shares': data['shares'],
                'Avg Cost': data['avg_cost'],
                'Current Value': cv, 'Gain/Loss': cv - cb,
                'Gain %': (cv - cb) / cb * 100
            })
        return pd.DataFrame(metrics)

    def create_dashboard(self):
        metrics = self.calculate_metrics()
        fig = make_subplots(rows=2, cols=2,
            specs=[[{"type": "pie"}, {"type": "bar"}],
                   [{"colspan": 2}, None]],
            subplot_titles=('Allocation', 'Returns', 'Price History'))

        fig.add_trace(go.Pie(labels=metrics['Symbol'],
            values=metrics['Current Value'], hole=0.4,
            textinfo='label+percent'), row=1, col=1)

        colors = ['#26a69a' if x >= 0 else '#ef5350'
                  for x in metrics['Gain %']]
        fig.add_trace(go.Bar(x=metrics['Symbol'], y=metrics['Gain %'],
            marker_color=colors,
            text=metrics['Gain %'].apply(lambda x: f'{x:.1f}%'),
            textposition='outside'), row=1, col=2)

        for symbol in self.portfolio:
            hist = self.generate_price_history(symbol)
            fig.add_trace(go.Scatter(x=hist['Date'], y=hist['Close'],
                name=symbol, mode='lines'), row=2, col=1)

        total = metrics['Current Value'].sum()
        gain = metrics['Gain/Loss'].sum()
        fig.update_layout(title=f'Portfolio: ${total:,.2f} '
                          f'({"+" if gain >= 0 else ""}{gain:,.2f})',
                          height=800, template='plotly_white')
        return fig

tracker = PortfolioTracker()
tracker.add_stock('AAPL', 100, 150.00)
tracker.add_stock('GOOGL', 50, 2800.00)
tracker.add_stock('MSFT', 75, 300.00)
tracker.add_stock('AMZN', 30, 3200.00)
tracker.add_stock('TSLA', 40, 200.00)
fig = tracker.create_dashboard()
fig.write_html('portfolio_dashboard.html')
fig.show()
```

---

## 13.13 Project Idea 2: A/B Test Visualizer

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from scipy import stats

class ABTestVisualizer:
    def __init__(self):
        self.results = None

    def generate_test_data(self, n=1000):
        np.random.seed(42)
        control = np.random.binomial(1, 0.12, n)
        treatment = np.random.binomial(1, 0.15, n)
        self.results = pd.DataFrame({
            'group': ['Control']*n + ['Treatment']*n,
            'converted': np.concatenate([control, treatment]),
            'revenue': np.concatenate([
                np.random.exponential(50, n),
                np.random.exponential(55, n)])
        })

    def create_dashboard(self):
        ctrl = self.results[self.results['group'] == 'Control']
        treat = self.results[self.results['group'] == 'Treatment']
        ctrl_rate = ctrl['converted'].mean()
        treat_rate = treat['converted'].mean()
        p_val = stats.proportions_ztest(
            [treat['converted'].sum(), ctrl['converted'].sum()],
            [len(treat), len(ctrl)])[1]

        fig = make_subplots(rows=2, cols=2,
            subplot_titles=('Conversion Rates', 'Revenue Distribution',
                          'Cumulative Conversion', 'Summary'),
            specs=[[{"type": "bar"}, {"type": "box"}],
                   [{"type": "scatter"}, {"type": "table"}]])

        fig.add_trace(go.Bar(x=['Control','Treatment'],
            y=[ctrl_rate, treat_rate],
            text=[f'{ctrl_rate:.2%}', f'{treat_rate:.2%}'],
            textposition='outside',
            marker_color=['#3498db', '#2ecc71']), row=1, col=1)

        for grp, color in [('Control','#3498db'), ('Treatment','#2ecc71')]:
            gd = self.results[self.results['group'] == grp]
            fig.add_trace(go.Box(y=gd['revenue'], name=grp,
                                marker_color=color), row=1, col=2)

        for grp in ['Control', 'Treatment']:
            gd = self.results[self.results['group'] == grp]
            cum = gd['converted'].cumsum() / range(1, len(gd)+1)
            fig.add_trace(go.Scatter(y=cum.values, name=grp,
                                     mode='lines'), row=2, col=1)

        fig.update_layout(title='A/B Test Dashboard', height=800,
                         template='plotly_white')
        return fig

viz = ABTestVisualizer()
viz.generate_test_data()
fig = viz.create_dashboard()
fig.show()
```

---

## 13.14 Project Idea 3: Sales Funnel Analytics

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

class SalesFunnelAnalyzer:
    def __init__(self):
        self.funnel_data = None

    def generate_funnel_data(self):
        stages = ['Visitors', 'Leads', 'MQLs', 'SQLs',
                  'Opportunities', 'Proposals', 'Negotiations', 'Won']
        rates = [0.15, 0.30, 0.40, 0.50, 0.60, 0.70, 0.35]
        counts = [100000]
        for r in rates:
            counts.append(int(counts[-1] * r))
        self.funnel_data = pd.DataFrame({
            'Stage': stages, 'Count': counts,
            'Rate': [100] + [r*100 for r in rates]
        })

    def create_dashboard(self):
        fig = make_subplots(rows=1, cols=2,
            specs=[[{"type": "funnel"}, {"type": "bar"}]],
            subplot_titles=('Sales Funnel', 'Conversion by Stage'))

        fig.add_trace(go.Funnel(
            y=self.funnel_data['Stage'], x=self.funnel_data['Count'],
            textinfo="value+percent initial",
            marker=dict(color=['#2196F3','#03A9F4','#00BCD4','#009688',
                              '#4CAF50','#8BC34A','#CDDC39','#FFEB3B'])),
            row=1, col=1)

        fig.add_trace(go.Bar(x=self.funnel_data['Stage'][1:],
            y=self.funnel_data['Rate'][1:],
            text=[f'{r:.0f}%' for r in self.funnel_data['Rate'][1:]],
            textposition='outside', marker_color='#4CAF50'), row=1, col=2)

        fig.update_layout(title='Sales Funnel Analytics',
                         height=500, template='plotly_white')
        return fig

analyzer = SalesFunnelAnalyzer()
analyzer.generate_funnel_data()
fig = analyzer.create_dashboard()
fig.show()
```

---

## 13.15 Alternative Code Approaches

### Scatter Plot: Plotly Express vs Graph Objects vs Altair

```python
# APPROACH 1: Plotly Express (Simplest)
import plotly.express as px
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    'x': np.random.randn(100), 'y': np.random.randn(100),
    'size': np.random.uniform(5, 20, 100),
    'category': np.random.choice(['A', 'B', 'C'], 100)
})

fig1 = px.scatter(df, x='x', y='y', size='size', color='category',
                  title='Plotly Express Scatter', template='plotly_white')
fig1.show()

# APPROACH 2: Graph Objects (More Control)
import plotly.graph_objects as go

fig2 = go.Figure()
for cat in df['category'].unique():
    mask = df['category'] == cat
    fig2.add_trace(go.Scatter(
        x=df[mask]['x'], y=df[mask]['y'], mode='markers',
        name=cat,
        marker=dict(size=df[mask]['size'], opacity=0.7,
                    line=dict(width=1, color='white'))
    ))
fig2.update_layout(title='Graph Objects Scatter', template='plotly_white')
fig2.show()

# APPROACH 3: Altair (Declarative)
import altair as alt

chart = alt.Chart(df).mark_circle(opacity=0.7).encode(
    x='x', y='y',
    size=alt.Size('size', scale=alt.Scale(range=[20, 500])),
    color='category',
    tooltip=['x', 'y', 'category']
).properties(title='Altair Scatter', width=500, height=400)
chart.show()
```

### Dashboard: Dash vs Streamlit vs Gradio

```python
# DASH APPROACH
import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd
import numpy as np

app = dash.Dash(__name__)
df = pd.DataFrame({
    'x': np.random.randn(100), 'y': np.random.randn(100),
    'cat': np.random.choice(['A', 'B', 'C'], 100)
})

app.layout = html.Div([
    dcc.Dropdown(id='color-by', options=[
        {'label': 'Category', 'value': 'cat'}],
        value='cat'),
    dcc.Graph(id='main-chart')
])

@app.callback(Output('main-chart', 'figure'),
              Input('color-by', 'value'))
def update(color):
    return px.scatter(df, x='x', y='y', color=color)

app.run(debug=True)

# STREAMLIT APPROACH
import streamlit as st
import plotly.express as px
import pandas as pd
import numpy as np

st.title('Interactive Dashboard')
df = pd.DataFrame({
    'x': np.random.randn(100), 'y': np.random.randn(100),
    'cat': np.random.choice(['A', 'B', 'C'], 100)
})
color = st.selectbox('Color by', ['cat'])
st.plotly_chart(px.scatter(df, x='x', y='y', color=color))

# GRADIO APPROACH
import gradio as gr
import plotly.express as px
import pandas as pd
import numpy as np

def create_chart(color_var):
    df = pd.DataFrame({
        'x': np.random.randn(100), 'y': np.random.randn(100),
        'cat': np.random.choice(['A', 'B', 'C'], 100)
    })
    fig = px.scatter(df, x='x', y='y', color=color_var)
    return fig

demo = gr.Interface(fn=create_chart,
    inputs=gr.Radio(['cat'], label='Color by'),
    outputs=gr.Plot(label='Chart'))
demo.launch()
```

---

# Module 14: Dashboard Development with Dash/Streamlit

## 14.1 Module Overview

This module covers building interactive dashboards using Dash (Plotly) and Streamlit, including layouts, callbacks, state management, and deployment.

### Learning Objectives
- Build production-ready dashboards with Dash
- Create rapid prototypes with Streamlit
- Implement complex callback chains and state management
- Design responsive layouts for different screen sizes
- Deploy dashboards to cloud platforms

---

## 14.2 Dashboard Architecture Patterns

### 14.2.1 Dash Application Architecture

```
+------------------------------------------------------------------+
|                    DASH APPLICATION ARCHITECTURE                   |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                    FLASK SERVER                              |  |
|  |  +------------------+  +------------------+                |  |
|  |  | HTTP Routes      |  | WebSocket        |                |  |
|  |  +------------------+  +------------------+                |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |                 DASH LAYOUT ENGINE                           |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | HTML Div   |  | Core        |  | Bootstrap   |         |  |
|  |  | Components |  | Components  |  | Components  |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  |         |                |                |                  |  |
|  |         v                v                v                  |  |
|  |  +----------------------------------------------------+    |  |
|  |  |              COMPONENT TREE                         |    |  |
|  |  |  Root Div                                           |    |  |
|  |  |    +-- Header                                       |    |  |
|  |  |    +-- Sidebar                                      |    |  |
|  |  |    |     +-- Filters                                |    |  |
|  |  |    |     +-- Navigation                             |    |  |
|  |  |    +-- Main Content                                 |    |  |
|  |  |          +-- Charts / Tables / Metrics              |    |  |
|  |  +----------------------------------------------------+    |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |              CALLBACK SYSTEM                                 |  |
|  |  +------------------+     +------------------+              |  |
|  |  | Input (Trigger)  |     | State (Context)  |              |  |
|  |  +--------+---------+     +--------+---------+              |  |
|  |           |                      |                           |  |
|  |           v                      v                           |  |
|  |  +------------------------------------------+              |  |
|  |  |         CALLBACK FUNCTION                  |              |  |
|  |  +------------------------------------------+              |  |
|  |                    |                                        |  |
|  |                    v                                        |  |
|  |  +------------------+                                      |  |
|  |  | Output (Props)   |                                      |  |
|  |  +------------------+                                      |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |              CACHE LAYER                                    |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | LRU Cache   |  | Redis       |  | Disk Cache  |         |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### 14.2.2 Streamlit Architecture

```
+------------------------------------------------------------------+
|                  STREAMLIT APPLICATION ARCHITECTURE                |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------------------------------------------+  |
|  |  User Request --> Script Rerun --> Rendered Output          |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |  st.session_state = {'user_id': '...', 'filters': {...}}   |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Input       |  | Display     |  | Layout      |         |  |
|  |  | Widgets     |  | Elements    |  | Containers  |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  |  |st.select |  |st.write |  |st.columns |                  |  |
|  |  |st.slider |  |st.metric|  |st.expander|                  |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |  @st.cache_data    -- For dataframes and computations      |  |
|  |  @st.cache_resource -- For ML models and database conns    |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### 14.2.3 Component Interaction Flow

```
+------------------------------------------------------------------+
|              COMPONENT INTERACTION FLOW                            |
+------------------------------------------------------------------+
|                                                                    |
|  USER ACTION (Click, Type, Select)                                |
|         |                                                          |
|         v                                                          |
|  +------------------+                                             |
|  | Event Handler    |                                             |
|  | (JavaScript)     |                                             |
|  +--------+---------+                                             |
|           |  WebSocket / HTTP                                      |
|           v                                                        |
|  +------------------+                                             |
|  | Server Callback  |                                             |
|  +--------+---------+                                             |
|           v                                                        |
|  +------------------+                                             |
|  | State Update     |                                             |
|  +--------+---------+                                             |
|           v                                                        |
|  +------------------+                                             |
|  | DOM Diffing      |                                             |
|  | & Patching       |                                             |
|  +--------+---------+                                             |
|           v                                                        |
|  UPDATED UI                                                        |
+------------------------------------------------------------------+
```

---

## 14.3 Use Case 1: Complete Sales Dashboard with Dash

```python
import dash
from dash import dcc, html, Input, Output
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from datetime import datetime

app = dash.Dash(__name__, suppress_callback_exceptions=True)
server = app.server

np.random.seed(42)
n_records = 5000
categories = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports']
regions = ['North', 'South', 'East', 'West', 'Central']
sales_reps = [f'Rep_{i}' for i in range(1, 21)]
dates = pd.date_range(end=datetime.now(), periods=365, freq='D')

df = pd.DataFrame({
    'Date': np.random.choice(dates, n_records),
    'Category': np.random.choice(categories, n_records),
    'Region': np.random.choice(regions, n_records),
    'Sales_Rep': np.random.choice(sales_reps, n_records),
    'Revenue': np.random.uniform(100, 10000, n_records).round(2),
    'Quantity': np.random.randint(1, 100, n_records),
    'Profit_Margin': np.random.uniform(0.05, 0.45, n_records).round(3)
})
df['Profit'] = (df['Revenue'] * df['Profit_Margin']).round(2)
df['Month'] = df['Date'].dt.to_period('M').astype(str)

app.layout = html.Div([
    html.Div([
        html.H1('Sales Analytics Dashboard',
                style={'textAlign': 'center', 'color': '#2c3e50'}),
        html.P('Real-time sales performance metrics',
               style={'textAlign': 'center', 'color': '#7f8c8d'})
    ], style={'padding': '20px', 'backgroundColor': '#ecf0f1'}),
    html.Div([
        html.Div([html.Label('Category'),
            dcc.Dropdown(id='category-filter',
                options=[{'label': c, 'value': c} for c in categories],
                value=categories, multi=True)],
            style={'width': '25%', 'display': 'inline-block', 'padding': '10px'}),
        html.Div([html.Label('Region'),
            dcc.Dropdown(id='region-filter',
                options=[{'label': r, 'value': r} for r in regions],
                value=regions, multi=True)],
            style={'width': '25%', 'display': 'inline-block', 'padding': '10px'}),
        html.Div([html.Label('Date Range'),
            dcc.DatePickerRange(id='date-range',
                start_date=df['Date'].min(), end_date=df['Date'].max())],
            style={'width': '30%', 'display': 'inline-block', 'padding': '10px'}),
        html.Div([html.Label('Sales Rep'),
            dcc.Dropdown(id='rep-filter',
                options=[{'label': r, 'value': r} for r in sales_reps],
                value=[], multi=True, placeholder='All reps...')],
            style={'width': '20%', 'display': 'inline-block', 'padding': '10px'})
    ], style={'backgroundColor': 'white', 'margin': '10px', 'borderRadius': '5px',
              'boxShadow': '0 2px 4px rgba(0,0,0,0.1)'}),
    html.Div(id='kpi-cards', style={'padding': '10px'}),
    html.Div([
        html.Div([dcc.Graph(id='revenue-trend')],
            style={'width': '60%', 'display': 'inline-block'}),
        html.Div([dcc.Graph(id='category-pie')],
            style={'width': '40%', 'display': 'inline-block'})
    ]),
    html.Div([
        html.Div([dcc.Graph(id='region-bar')],
            style={'width': '50%', 'display': 'inline-block'}),
        html.Div([dcc.Graph(id='scatter-chart')],
            style={'width': '50%', 'display': 'inline-block'})
    ])
], style={'fontFamily': 'Arial, sans-serif', 'backgroundColor': '#f5f6fa'})

@app.callback(
    [Output('kpi-cards', 'children'), Output('revenue-trend', 'figure'),
     Output('category-pie', 'figure'), Output('region-bar', 'figure'),
     Output('scatter-chart', 'figure')],
    [Input('category-filter', 'value'), Input('region-filter', 'value'),
     Input('date-range', 'start_date'), Input('date-range', 'end_date'),
     Input('rep-filter', 'value')]
)
def update_dashboard(cats, regions_sel, start_date, end_date, reps):
    filtered = df.copy()
    if cats: filtered = filtered[filtered['Category'].isin(cats)]
    if regions_sel: filtered = filtered[filtered['Region'].isin(regions_sel)]
    if start_date: filtered = filtered[filtered['Date'] >= start_date]
    if end_date: filtered = filtered[filtered['Date'] <= end_date]
    if reps: filtered = filtered[filtered['Sales_Rep'].isin(reps)]
    total_rev = filtered['Revenue'].sum()
    total_profit = filtered['Profit'].sum()
    avg_margin = filtered['Profit_Margin'].mean()
    kpi = html.Div([
        html.Div([html.H4('Revenue'), html.H2(f'${total_rev:,.2f}',
            style={'color': '#27ae60'})],
            style={'textAlign':'center','padding':'20px','backgroundColor':'white',
                   'borderRadius':'5px','width':'23%','display':'inline-block',
                   'margin':'1%','boxShadow':'0 2px 4px rgba(0,0,0,0.1)'}),
        html.Div([html.H4('Profit'), html.H2(f'${total_profit:,.2f}',
            style={'color': '#2980b9'})],
            style={'textAlign':'center','padding':'20px','backgroundColor':'white',
                   'borderRadius':'5px','width':'23%','display':'inline-block',
                   'margin':'1%','boxShadow':'0 2px 4px rgba(0,0,0,0.1)'}),
        html.Div([html.H4('Avg Margin'), html.H2(f'{avg_margin:.1%}',
            style={'color': '#8e44ad'})],
            style={'textAlign':'center','padding':'20px','backgroundColor':'white',
                   'borderRadius':'5px','width':'23%','display':'inline-block',
                   'margin':'1%','boxShadow':'0 2px 4px rgba(0,0,0,0.1)'}),
        html.Div([html.H4('Orders'), html.H2(f'{len(filtered):,}',
            style={'color': '#e74c3c'})],
            style={'textAlign':'center','padding':'20px','backgroundColor':'white',
                   'borderRadius':'5px','width':'23%','display':'inline-block',
                   'margin':'1%','boxShadow':'0 2px 4px rgba(0,0,0,0.1)'})
    ])
    monthly = filtered.groupby('Month').agg(
        {'Revenue':'sum','Profit':'sum'}).reset_index()
    trend_fig = go.Figure()
    trend_fig.add_trace(go.Scatter(x=monthly['Month'], y=monthly['Revenue'],
        mode='lines+markers', name='Revenue', line=dict(color='#3498db', width=3)))
    trend_fig.add_trace(go.Scatter(x=monthly['Month'], y=monthly['Profit'],
        mode='lines+markers', name='Profit', line=dict(color='#2ecc71', width=3)))
    trend_fig.update_layout(title='Monthly Revenue & Profit',
        template='plotly_white', hovermode='x unified', height=400)
    cat_data = filtered.groupby('Category')['Revenue'].sum().reset_index()
    pie_fig = px.pie(cat_data, values='Revenue', names='Category',
        title='Revenue by Category', template='plotly_white', hole=0.4)
    reg_data = filtered.groupby('Region').agg(
        {'Revenue':'sum','Profit':'sum'}).reset_index()
    bar_fig = go.Figure()
    bar_fig.add_trace(go.Bar(y=reg_data['Region'], x=reg_data['Revenue'],
        name='Revenue', orientation='h', marker_color='#3498db'))
    bar_fig.add_trace(go.Bar(y=reg_data['Region'], x=reg_data['Profit'],
        name='Profit', orientation='h', marker_color='#2ecc71'))
    bar_fig.update_layout(title='By Region', template='plotly_white',
        barmode='group', height=400)
    scatter = px.scatter(filtered, x='Revenue', y='Profit', color='Category',
        size='Quantity', title='Revenue vs Profit', template='plotly_white')
    return kpi, trend_fig, pie_fig, bar_fig, scatter

if __name__ == '__main__':
    app.run(debug=True, port=8050)
```

---

## 14.4 Use Case 2: Real-Time IoT Monitoring (Streamlit)

```python
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from datetime import datetime
import time

st.set_page_config(page_title="IoT Monitor", page_icon="🏭", layout="wide")
st.title("🏭 Real-Time IoT Sensor Dashboard")

if 'sensor_data' not in st.session_state:
    st.session_state.sensor_data = pd.DataFrame()

def generate_sensor_data(n=100):
    np.random.seed(int(time.time()) % 2**32)
    ts = pd.date_range(end=datetime.now(), periods=n, freq='1min')
    return pd.DataFrame({
        'Timestamp': ts,
        'Temperature': 25 + np.sin(np.linspace(0, 4*np.pi, n)) * 5 +
                       np.random.randn(n) * 2,
        'Humidity': 60 + np.cos(np.linspace(0, 4*np.pi, n)) * 10 +
                   np.random.randn(n) * 3,
        'Vibration': abs(np.random.randn(n) * 0.5),
        'Power': 100 + np.random.randn(n) * 20
    })

with st.sidebar:
    st.header("⚙️ Controls")
    refresh = st.slider("Refresh (seconds)", 1, 30, 5)
    temp_thresh = st.slider("Temp Threshold °C", 20, 50, 35)
    hum_thresh = st.slider("Humidity Threshold %", 50, 100, 80)

new_data = generate_sensor_data()
st.session_state.sensor_data = pd.concat(
    [st.session_state.sensor_data, new_data]).tail(1000)
data = st.session_state.sensor_data

c1, c2, c3, c4, c5 = st.columns(5)
with c1: st.metric("Temperature", f"{data['Temperature'].iloc[-1]:.1f}°C")
with c2: st.metric("Humidity", f"{data['Humidity'].iloc[-1]:.1f}%")
with c3: st.metric("Vibration", f"{data['Vibration'].iloc[-1]:.3f}g")
with c4: st.metric("Power", f"{data['Power'].iloc[-1]:.1f} kW")
with c5: st.metric("Status", "✅ Normal")

tab1, tab2 = st.tabs(["📈 Real-Time", "📊 Analysis"])
with tab1:
    c1, c2 = st.columns(2)
    with c1:
        fig = go.Figure(go.Scatter(x=data['Timestamp'], y=data['Temperature'],
            mode='lines', line=dict(color='#ff6b6b', width=2)))
        fig.add_hline(y=temp_thresh, line_dash="dash", line_color="red")
        fig.update_layout(title='Temperature', template='plotly_white', height=350)
        st.plotly_chart(fig, use_container_width=True)
    with c2:
        fig = go.Figure(go.Scatter(x=data['Timestamp'], y=data['Humidity'],
            mode='lines', line=dict(color='#4ecdc4', width=2)))
        fig.add_hline(y=hum_thresh, line_dash="dash", line_color="red")
        fig.update_layout(title='Humidity', template='plotly_white', height=350)
        st.plotly_chart(fig, use_container_width=True)
with tab2:
    st.dataframe(data.describe().round(2), use_container_width=True)
time.sleep(refresh)
st.rerun()
```

---

## 14.5 Use Case 3: E-Commerce Dashboard (Dash + Bootstrap)

```python
import dash
from dash import dcc, html, Input, Output
import dash_bootstrap_components as dbc
import plotly.express as px
import pandas as pd
import numpy as np

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
np.random.seed(42)
products = ['Laptop', 'Phone', 'Tablet', 'Watch', 'Headphones']
df = pd.DataFrame({
    'Product': np.random.choice(products, 5000),
    'Price': np.random.uniform(50, 2000, 5000),
    'Quantity': np.random.randint(1, 5, 5000),
    'Revenue': np.random.uniform(50, 10000, 5000)
})

app.layout = dbc.Container([
    dbc.NavbarSimple(brand="E-Commerce Analytics", color="primary", dark=True),
    dbc.Row([
        dbc.Col([
            dbc.Card([dbc.CardHeader("Filters"), dbc.CardBody([
                dcc.Dropdown(id='prod-filter',
                    options=[{'label': p, 'value': p} for p in products],
                    value=products, multi=True),
                dcc.RangeSlider(id='price-slider', min=0, max=2000,
                    value=[0, 2000], marks={0:'$0', 1000:'$1K', 2000:'$2K'})
            ])])
        ], width=3),
        dbc.Col([
            dbc.Row([
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H6("Revenue"), html.H3(id='total-rev')
                ]), color="success", outline=True), width=4),
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H6("Avg Order"), html.H3(id='avg-order')
                ]), color="primary", outline=True), width=4),
                dbc.Col(dbc.Card(dbc.CardBody([
                    html.H6("Orders"), html.H3(id='total-orders')
                ]), color="info", outline=True), width=4),
            ], className="mb-3"),
            dcc.Graph(id='main-chart')
        ], width=9)
    ])
], fluid=True)

@app.callback(
    [Output('total-rev', 'children'), Output('avg-order', 'children'),
     Output('total-orders', 'children'), Output('main-chart', 'figure')],
    [Input('prod-filter', 'value'), Input('price-slider', 'value')]
)
def update(prods, price_range):
    f = df.copy()
    if prods: f = f[f['Product'].isin(prods)]
    if price_range:
        f = f[(f['Price'] >= price_range[0]) & (f['Price'] <= price_range[1])]
    fig = px.bar(f.groupby('Product')['Revenue'].sum().reset_index(),
        x='Product', y='Revenue', template='plotly_white')
    return f"${f['Revenue'].sum():,.2f}", f"${f['Revenue'].mean():,.2f}", f"{len(f):,}", fig

if __name__ == '__main__':
    app.run(debug=True, port=8051)
```

---

## 14.6 Use Case 4: Multi-Page Streamlit with Auth

```python
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

st.set_page_config(page_title="Enterprise Dashboard", layout="wide")
if 'auth' not in st.session_state:
    st.session_state.auth = False

if not st.session_state.auth:
    st.title("🔐 Login")
    with st.form("login"):
        u = st.text_input("Username")
        p = st.text_input("Password", type="password")
        if st.form_submit_button("Login"):
            if u == 'admin' and p == 'admin123':
                st.session_state.auth = True
                st.rerun()
            else:
                st.error("Invalid")
    st.stop()

np.random.seed(42)
data = pd.DataFrame({
    'Date': pd.date_range('2024-01-01', periods=365, freq='D'),
    'Revenue': np.cumsum(np.random.randn(365) * 1000 + 5000),
    'Orders': np.random.randint(50, 200, 365)
})

with st.sidebar:
    st.write("Welcome, admin!")
    if st.button("Logout"):
        st.session_state.auth = False
        st.rerun()
    page = st.selectbox("Navigate", ["📊 Overview", "📈 Trends"])

if page == "📊 Overview":
    st.title("📊 Overview")
    c1, c2 = st.columns(2)
    with c1: st.metric("Revenue", f"${data['Revenue'].iloc[-1]:,.0f}")
    with c2: st.metric("Orders", f"{data['Orders'].sum():,}")
    st.plotly_chart(px.line(data, x='Date', y='Revenue'), use_container_width=True)
else:
    st.title("📈 Trends")
    st.plotly_chart(px.area(data, x='Date', y='Revenue'), use_container_width=True)
```

---

## 14.7 Use Case 5: Complex Callback Chains

```python
import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd
import numpy as np

app = dash.Dash(__name__)
np.random.seed(42)
departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
teams = {
    'Engineering': ['Frontend', 'Backend', 'DevOps', 'QA'],
    'Marketing': ['Content', 'SEO', 'Social'],
    'Sales': ['Enterprise', 'SMB'], 'HR': ['Recruiting', 'Training'],
    'Finance': ['Accounting', 'FP&A']
}
records = []
for dept in departments:
    for team in teams[dept]:
        for _ in range(50):
            records.append({'Department': dept, 'Team': team,
                'Performance': np.random.uniform(60, 100),
                'Satisfaction': np.random.uniform(3, 10)})
df = pd.DataFrame(records)

app.layout = html.Div([
    html.H1('Employee Analytics', style={'textAlign': 'center'}),
    html.Div([html.H3('Department'),
        dcc.RadioItems(id='dept-radio',
            options=[{'label': d, 'value': d} for d in departments],
            value=departments[0], inline=True)], style={'padding': '20px'}),
    html.Div(id='team-container'),
    html.Div([
        html.Div([dcc.Graph(id='scatter')], style={'width':'50%','display':'inline-block'}),
        html.Div([dcc.Graph(id='violin')], style={'width':'50%','display':'inline-block'})
    ])
])

@app.callback(Output('team-container', 'children'), Input('dept-radio', 'value'))
def update_teams(dept):
    if not dept: return html.Div()
    return html.Div([
        dcc.Checklist(id='team-check',
            options=[{'label': t, 'value': t} for t in teams[dept]],
            value=teams[dept], inline=True)
    ], style={'padding': '20px', 'backgroundColor': '#f0f0f0'})

@app.callback(
    [Output('scatter', 'figure'), Output('violin', 'figure')],
    [Input('dept-radio', 'value'), Input('team-check', 'value')]
)
def update_charts(dept, selected):
    if not dept or not selected:
        return go.Figure(), go.Figure()
    f = df[(df['Department'] == dept) & (df['Team'].isin(selected))]
    s = px.scatter(f, x='Performance', y='Satisfaction', color='Team')
    v = px.violin(f, x='Team', y='Performance', box=True)
    return s, v

if __name__ == '__main__':
    app.run(debug=True, port=8052)
```

---

## 14.8 Design Principles for Dashboards

### 14.8.1 Dashboard Layout Patterns

```
+------------------------------------------------------------------+
|                 DASHBOARD LAYOUT PATTERNS                          |
+------------------------------------------------------------------+
|  PATTERN 1: KPI + DRILL-DOWN                                      |
|  +------------------------------------------------------------+  |
|  | [KPI1] [KPI2] [KPI3] [KPI4]                                |  |
|  +------------------------------------------------------------+  |
|  | [Main Chart - Full Width]                                    |  |
|  +------------------------------------------------------------+  |
|  | [Detail 1]          | [Detail 2]          | [Detail 3]      |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  PATTERN 2: SIDEBAR + CONTENT                                     |
|  +------+-----------------------------------------------------+  |
|  | SIDE | [KPI1] [KPI2] [KPI3]                                |  |
|  | BAR  |-----------------------------------------------------|  |
|  | [Nav]| [Main Content Area]                                  |  |
|  | [Flt]|-----------------------------------------------------|  |
|  |      | [Secondary Content]                                  |  |
|  +------+-----------------------------------------------------+  |
|                                                                    |
|  PATTERN 3: TAB-BASED                                             |
|  +------------------------------------------------------------+  |
|  | [Tab 1] [Tab 2] [Tab 3] [Tab 4]                            |  |
|  +------------------------------------------------------------+  |
|  | +-----------+  +-----------+  +-----------+                |  |
|  | | Chart 1   |  | Chart 2   |  | Chart 3   |                |  |
|  | +-----------+  +-----------+  +-----------+                |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### 14.8.2 Color Palette

```python
DASHBOARD_COLORS = {
    'background': '#f8f9fa', 'card_background': '#ffffff',
    'text': '#2c3e50', 'primary': '#3498db', 'success': '#27ae60',
    'danger': '#e74c3c', 'warning': '#f39c12',
    'chart_palette': ['#3498db','#e74c3c','#2ecc71','#f39c12',
                      '#9b59b6','#1abc9c','#e67e22','#34495e']
}
```

### 14.8.3 Accessibility Checklist

```
+------------------------------------------------------------------+
|              ACCESSIBILITY CHECKLIST FOR DASHBOARDS                |
+------------------------------------------------------------------+
|  [ ] Color contrast ratio >= 4.5:1 for text                      |
|  [ ] Color contrast ratio >= 3:1 for graphics                    |
|  [ ] Not relying solely on color to convey information           |
|  [ ] All interactive elements focusable via keyboard             |
|  [ ] Tab order follows logical sequence                          |
|  [ ] Proper heading hierarchy (h1 -> h2 -> h3)                   |
|  [ ] ARIA labels on interactive elements                          |
|  [ ] Large click targets (min 44x44 pixels)                      |
|  [ ] No time-limited interactions                                 |
+------------------------------------------------------------------+
```

---

## 14.9 Project Idea 1: Real-Time IoT Dashboard (Dash)

```python
import dash
from dash import dcc, html, Input, Output
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from datetime import datetime
import threading, time

app = dash.Dash(__name__)
store = {}

def generate_sensors(n=5):
    ts = datetime.now().isoformat()
    data = {}
    for i in range(1, n+1):
        np.random.seed(hash(f'S{i}{ts}') % 2**32)
        data[f'Sensor_{i}'] = {
            'temperature': 25 + np.random.randn() * 5,
            'humidity': 60 + np.random.randn() * 10,
            'battery': max(0, 100 - np.random.exponential(10)),
            'status': np.random.choice(
                ['normal', 'warning', 'critical'], p=[0.8, 0.15, 0.05])}
    return data

def update_loop():
    while True:
        store['current'] = generate_sensors()
        time.sleep(5)

threading.Thread(target=update_loop, daemon=True).start()

app.layout = html.Div([
    html.Div([html.H1('🏭 IoT Dashboard',
        style={'color': 'white', 'textAlign': 'center'})],
        style={'backgroundColor': '#2c3e50', 'padding': '20px'}),
    dcc.Interval(id='interval', interval=5000, n_intervals=0),
    html.Div(id='content', style={'padding': '20px'})
])

@app.callback(Output('content', 'children'), Input('interval', 'n_intervals'))
def update(n):
    data = store.get('current')
    if not data: return html.Div("Loading...")
    cards = []
    for sid, sd in data.items():
        color = {'normal':'#27ae60','warning':'#f39c12',
                 'critical':'#e74c3c'}[sd['status']]
        cards.append(html.Div([
            html.H4(sid),
            html.P(f"🌡️ {sd['temperature']:.1f}°C"),
            html.P(f"💧 {sd['humidity']:.1f}%"),
            html.P(f"🔋 {sd['battery']:.1f}%"),
            html.P(sd['status'].upper(),
                   style={'color': color, 'fontWeight': 'bold'})
        ], style={'backgroundColor':'white','borderRadius':'10px',
                  'padding':'15px','margin':'10px','width':'200px',
                  'display':'inline-block','boxShadow':'0 2px 4px rgba(0,0,0,0.1)',
                  'borderLeft': f'5px solid {color}'}))
    return html.Div(cards, style={'textAlign': 'center'})

if __name__ == '__main__':
    app.run(debug=True, port=8053)
```

---

## 14.10 Project Idea 2: HR Analytics Dashboard

```python
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

st.set_page_config(page_title="HR Analytics", page_icon="👥", layout="wide")

@st.cache_data
def load_data():
    np.random.seed(42)
    n = 500
    return pd.DataFrame({
        'Department': np.random.choice(
            ['Engineering','Marketing','Sales','HR','Finance'], n),
        'Job_Level': np.random.choice(
            ['Junior','Mid','Senior','Lead','Manager'], n),
        'Salary': np.random.uniform(40000, 180000, n),
        'Satisfaction': np.random.uniform(1, 10, n),
        'Performance': np.random.uniform(60, 100, n),
        'Age': np.random.randint(22, 65, n),
        'Training_Hours': np.random.randint(0, 100, n),
        'Attrition': np.random.choice([True, False], n, p=[0.16, 0.84])})

df = load_data()
st.title("👥 HR Analytics Dashboard")

with st.sidebar:
    dept_f = st.multiselect("Department", df['Department'].unique(),
                            default=df['Department'].unique())
    level_f = st.multiselect("Job Level", df['Job_Level'].unique(),
                             default=df['Job_Level'].unique())

filtered = df[df['Department'].isin(dept_f) & df['Job_Level'].isin(level_f)]

c1, c2, c3, c4 = st.columns(4)
with c1: st.metric("Employees", len(filtered))
with c2: st.metric("Avg Satisfaction", f"{filtered['Satisfaction'].mean():.1f}")
with c3: st.metric("Avg Performance", f"{filtered['Performance'].mean():.0f}")
with c4: st.metric("Attrition", f"{filtered['Attrition'].mean():.1%}")

tab1, tab2 = st.tabs(["📊 Demographics", "📈 Performance"])
with tab1:
    c1, c2 = st.columns(2)
    with c1: st.plotly_chart(px.pie(filtered, names='Department'), use_container_width=True)
    with c2: st.plotly_chart(px.histogram(filtered, x='Age', color='Department'),
                            use_container_width=True)
with tab2:
    c1, c2 = st.columns(2)
    with c1: st.plotly_chart(px.box(filtered, x='Department', y='Performance',
        color='Job_Level'), use_container_width=True)
    with c2: st.plotly_chart(px.scatter(filtered, x='Training_Hours',
        y='Performance', color='Department'), use_container_width=True)
```

---

## 14.11 Project Idea 3: Financial Portfolio Dashboard

```python
import streamlit as st
import plotly.express as px
import pandas as pd
import numpy as np
from datetime import datetime

st.set_page_config(page_title="Portfolio", page_icon="💰", layout="wide")
st.title("💰 Investment Portfolio Dashboard")

if 'portfolio' not in st.session_state:
    st.session_state.portfolio = {
        'AAPL': {'shares': 100, 'avg_cost': 150},
        'GOOGL': {'shares': 50, 'avg_cost': 2800},
        'MSFT': {'shares': 75, 'avg_cost': 300}}

with st.sidebar:
    new_ticker = st.text_input("Ticker")
    new_shares = st.number_input("Shares", min_value=1, value=10)
    new_cost = st.number_input("Avg Cost ($)", min_value=0.0, value=100.0)
    if st.button("Add"):
        if new_ticker:
            st.session_state.portfolio[new_ticker.upper()] = {
                'shares': new_shares, 'avg_cost': new_cost}
            st.rerun()

@st.cache_data
def get_data(ticker):
    np.random.seed(hash(ticker) % 2**32)
    dates = pd.date_range(end=datetime.now(), periods=252, freq='B')
    base = np.random.uniform(50, 500)
    return pd.DataFrame({'Date': dates,
        'Close': base + np.cumsum(np.random.randn(252) * base * 0.02)})

metrics = []
for t, h in st.session_state.portfolio.items():
    d = get_data(t)
    cp = d['Close'].iloc[-1]
    mv = h['shares'] * cp
    cb = h['shares'] * h['avg_cost']
    metrics.append({'Ticker': t, 'Market Value': mv, 'Cost Basis': cb,
                    'Return %': (mv - cb) / cb * 100})
m_df = pd.DataFrame(metrics)
tv = m_df['Market Value'].sum()

c1, c2, c3 = st.columns(3)
with c1: st.metric("Portfolio", f"${tv:,.2f}")
with c2: st.metric("Gain/Loss", f"${m_df['Market Value'].sum() - m_df['Cost Basis'].sum():,.2f}")
with c3: st.metric("Return",
    f"{(m_df['Market Value'].sum() - m_df['Cost Basis'].sum()) / m_df['Cost Basis'].sum() * 100:.2f}%")

c1, c2 = st.columns(2)
with c1: st.plotly_chart(px.pie(m_df, values='Market Value', names='Ticker', hole=0.4),
                        use_container_width=True)
with c2: st.plotly_chart(px.bar(m_df, x='Ticker', y='Return %', color='Return %',
    color_continuous_scale='RdYlGn'), use_container_width=True)
```

---

# Module 15: Advanced Seaborn & Statistical Visualization

## 15.1 Module Overview

Seaborn is a statistical data visualization library built on Matplotlib. This module covers heatmaps, pair plots, violin plots, regression plots, and advanced statistical visualizations.

### Learning Objectives
- Master statistical plot types in Seaborn
- Create heatmaps, pair plots, violin plots, and regression plots
- Perform distribution analysis with KDE and ECDF
- Build publication-quality statistical dashboards
- Combine multiple statistical tests with visualizations

---

## 15.2 Statistical Visualization Architecture

```
+------------------------------------------------------------------+
|              STATISTICAL VISUALIZATION ARCHITECTURE                |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                   DATA LAYER                                 |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Raw Data    |  | Cleaned     |  | Aggregated  |         |  |
|  |  | (Pandas)    |  | Data        |  | Statistics  |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |              STATISTICAL ENGINE                              |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Descriptive |  | Inferential |  | Exploratory |         |  |
|  |  | Statistics  |  | Statistics  |  | Analysis    |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  |         |                |                |                  |  |
|  |         v                v                v                  |  |
|  |  +-----------------------------------------------+         |  |
|  |  | scipy.stats / statsmodels                      |         |  |
|  |  | - t-tests, ANOVA, chi-square                  |         |  |
|  |  | - Regression, correlation                     |         |  |
|  |  | - Distribution fitting                        |         |  |
|  |  +-----------------------------------------------+         |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |              VISUALIZATION LAYER                             |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Distribution|  | Relationship|  | Categorical |         |  |
|  |  | hist, kde   |  | scatter,reg |  | box,violin  |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Plot Selection Guide

```
+------------------------------------------------------------------+
|              PLOT TYPE SELECTION GUIDE                             |
+------------------------------------------------------------------+
|  DATA TYPE              | RECOMMENDED PLOT                        |
|  -----------------------|----------------------------------------|
|  1 Continuous variable   | hist, kde, rug, ecdf                   |
|  2 Continuous variables  | scatter, reg, kde2d, hexbin            |
|  1 Categorical + 1 Cont  | box, violin, strip, swarm, bar         |
|  2 Categorical + 1 Cont  | catplot (with hue/col)                 |
|  Matrix/Data Frame       | heatmap, clustermap, pairplot          |
|  Time Series             | lineplot                               |
|  Proportions             | barplot, pointplot                     |
|  Comparison              | pairplot, jointgrid, pairgrid          |
+------------------------------------------------------------------+
```

---

## 15.3 Use Case 1: Correlation Heatmap with Clustering

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
n = 500
base = np.random.randn(n, 5)
corr_matrix = np.array([
    [1.0, 0.8, 0.6, -0.3, 0.1],
    [0.8, 1.0, 0.7, -0.2, 0.15],
    [0.6, 0.7, 1.0, -0.1, 0.2],
    [-0.3, -0.2, -0.1, 1.0, 0.5],
    [0.1, 0.15, 0.2, 0.5, 1.0]
])
L = np.linalg.cholesky(corr_matrix)
data = base @ L.T
cols = ['Income', 'Spending', 'Credit_Score', 'Age', 'Debt_Ratio']
df = pd.DataFrame(data * [30000, 15000, 100, 20, 0.3] +
                  [60000, 30000, 700, 35, 0.4], columns=cols)

fig, axes = plt.subplots(1, 2, figsize=(16, 6))

sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='RdBu_r',
            center=0, vmin=-1, vmax=1, square=True, linewidths=0.5,
            cbar_kws={'shrink': 0.8}, ax=axes[0])
axes[0].set_title('Correlation Heatmap', fontsize=14, fontweight='bold')

g = sns.clustermap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm',
                   center=0, vmin=-1, vmax=1, square=True, linewidths=0.5,
                   figsize=(8, 8), dendrogram_ratio=0.15)
g.fig.suptitle('Clustered Correlation', y=1.02, fontsize=14, fontweight='bold')

plt.tight_layout()
plt.savefig('correlation_analysis.png', dpi=150, bbox_inches='tight')
plt.show()
```

---

## 15.4 Use Case 2: Multi-Dimensional Pair Plot

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

np.random.seed(42)
n = 300
groups = np.random.choice(['Treatment A', 'Treatment B', 'Placebo'], n,
                          p=[0.35, 0.35, 0.3])
df = pd.DataFrame({
    'BMI': np.random.normal(26, 4, n),
    'Blood_Pressure': np.random.normal(120, 15, n),
    'Cholesterol': np.random.normal(200, 30, n),
    'Glucose': np.random.normal(100, 20, n),
    'Treatment': groups
})
df.loc[df['Treatment'] == 'Treatment A', 'Blood_Pressure'] -= 8
df.loc[df['Treatment'] == 'Treatment A', 'Cholesterol'] -= 15

g = sns.pairplot(
    df, hue='Treatment',
    vars=['BMI', 'Blood_Pressure', 'Cholesterol', 'Glucose'],
    diag_kind='kde',
    plot_kws={'alpha': 0.6, 's': 30, 'edgecolor': 'white'},
    diag_kws={'linewidth': 2, 'fill': True, 'alpha': 0.3},
    palette={'Treatment A': '#e74c3c', 'Treatment B': '#3498db',
             'Placebo': '#2ecc71'},
    corner=True
)
g.fig.suptitle('Clinical Study Pair Plot', y=1.02,
               fontsize=16, fontweight='bold')
plt.savefig('pairplot.png', dpi=150, bbox_inches='tight')
plt.show()

print("ANOVA Tests:")
for col in ['BMI', 'Blood_Pressure', 'Cholesterol', 'Glucose']:
    groups_data = [df[df['Treatment'] == g][col].values
                   for g in df['Treatment'].unique()]
    f_stat, p_val = stats.f_oneway(*groups_data)
    sig = "***" if p_val < 0.001 else "**" if p_val < 0.01 else "*" if p_val < 0.05 else "ns"
    print(f"  {col}: F={f_stat:.2f}, p={p_val:.4f} {sig}")
```

---

## 15.5 Use Case 3: Violin + Box + Swarm Combined

```python
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import pandas as pd
import numpy as np

np.random.seed(42)
categories = ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR']
levels = ['Junior', 'Senior']

data = []
for cat in categories:
    for level in levels:
        base = {'Junior': 60, 'Senior': 75}[level] + \
               {'Engineering': 10, 'Marketing': 0, 'Sales': 5,
                'Finance': 8, 'HR': -2}[cat]
        for _ in range(60):
            data.append({
                'Department': cat, 'Level': level,
                'Performance': base + np.random.randn() * 10,
                'Satisfaction': np.random.uniform(3, 10),
                'Salary': base * 800 + np.random.randn() * 5000})
df = pd.DataFrame(data)

fig = plt.figure(figsize=(20, 12))
gs = gridspec.GridSpec(2, 3, hspace=0.35, wspace=0.3)

ax1 = fig.add_subplot(gs[0, 0])
sns.violinplot(data=df, x='Department', y='Performance', hue='Level',
              split=True, inner='box', palette='Set2', ax=ax1)
ax1.set_title('Performance Distribution', fontsize=12, fontweight='bold')

ax2 = fig.add_subplot(gs[0, 1])
sns.boxplot(data=df, x='Department', y='Satisfaction', palette='pastel',
           ax=ax2, width=0.6, fliersize=0)
sns.stripplot(data=df, x='Department', y='Satisfaction', palette='dark',
             ax=ax2, size=4, alpha=0.5, jitter=0.2)
ax2.set_title('Satisfaction Distribution', fontsize=12, fontweight='bold')

ax3 = fig.add_subplot(gs[0, 2])
sns.scatterplot(data=df, x='Performance', y='Salary', hue='Department',
               palette='Set1', alpha=0.6, s=50, ax=ax3)
ax3.set_title('Performance vs Salary', fontsize=12, fontweight='bold')

ax4 = fig.add_subplot(gs[1, 0])
pivot = df.groupby(['Department', 'Level'])['Performance'].mean().unstack()
sns.heatmap(pivot, annot=True, fmt='.1f', cmap='YlOrRd',
           ax=ax4, linewidths=1)
ax4.set_title('Mean Performance', fontsize=12, fontweight='bold')

ax5 = fig.add_subplot(gs[1, 1])
sns.boxenplot(data=df, x='Department', y='Salary', hue='Level',
             palette='Set3', ax=ax5)
ax5.set_title('Salary (Boxen Plot)', fontsize=12, fontweight='bold')

ax6 = fig.add_subplot(gs[1, 2])
sns.pointplot(data=df, x='Department', y='Performance', hue='Level',
             palette='Set1', ax=ax6, dodge=True, ci=95)
ax6.set_title('Mean Performance with 95% CI', fontsize=12, fontweight='bold')

plt.suptitle('Employee Performance Analysis', fontsize=16, fontweight='bold')
plt.savefig('combined_stats.png', dpi=150, bbox_inches='tight')
plt.show()
```

---

## 15.6 Use Case 4: Regression Analysis with Diagnostics

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats
from sklearn.linear_model import LinearRegression

np.random.seed(42)
n = 200
sqft = np.random.uniform(500, 3500, n)
bedrooms = np.random.randint(1, 6, n)
age = np.random.uniform(0, 50, n)
distance = np.random.uniform(0.5, 25, n)
price = 50000 + 150 * sqft + 20000 * bedrooms - 500 * age - \
        3000 * distance + np.random.randn(n) * 20000

df = pd.DataFrame({'SqFt': sqft, 'Bedrooms': bedrooms, 'Age': age,
                   'Distance': distance, 'Price': price})

X = df[['SqFt', 'Bedrooms', 'Age', 'Distance']]
y = df['Price']
model = LinearRegression().fit(X, y)
residuals = y - model.predict(X)

fig, axes = plt.subplots(2, 3, figsize=(18, 12))

sns.regplot(data=df, x='SqFt', y='Price', ax=axes[0, 0],
           scatter_kws={'alpha': 0.5, 's': 20},
           line_kws={'color': 'red', 'linewidth': 2})
r, p = stats.pearsonr(df['SqFt'], df['Price'])
axes[0, 0].set_title(f'SqFt vs Price (r={r:.3f}, p={p:.2e})',
                     fontsize=11, fontweight='bold')

axes[0, 1].scatter(model.predict(X), residuals, alpha=0.5, s=20)
axes[0, 1].axhline(y=0, color='red', linestyle='--', linewidth=2)
axes[0, 1].set_title('Residuals vs Fitted', fontsize=11, fontweight='bold')

stats.probplot(residuals, dist="norm", plot=axes[0, 2])
axes[0, 2].set_title('Normal Q-Q Plot', fontsize=11, fontweight='bold')

sqrt_resid = np.sqrt(np.abs(residuals))
axes[1, 0].scatter(model.predict(X), sqrt_resid, alpha=0.5, s=20)
z = np.polyfit(model.predict(X), sqrt_resid, 1)
p_line = np.poly1d(z)
axes[1, 0].plot(sorted(model.predict(X)),
                p_line(sorted(model.predict(X))), "r--")
axes[1, 0].set_title('Scale-Location', fontsize=11, fontweight='bold')

std_resid = residuals / np.std(residuals)
hat = np.diag(X.values @ np.linalg.pinv(X.values.T @ X.values) @ X.values.T)
axes[1, 1].scatter(hat, std_resid, alpha=0.6, s=30)
axes[1, 1].axhline(y=2, color='red', linestyle=':', linewidth=1)
axes[1, 1].axhline(y=-2, color='red', linestyle=':', linewidth=1)
axes[1, 1].set_title('Influence Plot', fontsize=11, fontweight='bold')

sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm',
           center=0, ax=axes[1, 2], square=True, linewidths=1)
axes[1, 2].set_title('Feature Correlation', fontsize=11, fontweight='bold')

plt.suptitle('Regression Diagnostics', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('regression_diagnostics.png', dpi=150, bbox_inches='tight')
plt.show()

print(f"R²: {model.score(X, y):.4f}")
print(f"RMSE: {np.sqrt(np.mean(residuals**2)):,.2f}")
for feat, coef in zip(X.columns, model.coef_):
    print(f"  {feat}: {coef:,.2f}")
```

---

## 15.7 Use Case 5: Distribution Analysis with KDE

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

np.random.seed(42)
n = 500
data_a = np.concatenate([np.random.normal(20, 3, n//2),
                         np.random.normal(30, 4, n//2)])
data_b = np.concatenate([np.random.normal(18, 5, n//2),
                         np.random.normal(35, 3, n//2)])
data_c = np.random.normal(25, 6, n)

df = pd.DataFrame({
    'Value': np.concatenate([data_a, data_b, data_c]),
    'Population': ['A']*n + ['B']*n + ['C']*n
})

fig, axes = plt.subplots(2, 3, figsize=(18, 12))

sns.histplot(data=df, x='Value', hue='Population', kde=True,
            stat='density', common_norm=False, ax=axes[0, 0],
            palette='Set1', alpha=0.4, element='step')
axes[0, 0].set_title('Histogram + KDE', fontsize=12, fontweight='bold')

for pop in ['A', 'B', 'C']:
    sns.kdeplot(data=df[df['Population']==pop], x='Value',
               ax=axes[0, 1], fill=True, alpha=0.5, linewidth=2,
               label=f'Pop {pop}')
axes[0, 1].legend()
axes[0, 1].set_title('Density Comparison', fontsize=12, fontweight='bold')

sns.ecdfplot(data=df, x='Value', hue='Population', ax=axes[0, 2], linewidth=2)
axes[0, 2].set_title('Empirical CDF', fontsize=12, fontweight='bold')

sns.violinplot(data=df, x='Population', y='Value', ax=axes[1, 0],
              palette='Set2', inner='quartile')
sns.stripplot(data=df, x='Population', y='Value', ax=axes[1, 0],
             color='black', alpha=0.1, size=2, jitter=True)
axes[1, 0].set_title('Violin + Strip', fontsize=12, fontweight='bold')

sns.kdeplot(data=df[df['Population']=='A'], x='Value',
           fill=True, ax=axes[1, 1], alpha=0.5, label='A')
sns.kdeplot(data=df[df['Population']=='B'], x='Value',
           fill=True, ax=axes[1, 1], alpha=0.5, label='B')
axes[1, 1].legend()
axes[1, 1].set_title('Overlapping KDE', fontsize=12, fontweight='bold')

sns.histplot(data=df, x='Value', hue='Population', ax=axes[1, 2],
            palette='Set1', multiple='stack', alpha=0.7)
sns.rugplot(data=df, x='Value', hue='Population', ax=axes[1, 2],
           palette='Set1', alpha=0.3, height=0.1)
axes[1, 2].set_title('Stacked + Rug', fontsize=12, fontweight='bold')

plt.suptitle('Distribution Analysis', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('distributions.png', dpi=150, bbox_inches='tight')
plt.show()

print("Shapiro-Wilk Tests:")
for pop in ['A', 'B', 'C']:
    s, p = stats.shapiro(df[df['Population'] == pop]['Value'][:500])
    print(f"  Pop {pop}: W={s:.4f}, p={p:.4f}")
```

---

## 15.8 Use Case 6: Categorical Analysis

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

np.random.seed(42)
n = 1000
df = pd.DataFrame({
    'Department': np.random.choice(
        ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'], n),
    'Performance': np.random.choice(
        ['Exceeds', 'Meets', 'Needs Improvement'], n, p=[0.3, 0.5, 0.2]),
    'Gender': np.random.choice(['M', 'F'], n),
    'Training': np.random.choice(['Completed', 'In Progress', 'Not Started'], n)
})

fig, axes = plt.subplots(2, 3, figsize=(18, 12))

ct = pd.crosstab(df['Department'], df['Performance'], normalize='index')
ct.plot(kind='bar', stacked=True, ax=axes[0, 0], colormap='Set2')
axes[0, 0].set_title('Proportional Comparison', fontsize=12, fontweight='bold')
axes[0, 0].legend(title='Performance', bbox_to_anchor=(1.05, 1))

ct_counts = pd.crosstab(df['Department'], df['Performance'])
chi2, p, dof, expected = stats.chi2_contingency(ct_counts)
residuals = (ct_counts - expected) / np.sqrt(expected)
sns.heatmap(residuals, annot=True, fmt='.2f', cmap='RdBu_r',
           center=0, ax=axes[0, 1], linewidths=1)
axes[0, 1].set_title(f'Std Residuals (χ²={chi2:.1f}, p={p:.4f})',
                     fontsize=11, fontweight='bold')

sns.countplot(data=df, x='Department', hue='Performance',
             ax=axes[0, 2], palette='pastel')
axes[0, 2].set_title('Performance by Dept', fontsize=12, fontweight='bold')

sns.countplot(data=df, x='Department', hue='Training',
             ax=axes[1, 0], palette='Set1')
axes[1, 0].set_title('Training Status', fontsize=12, fontweight='bold')

def cramers_v(cm):
    chi2 = stats.chi2_contingency(cm)[0]
    n = cm.sum().sum()
    return np.sqrt(chi2 / (n * min(cm.shape) - 1))

cats = ['Department', 'Performance', 'Gender', 'Training']
v_mat = pd.DataFrame(np.zeros((len(cats), len(cats))),
                     index=cats, columns=cats)
for i, c1 in enumerate(cats):
    for j, c2 in enumerate(cats):
        if i <= j:
            ct = pd.crosstab(df[c1], df[c2])
            v = cramers_v(ct)
            v_mat.loc[c1, c2] = v
            v_mat.loc[c2, c1] = v

sns.heatmap(v_mat, annot=True, fmt='.3f', cmap='YlOrRd',
           vmin=0, vmax=1, ax=axes[1, 1], linewidths=1)
axes[1, 1].set_title("Cramér's V", fontsize=12, fontweight='bold')

sns.countplot(data=df, x='Performance', hue='Department',
             ax=axes[1, 2], palette='Set1')
axes[1, 2].set_title('Performance by Dept (Reversed)',
                     fontsize=12, fontweight='bold')

plt.suptitle('Categorical Analysis', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('categorical.png', dpi=150, bbox_inches='tight')
plt.show()
```

---

## 15.9 Use Case 7: Time Series Decomposition

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose

np.random.seed(42)
days = 365 * 2
dates = pd.date_range('2023-01-01', periods=days, freq='D')
trend = np.linspace(100, 200, days)
seasonal = 30 * np.sin(2 * np.pi * np.arange(days) / 365)
noise = np.random.randn(days) * 10
demand = trend + seasonal + noise

df = pd.DataFrame({'Date': dates, 'Demand': demand}).set_index('Date')
decomp = seasonal_decompose(df['Demand'], model='additive', period=365)

fig, axes = plt.subplots(4, 1, figsize=(14, 10), sharex=True)
axes[0].plot(decomp.observed, color='#3498db', linewidth=1.5)
axes[0].set_ylabel('Observed')
axes[0].set_title('Time Series Decomposition', fontsize=14, fontweight='bold')
axes[1].plot(decomp.trend, color='#e74c3c', linewidth=2)
axes[1].set_ylabel('Trend')
axes[2].plot(decomp.seasonal, color='#2ecc71', linewidth=1)
axes[2].set_ylabel('Seasonal')
axes[3].plot(decomp.resid, color='#9b59b6', linewidth=1)
axes[3].set_ylabel('Residual')
plt.tight_layout()
plt.savefig('decomposition.png', dpi=150, bbox_inches='tight')
plt.show()

fig, ax = plt.subplots(figsize=(14, 5))
ax.plot(df['Demand'], alpha=0.3, label='Original', color='gray')
ax.plot(df['Demand'].rolling(7).mean(), label='7-day MA',
       color='#3498db', linewidth=2)
ax.plot(df['Demand'].rolling(30).mean(), label='30-day MA',
       color='#e74c3c', linewidth=2)
ax.plot(df['Demand'].rolling(90).mean(), label='90-day MA',
       color='#2ecc71', linewidth=2)
ax.legend()
ax.grid(True, alpha=0.3)
ax.set_title('Moving Averages', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

---

## 15.10 Use Case 8: Custom PairGrid

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

np.random.seed(42)
n = 300
df = pd.DataFrame({
    'X1': np.random.randn(n), 'X2': np.random.randn(n) * 0.8 + 0.3,
    'X3': np.random.randn(n) * 1.2 - 0.1, 'X4': np.random.randn(n) * 0.5,
    'Group': np.random.choice(['Control', 'Treatment'], n)
})

def corr_func(x, y, **kwargs):
    r, p = stats.pearsonr(x, y)
    color = '#27ae60' if p < 0.05 else '#e74c3c'
    ax = plt.gca()
    ax.annotate(f'r={r:.2f}\np={p:.3f}',
               xy=(0.5, 0.5), xycoords='axes fraction',
               ha='center', va='center', fontsize=9, color=color,
               fontweight='bold',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

def lower_func(x, y, **kwargs):
    plt.gca().scatter(x, y, alpha=0.3, s=15)

g = sns.PairGrid(df, hue='Group', palette='Set1', height=2.5)
g.map_upper(plt.scatter, alpha=0.4, s=20)
g.map_lower(lower_func)
g.map_diag(sns.kdeplot, fill=True, alpha=0.4, linewidth=2)
g.map_offdiag(corr_func)
g.add_legend(title='Group')
g.fig.suptitle('Custom PairGrid', y=1.02, fontsize=16, fontweight='bold')
plt.savefig('pairgrid.png', dpi=150, bbox_inches='tight')
plt.show()
```

---

## 15.11 Design Patterns for Statistical Visualization

### Layered Visualization Pattern

```
+------------------------------------------------------------------+
|              LAYERED VISUALIZATION PATTERN                         |
+------------------------------------------------------------------+
|                                                                    |
|  Layer 5: Annotations & Labels                                    |
|  +------------------------------------------------------------+  |
|  |  Title, axis labels, legend, statistical annotations       |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 4: Statistical Overlays                                    |
|  +------------------------------------------------------------+  |
|  |  Regression lines, confidence bands, distribution fits     |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 3: Data Representation                                     |
|  +------------------------------------------------------------+  |
|  |  Points, bars, lines, box plots, violin plots, heatmaps   |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 2: Scale & Axes                                            |
|  +------------------------------------------------------------+  |
|  |  Linear, log, categorical axes, ticks, grids              |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 1: Canvas                                                  |
|  +------------------------------------------------------------+  |
|  |  Figure size, DPI, background, margins                     |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## 15.12 Project Idea 1: Statistical Report Generator

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats
import os

class StatisticalReport:
    def __init__(self, data, output_dir='reports'):
        self.data = data
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def descriptive_stats(self):
        desc = self.data.describe()
        desc.loc['skewness'] = self.data.skew()
        desc.loc['kurtosis'] = self.data.kurtosis()
        desc.loc['missing'] = self.data.isnull().sum()
        return desc

    def normality_tests(self, columns=None):
        if columns is None:
            columns = self.data.select_dtypes(include=[np.number]).columns
        results = []
        for col in columns:
            s, p = stats.shapiro(self.data[col].dropna()[:5000])
            results.append({'Column': col, 'Statistic': s,
                          'P-value': p, 'Normal': p > 0.05})
        return pd.DataFrame(results)

    def create_visualizations(self, columns=None):
        if columns is None:
            columns = self.data.select_dtypes(include=[np.number]).columns
        n = min(len(columns), 4)
        fig, axes = plt.subplots(2, n, figsize=(5*n, 10))
        axes = axes.flatten() if n > 1 else [axes]
        for i, col in enumerate(columns[:8]):
            sns.histplot(self.data[col], kde=True, ax=axes[i],
                        color='#3498db', alpha=0.7)
            axes[i].axvline(self.data[col].mean(), color='red', linestyle='--')
            axes[i].set_title(col, fontsize=11, fontweight='bold')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/distributions.png', dpi=150)
        plt.close()

    def correlation_analysis(self):
        numeric = self.data.select_dtypes(include=[np.number])
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(numeric.corr(), annot=True, fmt='.2f',
                   cmap='coolwarm', center=0, ax=ax, square=True)
        ax.set_title('Correlation Matrix', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/correlations.png', dpi=150)
        plt.close()

    def generate_report(self):
        print("Generating Report...")
        print("=" * 60)
        desc = self.descriptive_stats()
        print("\nDescriptive Statistics:")
        print(desc.round(3).to_string())
        norm = self.normality_tests()
        print("\n\nNormality Tests:")
        print(norm.to_string(index=False))
        self.create_visualizations()
        self.correlation_analysis()
        print(f"\nSaved to: {self.output_dir}/")

np.random.seed(42)
df = pd.DataFrame({
    'Revenue': np.random.lognormal(10, 1, 1000),
    'Customers': np.random.poisson(50, 1000),
    'Satisfaction': np.random.beta(5, 2, 1000) * 10,
    'Response_Time': np.random.exponential(5, 1000)
})
report = StatisticalReport(df)
report.generate_report()
```

---

## 15.13 Project Idea 2: A/B Test Statistical Dashboard

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import stats

class ABTestAnalyzer:
    def __init__(self):
        self.results = None

    def run_test(self, n=1000, ctrl_rate=0.12, treat_rate=0.15):
        np.random.seed(42)
        control = np.random.binomial(1, ctrl_rate, n)
        treatment = np.random.binomial(1, treat_rate, n)
        contingency = np.array([[control.sum(), n - control.sum()],
                               [treatment.sum(), n - treatment.sum()]])
        chi2, p_val, dof, expected = stats.chi2_contingency(contingency)
        h = 2 * (np.arcsin(np.sqrt(treatment.mean())) -
                np.arcsin(np.sqrt(control.mean())))
        self.results = {
            'control': control, 'treatment': treatment,
            'ctrl_rate': control.mean(), 'treat_rate': treatment.mean(),
            'chi2': chi2, 'p_value': p_val, 'effect_size': h,
            'lift': (treatment.mean() - control.mean()) / control.mean() * 100}

    def create_dashboard(self):
        r = self.results
        fig, axes = plt.subplots(2, 3, figsize=(18, 10))

        axes[0, 0].bar(['Control', 'Treatment'], [r['ctrl_rate'], r['treat_rate']],
                       color=['#3498db', '#2ecc71'], edgecolor='white')
        axes[0, 0].set_title('Conversion Rates', fontsize=12, fontweight='bold')
        for i, v in enumerate([r['ctrl_rate'], r['treat_rate']]):
            axes[0, 0].text(i, v + 0.002, f'{v:.2%}', ha='center', fontweight='bold')

        for data, name, color in [(r['control'], 'Control', '#3498db'),
                                   (r['treatment'], 'Treatment', '#2ecc71')]:
            cum = data.cumsum() / range(1, len(data) + 1)
            axes[0, 1].plot(cum, label=name, color=color)
        axes[0, 1].legend()
        axes[0, 1].set_title('Cumulative Conversion', fontsize=12, fontweight='bold')

        axes[0, 2].boxplot([r['control'], r['treatment']],
                          labels=['Control', 'Treatment'])
        axes[0, 2].set_title('Distribution', fontsize=12, fontweight='bold')

        sns.histplot(r['control'], alpha=0.5, label='Control',
                    ax=axes[1, 0], color='#3498db')
        sns.histplot(r['treatment'], alpha=0.5, label='Treatment',
                    ax=axes[1, 0], color='#2ecc71')
        axes[1, 0].legend()
        axes[1, 0].set_title('Overlapping Distributions', fontsize=12, fontweight='bold')

        summary = f"P-value: {r['p_value']:.4f}\nEffect Size: {r['effect_size']:.4f}\nLift: {r['lift']:.1f}%"
        axes[1, 1].text(0.5, 0.5, summary, transform=axes[1, 1].transAxes,
                       fontsize=14, ha='center', va='center',
                       bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
        axes[1, 1].set_title('Summary', fontsize=12, fontweight='bold')
        axes[1, 1].axis('off')

        sig = 'YES' if r['p_value'] < 0.05 else 'NO'
        color = '#27ae60' if sig == 'YES' else '#e74c3c'
        axes[1, 2].text(0.5, 0.5, f'Significant?\n\n{sig}',
                       transform=axes[1, 2].transAxes, fontsize=24,
                       ha='center', va='center', color=color, fontweight='bold')
        axes[1, 2].axis('off')

        plt.suptitle('A/B Test Dashboard', fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.savefig('ab_test.png', dpi=150, bbox_inches='tight')
        plt.show()

analyzer = ABTestAnalyzer()
analyzer.run_test()
analyzer.create_dashboard()
```

---

## 15.14 Project Idea 3: Data Quality Dashboard

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

class DataQualityDashboard:
    def __init__(self, df):
        self.df = df

    def missing_analysis(self):
        missing = self.df.isnull().sum()
        missing_pct = (missing / len(self.df)) * 100
        return pd.DataFrame({'Missing': missing, 'Percentage': missing_pct})

    def create_dashboard(self):
        fig, axes = plt.subplots(2, 3, figsize=(20, 12))

        missing = self.missing_analysis()
        missing[missing['Missing'] > 0].plot(
            kind='barh', y='Percentage', ax=axes[0, 0], color='#e74c3c')
        axes[0, 0].set_title('Missing Values %', fontsize=12, fontweight='bold')

        dtypes = self.df.dtypes.value_counts()
        axes[0, 1].pie(dtypes.values, labels=dtypes.index,
                      autopct='%1.1f%%', colors=sns.color_palette('Set2'))
        axes[0, 1].set_title('Column Types', fontsize=12, fontweight='bold')

        num_cols = self.df.select_dtypes(include=[np.number]).columns
        if len(num_cols) > 0:
            self.df[num_cols].boxplot(ax=axes[0, 2])
            axes[0, 2].set_title('Numeric Distributions', fontsize=12,
                                fontweight='bold')
            axes[0, 2].tick_params(axis='x', rotation=45)

        if len(num_cols) > 1:
            sns.heatmap(self.df[num_cols].corr(), annot=True, fmt='.2f',
                       cmap='coolwarm', ax=axes[1, 0], center=0)
            axes[1, 0].set_title('Correlations', fontsize=12,
                                fontweight='bold')

        nunique = self.df.nunique()
        axes[1, 1].barh(nunique.index, nunique.values, color='#3498db')
        axes[1, 1].set_title('Unique Values per Column', fontsize=12,
                            fontweight='bold')

        sample_sizes = [len(self.df.sample(frac=f, random_state=42))
                       for f in [0.1, 0.25, 0.5, 0.75, 1.0]]
        axes[1, 2].plot([10, 25, 50, 75, 100], sample_sizes,
                       marker='o', color='#2ecc71')
        axes[1, 2].set_title('Sample Size Consistency', fontsize=12,
                            fontweight='bold')
        axes[1, 2].set_xlabel('Sample %')

        plt.suptitle('Data Quality Dashboard', fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.savefig('data_quality.png', dpi=150, bbox_inches='tight')
        plt.show()

np.random.seed(42)
df = pd.DataFrame({
    'A': np.random.randn(1000),
    'B': np.random.choice(['x', 'y', 'z'], 1000),
    'C': np.random.uniform(0, 100, 1000),
    'D': np.random.randint(0, 10, 1000)
})
df.loc[np.random.choice(df.index, 50), 'A'] = np.nan

dq = DataQualityDashboard(df)
dq.create_dashboard()
```

---

## 15.15 Alternative Approaches

### Seaborn vs Matplotlib vs Plotly for Statistical Plots

```python
# SEABORN: Statistical plots (simplest)
import seaborn as sns
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 6))
sns.regplot(data=df, x='x', y='y', ax=ax,
           scatter_kws={'alpha': 0.5}, line_kws={'color': 'red'})
ax.set_title('Seaborn Regression')

# MATPLOTLIB: Manual calculation
from sklearn.linear_model import LinearRegression
import numpy as np

model = LinearRegression().fit(df[['x']], df['y'])
ax2 = plt.gca()
ax2.scatter(df['x'], df['y'], alpha=0.5)
ax2.plot(df['x'], model.predict(df[['x']]), color='red')

# PLOTLY: Interactive
import plotly.express as px
fig = px.scatter(df, x='x', y='y', trendline='ols', opacity=0.5)
fig.update_layout(title='Plotly Regression')
```

---

# Module 16: Geospatial & Network Visualization

## 16.1 Module Overview

This module covers geospatial visualization with Folium, network analysis with NetworkX, choropleth maps, flow maps, and spatial data analysis.

### Learning Objectives
- Create interactive maps with Folium
- Build network graphs with NetworkX
- Create choropleth and heatmaps
- Visualize flow maps and spatial patterns
- Perform geospatial data analysis

---

## 16.2 Geospatial Visualization Architecture

```
+------------------------------------------------------------------+
|              GEOSPATIAL VISUALIZATION ARCHITECTURE                 |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                   DATA LAYER                                 |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | GPS/Data    |  | Shapefiles  |  | API Data    |         |  |
|  |  | (Lat/Lon)   |  | (GeoJSON)   |  | (OpenStreet)|         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |              PROCESSING LAYER                                |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Projection  |  | Clustering  |  | Spatial     |         |  |
|  |  | Transform   |  | (DBSCAN)    |  | Join        |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |              VISUALIZATION LAYER                             |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Folium      |  | Plotly Geo  |  | Matplotlib  |         |  |
|  |  | (Leaflet)   |  | (Choropleth)|  | Basemap     |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Network Visualization Architecture

```
+------------------------------------------------------------------+
|              NETWORK VISUALIZATION ARCHITECTURE                    |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------------------------------------------+  |
|  |  INPUT: Edge List / Adjacency Matrix / Graph Object        |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |  NETWORKX ENGINE                                            |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Graph       |  | Algorithms  |  | Centrality  |         |  |
|  |  | Construction|  | (BFS/DFS)   |  | Measures    |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  +------------------------------------------------------------+  |
|                            |                                       |
|                            v                                       |
|  +------------------------------------------------------------+  |
|  |  RENDERING LAYER                                            |  |
|  |  +-------------+  +-------------+  +-------------+         |  |
|  |  | Spring      |  | Circular    |  | Kamada-     |         |  |
|  |  | Layout      |  | Layout      |  | Kawai       |         |  |
|  |  +------+------+  +------+------+  +------+------+         |  |
|  |         |                |                |                  |  |
|  |         v                v                v                  |  |
|  |  +----------------------------------------------------+    |  |
|  |  |  Matplotlib / Pyvis / Plotly                        |    |  |
|  |  +----------------------------------------------------+    |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## 16.3 Use Case 1: Interactive Map with Folium

```python
import folium
from folium.plugins import MarkerCluster, HeatMap
import pandas as pd
import numpy as np

np.random.seed(42)
n = 500
df = pd.DataFrame({
    'lat': np.random.uniform(1.2, 1.5, n),
    'lon': np.random.uniform(103.6, 104.0, n),
    'value': np.random.exponential(100, n),
    'category': np.random.choice(
        ['Restaurant', 'Hotel', 'Attraction', 'Shop'], n)
})

m = folium.Map(location=[1.35, 103.8], zoom_start=12,
               tiles='CartoDB positron')

marker_cluster = MarkerCluster(name='Locations').add_to(m)
colors = {'Restaurant': 'red', 'Hotel': 'blue',
          'Attraction': 'green', 'Shop': 'orange'}

for _, row in df.iterrows():
    folium.CircleMarker(
        location=[row['lat'], row['lon']],
        radius=min(row['value'] / 10, 20),
        color=colors[row['category']],
        fill=True, fill_opacity=0.6,
        popup=folium.Popup(
            f"<b>{row['category']}</b><br>"
            f"Value: ${row['value']:.0f}<br>"
            f"Lat: {row['lat']:.4f}, Lon: {row['lon']:.4f}",
            max_width=200)
    ).add_to(marker_cluster)

heat_data = df[['lat', 'lon']].values.tolist()
HeatMap(heat_data, radius=15, blur=10, max_zoom=1,
        name='Heatmap').add_to(m)

folium.LayerControl().add_to(m)
m.save('interactive_map.html')
print("Map saved to interactive_map.html")
```

---

## 16.4 Use Case 2: Choropleth Map

```python
import plotly.express as px
import pandas as pd
import numpy as np

np.random.seed(42)
countries = ['USA', 'GBR', 'DEU', 'FRA', 'JPN', 'CHN', 'IND', 'BRA',
             'AUS', 'CAN', 'KOR', 'MEX', 'ZAF', 'NGA', 'EGY', 'TUR',
             'SAU', 'ARG', 'POL', 'NLD']
data = pd.DataFrame({
    'country': countries,
    'iso_alpha': countries,
    'Sales': np.random.uniform(100000, 5000000, len(countries)),
    'Growth': np.random.uniform(-5, 25, len(countries)),
    'Region': np.random.choice(
        ['Americas', 'Europe', 'Asia', 'Africa', 'Oceania'], len(countries))
})

fig = px.choropleth(
    data, locations='iso_alpha', color='Sales',
    hover_name='country', hover_data={'Sales': ':$,.0f', 'Growth': ':.1f%',
                                      'iso_alpha': False},
    color_continuous_scale='Viridis',
    projection='natural earth',
    title='Global Sales by Country',
    template='plotly_white'
)
fig.update_layout(height=600, geo=dict(showframe=False, showcoastlines=True))
fig.show()

fig2 = px.choropleth(
    data, locations='iso_alpha', color='Growth',
    hover_name='country',
    color_continuous_scale='RdYlGn', center={'lat': 20, 'lon': 0},
    projection='natural earth',
    title='Growth Rate by Country',
    template='plotly_white'
)
fig2.update_layout(height=600)
fig2.show()
```

---

## 16.5 Use Case 3: Network Graph with NetworkX

```python
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

G = nx.Graph()

departments = ['CEO', 'CTO', 'CFO', 'CMO', 'COO',
               'Engineering', 'Marketing', 'Sales', 'Finance', 'HR',
               'Dev', 'QA', 'Content', 'SEO', 'Enterprise', 'SMB']

for dept in departments:
    G.add_node(dept, type='department' if dept in departments[:5] else 'team')

edges = [
    ('CEO', 'CTO', 10), ('CEO', 'CFO', 8), ('CEO', 'CMO', 7),
    ('CEO', 'COO', 9), ('CTO', 'Engineering', 10),
    ('CTO', 'Marketing', 3), ('CMO', 'Marketing', 10),
    ('CMO', 'Sales', 5), ('CFO', 'Finance', 10),
    ('COO', 'Sales', 7), ('COO', 'HR', 6),
    ('Engineering', 'Dev', 10), ('Engineering', 'QA', 8),
    ('Marketing', 'Content', 8), ('Marketing', 'SEO', 7),
    ('Sales', 'Enterprise', 9), ('Sales', 'SMB', 8),
]

for u, w, weight in edges:
    G.add_edge(u, w, weight=weight)

pos = nx.spring_layout(G, k=2, iterations=50, seed=42)

fig, axes = plt.subplots(1, 3, figsize=(24, 8))

# Degree centrality
degree = nx.degree_centrality(G)
node_sizes = [degree[n] * 3000 + 200 for n in G.nodes()]
node_colors = [degree[n] for n in G.nodes()]
nx.draw(G, pos, ax=axes[0], node_size=node_sizes, node_color=node_colors,
        cmap=plt.cm.YlOrRd, with_labels=True, font_size=8,
        font_weight='bold', edge_color='gray', width=[G[u][v]['weight']/3
        for u, v in G.edges()])
axes[0].set_title('Degree Centrality', fontsize=14, fontweight='bold')

# Betweenness centrality
betweenness = nx.betweenness_centrality(G)
node_sizes2 = [betweenness[n] * 5000 + 200 for n in G.nodes()]
node_colors2 = [betweenness[n] for n in G.nodes()]
nx.draw(G, pos, ax=axes[1], node_size=node_sizes2, node_color=node_colors2,
        cmap=plt.cm.viridis, with_labels=True, font_size=8,
        font_weight='bold', edge_color='gray', width=[G[u][v]['weight']/3
        for u, v in G.edges()])
axes[1].set_title('Betweenness Centrality', fontsize=14, fontweight='bold')

# Community detection
from networkx.algorithms.community import greedy_modularity_communities
communities = list(greedy_modularity_communities(G))
color_map = {}
colors_list = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
for i, comm in enumerate(communities):
    for node in comm:
        color_map[node] = colors_list[i % len(colors_list)]

nx.draw(G, pos, ax=axes[2], node_size=500,
        node_color=[color_map[n] for n in G.nodes()],
        with_labels=True, font_size=8, font_weight='bold',
        edge_color='gray', width=[G[u][v]['weight']/3
        for u, v in G.edges()])
axes[2].set_title('Community Detection', fontsize=14, fontweight='bold')

plt.suptitle('Organizational Network Analysis', fontsize=18, fontweight='bold')
plt.tight_layout()
plt.savefig('network_analysis.png', dpi=150, bbox_inches='tight')
plt.show()

print("Centrality Measures:")
print(f"  Highest degree: {max(degree, key=degree.get)} "
      f"({max(degree.values()):.3f})")
print(f"  Highest betweenness: {max(betweenness, key=betweenness.get)} "
      f"({max(betweenness.values()):.3f})")
print(f"  Communities: {len(communities)}")
```

---

## 16.6 Use Case 4: Flow Map / Sankey Diagram

```python
import plotly.graph_objects as go
import pandas as pd
import numpy as np

np.random.seed(42)
sources = ['Source A', 'Source B', 'Source C', 'Source D']
targets = ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5']
intermediates = ['Hub X', 'Hub Y', 'Hub Z']

all_nodes = sources + intermediates + targets
node_indices = {n: i for i, n in enumerate(all_nodes)}

links_data = []
for src in sources:
    for hub in intermediates:
        links_data.append({'source': src, 'target': hub,
                          'value': np.random.randint(100, 1000)})
    for tgt in targets:
        if np.random.random() > 0.3:
            links_data.append({'source': src, 'target': tgt,
                              'value': np.random.randint(50, 500)})

for hub in intermediates:
    for tgt in targets:
        links_data.append({'source': hub, 'target': tgt,
                          'value': np.random.randint(100, 800)})

df = pd.DataFrame(links_data)

fig = go.Figure(go.Sankey(
    arrangement='snap',
    node=dict(
        pad=20, thickness=20, line=dict(color='black', width=0.5),
        label=all_nodes,
        color=['#e74c3c'] * len(sources) + ['#3498db'] * len(intermediates) +
              ['#2ecc71'] * len(targets)
    ),
    link=dict(
        source=[node_indices[s] for s in df['source']],
        target=[node_indices[t] for t in df['target']],
        value=df['value'],
        color=['rgba(200,200,200,0.3)'] * len(df)
    )
))

fig.update_layout(
    title_text='Flow Map - Supply Chain / Data Pipeline',
    font_size=12, height=600, template='plotly_white'
)
fig.show()
```

---

## 16.7 Use Case 5: Geographic Heat Map with Clustering

```python
import folium
from folium.plugins import HeatMapWithTime, MarkerCluster
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN

np.random.seed(42)
n = 1000
df = pd.DataFrame({
    'lat': np.concatenate([
        np.random.normal(1.35, 0.02, n//4),
        np.random.normal(1.30, 0.01, n//4),
        np.random.normal(1.38, 0.015, n//4),
        np.random.normal(1.32, 0.02, n//4)
    ]),
    'lon': np.concatenate([
        np.random.normal(103.8, 0.02, n//4),
        np.random.normal(103.75, 0.015, n//4),
        np.random.normal(103.85, 0.01, n//4),
        np.random.normal(103.82, 0.02, n//4)
    ]),
    'intensity': np.random.exponential(100, n),
    'hour': np.random.randint(0, 24, n)
})

# DBSCAN clustering
coords = df[['lat', 'lon']].values
clustering = DBSCAN(eps=0.01, min_samples=10).fit(coords)
df['cluster'] = clustering.labels_

m = folium.Map(location=[1.35, 103.8], zoom_start=12,
               tiles='CartoDB dark_matter')

cluster_colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12',
                  '#9b59b6', '#1abc9c', '#e67e22']
for cluster_id in df['cluster'].unique():
    if cluster_id == -1:
        continue
    cluster_df = df[df['cluster'] == cluster_id]
    color = cluster_colors[cluster_id % len(cluster_colors)]
    for _, row in cluster_df.iterrows():
        folium.CircleMarker(
            location=[row['lat'], row['lon']],
            radius=max(row['intensity'] / 50, 3),
            color=color, fill=True, fill_opacity=0.5
        ).add_to(m)

# Time-based heatmap
hour_groups = []
for hour in range(24):
    hour_data = df[df['hour'] == hour][['lat', 'lon']].values.tolist()
    hour_groups.append(hour_data)

HeatMapWithTime(hour_groups, index=[str(h) for h in range(24)],
                radius=20, auto_play=True,
                name='Hourly Heatmap').add_to(m)

folium.LayerControl().add_to(m)
m.save('geo_heatmap_clustered.html')
print("Map saved to geo_heatmap_clustered.html")
```

---

## 16.8 Use Case 6: World Map with Plotly

```python
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

np.random.seed(42)
n_countries = 50
data = pd.DataFrame({
    'country': [f'Country_{i}' for i in range(n_countries)],
    'iso_alpha': ['USA','GBR','DEU','FRA','JPN','CHN','IND','BRA',
                  'AUS','CAN','KOR','MEX','ZAF','NGA','EGY','TUR',
                  'SAU','ARG','POL','NLD','BEL','SWE','NOR','CHE',
                  'AUT','ITA','ESP','PRT','GRC','IRL','FIN','DNK',
                  'CZE','ROU','HUN','BGR','HRV','SVN','SVK','LTU',
                  'LVA','EST','LUX','MLT','CYP','ISL','LIE','MCO',
                  'SMR','AND'][:n_countries],
    'lat': np.random.uniform(-40, 65, n_countries),
    'lon': np.random.uniform(-120, 150, n_countries),
    'gdp_per_capita': np.random.lognormal(10, 1, n_countries),
    'population': np.random.lognormal(15, 1, n_countries),
    'life_expectancy': np.random.normal(75, 10, n_countries),
    'continent': np.random.choice(
        ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'], n_countries)
})

# Scatter on map
fig1 = px.scatter_geo(data, lat='lat', lon='lon', size='population',
    color='gdp_per_capita', hover_name='country',
    size_max=30, projection='natural earth',
    title='Global Demographics',
    color_continuous_scale='Viridis',
    template='plotly_white')
fig1.update_layout(height=600)
fig1.show()

# Choropleth
fig2 = px.choropleth(data, locations='iso_alpha', color='life_expectancy',
    hover_name='country', hover_data={'population': ':,.0f',
                                       'gdp_per_capita': ':$,.0f'},
    color_continuous_scale='RdYlGn',
    title='Life Expectancy by Country',
    template='plotly_white')
fig2.update_layout(height=600)
fig2.show()

# Animated bubble
data['year'] = np.random.choice([2020, 2021, 2022, 2023, 2024], n_countries)
fig3 = px.scatter_geo(data, lat='lat', lon='lon', size='gdp_per_capita',
    color='continent', animation_frame='year',
    hover_name='country', size_max=25,
    projection='natural earth',
    title='GDP Growth Over Time',
    template='plotly_white')
fig3.update_layout(height=600)
fig3.show()
```

---

## 16.9 Use Case 7: Network Graph with Pyvis

```python
import networkx as nx
from pyvis.network import Network
import numpy as np

G = nx.DiGraph()

categories = {
    'Technology': ['Python', 'JavaScript', 'React', 'Django', 'Node.js'],
    'Data Science': ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
    'Database': ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
}

for cat, tools in categories.items():
    for tool in tools:
        G.add_node(tool, group=cat, size=25)

skill_edges = [
    ('Python', 'Pandas', 5), ('Python', 'NumPy', 5),
    ('Python', 'Scikit-learn', 4), ('Python', 'Django', 4),
    ('Python', 'TensorFlow', 3), ('Python', 'PyTorch', 3),
    ('JavaScript', 'React', 5), ('JavaScript', 'Node.js', 5),
    ('React', 'Django', 2), ('Pandas', 'Scikit-learn', 4),
    ('Scikit-learn', 'TensorFlow', 3), ('Scikit-learn', 'PyTorch', 3),
    ('Docker', 'Kubernetes', 5), ('AWS', 'Kubernetes', 4),
    ('PostgreSQL', 'Django', 3), ('MongoDB', 'Node.js', 3),
    ('Redis', 'Node.js', 2), ('CI/CD', 'Docker', 4),
]

for u, w, weight in skill_edges:
    G.add_edge(u, w, weight=weight)

net = Network(height='700px', width='100%', directed=True,
              bgcolor='#222222', font_color='white')

color_map = {'Technology': '#3498db', 'Data Science': '#2ecc71',
             'Database': '#e74c3c', 'DevOps': '#f39c12'}

for node in G.nodes():
    cat = G.nodes[node].get('group', 'Unknown')
    net.add_node(node, label=node, group=cat,
                color=color_map.get(cat, '#95a5a6'), size=25)

for u, v, data in G.edges(data=True):
    net.add_edge(u, v, value=data.get('weight', 1), arrows='to')

net.set_options('''
{
    "physics": {
        "forceAtlas2Based": {
            "gravitationalConstant": -100,
            "centralGravity": 0.01,
            "springLength": 150,
            "springConstant": 0.08
        },
        "solver": "forceAtlas2Based"
    }
}
''')

net.save_graph('skill_network.html')
print("Network saved to skill_network.html")
```

---

## 16.10 Use Case 8: Spatial Autocorrelation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.spatial.distance import cdist

np.random.seed(42)
n = 200
lat = np.random.uniform(1.2, 1.5, n)
lon = np.random.uniform(103.6, 104.0, n)
values = np.random.randn(n)

# Create spatial clusters
for i in range(5):
    center_lat, center_lon = np.random.uniform(1.25, 1.45), np.random.uniform(103.7, 103.9)
    distances = np.sqrt((lat - center_lat)**2 + (lon - center_lon)**2)
    mask = distances < 0.05
    values[mask] += np.random.randn() * 2

df = pd.DataFrame({'lat': lat, 'lon': lon, 'value': values})

coords = np.column_stack([lat, lon])
dist_matrix = cdist(coords, coords)
threshold = 0.1
weights = (dist_matrix < threshold).astype(float)
np.fill_diagonal(weights, 0)

# Moran's I
z = (values - values.mean()) / values.std()
n_val = len(values)
numerator = np.sum(weights * np.outer(z, z))
denominator = np.sum(weights)
moran_i = (n_val / denominator) * (numerator / n_val)

fig, axes = plt.subplots(2, 2, figsize=(16, 14))

# Scatter plot
scatter = axes[0, 0].scatter(lon, lat, c=values, cmap='RdYlGn',
                             s=50, alpha=0.7, edgecolors='white', linewidth=0.5)
plt.colorbar(scatter, ax=axes[0, 0], label='Value')
axes[0, 0].set_title('Spatial Distribution', fontsize=12, fontweight='bold')
axes[0, 0].set_xlabel('Longitude')
axes[0, 0].set_ylabel('Latitude')

# Lag plot
lag_values = np.zeros(n)
for i in range(n):
    neighbor_mask = weights[i] > 0
    if neighbor_mask.sum() > 0:
        lag_values[i] = np.average(values[neighbor_mask],
                                   weights=weights[i, neighbor_mask])

axes[0, 1].scatter(values, lag_values, alpha=0.5, s=30, c='#3498db')
axes[0, 1].set_xlabel('Value')
axes[0, 1].set_ylabel('Spatial Lag')
axes[0, 1].set_title(f"Lag Plot (Moran's I = {moran_i:.3f})",
                     fontsize=12, fontweight='bold')
z_line = np.polyfit(values, lag_values, 1)
x_line = np.linspace(values.min(), values.max(), 100)
axes[0, 1].plot(x_line, np.polyval(z_line, x_line), 'r--', linewidth=2)

# Distribution
sns.histplot(values, kde=True, ax=axes[1, 0], color='#2ecc71')
axes[1, 0].set_title('Value Distribution', fontsize=12, fontweight='bold')

# Distance decay
avg_values = []
distances_list = []
for d in np.linspace(0.01, 0.15, 20):
    mask = (dist_matrix > 0) & (dist_matrix < d)
    if mask.any():
        corr = np.corrcoef(values[mask.any(axis=1)], 
                          np.average(values, weights=weights, axis=1))[0, 1]
        avg_values.append(corr)
        distances_list.append(d)

axes[1, 1].plot(distances_list, avg_values, 'o-', color='#e74c3c', linewidth=2)
axes[1, 1].set_xlabel('Distance Threshold')
axes[1, 1].set_ylabel('Spatial Correlation')
axes[1, 1].set_title('Distance Decay Function', fontsize=12, fontweight='bold')
axes[1, 1].axhline(y=0, color='gray', linestyle='--', alpha=0.5)

plt.suptitle('Spatial Autocorrelation Analysis', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('spatial_autocorrelation.png', dpi=150, bbox_inches='tight')
plt.show()

print(f"Moran's I: {moran_i:.4f}")
print(f"Interpretation: {'Spatial clustering detected' if moran_i > 0.3 else 'Random distribution' if abs(moran_i) < 0.1 else 'Spatial dispersion'}")
```

---

## 16.11 Design Patterns for Geospatial

### Map Layer Pattern

```
+------------------------------------------------------------------+
|              MAP LAYER PATTERN                                    |
+------------------------------------------------------------------+
|                                                                    |
|  Layer 5: Interactivity                                           |
|  +------------------------------------------------------------+  |
|  |  Tooltips, popups, zoom controls, layer toggles           |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 4: Annotations                                             |
|  +------------------------------------------------------------+  |
|  |  Labels, markers, legends, scale bar                       |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 3: Data Overlay                                            |
|  +------------------------------------------------------------+  |
|  |  Choropleth, heatmap, markers, clusters                    |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 2: Base Map                                                |
|  +------------------------------------------------------------+  |
|  |  Tile layers (OpenStreetMap, Satellite, Terrain)          |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Layer 1: Projection                                              |
|  +------------------------------------------------------------+  |
|  |  Coordinate reference system, bounds                       |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

---

## 16.12 Project Idea 1: Real Estate Map Analyzer

```python
import folium
from folium.plugins import MarkerCluster
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

np.random.seed(42)
n = 500
df = pd.DataFrame({
    'lat': np.random.uniform(1.2, 1.5, n),
    'lon': np.random.uniform(103.6, 104.0, n),
    'price': np.random.lognormal(13, 0.5, n),
    'sqft': np.random.uniform(500, 3000, n),
    'bedrooms': np.random.randint(1, 6, n),
    'type': np.random.choice(['Condo', 'HDB', 'Landed', 'Executive'], n)
})
df['price_per_sqft'] = df['price'] / df['sqft']

kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(df[['lat', 'lon', 'price_per_sqft']])

m = folium.Map(location=[1.35, 103.8], zoom_start=12, tiles='CartoDB positron')

cluster_colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
for cluster_id in range(5):
    cluster_df = df[df['cluster'] == cluster_id]
    fg = folium.FeatureGroup(name=f'Cluster {cluster_id} (n={len(cluster_df)})')
    for _, row in cluster_df.iterrows():
        folium.CircleMarker(
            location=[row['lat'], row['lon']],
            radius=max(row['price_per_sqft'] / 500, 3),
            color=cluster_colors[cluster_id],
            fill=True, fill_opacity=0.6,
            popup=folium.Popup(
                f"<b>${row['price']:,.0f}</b><br>"
                f"{row['sqft']:.0f} sqft<br>"
                f"{row['bedrooms']} BR<br>"
                f"${row['price_per_sqft']:,.0f}/sqft<br>"
                f"Type: {row['type']}", max_width=200)
        ).add_to(fg)
    fg.add_to(m)

folium.LayerControl().add_to(m)
m.save('real_estate_map.html')
print(f"Average price: ${df['price'].mean():,.0f}")
print(f"Average price/sqft: ${df['price_per_sqft'].mean():,.0f}")
```

---

## 16.13 Project Idea 2: Social Network Analyzer

```python
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

class SocialNetworkAnalyzer:
    def __init__(self):
        self.G = nx.Graph()

    def generate_social_network(self, n_users=100, avg_connections=5):
        np.random.seed(42)
        for i in range(n_users):
            self.G.add_node(i, name=f'User_{i}',
                          activity=np.random.uniform(0, 1),
                          joined=f'202{np.random.randint(0, 4)}')

        for i in range(n_users):
            n_edges = np.random.poisson(avg_connections)
            targets = np.random.choice(
                [j for j in range(n_users) if j != i],
                min(n_edges, n_users - 1), replace=False)
            for j in targets:
                if not self.G.has_edge(i, j):
                    self.G.add_edge(i, j, weight=np.random.uniform(0.1, 1))

    def analyze(self):
        metrics = {
            'degree_centrality': nx.degree_centrality(self.G),
            'betweenness_centrality': nx.betweenness_centrality(self.G),
            'closeness_centrality': nx.closeness_centrality(self.G),
            'pagerank': nx.pagerank(self.G)
        }
        communities = list(nx.community.greedy_modularity_communities(self.G))
        return metrics, communities

    def visualize(self):
        metrics, communities = self.analyze()
        fig, axes = plt.subplots(2, 2, figsize=(16, 14))

        pos = nx.spring_layout(self.G, k=0.5, iterations=50, seed=42)

        # Degree
        deg = [metrics['degree_centrality'][n] * 500 + 50 for n in self.G.nodes()]
        nx.draw(self.G, pos, ax=axes[0, 0], node_size=deg,
                node_color=[metrics['degree_centrality'][n] for n in self.G.nodes()],
                cmap=plt.cm.YlOrRd, edge_color='gray', alpha=0.7, width=0.5)
        axes[0, 0].set_title('Degree Centrality', fontsize=14, fontweight='bold')

        # Betweenness
        bet = [metrics['betweenness_centrality'][n] * 1000 + 50 for n in self.G.nodes()]
        nx.draw(self.G, pos, ax=axes[0, 1], node_size=bet,
                node_color=[metrics['betweenness_centrality'][n] for n in self.G.nodes()],
                cmap=plt.cm.viridis, edge_color='gray', alpha=0.7, width=0.5)
        axes[0, 1].set_title('Betweenness Centrality', fontsize=14, fontweight='bold')

        # PageRank
        pr = [metrics['pagerank'][n] * 3000 + 50 for n in self.G.nodes()]
        nx.draw(self.G, pos, ax=axes[1, 0], node_size=pr,
                node_color=[metrics['pagerank'][n] for n in self.G.nodes()],
                cmap=plt.cm.plasma, edge_color='gray', alpha=0.7, width=0.5)
        axes[1, 0].set_title('PageRank', fontsize=14, fontweight='bold')

        # Communities
        colors = plt.cm.Set3(np.linspace(0, 1, len(communities)))
        node_colors = np.zeros(self.G.number_of_nodes())
        for i, comm in enumerate(communities):
            for node in comm:
                node_colors[node] = i
        nx.draw(self.G, pos, ax=axes[1, 1], node_size=100,
                node_color=node_colors, cmap=plt.cm.Set3,
                edge_color='gray', alpha=0.7, width=0.5)
        axes[1, 1].set_title(f'Communities ({len(communities)})',
                            fontsize=14, fontweight='bold')

        plt.suptitle('Social Network Analysis', fontsize=18, fontweight='bold')
        plt.tight_layout()
        plt.savefig('social_network.png', dpi=150, bbox_inches='tight')
        plt.show()

        # Top users
        top_degree = sorted(metrics['degree_centrality'].items(),
                          key=lambda x: x[1], reverse=True)[:5]
        print("Top 5 users by connections:")
        for user, score in top_degree:
            print(f"  User_{user}: {score:.3f}")

analyzer = SocialNetworkAnalyzer()
analyzer.generate_social_network(100, 5)
analyzer.visualize()
```

---

## 16.14 Project Idea 3: Route Optimization Visualizer

```python
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

class RouteOptimizer:
    def __init__(self):
        self.G = nx.DiGraph()

    def create_road_network(self):
        locations = {
            'A': (1, 4), 'B': (2, 4), 'C': (3, 4), 'D': (4, 4),
            'E': (1, 3), 'F': (2, 3), 'G': (3, 3), 'H': (4, 3),
            'I': (1, 2), 'J': (2, 2), 'K': (3, 2), 'L': (4, 2),
            'M': (1, 1), 'N': (2, 1), 'O': (3, 1), 'P': (4, 1)
        }

        for name, pos in locations.items():
            self.G.add_node(name, pos=pos)

        edges = [
            ('A', 'B', 10), ('A', 'E', 15), ('B', 'C', 12), ('B', 'F', 8),
            ('C', 'D', 10), ('C', 'G', 9), ('D', 'H', 11),
            ('E', 'F', 7), ('E', 'I', 14), ('F', 'G', 8), ('F', 'J', 6),
            ('G', 'H', 10), ('G', 'K', 7), ('H', 'L', 12),
            ('I', 'J', 9), ('I', 'M', 13), ('J', 'K', 8), ('J', 'N', 5),
            ('K', 'L', 11), ('K', 'O', 6), ('L', 'P', 10),
            ('M', 'N', 7), ('N', 'O', 8), ('O', 'P', 9),
            ('B', 'A', 10), ('E', 'A', 15), ('C', 'B', 12), ('F', 'B', 8),
            ('D', 'C', 10), ('G', 'C', 9), ('H', 'D', 11),
            ('F', 'E', 7), ('I', 'E', 14), ('G', 'F', 8), ('J', 'F', 6),
            ('H', 'G', 10), ('K', 'G', 7), ('L', 'H', 12),
            ('J', 'I', 9), ('M', 'I', 13), ('K', 'J', 8), ('N', 'J', 5),
            ('L', 'K', 11), ('O', 'K', 6), ('P', 'L', 10),
            ('N', 'M', 7), ('O', 'N', 8), ('P', 'O', 9)
        ]

        for u, w, weight in edges:
            self.G.add_edge(u, w, weight=weight)

    def find_optimal_routes(self, source, destinations):
        routes = {}
        for dest in destinations:
            try:
                path = nx.shortest_path(self.G, source, dest, weight='weight')
                dist = nx.shortest_path_length(self.G, source, dest, weight='weight')
                routes[dest] = {'path': path, 'distance': dist}
            except nx.NetworkXNoPath:
                routes[dest] = None
        return routes

    def visualize(self, source='A', destinations=None):
        if destinations is None:
            destinations = ['P', 'L', 'F', 'K']

        fig, axes = plt.subplots(1, 2, figsize=(20, 10))
        pos = nx.get_node_attributes(self.G, 'pos')

        # Network visualization
        nx.draw_networkx_nodes(self.G, pos, ax=axes[0], node_size=500,
                              node_color='lightblue', edgecolors='black')
        nx.draw_networkx_labels(self.G, pos, ax=axes[0], font_size=10,
                               font_weight='bold')
        nx.draw_networkx_edges(self.G, pos, ax=axes[0], edge_color='gray',
                              arrows=True, arrowsize=15, alpha=0.5,
                              width=1)
        edge_labels = nx.get_edge_attributes(self.G, 'weight')
        nx.draw_networkx_edge_labels(self.G, pos, ax=axes[0],
                                    edge_labels=edge_labels, font_size=7)

        colors = plt.cm.Set1(np.linspace(0, 1, len(destinations)))
        routes = self.find_optimal_routes(source, destinations)

        for i, (dest, route) in enumerate(routes.items()):
            if route:
                path_edges = list(zip(route['path'][:-1], route['path'][1:]))
                nx.draw_networkx_edges(self.G, pos, ax=axes[0],
                    edgelist=path_edges, edge_color=[colors[i]],
                    width=3, alpha=0.8)
                axes[0].plot([], [], color=colors[i], linewidth=3,
                           label=f"To {dest}: {route['distance']} units")

        axes[0].legend(loc='upper left', fontsize=10)
        axes[0].set_title(f'Optimal Routes from {source}',
                         fontsize=14, fontweight='bold')
        axes[0].axis('off')

        # Route summary
        route_summary = []
        for dest, route in routes.items():
            if route:
                route_summary.append({
                    'Destination': dest, 'Path': ' -> '.join(route['path']),
                    'Distance': route['distance'],
                    'Stops': len(route['path']) - 1
                })

        if route_summary:
            import pandas as pd
            summary_df = pd.DataFrame(route_summary)
            axes[1].axis('off')
            table = axes[1].table(
                cellText=summary_df.values,
                colLabels=summary_df.columns,
                loc='center', cellLoc='center')
            table.auto_set_font_size(False)
            table.set_fontsize(11)
            table.scale(1.2, 1.5)
            axes[1].set_title('Route Summary', fontsize=14, fontweight='bold')

        plt.suptitle('Route Optimization Dashboard', fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.savefig('route_optimization.png', dpi=150, bbox_inches='tight')
        plt.show()

optimizer = RouteOptimizer()
optimizer.create_road_network()
optimizer.visualize('A', ['P', 'L', 'F', 'K', 'M'])
```

---

## 16.15 Alternative Approaches

### Geospatial: Folium vs Plotly vs Basemap

```python
# FOLIUM: Interactive Leaflet maps
import folium
m = folium.Map(location=[1.35, 103.8], zoom_start=12)
folium.Marker([1.35, 103.8], popup='Location').add_to(m)
m.save('folium_map.html')

# PLOTLY: Declarative, publication-ready
import plotly.express as px
fig = px.scatter_geo(df, lat='lat', lon='lon', color='category')
fig.show()

# MATPLOTLIB/BASEMAP: Static, full control
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(10, 8))
ax.scatter(df['lon'], df['lat'], c=df['value'], cmap='viridis')
plt.savefig('static_map.png')
```

### Network: NetworkX vs Graph-tool vs Cytoscape

```python
# NETWORKX: Pythonic, most features
import networkx as nx
G = nx.Graph()
G.add_edges_from([(1,2), (2,3), (3,1)])
nx.draw(G, with_labels=True)

# PYVIS: Interactive HTML output
from pyvis.network import Network
net = Network()
net.add_nodes([1, 2, 3])
net.add_edge(1, 2)
net.save_graph('network.html')

# PLOTLY: Network with scatter
import plotly.graph_objects as go
fig = go.Figure(go.Scatter(x=[0,1,2], y=[0,1,0], mode='lines+markers'))
fig.show()
```

---

# CAPSTONE PROJECT: Enterprise Analytics Dashboard Platform

## Project Overview

Build a production-grade, multi-module analytics dashboard integrating Plotly, Dash, Seaborn, and geospatial visualization with real-time streaming, role-based access control, and PostgreSQL backend. This capstone synthesizes all Course 2 modules into a deployable enterprise application.

### Architecture Diagram

```
+=============================================================================+
|                         ENTERPRISE ANALYTICS PLATFORM                        |
+=============================================================================+
|                                                                             |
|  +------------------+    +------------------+    +------------------+       |
|  |   NGINX REVERSE  |    |   AUTH SERVICE   |    |   API GATEWAY    |       |
|  |     PROXY        |-->|  (Flask-JWT)     |-->|  (Rate Limiting) |       |
|  |  :80 / :443      |    |  :5001           |    |  :5002            |       |
|  +------------------+    +------------------+    +------------------+       |
|           |                       |                       |                  |
|           v                       v                       v                  |
|  +--------------------------------------------------------------------+     |
|  |                    DASH APPLICATION LAYER                          |     |
|  |  +-----------+  +-----------+  +-----------+  +-----------+       |     |
|  |  | EXECUTIVE |  | SALES     |  | OPERATIONS|  | CUSTOMER  |       |     |
|  |  | DASHBOARD |  | ANALYTICS |  | MONITOR   |  | 360 VIEW  |       |     |
|  |  |  :8050    |  |  :8051    |  |  :8052    |  |  :8053    |       |     |
|  |  +-----------+  +-----------+  +-----------+  +-----------+       |     |
|  +--------------------------------------------------------------------+     |
|           |               |               |               |                  |
|           v               v               v               v                  |
|  +--------------------------------------------------------------------+     |
|  |                  VISUALIZATION ENGINE                               |     |
|  |  +----------+  +----------+  +----------+  +----------+           |     |
|  |  |  PLOTLY  |  | SEABORN  |  | GEOJSON  |  | NETWORKX |           |     |
|  |  | Interactive|  | Statistical|  | Choropleth|  | Graph   |           |     |
|  |  +----------+  +----------+  +----------+  +----------+           |     |
|  +--------------------------------------------------------------------+     |
|           |               |               |               |                  |
|           v               v               v               v                  |
|  +--------------------------------------------------------------------+     |
|  |                      DATA LAYER                                     |     |
|  |  +-----------+  +-----------+  +-----------+  +-----------+       |     |
|  |  | POSTGRESQL|  |  REDIS    |  | KAFKA     |  | MINIO    |       |     |
|  |  |  :5432    |  |  :6379    |  |  :9092    |  |  :9000   |       |     |
|  |  | (Primary) |  | (Cache)   |  | (Streams) |  | (Files)  |       |     |
|  |  +-----------+  +-----------+  +-----------+  +-----------+       |     |
|  +--------------------------------------------------------------------+     |
|                                                                             |
+=============================================================================+
```

### Technology Stack

```
+===========================================================================+
|                        TECHNOLOGY MATRIX                                  |
+===========================================================================+
|                                                                           |
|  LAYER           | TOOL           | PURPOSE              | VERSION        |
| ---------------- | -------------- | -------------------- | -------------- |
|  Frontend        | Dash/Plotly    | Interactive UI       | 2.14+         |
|  Backend         | Flask          | API/Authentication   | 3.0+          |
|  Database        | PostgreSQL     | Primary datastore    | 15+           |
|  Cache           | Redis          | Session/Query cache  | 7+            |
|  Streaming       | Kafka          | Real-time events     | 3.5+          |
|  Object Store    | MinIO          | File/Asset storage   | Latest        |
|  Reverse Proxy   | Nginx          | Load balancing       | 1.25+         |
|  Container       | Docker         | Deployment           | 24+           |
|  Orchestration   | Docker Compose | Multi-container      | 2.20+         |
|  Monitoring      | Prometheus     | Metrics              | 2.45+         |
|  Visualization   | Grafana        | Ops dashboards       | 10+           |
|                                                                           |
+===========================================================================+
```

---

## Phase 1: Database Schema & Models

### Entity-Relationship Diagram

```
+=============================================================================+
|                           DATABASE SCHEMA                                   |
+=============================================================================+
|                                                                             |
|  +-------------+       +----------------+       +---------------+          |
|  |    USERS    |       |   DASHBOARDS   |       |   WIDGETS     |          |
|  +-------------+       +----------------+       +---------------+          |
|  | id (PK)     |<----->| id (PK)        |<----->| id (PK)       |          |
|  | username    |  1:N  | owner_id (FK)  |  1:N  | dashboard_id  |          |
|  | email       |       | title          |       | chart_type    |          |
|  | password    |       | layout_config  |       | config_json   |          |
|  | role        |       | created_at     |       | position_x    |          |
|  | is_active   |       | updated_at     |       | position_y    |          |
|  | created_at  |       | is_public      |       | width         |          |
|  +-------------+       +----------------+       | height        |          |
|         |                      |                +---------------+          |
|         |                      |                       |                   |
|         v                      v                       v                   |
|  +-------------+       +----------------+       +---------------+          |
|  | AUDIT_LOG   |       | DATA_SOURCES   |       | QUERY_CACHE   |          |
|  +-------------+       +----------------+       +---------------+          |
|  | id (PK)     |       | id (PK)        |       | id (PK)       |          |
|  | user_id(FK) |       | name           |       | query_hash    |          |
|  | action      |       | source_type    |       | result_json   |          |
|  | resource    |       | connection_str |       | expires_at    |          |
|  | timestamp   |       | schema_info    |       | created_at    |          |
|  | ip_address  |       | last_synced    |       +---------------+          |
|  +-------------+       +----------------+                                  |
|                                                                             |
+=============================================================================+
```

### Complete Database Models

```python
# models.py
import os
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import json
import hashlib

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='viewer')
    is_active_user = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    dashboards = db.relationship('Dashboard', backref='owner', lazy='dynamic')
    audit_logs = db.relationship('AuditLog', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(
            password,
            method='pbkdf2:sha256:260000'
        )

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def has_permission(self, resource, action):
        permissions = {
            'admin': ['read', 'write', 'delete', 'manage_users', 'manage_dashboards'],
            'analyst': ['read', 'write', 'create_dashboard'],
            'viewer': ['read']
        }
        return action in permissions.get(self.role, [])

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active_user,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


class Dashboard(db.Model):
    __tablename__ = 'dashboards'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    layout_config = db.Column(db.JSON, default=dict)
    theme = db.Column(db.String(50), default='plotly')
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    widgets = db.relationship('Widget', backref='dashboard', lazy='dynamic',
                              cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'owner_id': self.owner_id,
            'layout': self.layout_config,
            'theme': self.theme,
            'is_public': self.is_public,
            'widget_count': self.widgets.count(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Widget(db.Model):
    __tablename__ = 'widgets'

    id = db.Column(db.Integer, primary_key=True)
    dashboard_id = db.Column(db.Integer, db.ForeignKey('dashboards.id'), nullable=False)
    chart_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    config_json = db.Column(db.JSON, default=dict)
    data_query = db.Column(db.Text)
    position_x = db.Column(db.Integer, default=0)
    position_y = db.Column(db.Integer, default=0)
    width = db.Column(db.Integer, default=6)
    height = db.Column(db.Integer, default=4)
    refresh_interval = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'dashboard_id': self.dashboard_id,
            'chart_type': self.chart_type,
            'title': self.title,
            'config': self.config_json,
            'position': {'x': self.position_x, 'y': self.position_y},
            'size': {'w': self.width, 'h': self.height},
            'refresh_interval': self.refresh_interval
        }


class DataSource(db.Model):
    __tablename__ = 'data_sources'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    source_type = db.Column(db.String(50), nullable=False)
    connection_config = db.Column(db.JSON, nullable=False)
    schema_info = db.Column(db.JSON, default=dict)
    is_active = db.Column(db.Boolean, default=True)
    last_synced = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class AuditLog(db.Model):
    __tablename__ = 'audit_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    resource_type = db.Column(db.String(50))
    resource_id = db.Column(db.Integer)
    details = db.Column(db.JSON, default=dict)
    ip_address = db.Column(db.String(45))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        db.Index('idx_audit_user_time', 'user_id', 'timestamp'),
    )


class QueryCache(db.Model):
    __tablename__ = 'query_cache'

    id = db.Column(db.Integer, primary_key=True)
    query_hash = db.Column(db.String(64), unique=True, nullable=False, index=True)
    result_json = db.Column(db.Text, nullable=False)
    row_count = db.Column(db.Integer, default=0)
    execution_time_ms = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

    @staticmethod
    def make_hash(query_string):
        return hashlib.sha256(query_string.encode()).hexdigest()

    def is_expired(self):
        return datetime.utcnow() > self.expires_at


def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        _seed_defaults(app)


def _seed_defaults(app):
    if User.query.first():
        return

    admin = User(username='admin', email='admin@company.com', role='admin')
    admin.set_password(os.getenv('ADMIN_PASSWORD', 'admin123'))
    admin.is_active_user = True

    analyst = User(username='analyst', email='analyst@company.com', role='analyst')
    analyst.set_password(os.getenv('ANALYST_PASSWORD', 'analyst123'))

    viewer = User(username='viewer', email='viewer@company.com', role='viewer')
    viewer.set_password(os.getenv('VIEWER_PASSWORD', 'viewer123'))

    db.session.add_all([admin, analyst, viewer])
    db.session.commit()
```

---

## Phase 2: Authentication Service

### Auth Flow Diagram

```
+=============================================================================+
|                        AUTHENTICATION FLOW                                   |
+=============================================================================+
|                                                                             |
|   Browser              Flask Auth              PostgreSQL          Redis    |
|     |                      |                      |                  |      |
|     |  POST /auth/login    |                      |                  |      |
|     |--------------------->|  SELECT user         |                  |      |
|     |                      |--------------------->|                  |      |
|     |                      |  user row            |                  |      |
|     |                      |<---------------------|                  |      |
|     |                      |  check_password()    |                  |      |
|     |                      |  create JWT          |                  |      |
|     |                      |  SET session         |                  |      |
|     |                      |--------------------->|                  |      |
|     |  {access_token,      |                      |                  |      |
|     |   refresh_token}     |                      |                  |      |
|     |<---------------------|                      |                  |      |
|     |                      |                      |                  |      |
|     |  GET /api/data       |                      |                  |      |
|     |  Authorization: Bearer|                     |                  |      |
|     |--------------------->|  verify JWT          |                  |      |
|     |                      |  check Redis cache   |                  |      |
|     |                      |--------------------->|                  |      |
|     |                      |  cached user perms   |                  |      |
|     |                      |<---------------------|                  |      |
|     |  {data response}     |                      |                  |      |
|     |<---------------------|                      |                  |      |
|                                                                             |
+=============================================================================+
```

### Authentication Code

```python
# auth.py
import os
import redis
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_user, logout_user, current_user
from models import db, User, AuditLog

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=0,
    decode_responses=True
)

JWT_SECRET = os.getenv('JWT_SECRET', 'change-this-in-production')
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRY = timedelta(minutes=30)
REFRESH_TOKEN_EXPIRY = timedelta(days=7)


def create_tokens(user):
    now = datetime.utcnow()

    access_payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'type': 'access',
        'iat': now,
        'exp': now + ACCESS_TOKEN_EXPIRY
    }

    refresh_payload = {
        'user_id': user.id,
        'type': 'refresh',
        'iat': now,
        'exp': now + REFRESH_TOKEN_EXPIRY
    }

    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    redis_client.setex(
        f'user_session:{user.id}',
        int(ACCESS_TOKEN_EXPIRY.total_seconds()),
        user.role
    )

    return access_token, refresh_token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', '')

        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

            if payload.get('type') != 'access':
                return jsonify({'error': 'Invalid token type'}), 401

            cached_role = redis_client.get(f'user_session:{payload["user_id"]}')
            if not cached_role:
                return jsonify({'error': 'Session expired'}), 401

            user = User.query.get(payload['user_id'])
            if not user or not user.is_active_user:
                return jsonify({'error': 'User not found or inactive'}), 401

            request.current_user = user

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated


def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, 'current_user'):
                return jsonify({'error': 'Authentication required'}), 401

            if request.current_user.role not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403

            return f(*args, **kwargs)
        return decorated
    return decorator


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password required'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active_user:
        return jsonify({'error': 'Account disabled'}), 403

    login_user(user, remember=True)
    user.last_login = datetime.utcnow()

    log = AuditLog(
        user_id=user.id,
        action='login',
        resource_type='auth',
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()

    access_token, refresh_token = create_tokens(user)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json()
    token = data.get('refresh_token')

    if not token:
        return jsonify({'error': 'Refresh token required'}), 400

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        if payload.get('type') != 'refresh':
            return jsonify({'error': 'Invalid token type'}), 401

        user = User.query.get(payload['user_id'])
        if not user or not user.is_active_user:
            return jsonify({'error': 'User not found'}), 401

        access_token, new_refresh = create_tokens(user)

        return jsonify({
            'access_token': access_token,
            'refresh_token': new_refresh
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Refresh token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid refresh token'}), 401


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    user = request.current_user
    redis_client.delete(f'user_session:{user.id}')

    log = AuditLog(
        user_id=user.id,
        action='logout',
        resource_type='auth',
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    return jsonify(request.current_user.to_dict()), 200


@auth_bp.route('/users', methods=['GET'])
@token_required
@role_required('admin')
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200
```

---

## Phase 3: Executive Dashboard (Dash + Plotly)

### Dashboard Layout

```
+=============================================================================+
|  [LOGO]  ENTERPRISE ANALYTICS     [Search...]      [User: Admin] [Logout]  |
+=============================================================================+
|  NAV:  [Executive] [Sales] [Operations] [Customer]  |  Date: [From]-[To]   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +------------------+  +------------------+  +------------------+          |
|  |  TOTAL REVENUE   |  |   ACTIVE USERS   |  |  CONVERSION RATE |          |
|  |   $2.45M         |  |     12,847       |  |      3.24%       |          |
|  |  +12.3% vs prev  |  |  +8.1% vs prev   |  |  -0.5% vs prev   |          |
|  +------------------+  +------------------+  +------------------+          |
|                                                                             |
|  +----------------------------------+  +----------------------------------+  |
|  |        REVENUE TREND             |  |     GEOGRAPHIC BREAKDOWN        |  |
|  |   [Interactive Line Chart]       |  |     [Choropleth Map]            |  |
|  |   Plotly with range slider       |  |     Plotly Mapbox               |  |
|  |                                  |  |                                  |  |
|  |   Jan  Feb  Mar  Apr  May  Jun   |  |    [World Map with Colors]      |  |
|  +----------------------------------+  +----------------------------------+  |
|                                                                             |
|  +----------------------------------+  +----------------------------------+  |
|  |     TOP PRODUCTS TABLE           |  |     CATEGORY DISTRIBUTION       |  |
|  |  +--------+--------+---------+  |  |     [Sunburst Chart]            |  |
|  |  | Product | Revenue|  Growth |  |  |                                  |  |
|  |  +--------+--------+---------+  |  |     [Interactive Treemap]       |  |
|  |  | Widget  | $450K  |  +15%   |  |  |                                  |  |
|  |  | Gadget  | $380K  |  +8%    |  |  +----------------------------------+  |
|  |  | Tool    | $320K  |  +22%   |  |                                    |
|  +----------------------------------+                                    |
|                                                                             |
+=============================================================================+
```

```python
# dashboards/executive.py
import dash
from dash import dcc, html, dash_table, callback_context
from dash.dependencies import Input, Output, State
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import os

# Executive Dashboard Application
app = dash.Dash(
    __name__,
    name='executive-dashboard',
    suppress_callback_exceptions=True,
    meta_tags=[{'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0'}]
)

app.title = 'Executive Dashboard'

COLORS = {
    'background': '#f8f9fa',
    'card_bg': '#ffffff',
    'primary': '#6366f1',
    'secondary': '#8b5cf6',
    'success': '#10b981',
    'danger': '#ef4444',
    'warning': '#f59e0b',
    'text': '#1f2937',
    'text_light': '#6b7280',
    'border': '#e5e7eb'
}

THEME = 'plotly_white'


def create_kpi_card(title, value, change, icon='📈'):
    color = COLORS['success'] if change >= 0 else COLORS['danger']
    arrow = '▲' if change >= 0 else '▼'

    return html.Div([
        html.Div([
            html.Span(icon, style={'fontSize': '24px'}),
            html.Span(title, style={
                'color': COLORS['text_light'],
                'fontSize': '14px',
                'marginLeft': '8px'
            })
        ], style={'display': 'flex', 'alignItems': 'center'}),
        html.H2(value, style={
            'color': COLORS['text'],
            'margin': '8px 0 4px 0',
            'fontSize': '28px',
            'fontWeight': '700'
        }),
        html.Span(f'{arrow} {abs(change):.1f}% vs last period', style={
            'color': color,
            'fontSize': '13px',
            'fontWeight': '500'
        })
    ], style={
        'backgroundColor': COLORS['card_bg'],
        'borderRadius': '12px',
        'padding': '20px',
        'boxShadow': '0 1px 3px rgba(0,0,0,0.1)',
        'border': f'1px solid {COLORS["border"]}',
        'flex': '1',
        'minWidth': '220px'
    })


def create_revenue_trend_chart(df):
    fig = make_subplots(
        rows=2, cols=1,
        shared_xaxes=True,
        vertical_spacing=0.08,
        row_heights=[0.7, 0.3],
        subplot_titles=('Revenue & Profit', 'Transaction Volume')
    )

    fig.add_trace(
        go.Scatter(
            x=df['date'], y=df['revenue'],
            name='Revenue',
            line=dict(color=COLORS['primary'], width=3),
            fill='tozeroy',
            fillcolor='rgba(99, 102, 241, 0.1)',
            hovertemplate='<b>Revenue</b><br>%{x}<br>$%{y:,.0f}<extra></extra>'
        ),
        row=1, col=1
    )

    fig.add_trace(
        go.Scatter(
            x=df['date'], y=df['profit'],
            name='Profit',
            line=dict(color=COLORS['success'], width=2, dash='dot'),
            hovertemplate='<b>Profit</b><br>%{x}<br>$%{y:,.0f}<extra></extra>'
        ),
        row=1, col=1
    )

    fig.add_trace(
        go.Bar(
            x=df['date'], y=df['transactions'],
            name='Transactions',
            marker_color=COLORS['secondary'],
            opacity=0.7,
            hovertemplate='<b>Transactions</b><br>%{x}<br>%{y:,}<extra></extra>'
        ),
        row=2, col=1
    )

    fig.update_layout(
        template=THEME,
        height=450,
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
        margin=dict(l=40, r=20, t=40, b=30),
        xaxis2=dict(
            rangeslider=dict(visible=True, thickness=0.05),
            type='date'
        )
    )

    return fig


def create_geo_chart(df):
    fig = px.choropleth(
        df,
        locations='country_code',
        color='revenue',
        hover_name='country',
        hover_data={'revenue': ':$,.0f', 'growth': ':.1%'},
        color_continuous_scale='Viridis',
        title='Revenue by Region',
        labels={'revenue': 'Revenue', 'growth': 'Growth'}
    )

    fig.update_layout(
        geo=dict(
            showframe=False,
            showcoastlines=True,
            projection_type='natural earth',
            bgcolor='rgba(0,0,0,0)'
        ),
        margin=dict(l=0, r=0, t=40, b=0),
        height=400,
        coloraxis_colorbar=dict(title='Revenue ($)')
    )

    return fig


def create_sunburst_chart(df):
    fig = px.sunburst(
        df,
        path=['region', 'category', 'product'],
        values='revenue',
        color='growth',
        color_continuous_scale='RdYlGn',
        title='Product Hierarchy',
        hover_data={'revenue': ':$,.0f'}
    )

    fig.update_layout(
        margin=dict(t=40, l=0, r=0, b=0),
        height=400
    )

    return fig


app.layout = html.Div([
    html.Div([
        html.Div([
            html.Img(src='/assets/logo.svg', height=32),
            html.H3('Enterprise Analytics', style={'marginLeft': '12px', 'margin': 0})
        ], style={'display': 'flex', 'alignItems': 'center'}),

        html.Div([
            dcc.Input(
                placeholder='Search metrics...',
                type='text',
                style={
                    'padding': '8px 16px',
                    'borderRadius': '8px',
                    'border': f'1px solid {COLORS["border"]}',
                    'width': '300px'
                }
            ),
            html.Div([
                html.Img(src='/assets/avatar.png', height=32, style={'borderRadius': '50%'}),
                html.Span('Admin', style={'marginLeft': '8px'}),
            ], style={'display': 'flex', 'alignItems': 'center', 'cursor': 'pointer'})
        ], style={'display': 'flex', 'alignItems': 'center', 'gap': '16px'})
    ], style={
        'display': 'flex',
        'justifyContent': 'space-between',
        'alignItems': 'center',
        'padding': '12px 24px',
        'backgroundColor': COLORS['card_bg'],
        'borderBottom': f'1px solid {COLORS["border"]}'
    }),

    html.Div([
        dcc.Tabs(
            id='nav-tabs',
            value='executive',
            children=[
                dcc.Tab(label='Executive', value='executive', style={'padding': '12px 24px'}),
                dcc.Tab(label='Sales', value='sales', style={'padding': '12px 24px'}),
                dcc.Tab(label='Operations', value='operations', style={'padding': '12px 24px'}),
                dcc.Tab(label='Customer', value='customer', style={'padding': '12px 24px'}),
            ],
            style={'backgroundColor': 'transparent'}
        ),
        html.Div([
            dcc.DatePickerRange(
                id='date-range',
                start_date_placeholder_text='Start',
                end_date_placeholder_text='End',
                style={'marginRight': '16px'}
            ),
            dcc.Dropdown(
                id='region-filter',
                options=[
                    {'label': 'All Regions', 'value': 'all'},
                    {'label': 'North America', 'value': 'na'},
                    {'label': 'Europe', 'value': 'eu'},
                    {'label': 'Asia Pacific', 'value': 'apac'}
                ],
                value='all',
                style={'width': '180px'},
                clearable=False
            ),
            html.Button('Refresh', id='refresh-btn', n_clicks=0, style={
                'padding': '8px 16px',
                'backgroundColor': COLORS['primary'],
                'color': 'white',
                'border': 'none',
                'borderRadius': '8px',
                'cursor': 'pointer',
                'marginLeft': '8px'
            })
        ], style={
            'display': 'flex',
            'alignItems': 'center',
            'justifyContent': 'flex-end',
            'padding': '0 24px',
            'gap': '12px'
        })
    ], style={
        'backgroundColor': COLORS['card_bg'],
        'borderBottom': f'1px solid {COLORS["border"]}',
        'padding': '8px 0'
    }),

    html.Div(id='dashboard-content', style={'padding': '24px'}),

    dcc.Interval(id='auto-refresh', interval=30000, n_intervals=0),

    dcc.Store(id='metrics-store', storage_type='memory')

], style={
    'backgroundColor': COLORS['background'],
    'minHeight': '100vh',
    'fontFamily': 'Inter, -apple-system, sans-serif'
})


@app.callback(
    Output('dashboard-content', 'children'),
    [Input('nav-tabs', 'value'),
     Input('date-range', 'start_date'),
     Input('date-range', 'end_date'),
     Input('region-filter', 'value'),
     Input('refresh-btn', 'n_clicks'),
     Input('auto-refresh', 'n_intervals')]
)
def update_dashboard(tab, start_date, end_date, region, refresh_clicks, intervals):
    df_revenue = _fetch_revenue_data(start_date, end_date, region)
    df_geo = _fetch_geo_data()
    df_products = _fetch_product_data()
    df_hierarchy = _fetch_hierarchy_data()

    if tab == 'executive':
        return _build_executive_view(df_revenue, df_geo, df_products, df_hierarchy)
    elif tab == 'sales':
        return _build_sales_view(df_revenue, df_products)
    elif tab == 'operations':
        return _build_operations_view()
    elif tab == 'customer':
        return _build_customer_view()
    return html.Div('Select a dashboard tab')


def _build_executive_view(df_revenue, df_geo, df_products, df_hierarchy):
    total_revenue = df_revenue['revenue'].sum()
    avg_growth = df_revenue['growth'].mean()
    total_transactions = df_revenue['transactions'].sum()
    conversion_rate = 3.24

    return html.Div([
        html.Div([
            create_kpi_card('Total Revenue', f'${total_revenue/1e6:.2f}M', avg_growth, '💰'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Transactions', f'{total_transactions:,}', 8.1, '📊'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Conversion Rate', f'{conversion_rate:.2f}%', -0.5, '🎯'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Active Users', '12,847', 12.3, '👥'),
        ], style={
            'display': 'flex',
            'gap': '0',
            'marginBottom': '24px'
        }),

        html.Div([
            html.Div([
                dcc.Graph(
                    figure=create_revenue_trend_chart(df_revenue),
                    config={'displayModeBar': True, 'displaylogo': False}
                )
            ], style={
                'backgroundColor': COLORS['card_bg'],
                'borderRadius': '12px',
                'boxShadow': '0 1px 3px rgba(0,0,0,0.1)',
                'border': f'1px solid {COLORS["border"]}',
                'flex': '1.2'
            }),

            html.Div([
                dcc.Graph(
                    figure=create_geo_chart(df_geo),
                    config={'displayModeBar': True, 'displaylogo': False}
                )
            ], style={
                'backgroundColor': COLORS['card_bg'],
                'borderRadius': '12px',
                'boxShadow': '0 1px 3px rgba(0,0,0,0.1)',
                'border': f'1px solid {COLORS["border"]}',
                'flex': '0.8'
            })
        ], style={'display': 'flex', 'gap': '24px', 'marginBottom': '24px'}),

        html.Div([
            html.Div([
                dash_table.DataTable(
                    data=df_products.to_dict('records'),
                    columns=[
                        {'name': 'Product', 'id': 'product'},
                        {'name': 'Revenue', 'id': 'revenue', 'type': 'numeric',
                         'format': {'specifier': '$,.0f'}},
                        {'name': 'Growth', 'id': 'growth', 'type': 'numeric',
                         'format': {'specifier': '+.1%'}},
                        {'name': 'Units', 'id': 'units', 'type': 'numeric',
                         'format': {'specifier': ',}}
                    ],
                    style_table={'overflowX': 'auto'},
                    style_header={
                        'backgroundColor': COLORS['background'],
                        'fontWeight': '600',
                        'border': f'1px solid {COLORS["border"]}'
                    },
                    style_cell={
                        'textAlign': 'left',
                        'padding': '12px',
                        'border': f'1px solid {COLORS["border"]}'
                    },
                    style_data_conditional=[
                        {
                            'if': {'filter_query': '{growth} > 0'},
                            'color': COLORS['success']
                        },
                        {
                            'if': {'filter_query': '{growth} < 0'},
                            'color': COLORS['danger']
                        }
                    ],
                    sort_action='native',
                    page_size=8
                )
            ], style={
                'backgroundColor': COLORS['card_bg'],
                'borderRadius': '12px',
                'padding': '16px',
                'boxShadow': '0 1px 3px rgba(0,0,0,0.1)',
                'border': f'1px solid {COLORS["border"]}',
                'flex': '1'
            }),

            html.Div([
                dcc.Graph(
                    figure=create_sunburst_chart(df_hierarchy),
                    config={'displayModeBar': False}
                )
            ], style={
                'backgroundColor': COLORS['card_bg'],
                'borderRadius': '12px',
                'boxShadow': '0 1px 3px rgba(0,0,0,0.1)',
                'border': f'1px solid {COLORS["border"]}',
                'flex': '1'
            })
        ], style={'display': 'flex', 'gap': '24px'})
    ])


def _build_sales_view(df_revenue, df_products):
    return html.Div([
        html.H2('Sales Analytics', style={'color': COLORS['text']}),
        html.Div([
            create_kpi_card('Total Sales', '$1.2M', 15.2, '💼'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Avg Deal Size', '$45,200', 3.8, '📐'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Win Rate', '34.2%', 2.1, '🏆'),
        ], style={'display': 'flex', 'marginBottom': '24px'}),
        html.Div([
            dcc.Graph(
                figure=px.bar(
                    df_products.head(10),
                    x='product', y='revenue',
                    color='growth',
                    color_continuous_scale='Viridis',
                    title='Top Products by Revenue'
                ).update_layout(template=THEME, height=400)
            )
        ], style={
            'backgroundColor': COLORS['card_bg'],
            'borderRadius': '12px',
            'padding': '16px'
        })
    ])


def _build_operations_view():
    return html.Div([
        html.H2('Operations Monitor', style={'color': COLORS['text']}),
        html.Div([
            create_kpi_card('System Uptime', '99.97%', 0.02, '🖥️'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Avg Response', '142ms', -8.3, '⚡'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Error Rate', '0.03%', -12.5, '✅'),
        ], style={'display': 'flex', 'marginBottom': '24px'}),
        dcc.Graph(
            figure=px.line(
                pd.DataFrame({
                    'time': pd.date_range('2024-01-01', periods=100, freq='H'),
                    'response_time': [142 + i*0.5 for i in range(100)]
                }),
                x='time', y='response_time',
                title='Response Time (Last 100 Hours)'
            ).update_layout(template=THEME, height=300)
        )
    ])


def _build_customer_view():
    return html.Div([
        html.H2('Customer 360', style={'color': COLORS['text']}),
        html.Div([
            create_kpi_card('Total Customers', '8,432', 5.2, '👤'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('NPS Score', '72', 4.1, '⭐'),
            html.Div(style={'width': '16px'}),
            create_kpi_card('Churn Rate', '2.1%', -0.8, '📉'),
        ], style={'display': 'flex', 'marginBottom': '24px'}),
    ])


def _fetch_revenue_data(start_date=None, end_date=None, region='all'):
    import numpy as np
    np.random.seed(42)
    dates = pd.date_range('2024-01-01', periods=180, freq='D')
    base = 50000 + np.cumsum(np.random.randn(180) * 1000)

    df = pd.DataFrame({
        'date': dates,
        'revenue': base,
        'profit': base * 0.25,
        'transactions': np.random.poisson(500, 180),
        'growth': np.random.uniform(-0.1, 0.2, 180)
    })

    if start_date:
        df = df[df['date'] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df['date'] <= pd.to_datetime(end_date)]

    return df


def _fetch_geo_data():
    return pd.DataFrame({
        'country': ['United States', 'Germany', 'Japan', 'Brazil', 'India',
                    'United Kingdom', 'France', 'Canada', 'Australia', 'Singapore'],
        'country_code': ['USA', 'DEU', 'JPN', 'BRA', 'IND',
                         'GBR', 'FRA', 'CAN', 'AUS', 'SGP'],
        'revenue': [850000, 420000, 380000, 210000, 340000,
                    290000, 260000, 180000, 150000, 120000],
        'growth': [12.3, 8.7, 5.2, 18.1, 22.4, 6.3, 4.8, 9.1, 7.5, 15.2]
    })


def _fetch_product_data():
    return pd.DataFrame({
        'product': ['Widget Pro', 'Gadget X', 'Tool Suite', 'Service Pack',
                    'Analytics Hub', 'Cloud Basic', 'API Gateway', 'Data Pipeline'],
        'revenue': [450000, 380000, 320000, 280000, 250000, 210000, 180000, 150000],
        'growth': [15.2, 8.1, 22.4, -3.2, 12.8, 18.5, 6.2, 9.8],
        'units': [12500, 8900, 6200, 4800, 3200, 5400, 2100, 1800]
    })


def _fetch_hierarchy_data():
    return pd.DataFrame({
        'region': ['NA']*12 + ['EU']*12 + ['APAC']*12,
        'category': ['Software']*6 + ['Hardware']*6 + ['Software']*6 + ['Hardware']*6 +
                    ['Software']*6 + ['Hardware']*6,
        'product': [f'Product {i}' for i in range(36)],
        'revenue': [abs(50000 - i*1000) for i in range(36)],
        'growth': [i*0.5 for i in range(36)]
    })


if __name__ == '__main__':
    app.run(debug=True, port=8050, host='0.0.0.0')
```

---

## Phase 4: Statistical Analytics with Seaborn

### Seaborn Integration Module

```python
# analytics/statistical.py
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from io import BytesIO
import base64


class StatisticalAnalyzer:
    """Generate publication-quality statistical visualizations."""

    PALETTE = {
        'primary': '#6366f1',
        'secondary': '#8b5cf6',
        'accent': '#ec4899',
        'success': '#10b981',
        'warning': '#f59e0b',
        'background': '#f8f9fa'
    }

    def __init__(self):
        sns.set_theme(style='whitegrid', palette='viridis')
        plt.rcParams.update({
            'figure.facecolor': 'white',
            'axes.facecolor': '#f8f9fa',
            'font.family': 'sans-serif',
            'font.size': 11
        })

    def correlation_analysis(self, df, numerical_cols=None, figsize=(12, 10)):
        """Generate correlation heatmap with clustering."""
        if numerical_cols is None:
            numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        corr = df[numerical_cols].corr()

        fig, axes = plt.subplots(1, 2, figsize=figsize, width_ratios=[1, 1])

        mask = np.triu(np.ones_like(corr, dtype=bool), k=1)
        sns.heatmap(
            corr, mask=mask, annot=True, fmt='.2f',
            cmap='RdBu_r', center=0, vmin=-1, vmax=1,
            square=True, linewidths=0.5,
            cbar_kws={'shrink': 0.8, 'label': 'Correlation'},
            ax=axes[0]
        )
        axes[0].set_title('Correlation Matrix', fontsize=14, fontweight='bold', pad=15)

        from scipy.cluster.hierarchy import linkage, dendrogram
        from scipy.spatial.distance import squareform

        dist_matrix = 1 - abs(corr)
        np.fill_diagonal(dist_matrix.values, 0)
        condensed = squareform(dist_matrix)
        linkage_matrix = linkage(condensed, method='ward')

        dendro = dendrogram(
            linkage_matrix,
            labels=numerical_cols,
            ax=axes[1],
            orientation='right',
            leaf_font_size=10
        )
        axes[1].set_title('Feature Clustering', fontsize=14, fontweight='bold', pad=15)
        axes[1].set_xlabel('Distance')

        plt.tight_layout()
        return self._fig_to_base64(fig)

    def distribution_comparison(self, df, column, group_by=None, figsize=(14, 5)):
        """Multi-panel distribution analysis."""
        fig = plt.figure(figsize=figsize)
        gs = gridspec.GridSpec(1, 3, width_ratios=[2, 1, 1])

        ax1 = fig.add_subplot(gs[0])
        if group_by:
            groups = df[group_by].unique()
            colors = sns.color_palette('viridis', len(groups))
            for g, c in zip(groups, colors):
                subset = df[df[group_by] == g][column]
                sns.kdeplot(data=subset, ax=ax1, fill=True, alpha=0.4, color=c, label=g)
            ax1.legend(title=group_by)
        else:
            sns.histplot(data=df, x=column, kde=True, color=self.PALETTE['primary'],
                        edgecolor='white', linewidth=0.5, ax=ax1)
        ax1.set_title(f'Distribution of {column}', fontweight='bold')
        ax1.set_xlabel(column)
        ax1.set_ylabel('Density')

        ax2 = fig.add_subplot(gs[1])
        sns.boxplot(data=df, y=column, ax=ax2, color=self.PALETTE['secondary'],
                   width=0.5, flierprops={'marker': 'o', 'markersize': 4})
        ax2.set_title('Box Plot', fontweight='bold')
        ax2.set_ylabel(column)

        ax3 = fig.add_subplot(gs[2])
        sns.violinplot(data=df, y=column, ax=ax3, color=self.PALETTE['accent'],
                      inner='quartile', cut=0)
        ax3.set_title('Violin Plot', fontweight='bold')
        ax3.set_ylabel(column)

        plt.suptitle(f'Statistical Analysis: {column}', fontsize=16, fontweight='bold', y=1.02)
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def regression_analysis(self, df, x_col, y_col, hue_col=None, figsize=(10, 8)):
        """Regression with confidence intervals."""
        fig, axes = plt.subplots(1, 2, figsize=figsize)

        sns.regplot(
            data=df, x=x_col, y=y_col,
            scatter_kws={'alpha': 0.5, 's': 30, 'edgecolor': 'white'},
            line_kws={'color': self.PALETTE['accent'], 'linewidth': 2},
            ci=95, ax=axes[0]
        )
        axes[0].set_title('Regression with 95% CI', fontweight='bold')

        from scipy import stats
        slope, intercept, r_value, p_value, std_err = stats.linregress(df[x_col], df[y_col])
        textstr = f'R² = {r_value**2:.3f}\np = {p_value:.4f}\ny = {slope:.2f}x + {intercept:.2f}'
        props = dict(boxstyle='round', facecolor='wheat', alpha=0.8)
        axes[0].text(0.05, 0.95, textstr, transform=axes[0].transAxes, fontsize=10,
                    verticalalignment='top', bbox=props)

        residuals = df[y_col] - (slope * df[x_col] + intercept)
        sns.histplot(residuals, kde=True, ax=axes[1], color=self.PALETTE['warning'],
                    edgecolor='white')
        axes[1].axvline(x=0, color='red', linestyle='--', linewidth=1.5)
        axes[1].set_title('Residual Distribution', fontweight='bold')
        axes[1].set_xlabel('Residuals')

        plt.tight_layout()
        return self._fig_to_base64(fig)

    def time_series_decomposition(self, dates, values, period=7, figsize=(14, 10)):
        """STL decomposition visualization."""
        from statsmodels.tsa.seasonal import seasonal_decompose

        ts = pd.Series(values, index=pd.DatetimeIndex(dates))
        decomposition = seasonal_decompose(ts, model='additive', period=period)

        fig, axes = plt.subplots(4, 1, figsize=figsize, sharex=True)

        components = [
            ('Observed', decomposition.observed, self.PALETTE['primary']),
            ('Trend', decomposition.trend, self.PALETTE['success']),
            ('Seasonal', decomposition.seasonal, self.PALETTE['secondary']),
            ('Residual', decomposition.resid, self.PALETTE['warning'])
        ]

        for ax, (title, data, color) in zip(axes, components):
            ax.plot(data.index, data.values, color=color, linewidth=1.5)
            ax.set_ylabel(title, fontweight='bold')
            ax.grid(True, alpha=0.3)

        axes[0].set_title('Time Series Decomposition', fontsize=16, fontweight='bold')
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def categorical_analysis(self, df, cat_col, val_col, figsize=(14, 6)):
        """Comprehensive categorical comparison."""
        fig, axes = plt.subplots(1, 2, figsize=figsize)

        order = df.groupby(cat_col)[val_col].median().sort_values(ascending=False).index

        sns.barplot(data=df, x=cat_col, y=val_col, order=order,
                   palette='viridis', ax=axes[0], errorbar='sd',
                   capsize=0.1, edgecolor='white')
        axes[0].set_xticklabels(axes[0].get_xticklabels(), rotation=45, ha='right')
        axes[0].set_title(f'{val_col} by {cat_col}', fontweight='bold')

        stats_text = []
        for cat in order:
            subset = df[df[cat_col] == cat][val_col]
            stats_text.append(f'{cat}: μ={subset.mean():.1f}, σ={subset.std():.1f}, n={len(subset)}')

        sns.stripplot(data=df, x=cat_col, y=val_col, order=order,
                     palette='viridis', ax=axes[1], alpha=0.4, size=4,
                     jitter=0.2)
        sns.boxplot(data=df, x=cat_col, y=val_col, order=order,
                   palette='viridis', ax=axes[1], width=0.5,
                   boxprops={'alpha': 0.3'}, flierprops={'alpha': 0})
        axes[1].set_xticklabels(axes[1].get_xticklabels(), rotation=45, ha='right')
        axes[1].set_title(f'Distribution by {cat_col}', fontweight='bold')

        plt.tight_layout()
        return self._fig_to_base64(fig)

    @staticmethod
    def _fig_to_base64(fig):
        buffer = BytesIO()
        fig.savefig(buffer, format='png', dpi=150, bbox_inches='tight',
                   facecolor='white', edgecolor='none')
        plt.close(fig)
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode()


def plotly_from_seaborn(seaborn_b64, title=''):
    """Convert seaborn output to Plotly-compatible format for Dash integration."""
    return html.Img(
        src=f'data:image/png;base64,{seaborn_b64}',
        style={'maxWidth': '100%', 'height': 'auto'},
        alt=title
    )


analyzer = StatisticalAnalyzer()
```

---

## Phase 5: Geospatial Visualization Module

### Map Layer Architecture

```
+=============================================================================+
|                    GEOSPATIAL VISUALIZATION STACK                           |
+=============================================================================+
|                                                                             |
|  +--------------------------------------------------------------------+     |
|  |                      INTERACTIVE MAP LAYER                         |     |
|  |  +------------------+  +------------------+  +------------------+ |     |
|  |  | Plotly Mapbox    |  | Folium           |  | Kepler.gl        | |     |
|  |  | (Real-time)      |  | (Exploration)    |  | (3D/Big Data)    | |     |
|  |  +------------------+  +------------------+  +------------------+ |     |
|  +--------------------------------------------------------------------+     |
|           |                       |                       |                  |
|           v                       v                       v                  |
|  +--------------------------------------------------------------------+     |
|  |                     DATA PROCESSING LAYER                         |     |
|  |  +------------------+  +------------------+  +------------------+ |     |
|  |  | GeoPandas         |  | H3 Hexagonal    |  | Turf.js          | |     |
|  |  | (Vector)          |  | (Indexing)       |  | (Geofencing)     | |     |
|  |  +------------------+  +------------------+  +------------------+ |     |
|  +--------------------------------------------------------------------+     |
|           |                       |                       |                  |
|           v                       v                       v                  |
|  +--------------------------------------------------------------------+     |
|  |                     DATA SOURCES                                   |     |
|  |  +------------------+  +------------------+  +------------------+ |     |
|  |  | PostGIS           |  | GeoJSON Files    |  | OSM API          | |     |
|  |  | (Spatial Query)   |  | (Static Data)    |  | (Base Maps)      | |     |
|  |  +------------------+  +------------------+  +------------------+ |     |
|  +--------------------------------------------------------------------+     |
|                                                                             |
+=============================================================================+
```

```python
# analytics/geospatial.py
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import geopandas as gpd
import pandas as pd
import numpy as np
import json


class GeoVisualizer:
    """Geospatial visualization engine for enterprise analytics."""

    MAP_THEMES = {
        'dark': 'carto-darkmatter',
        'light': 'carto-positron',
        'satellite': 'carto-stamer',
        'outdoors': 'open-street-map'
    }

    def __init__(self, default_theme='light'):
        self.default_style = self.MAP_THEMES.get(default_theme, 'carto-positron')

    def create_choropleth(self, df, locations_col, color_col,
                         geojson=None, featureidkey='properties.name',
                         title='', projection='natural earth', **kwargs):
        """Production choropleth with error handling."""
        fig = px.choropleth(
            df,
            locations=locations_col,
            color=color_col,
            geojson=geojson,
            featureidkey=featureidkey,
            color_continuous_scale=kwargs.get('colorscale', 'Viridis'),
            hover_name=locations_col,
            hover_data={col: ':,.0f' if df[col].dtype in ['int64', 'float64'] else False
                       for col in df.columns if col != locations_col},
            title=title
        )

        fig.update_geos(
            projection_type=projection,
            showframe=False,
            showcoastlines=True,
            coastlinecolor='#ccc',
            showland=True,
            landcolor='#f0f0f0',
            showocean=True,
            oceancolor='#e8f4f8',
            showlakes=True,
            lakecolor='#e8f4f8',
            bgcolor='rgba(0,0,0,0)'
        )

        fig.update_layout(
            margin=dict(l=0, r=0, t=50, b=0),
            coloraxis_colorbar=dict(title=color_col.replace('_', ' ').title()),
            height=500
        )

        return fig

    def create_scatter_map(self, df, lat_col, lon_col, color_col=None,
                          size_col=None, hover_cols=None, title='',
                          map_style=None, cluster=True):
        """Scatter on map with clustering support."""
        fig = px.scatter_mapbox(
            df,
            lat=lat_col,
            lon=lon_col,
            color=color_col,
            size=size_col,
            hover_data=hover_cols or [],
            color_continuous_scale='Viridis' if color_col else None,
            size_max=15 if size_col else None,
            zoom=3,
            mapbox_style=map_style or self.default_style,
            title=title
        )

        fig.update_layout(
            margin=dict(l=0, r=0, t=50, b=0),
            height=550,
            mapbox=dict(
                bearing=0,
                pitch=0
            )
        )

        if cluster:
            fig.update_traces(
                marker=dict(
                    opacity=0.7,
                    line=dict(width=1, color='white')
                )
            )

        return fig

    def create_heatmap_map(self, df, lat_col, lon_col, intensity_col,
                          radius=15, title=''):
        """Density heatmap on map."""
        fig = px.density_mapbox(
            df,
            lat=lat_col,
            lon=lon_col,
            z=intensity_col,
            radius=radius,
            center=dict(lat=df[lat_col].mean(), lon=df[lon_col].mean()),
            zoom=10,
            mapbox_style=self.default_style,
            title=title
        )

        fig.update_layout(
            margin=dict(l=0, r=0, t=50, b=0),
            height=500
        )

        return fig

    def create_flow_map(self, origins_df, destinations_df,
                       origin_lat, origin_lon, dest_lat, dest_lon,
                       flow_values, title=''):
        """Origin-destination flow visualization."""
        fig = go.Figure()

        for i in range(len(origins_df)):
            fig.add_trace(go.Scattermapbox(
                mode='lines',
                lon=[origins_df.iloc[i][origin_lon], destinations_df.iloc[i][dest_lon]],
                lat=[origins_df.iloc[i][origin_lat], destinations_df.iloc[i][dest_lat]],
                line=dict(
                    width=flow_values.iloc[i] / flow_values.max() * 5,
                    color='rgba(99, 102, 241, 0.6)'
                ),
                showlegend=False,
                hoverinfo='text',
                text=f'Flow: {flow_values.iloc[i]:,.0f}'
            ))

        fig.add_trace(go.Scattermapbox(
            mode='markers',
            lon=pd.concat([origins_df[origin_lon], destinations_df[dest_lon]]),
            lat=pd.concat([origins_df[origin_lat], destinations_df[dest_lat]]),
            marker=dict(size=10, color='red'),
            showlegend=False
        ))

        fig.update_layout(
            mapbox_style=self.default_style,
            mapbox=dict(
                center=dict(
                    lat=pd.concat([origins_df[origin_lat], destinations_df[dest_lat]]).mean(),
                    lon=pd.concat([origins_df[origin_lon], destinations_df[dest_lon]]).mean()
                ),
                zoom=5
            ),
            margin=dict(l=0, r=0, t=50, b=0),
            height=550,
            title=title
        )

        return fig

    def create_3d_terrain(self, df, lat_col, lon_col, elevation_col,
                         color_col=None, title=''):
        """3D terrain/urban visualization."""
        fig = go.Figure(go.Scattermapbox(
            lat=df[lat_col],
            lon=df[lon_col],
            mode='markers',
            marker=dict(
                size=6,
                color=df[color_col] if color_col else df[elevation_col],
                colorscale='Viridis',
                opacity=0.8,
                symbol='circle'
            ),
            text=df.apply(lambda r: f"Lat: {r[lat_col]:.4f}<br>Lon: {r[lon_col]:.4f}<br>Elev: {r[elevation_col]:.1f}m", axis=1),
            hoverinfo='text'
        ))

        fig.update_layout(
            mapbox=dict(
                style='open-street-map',
                center=dict(lat=df[lat_col].mean(), lon=df[lon_col].mean()),
                zoom=12,
                pitch=45,
                bearing=30
            ),
            margin=dict(l=0, r=0, t=50, b=0),
            height=600,
            title=title
        )

        return fig

    def create_multi_layer_map(self, df_points, df_regions, df_flows=None):
        """Multi-layer composite map."""
        fig = go.Figure()

        if 'geometry' in df_regions.columns:
            fig.add_trace(go.Choroplethmapbox(
                geojson=json.loads(df_regions.to_json()),
                locations=df_regions.index,
                z=df_regions['value'],
                colorscale='YlOrRd',
                opacity=0.5,
                marker_line_width=1,
                name='Regions'
            ))

        fig.add_trace(go.Scattermapbox(
            lat=df_points['lat'],
            lon=df_points['lon'],
            mode='markers',
            marker=dict(
                size=df_points['size'] if 'size' in df_points.columns else 10,
                color=df_points['value'] if 'value' in df_points.columns else 'blue',
                colorscale='Viridis',
                opacity=0.8
            ),
            text=df_points.get('label', ''),
            name='Data Points'
        ))

        center_lat = df_points['lat'].mean()
        center_lon = df_points['lon'].mean()

        fig.update_layout(
            mapbox=dict(
                style=self.default_style,
                center=dict(lat=center_lat, lon=center_lon),
                zoom=10
            ),
            margin=dict(l=0, r=0, t=0, b=0),
            height=600,
            legend=dict(
                yanchor='top',
                y=0.99,
                xanchor='left',
                x=0.01,
                bgcolor='rgba(255,255,255,0.8)'
            )
        )

        return fig


geo_viz = GeoVisualizer()
```

---

## Phase 6: Network Analysis Module

```python
# analytics/network_analysis.py
import networkx as nx
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from community import community_louvain


class NetworkAnalyzer:
    """Enterprise network analysis and visualization."""

    def __init__(self):
        self.color_palette = px.colors.qualitative.Set3

    def create_network_graph(self, edges_df, node_attributes=None,
                            layout='spring', title='',
                            node_size_metric='degree', show_labels=True):
        """Production network visualization."""
        G = nx.from_pandas_edgelist(edges_df, 'source', 'target', edge_attr=True)

        if node_attributes:
            for node, attrs in node_attributes.items():
                if node in G.nodes():
                    nx.set_node_attributes(G, {node: attrs})

        layout_funcs = {
            'spring': nx.spring_layout,
            'kamada_kawai': nx.kamada_kawai_layout,
            'circular': nx.circular_layout,
            'shell': nx.shell_layout,
            'spectral': nx.spectral_layout
        }

        pos = layout_funcs.get(layout, nx.spring_layout)(G, seed=42)

        partition = community_louvain.best_partition(G)

        node_x, node_y, node_text, node_size, node_color = [], [], [], [], []

        for node in G.nodes():
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)

            degree = G.degree(node)
            betweenness = nx.betweenness_centrality(G).get(node, 0)
            clustering = nx.clustering(G).get(node, 0)

            node_text.append(
                f"<b>{node}</b><br>"
                f"Degree: {degree}<br>"
                f"Betweenness: {betweenness:.3f}<br>"
                f"Clustering: {clustering:.3f}<br>"
                f"Community: {partition.get(node, 0)}"
            )

            size_metric = {
                'degree': degree * 8,
                'betweenness': betweenness * 500 + 10,
                'pagerank': nx.pagerank(G).get(node, 0) * 500 + 10
            }
            node_size.append(size_metric.get(node_size_metric, degree * 8))
            node_color.append(partition.get(node, 0))

        edge_x, edge_y = [], []
        edge_width = []

        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
            weight = G.edges[edge].get('weight', 1)
            edge_width.append(min(weight * 0.5, 4))

        edge_trace = go.Scatter(
            x=edge_x, y=edge_y,
            line=dict(width=0.5, color='rgba(150,150,150,0.3)'),
            hoverinfo='none',
            mode='lines',
            name='Edges'
        )

        node_trace = go.Scatter(
            x=node_x, y=node_y,
            mode='markers+text' if show_labels else 'markers',
            text=[n for n in G.nodes()] if show_labels else None,
            textposition='top center',
            textfont=dict(size=9, color='#666'),
            hovertext=node_text,
            hoverinfo='text',
            marker=dict(
                size=node_size,
                color=node_color,
                colorscale='Viridis',
                colorbar=dict(
                    title='Community',
                    thickness=15,
                    x=1.02
                ),
                line=dict(width=1, color='white')
            ),
            name='Nodes'
        )

        fig = go.Figure(data=[edge_trace, node_trace])

        stats = {
            'nodes': G.number_of_nodes(),
            'edges': G.number_of_edges(),
            'density': nx.density(G),
            'avg_clustering': nx.average_clustering(G),
            'components': nx.number_connected_components(G)
        }

        stats_text = (
            f"Nodes: {stats['nodes']} | "
            f"Edges: {stats['edges']} | "
            f"Density: {stats['density']:.3f} | "
            f"Avg Clustering: {stats['avg_clustering']:.3f}"
        )

        fig.update_layout(
            title=dict(text=f"{title}<br><sub>{stats_text}</sub>"),
            showlegend=True,
            hovermode='closest',
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            plot_bgcolor='white',
            height=600,
            margin=dict(l=20, r=20, t=80, b=20)
        )

        return fig, stats

    def create_organizational_chart(self, org_data, title='Organization Structure'):
        """Hierarchical org chart visualization."""
        G = nx.DiGraph()

        for employee in org_data:
            G.add_node(employee['name'], **employee)

        for employee in org_data:
            if employee.get('reports_to'):
                G.add_edge(employee['reports_to'], employee['name'])

        pos = nx.nx_agraph.graphviz_layout(G, prog='dot') if \
              self._check_graphviz() else nx.spring_layout(G, seed=42)

        node_x = [pos[n][0] for n in G.nodes()]
        node_y = [pos[n][1] for n in G.nodes()]

        role_colors = {
            'CEO': '#e74c3c',
            'VP': '#e67e22',
            'Director': '#f1c40f',
            'Manager': '#2ecc71',
            'Individual Contributor': '#3498db'
        }

        node_colors = [role_colors.get(G.nodes[n].get('role', ''), '#95a5a6') for n in G.nodes()]

        edge_x, edge_y = [], []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])

        fig = go.Figure([
            go.Scatter(x=edge_x, y=edge_y, mode='lines',
                      line=dict(width=1, color='#ccc'), hoverinfo='none'),
            go.Scatter(
                x=node_x, y=node_y,
                mode='markers+text',
                text=[n.split()[-1] for n in G.nodes()],
                textposition='top center',
                marker=dict(size=20, color=node_colors,
                          line=dict(width=2, color='white')),
                hovertext=[f"{n}<br>{G.nodes[n].get('role', 'N/A')}<br>{G.nodes[n].get('department', 'N/A')}"
                          for n in G.nodes()],
                hoverinfo='text'
            )
        ])

        fig.update_layout(
            title=title,
            showlegend=False,
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            plot_bgcolor='white',
            height=500
        )

        return fig

    def create_interactive_pyvis(self, edges_df, output_file='network.html',
                                 height='700px', width='100%'):
        """Interactive HTML network with PyVis."""
        from pyvis.network import Network

        net = Network(height=height, width=width, bgcolor='#ffffff',
                     font_color='#333', directed=True)

        G = nx.from_pandas_edgelist(edges_df, 'source', 'target', edge_attr=True)

        partition = community_louvain.best_partition(G)

        for node in G.nodes():
            degree = G.degree(node)
            net.add_node(
                node,
                label=node,
                size=degree * 5 + 10,
                title=f'Degree: {degree}',
                color=self.color_palette[partition.get(node, 0) % len(self.color_palette)]
            )

        for edge in G.edges(data=True):
            weight = edge[2].get('weight', 1)
            net.add_edge(edge[0], edge[1], width=weight, title=f'Weight: {weight}')

        net.set_options(json.dumps({
            "physics": {
                "forceAtlas2Based": {
                    "gravitationalConstant": -50,
                    "centralGravity": 0.01,
                    "springLength": 100,
                    "springConstant": 0.08
                },
                "solver": "forceAtlas2Based",
                "stabilization": {"iterations": 200}
            },
            "interaction": {
                "hover": True,
                "navigationButtons": True,
                "keyboard": True
            }
        }))

        net.save_graph(output_file)
        return output_file

    @staticmethod
    def _check_graphviz():
        try:
            import pygraphviz
            return True
        except ImportError:
            return False


network_analyzer = NetworkAnalyzer()
```

---

## Phase 7: Real-Time Streaming Module

```python
# streaming/realtime.py
import os
import json
import time
import threading
from datetime import datetime
from collections import deque
import redis
from kafka import KafkaConsumer, KafkaProducer
import pandas as pd
import numpy as np


class RealtimeEngine:
    """Real-time data streaming and processing engine."""

    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=1,
            decode_responses=True
        )

        self.kafka_bootstrap = os.getenv('KAFKA_BOOTSTRAP', 'localhost:9092')

        self.buffer = deque(maxlen=1000)
        self.subscribers = {}
        self._running = False

    def create_producer(self):
        return KafkaProducer(
            bootstrap_servers=self.kafka_bootstrap,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            acks='all',
            retries=3
        )

    def create_consumer(self, topics, group_id='dashboard-group'):
        return KafkaConsumer(
            *topics,
            bootstrap_servers=self.kafka_bootstrap,
            group_id=group_id,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='latest',
            enable_auto_commit=True
        )

    def publish_metric(self, topic, metric_name, value, dimensions=None):
        producer = self.create_producer()
        message = {
            'metric': metric_name,
            'value': value,
            'timestamp': datetime.utcnow().isoformat(),
            'dimensions': dimensions or {}
        }

        future = producer.send(topic, message)
        record_metadata = future.get(timeout=10)

        self.redis_client.hset(
            f'latest:{metric_name}',
            mapping={
                'value': str(value),
                'timestamp': message['timestamp'],
                'topic': record_metadata.topic
            }
        )
        self.redis_client.expire(f'latest:{metric_name}', 300)

        self.buffer.append(message)
        self._notify_subscribers(metric_name, message)

        return record_metadata

    def subscribe(self, metric_name, callback):
        if metric_name not in self.subscribers:
            self.subscribers[metric_name] = []
        self.subscribers[metric_name].append(callback)

    def _notify_subscribers(self, metric_name, message):
        for callback in self.subscribers.get(metric_name, []):
            try:
                callback(message)
            except Exception as e:
                print(f'Subscriber error: {e}')

    def get_realtime_metrics(self, metric_names, window_seconds=60):
        results = {}
        for name in metric_names:
            cached = self.redis_client.hgetall(f'latest:{name}')
            if cached:
                cached['value'] = float(cached.get('value', 0))
                results[name] = cached

            history_key = f'history:{name}'
            cutoff = time.time() - window_seconds
            raw_history = self.redis_client.zrangebyscore(
                history_key, cutoff, '+inf', withscores=True
            )
            results[f'{name}_history'] = [
                {'value': json.loads(v)['value'], 'timestamp': s}
                for v, s in raw_history
            ]

        return results

    def start_stream_processor(self, topic, processing_fn):
        self._running = True
        consumer = self.create_consumer([topic])

        def _process():
            for message in consumer:
                if not self._running:
                    break
                processed = processing_fn(message.value)
                if processed:
                    self.publish_metric(
                        f'{topic}.processed',
                        processed.get('metric', 'unknown'),
                        processed.get('value', 0),
                        processed.get('dimensions', {})
                    )

        thread = threading.Thread(target=_process, daemon=True)
        thread.start()
        return thread

    def stop(self):
        self._running = False


class MetricsAggregator:
    """Aggregate and downsample metrics for dashboard display."""

    def __init__(self, redis_client):
        self.redis = redis_client

    def aggregate(self, metric_name, window='1m', agg_func='avg'):
        key = f'aggregated:{metric_name}:{window}:{agg_func}'
        cached = self.redis.get(key)
        if cached:
            return json.loads(cached)

        windows = {'1m': 60, '5m': 300, '15m': 900, '1h': 3600}
        window_seconds = windows.get(window, 60)

        history_key = f'history:{metric_name}'
        cutoff = time.time() - window_seconds
        raw = self.redis.zrangebyscore(history_key, cutoff, '+inf')

        values = [json.loads(r)['value'] for r in raw]

        if not values:
            return {'value': 0, 'count': 0, 'window': window}

        aggregations = {
            'avg': np.mean(values),
            'min': np.min(values),
            'max': np.max(values),
            'sum': np.sum(values),
            'count': len(values),
            'p50': np.percentile(values, 50),
            'p95': np.percentile(values, 95),
            'p99': np.percentile(values, 99)
        }

        result = {
            'metric': metric_name,
            'window': window,
            'aggregation': agg_func,
            'value': float(aggregations.get(agg_func, aggregations['avg'])),
            'stats': {k: float(v) for k, v in aggregations.items()},
            'timestamp': datetime.utcnow().isoformat()
        }

        self.redis.setex(key, 30, json.dumps(result))
        return result


realtime_engine = RealtimeEngine()
metrics_aggregator = MetricsAggregator(realtime_engine.redis_client)
```

---

## Phase 8: Docker Deployment

### Container Orchestration Diagram

```
+=============================================================================+
|                    DOCKER COMPOSE ARCHITECTURE                              |
+=============================================================================+
|                                                                             |
|  +------------------+      +------------------+      +------------------+  |
|  |      NGINX       |      |   DASH APPS      |      |    FLASK API     |  |
|  |  (Load Balancer) | <--> | (Visualization)  | <--> | (Authentication) |  |
|  |  :80/:443        |      | :8050-8053       |      | :5001/:5002      |  |
|  +------------------+      +------------------+      +------------------+  |
|           |                       |                         |              |
|           |         +-------------+-------------+           |              |
|           |         |             |             |           |              |
|           v         v             v             v           v              |
|  +--------------------------------------------------------------------+    |
|  |                     DOCKER NETWORK: analytics-net                   |    |
|  +--------------------------------------------------------------------+    |
|           |             |             |             |                       |
|           v             v             v             v                       |
|  +-----------+  +-----------+  +-----------+  +-----------+               |
|  | POSTGRESQL|  |   REDIS   |  |   KAFKA   |  |   MINIO   |               |
|  | :5432     |  | :6379     |  | :9092     |  | :9000     |               |
|  | (Primary) |  | (Cache)   |  | (Stream)  |  | (Files)   |               |
|  +-----------+  +-----------+  +-----------+  +-----------+               |
|                                                                             |
|  +--------------------------------------------------------------------+    |
|  |                    MONITORING: Prometheus + Grafana                  |    |
|  |                    :9090 (Prom) | :3000 (Grafana)                    |    |
|  +--------------------------------------------------------------------+    |
|                                                                             |
+=============================================================================+
```

### Docker Files

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - dash-executive
      - dash-sales
      - dash-operations
      - api
    networks:
      - analytics-net
    restart: unless-stopped
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost/health" ]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: analytics_db
      POSTGRES_USER: analytics_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - analytics-net
    restart: unless-stopped
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U analytics_user -d analytics_db" ]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - analytics-net
    restart: unless-stopped
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 10s
      timeout: 5s
      retries: 5

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper
    networks:
      - analytics-net
    restart: unless-stopped

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - analytics-net

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    networks:
      - analytics-net
    restart: unless-stopped

  api:
    build:
      context: ..
      dockerfile: Dockerfile.api
    environment:
      DATABASE_URL: postgresql://analytics_user:${DB_PASSWORD}@postgres:5432/analytics_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      KAFKA_BOOTSTRAP: kafka:9092
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5001:5001"
      - "5002:5002"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      kafka:
        condition: service_started
    networks:
      - analytics-net
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'

  dash-executive:
    build:
      context: ..
      dockerfile: Dockerfile.dash
    environment:
      DATABASE_URL: postgresql://analytics_user:${DB_PASSWORD}@postgres:5432/analytics_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      DASHBOARD_PORT: 8050
      DASHBOARD_NAME: executive
    ports:
      - "8050:8050"
    depends_on:
      - api
      - redis
    networks:
      - analytics-net
    restart: unless-stopped

  dash-sales:
    build:
      context: ..
      dockerfile: Dockerfile.dash
    environment:
      DATABASE_URL: postgresql://analytics_user:${DB_PASSWORD}@postgres:5432/analytics_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      DASHBOARD_PORT: 8051
      DASHBOARD_NAME: sales
    ports:
      - "8051:8051"
    depends_on:
      - api
      - redis
    networks:
      - analytics-net
    restart: unless-stopped

  dash-operations:
    build:
      context: ..
      dockerfile: Dockerfile.dash
    environment:
      DATABASE_URL: postgresql://analytics_user:${DB_PASSWORD}@postgres:5432/analytics_db
      REDIS_HOST: redis
      REDIS_PORT: 6379
      DASHBOARD_PORT: 8052
      DASHBOARD_NAME: operations
    ports:
      - "8052:8052"
    depends_on:
      - api
      - redis
    networks:
      - analytics-net
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - analytics-net

  grafana:
    image: grafana/grafana:latest
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - analytics-net

volumes:
  postgres_data:
  redis_data:
  minio_data:
  grafana_data:

networks:
  analytics-net:
    driver: bridge
```

```dockerfile
# Dockerfile.api
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001 5002

CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "4", "--threads", "2", \
     "--timeout", "120", "--access-logfile", "-", "app:create_app()"]
```

```dockerfile
# Dockerfile.dash
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV DASHBOARD_PORT=8050
EXPOSE ${DASHBOARD_PORT}

CMD ["python", "-m", "gunicorn", "--bind", "0.0.0.0:${DASHBOARD_PORT}", \
     "--workers", "2", "--timeout", "120", "app:create_dash_app()"]
```

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream dashboards {
        server dash-executive:8050;
        server dash-sales:8051;
        server dash-operations:8052;
    }

    upstream api_servers {
        server api:5001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=dashboard:10m rate=30r/s;

    # Cache
    proxy_cache_path /tmp/nginx_cache levels=1:2
                     keys_zone=dashboard_cache:10m
                     max_size=100m
                     inactive=60m;

    server {
        listen 80;
        server_name _;

        # Redirect HTTP to HTTPS in production
        # return 301 https://$host$request_uri;

        location / {
            limit_req zone=dashboard burst=20 nodelay;
            proxy_pass http://dashboards;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support for Dash
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        location /api/ {
            limit_req zone=api burst=5 nodelay;
            proxy_pass http://api_servers/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_cache dashboard_cache;
            proxy_cache_valid 200 5m;
            proxy_cache_key "$scheme$request_method$host$request_uri";
        }

        location /auth/ {
            proxy_pass http://api_servers/auth/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # No caching for auth endpoints
            proxy_no_cache 1;
            proxy_cache_bypass 1;
        }

        location /health {
            return 200 '{"status": "healthy"}';
            add_header Content-Type application/json;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

```ini
# requirements.txt
Flask==3.0.0
Flask-Login==0.6.3
Flask-SQLAlchemy==3.1.1
gunicorn==21.2.0
psycopg2-binary==2.9.9
redis==5.0.1
kafka-python==2.0.2
PyJWT==2.8.0
dash==2.14.2
plotly==5.18.0
pandas==2.1.4
numpy==1.26.2
seaborn==0.13.0
matplotlib==3.8.2
geopandas==0.14.1
networkx==3.2.1
python-louvain==0.16
pyvis==0.3.2
scipy==1.11.4
statsmodels==0.14.1
minio==7.2.0
Werkzeug==3.0.1
SQLAlchemy==2.0.23
```

### Deployment Commands

```bash
#!/bin/bash
# deploy.sh

set -e

echo "=== Enterprise Analytics Platform Deployment ==="

# Environment variables
export DB_PASSWORD="${DB_PASSWORD:-secure_password_123}"
export JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
export MINIO_USER="${MINIO_USER:-minioadmin}"
export MINIO_PASSWORD="${MINIO_PASSWORD:-minioadmin}"
export GRAFANA_PASSWORD="${GRAFANA_PASSWORD:-admin123}"

# Create required directories
mkdir -p nginx/ssl monitoring/init

# Generate self-signed SSL cert (development only)
if [ ! -f nginx/ssl/cert.pem ]; then
    echo "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=SG/ST=Singapore/L=Singapore/O=Enterprise/CN=analytics.local"
fi

# Create Prometheus config
cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'dash-apps'
    static_configs:
      - targets:
          - dash-executive:8050
          - dash-sales:8051
          - dash-operations:8052
    metrics_path: /metrics

  - job_name: 'api'
    static_configs:
      - targets:
          - api:5001
    metrics_path: /metrics

  - job_name: 'redis'
    static_configs:
      - targets:
          - redis:6379

  - job_name: 'postgres'
    static_configs:
      - targets:
          - postgres:5432
EOF

# Build and start
echo "Building containers..."
docker-compose build

echo "Starting services..."
docker-compose up -d

# Wait for dependencies
echo "Waiting for PostgreSQL..."
until docker-compose exec postgres pg_isready -U analytics_user; do
    sleep 2
done

echo "Waiting for Redis..."
until docker-compose exec redis redis-cli ping; do
    sleep 2
done

# Initialize database
echo "Initializing database..."
docker-compose exec api python -c "
from app import create_app
from models import init_db
app = create_app()
init_db(app)
print('Database initialized successfully')
"

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Access Points:"
echo "  Dashboard:   http://localhost"
echo "  API:         http://localhost/api/"
echo "  Auth API:    http://localhost/auth/"
echo "  Grafana:     http://localhost:3000 (admin/$GRAFANA_PASSWORD)"
echo "  Prometheus:  http://localhost:9090"
echo "  MinIO:       http://localhost:9001 ($MINIO_USER/$MINIO_PASSWORD)"
echo ""
echo "Default Users:"
echo "  admin / admin123 (Admin)"
echo "  analyst / analyst123 (Analyst)"
echo "  viewer / viewer123 (Viewer)"
echo ""

# Health check
echo "Running health checks..."
for port in 80 8050 8051 8052 5001; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health 2>/dev/null || echo "000")
    echo "  Port $port: $status"
done

echo ""
echo "Deployment complete!"
```

---

## Project Structure

```
enterprise-analytics-platform/
├── app.py                          # Main application factory
├── models.py                       # SQLAlchemy models
├── auth.py                         # Authentication blueprint
├── config.py                       # Configuration management
├── requirements.txt                # Python dependencies
│
├── dashboards/
│   ├── __init__.py
│   ├── executive.py                # Executive dashboard
│   ├── sales.py                    # Sales analytics dashboard
│   ├── operations.py               # Operations monitoring
│   └── customer.py                 # Customer 360 dashboard
│
├── analytics/
│   ├── __init__.py
│   ├── statistical.py              # Seaborn statistical analysis
│   ├── geospatial.py               # Map visualizations
│   └── network_analysis.py         # Network graph analysis
│
├── streaming/
│   ├── __init__.py
│   ├── realtime.py                 # Kafka/Redis streaming
│   └── processors.py               # Stream processors
│
├── api/
│   ├── __init__.py
│   ├── routes.py                   # API endpoints
│   └── middleware.py               # Rate limiting, auth
│
├── assets/
│   ├── logo.svg
│   ├── avatar.png
│   └── styles.css                  # Custom CSS
│
├── static/
│   └── maps/                       # GeoJSON files
│
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.dash
│   └── docker-compose.yml
│
├── nginx/
│   ├── nginx.conf
│   └── ssl/
│
├── monitoring/
│   ├── prometheus.yml
│   └── grafana/
│       └── dashboards/
│
├── tests/
│   ├── test_auth.py
│   ├── test_models.py
│   ├── test_dashboards.py
│   └── test_analytics.py
│
├── scripts/
│   ├── seed_data.py
│   ├── migrate.py
│   └── deploy.sh
│
├── .env.example
├── .gitignore
├── README.md
└── Makefile
```

---

## Capstone Checklist

### Phase 1: Core Infrastructure
- [x] PostgreSQL schema with User, Dashboard, Widget, DataSource, AuditLog, QueryCache
- [x] SQLAlchemy models with relationships and indexes
- [x] Database initialization and seeding

### Phase 2: Authentication
- [x] JWT-based authentication (access + refresh tokens)
- [x] Role-based access control (admin, analyst, viewer)
- [x] Redis session management
- [x] Audit logging for all auth events
- [x] Rate limiting and token refresh

### Phase 3: Executive Dashboard
- [x] KPI cards with trend indicators
- [x] Revenue trend chart (Plotly with range slider)
- [x] Geographic breakdown (choropleth map)
- [x] Top products data table with sorting
- [x] Category sunburst visualization
- [x] Auto-refresh interval (30s)

### Phase 4: Statistical Analytics
- [x] Correlation analysis with clustering dendrogram
- [x] Multi-panel distribution analysis (histogram, box, violin)
- [x] Regression analysis with confidence intervals
- [x] Time series decomposition (STL)
- [x] Categorical comparison charts

### Phase 5: Geospatial Visualization
- [x] Choropleth maps (country/region level)
- [x] Scatter mapbox with clustering
- [x] Density heatmap
- [x] Flow visualization (origin-destination)
- [x] Multi-layer composite maps

### Phase 6: Network Analysis
- [x] Interactive network graph (community detection)
- [x] Organizational chart visualization
- [x] PyVis interactive HTML export
- [x] Network metrics (degree, betweenness, clustering)

### Phase 7: Real-Time Streaming
- [x] Kafka producer/consumer setup
- [x] Redis caching and pub/sub
- [x] Metric aggregation (avg, p50, p95, p99)
- [x] Subscriber pattern for live updates

### Phase 8: Deployment
- [x] Docker Compose (10 services)
- [x] Nginx reverse proxy with rate limiting
- [x] SSL/TLS configuration
- [x] Health checks for all services
- [x] Prometheus + Grafana monitoring
- [x] One-command deployment script

---

## Key Learning Outcomes

| Skill | Module | Application |
|-------|--------|-------------|
| Interactive Charts | M13: Plotly | Revenue trends, KPIs |
| Dashboard Framework | M14: Dash | Multi-page enterprise app |
| Statistical Viz | M15: Seaborn | Correlation, regression, distributions |
| Geospatial | M16: Maps | Choropleth, scatter maps, flow |
| Network Analysis | M16: NetworkX | Org charts, network graphs |
| Real-time Data | Capstone | Kafka, Redis streaming |
| Authentication | Capstone | JWT, RBAC, session management |
| Deployment | Capstone | Docker, Nginx, monitoring |

---

**End of Course 2: Data Visualization with Python - Enhanced Content**

