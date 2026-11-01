export const PYTHON_TECHNOLOGIES = [
  {
    id: "beautifulsoup",
    name: "Beautiful Soup",
    icon: "\u{1F35C}",
    category: "Web Scraping",
    difficulty: "Beginner",
    description: "HTML/XML parsing for web scraping and data extraction.",
    tutorials: [
      {
        title: "Basic HTML Parsing & Data Extraction",
        why: "Web scraping is essential for data collection, price monitoring, and competitive analysis. Beautiful Soup turns raw HTML into navigable Python objects, letting you extract structured data from any website in minutes.",
        code: `from bs4 import BeautifulSoup
import requests

# Fetch and parse a web page
resp = requests.get("https://example.com")
soup = BeautifulSoup(resp.text, "html.parser")

# Extract all links with text
for link in soup.find_all("a", href=True):
    print(f"{link.text.strip()}: {link['href']}")

# Find elements by CSS class
articles = soup.find_all("div", class_="article")
for article in articles:
    title = article.find("h2").text
    summary = article.find("p").text[:100]
    print(f"{title}: {summary}...")

# CSS selectors for complex queries
items = soup.select("div.content > ul > li.active")
print(f"Found {len(items)} active items")`
      },
      {
        title: "Navigating the Parse Tree & Handling Messy HTML",
        why: "Real-world HTML is nested, malformed, and inconsistent. You need to navigate parent/sibling/child relationships and handle missing elements gracefully to build reliable scrapers.",
        code: `from bs4 import BeautifulSoup

html = """
<div class="product">
  <h2>Laptop Pro</h2>
  <span class="price">$1299</span>
  <ul class="specs"><li>CPU: M3</li><li>RAM: 32GB</li></ul>
  <div class="reviews">
    <div class="review"><span class="stars">5/5</span> Great!</div>
  </div>
</div>"""
soup = BeautifulSoup(html, "html.parser")
product = soup.find("div", class_="product")

name = product.find("h2").text
price = product.find("span", class_="price").text
specs = [li.text for li in product.select("ul.specs li")]
reviews = [div.text.strip() for div in product.select(".review")]

# Safe navigation with missing elements
rating = product.select_one(".stars")
print(rating.text if rating else "No rating")

# Sibling navigation
price_tag = product.find("span", class_="price")
next_elem = price_tag.find_next_sibling()
print(f"Next after price: {next_elem}")`
      }
    ]
  },
  {
    id: "scrapy",
    name: "Scrapy",
    icon: "\u{1F577}\uFE0F",
    category: "Web Scraping",
    difficulty: "Intermediate",
    description: "Industrial-strength web crawling framework with pipelines and middleware.",
    tutorials: [
      {
        title: "Building a Spider with Items and Pipelines",
        why: "Scrapy's architecture separates crawling, parsing, and storage into clean components. Spiders define what to scrape, Items structure your data, and Pipelines handle cleaning and storage for large-scale scraping.",
        code: `import scrapy

class ProductItem(scrapy.Item):
    name = scrapy.Field()
    price = scrapy.Field()
    rating = scrapy.Field()

class ProductSpider(scrapy.Spider):
    name = "products"
    start_urls = ["https://example.com/products"]

    def parse(self, response):
        for card in response.css("div.product-card"):
            item = ProductItem()
            item["name"] = card.css("h2::text").get()
            item["price"] = card.css(".price::text").get()
            item["rating"] = card.css(".stars::attr(data-rating)").get()
            yield item

        next_page = response.css("a.next::attr(href)").get()
        if next_page:
            yield response.follow(next_page, self.parse)

# Settings for polite crawling
custom_settings = {
    "DOWNLOAD_DELAY": 2,
    "CONCURRENT_REQUESTS": 8,
    "ROBOTSTXT_OBEY": True,
}`
      },
      {
        title: "Middleware, Pipelines & Exporting Data",
        why: "Middleware intercepts requests for proxy rotation and header manipulation. Pipelines clean and validate data before storage, transforming raw scraped data into production-ready datasets.",
        code: `from itemadapter import ItemAdapter
import random

class CleanPricePipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        price = adapter["price"]
        adapter["price"] = float(price.replace("$", "").replace(",", ""))
        adapter.setdefault("source", spider.name)
        return item

class RandomUserAgentMiddleware:
    AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X...)",
    ]

    def process_request(self, request, spider):
        request.headers["User-Agent"] = random.choice(self.AGENTS)

# Export to multiple formats
# scrapy crawl products -o items.json
# scrapy crawl products -o items.csv
ITEM_PIPELINES = {
    "mypipelines.CleanPricePipeline": 300,
}`
      }
    ]
  },
  {
    id: "selenium",
    name: "Selenium",
    icon: "\u{1F916}",
    category: "Web Scraping",
    difficulty: "Intermediate",
    description: "Browser automation for dynamic JS-rendered pages and testing.",
    tutorials: [
      {
        title: "Automating Dynamic Page Interactions",
        why: "Modern SPAs load content via JavaScript, making traditional scrapers useless. Selenium drives a real browser, executing JS and rendering content exactly as users see it for scraping React/Vue apps.",
        code: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument("--headless")
opts.add_argument("--disable-gpu")

driver = webdriver.Chrome(options=opts)
driver.get("https://example.com/search")

# Wait for dynamic content to load
search_box = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "search-input"))
)
search_box.send_keys("Python tutorials")
search_box.submit()

# Wait for results and extract
results = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".result-item"))
)
for r in results[:5]:
    title = r.find_element(By.TAG_NAME, "h3").text
    link = r.find_element(By.TAG_NAME, "a").get_attribute("href")
    print(f"{title}: {link}")

driver.quit()`
      },
      {
        title: "Handling Infinite Scroll & Complex UI",
        why: "Infinite scroll, cookie banners, and multi-step forms require simulating real user behavior. Selenium's ActionChains and scroll APIs handle these patterns reliably for comprehensive scraping.",
        code: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options

driver = webdriver.Chrome(options=Options().add_argument("--headless"))
driver.get("https://example.com/feed")

# Dismiss cookie banner if present
try:
    banner = driver.find_element(By.ID, "cookie-accept")
    banner.click()
except Exception:
    pass

# Infinite scroll - load all items
last_height = driver.execute_script("return document.body.scrollHeight")
while True:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    driver.implicitly_wait(3)
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

items = driver.find_elements(By.CSS_SELECTOR, ".feed-item")
print(f"Loaded {len(items)} items after scrolling")

# Hover interaction with ActionChains
menu = driver.find_element(By.CSS_SELECTOR, ".dropdown-menu-trigger")
ActionChains(driver).move_to_element(menu).perform()

driver.quit()`
      }
    ]
  },
  {
    id: "fastapi",
    name: "FastAPI",
    icon: "\u26A1",
    category: "Web Framework",
    difficulty: "Intermediate",
    description: "Modern async API framework with automatic docs and type validation.",
    tutorials: [
      {
        title: "Building a REST API with Pydantic Validation",
        why: "FastAPI combines Python type hints with automatic request validation, serialization, and OpenAPI docs. You get production-grade APIs with minimal boilerplate handling validation so you focus on business logic.",
        code: `from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, EmailStr
from typing import Optional

app = FastAPI(title="User API")

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int

class UserResponse(UserCreate):
    id: int

users_db = {}
counter = 0

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    global counter
    counter += 1
    user_data = user.model_dump()
    user_data["id"] = counter
    users_db[counter] = user_data
    return user_data

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.get("/users")
async def list_users(skip: int = 0, limit: int = Query(default=10, le=100)):
    return list(users_db.values())[skip : skip + limit]`
      },
      {
        title: "Dependency Injection & Background Tasks",
        why: "FastAPI's dependency injection eliminates boilerplate for auth, database sessions, and shared resources. Combined with async support, you build scalable APIs where concerns are cleanly separated.",
        code: `from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()
security = HTTPBearer()

async def get_db():
    db = {"conn": "active"}
    try:
        yield db
    finally:
        db["conn"] = "closed"

async def verify_token(cred: HTTPAuthorizationCredentials = Depends(security)):
    if cred.credentials != "secret-token":
        from fastapi import HTTPException
        raise HTTPException(status_code=401)
    return cred.credentials

def send_welcome_email(email: str):
    print(f"Sending welcome email to {email}")

@app.post("/register")
async def register(
    email: str,
    bg: BackgroundTasks,
    db=Depends(get_db),
    token=Depends(verify_token),
):
    bg.add_task(send_welcome_email, email)
    return {"status": "registered", "db": db["conn"]}

@app.get("/health")
async def health(db=Depends(get_db)):
    return {"status": "ok", "db": db["conn"]}`
      }
    ]
  },
  {
    id: "flask",
    name: "Flask",
    icon: "\u{1F376}",
    category: "Web Framework",
    difficulty: "Beginner",
    description: "Lightweight micro-framework for web apps and APIs.",
    tutorials: [
      {
        title: "Routing, Templates & Forms",
        why: "Flask's minimal core lets you add exactly what you need. Jinja2 templates keep HTML clean, WTForms handles validation, and blueprints organize larger apps for prototyping and small-to-medium services.",
        code: `from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "dev-key"

tasks = []

@app.route("/")
def index():
    return render_template("index.html", tasks=tasks)

@app.route("/add", methods=["POST"])
def add_task():
    title = request.form.get("title", "").strip()
    if not title:
        flash("Title required", "error")
        return redirect(url_for("index"))
    tasks.append({"title": title, "done": False})
    flash("Task added!", "success")
    return redirect(url_for("index"))

@app.route("/toggle/<int:idx>")
def toggle(idx):
    if 0 <= idx < len(tasks):
        tasks[idx]["done"] = not tasks[idx]["done"]
    return redirect(url_for("index"))

@app.route("/delete/<int:idx>")
def delete(idx):
    if 0 <= idx < len(tasks):
        tasks.pop(idx)
    return redirect(url_for("index"))`
      },
      {
        title: "Blueprints & RESTful API Endpoints",
        why: "Blueprints modularize Flask apps into reusable components. Each blueprint encapsulates routes, templates, and static files, essential for keeping large applications organized and testable.",
        code: `from flask import Flask, Blueprint, jsonify, request

app = Flask(__name__)
api = Blueprint("api", __name__, url_prefix="/api/v1")

items = {}
counter = 0

@api.route("/items", methods=["GET"])
def list_items():
    return jsonify(list(items.values()))

@api.route("/items", methods=["POST"])
def create_item():
    global counter
    data = request.get_json()
    counter += 1
    items[counter] = {"id": counter, **data}
    return jsonify(items[counter]), 201

@api.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    if item_id not in items:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    items[item_id].update(data)
    return jsonify(items[item_id])

@api.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    if item_id in items:
        del items[item_id]
        return "", 204
    return jsonify({"error": "Not found"}), 404

app.register_blueprint(api)`
      }
    ]
  },
  {
    id: "django",
    name: "Django",
    icon: "\u{1F3B8}",
    category: "Web Framework",
    difficulty: "Intermediate",
    description: "Full-stack framework with ORM, admin, and batteries included.",
    tutorials: [
      {
        title: "Models, Migrations & ORM Queries",
        why: "Django's ORM translates Python classes to database tables, handling migrations, relationships, and complex queries. Your models ARE your schema, keeping logic and structure in sync without raw SQL.",
        code: `from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    tags = models.ManyToManyField("Tag")

# Complex queries without raw SQL
expensive = Product.objects.filter(price__gt=100).select_related("category")
in_stock = Product.objects.filter(stock__gt=0).order_by("-price")

# Aggregations
from django.db.models import Avg, Count, Sum
stats = Product.objects.aggregate(
    avg_price=Avg("price"),
    total_stock=Sum("stock"),
    count=Count("id"),
)

# GroupBy with annotate
cat_stats = Category.objects.annotate(
    product_count=Count("product"),
    avg_price=Avg("product__price"),
).filter(product_count__gt=5)`
      },
      {
        title: "Class-Based Views & Django Admin",
        why: "CBVs eliminate repetitive CRUD boilerplate with generic views. Django's admin auto-generates a management interface from models, giving your team a data dashboard without writing frontend code.",
        code: `from django.contrib import admin
from django.urls import path
from django.views.generic import ListView, CreateView
from django.urls import reverse_lazy
from .models import Product, Category

class ProductListView(ListView):
    model = Product
    paginate_by = 20
    template_name = "products/list.html"

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.GET.get("category")
        if cat:
            qs = qs.filter(category__name=cat)
        return qs.order_by("-created")

class ProductCreateView(CreateView):
    model = Product
    fields = ["name", "category", "price", "stock"]
    success_url = reverse_lazy("product-list")

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "stock"]
    list_filter = ["category", "stock"]
    search_fields = ["name"]
    list_editable = ["price", "stock"]

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/new/", ProductCreateView.as_view(), name="product-create"),
]`
      }
    ]
  },
  {
    id: "numpy",
    name: "NumPy",
    icon: "\u{1F522}",
    category: "Scientific",
    difficulty: "Intermediate",
    description: "High-performance arrays, broadcasting, and linear algebra.",
    tutorials: [
      {
        title: "Array Operations & Broadcasting",
        why: "NumPy arrays are 10-100x faster than Python lists for numerical work. Broadcasting lets you operate on arrays of different shapes without explicit loops, turning complex math into concise expressions.",
        code: `import numpy as np

# Create arrays from various sources
a = np.array([1, 2, 3, 4, 5])
b = np.arange(0, 10, 2).reshape(2, 5)
c = np.random.randn(3, 4)

# Broadcasting: add scalar to 2D array
result = c + 10  # 10 broadcasts across all elements

# Vectorized operations (no loops)
squares = a ** 2
log_vals = np.log(a.astype(float))
cumsum = np.cumsum(a)

# Matrix operations
m1 = np.array([[1, 2], [3, 4]])
m2 = np.array([[5, 6], [7, 8]])
dot_product = m1 @ m2  # matrix multiply
transpose = m1.T

# Aggregations along axes
data = np.random.randn(1000, 5)
means = data.mean(axis=0)      # column means
stds = data.std(axis=1)        # row std devs
print(f"Shape: {data.shape}, Col means: {means}")`
      },
      {
        title: "Linear Algebra & Statistical Computing",
        why: "NumPy's linalg module provides production-quality matrix decompositions, solving systems of equations, and eigenvalue computation, the mathematical backbone of ML and scientific computing.",
        code: `import numpy as np
from numpy import linalg as LA

# Solve linear system: Ax = b
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])
x = LA.solve(A, b)
print(f"Solution: {x}, Check: {A @ x}")

# Eigenvalues and eigenvectors
eigenvalues, eigenvectors = LA.eig(A)
print(f"Eigenvalues: {eigenvalues}")

# Singular Value Decomposition
M = np.random.randn(4, 3)
U, S, Vt = LA.svd(M, full_matrices=False)
reconstructed = U @ np.diag(S) @ Vt
print(f"SVD error: {LA.norm(M - reconstructed):.2e}")

# Covariance and correlation
data = np.random.randn(100, 3)
cov_matrix = np.cov(data, rowvar=False)
cor_matrix = np.corrcoef(data, rowvar=False)

# Norms and distances
vec = np.array([3, 4])
print(f"L2 norm: {LA.norm(vec)}, L1 norm: {LA.norm(vec, 1)}")`
      }
    ]
  },
  {
    id: "scipy",
    name: "SciPy",
    icon: "\u{1F52C}",
    category: "Scientific",
    difficulty: "Advanced",
    description: "Advanced scientific computing: optimization, signal processing, stats.",
    tutorials: [
      {
        title: "Optimization & Curve Fitting",
        why: "SciPy's optimize module finds minima, fits curves to data, and solves constrained problems. From finding best model parameters to minimizing cost functions, it's the go-to for numerical optimization.",
        code: `import numpy as np
from scipy import optimize
from scipy.optimize import curve_fit

# Minimize a function
def rosenbrock(x):
    return (1 - x[0])**2 + 100*(x[1] - x[0]**2)**2

result = optimize.minimize(rosenbrock, [-1, 1], method="L-BFGS-B")
print(f"Minimum at {result.x}, value: {result.fun:.6f}")

# Curve fitting to noisy data
def model(x, a, b, c):
    return a * np.exp(-b * x) + c

x_data = np.linspace(0, 4, 50)
y_data = model(x_data, 2.5, 1.3, 0.5) + np.random.normal(0, 0.1, 50)

popt, pcov = curve_fit(model, x_data, y_data, p0=[2, 1, 0])
perr = np.sqrt(np.diag(pcov))
print(f"Fitted: a={popt[0]:.2f}+/-{perr[0]:.2f}")

# Root finding
root = optimize.brentq(lambda x: x**2 - 4, 0, 10)
print(f"Root of x^2-4: {root}")`
      },
      {
        title: "Signal Processing & Interpolation",
        why: "SciPy handles real-world signal processing: filtering noise, resampling data, and interpolating missing values, critical for audio, sensor data, and time-series analysis.",
        code: `import numpy as np
from scipy import signal, interpolate

# Generate noisy signal
t = np.linspace(0, 1, 1000, endpoint=False)
clean = np.sin(2 * np.pi * 5 * t) + 0.5 * np.sin(2 * np.pi * 12 * t)
noisy = clean + np.random.normal(0, 0.3, len(t))

# Design and apply low-pass filter
b, a = signal.butter(4, 0.1)
filtered = signal.filtfilt(b, a, noisy)

# Find peaks in signal
peaks, props = signal.find_peaks(filtered, height=0.5, distance=50)
print(f"Found {len(peaks)} peaks at positions: {peaks[:5]}")

# Interpolation for missing data
x_known = np.array([0, 1, 3, 4, 6, 7])
y_known = np.array([1, 3, 2, 5, 4, 6])
f = interpolate.interp1d(x_known, y_known, kind="cubic")
x_new = np.linspace(0, 7, 100)
y_new = f(x_new)
print(f"Interpolated {len(y_new)} points from {len(x_known)} known")`
      }
    ]
  },
  {
    id: "sympy",
    name: "SymPy",
    icon: "\u{1F4D0}",
    category: "Scientific",
    difficulty: "Intermediate",
    description: "Symbolic mathematics: algebra, calculus, equation solving.",
    tutorials: [
      {
        title: "Symbolic Algebra & Calculus",
        why: "SymPy manipulates math symbols exactly like pen-and-paper, simplifying expressions, computing derivatives, and solving equations symbolically. Essential for deriving formulas and generating LaTeX.",
        code: `from sympy import symbols, diff, integrate, simplify, solve

x, y, z = symbols("x y z")

# Symbolic differentiation
f = x**3 * y + 2*x*y**2 - 5*z
df_dx = diff(f, x)
df_dy = diff(f, y)
d2f = diff(f, x, y)

# Integration
indefinite = integrate(x**2 * sympy.exp(x), x)
definite = integrate(sympy.sin(x)**2, (x, 0, sympy.pi))
print(f"Definite integral: {definite}")

# Solve equations symbolically
solutions = solve(x**2 - 5*x + 6, x)
print(f"Roots: {solutions}")

system = [2*x + y - 3, x - y + 1]
sol = solve(system, [x, y])
print(f"System solution: {sol}")

# Simplify complex expressions
expr = (x**2 - 1) / (x - 1)
print(f"Simplified: {simplify(expr)}")`
      },
      {
        title: "Matrix Algebra & Series Expansion",
        why: "SymPy handles symbolic matrices, Taylor series, and limits for theoretical work, algorithm design, and deriving closed-form solutions that numerical methods cannot provide.",
        code: `from sympy import Matrix, series, limit, oo, binomial, bernoulli

# Symbolic matrices
M = Matrix([[1, 2], [3, 4]])
print(f"Det: {M.det()}, Trace: {M.trace()}")
eigenvals = M.eigenvals()
inverse = M.inv()

# Taylor series expansion
x = symbols("x")
exp_series = series(sympy.exp(x), x, 0, n=8)
sin_series = series(sympy.sin(x), x, 0, n=10)
print(f"e^x series: {exp_series}")

# Limits
lim = limit(sympy.sin(x) / x, x, 0)
print(f"lim sin(x)/x = {lim}")

lim_inf = limit((1 + 1/x)**x, x, oo)
print(f"lim (1+1/x)^x = {lim_inf}")

# Combinatorics
print(f"C(10,3) = {binomial(10, 3)}")
print(f"B_4 = {bernoulli(4)}")`
      }
    ]
  },
  {
    id: "pandas",
    name: "Python Pandas",
    icon: "\u{1F43C}",
    category: "Data",
    difficulty: "Intermediate",
    description: "DataFrames for data wrangling, groupby, and time series.",
    tutorials: [
      {
        title: "DataFrame Operations & Data Wrangling",
        why: "Pandas DataFrames are the Swiss Army knife of data manipulation. Filtering, merging, pivoting, and reshaping data that would take hours in SQL or Excel happens in seconds with intuitive method chains.",
        code: `import pandas as pd
import numpy as np

# Create DataFrame from dict
df = pd.DataFrame({
    "date": pd.date_range("2024-01-01", periods=100),
    "product": np.random.choice(["A", "B", "C"], 100),
    "revenue": np.random.uniform(100, 1000, 100).round(2),
    "units": np.random.randint(1, 50, 100),
})

# Filtering and method chaining
high_rev = (
    df[df["revenue"] > 500]
    .sort_values("revenue", ascending=False)
    .head(20)
)

# Groupby aggregation
summary = df.groupby("product").agg(
    total_revenue=("revenue", "sum"),
    avg_order=("revenue", "mean"),
    total_units=("units", "sum"),
    num_orders=("units", "count"),
).round(2)

# Pivot tables
pivot = df.pivot_table(
    values="revenue", index="product",
    columns=pd.Grouper(key="date", freq="W"),
    aggfunc="sum", fill_value=0,
)

# Merge and join
orders = pd.DataFrame({"order_id": [1, 2, 3], "product": ["A", "B", "A"]})
customers = pd.DataFrame({"product": ["A", "B"], "discount": [0.1, 0.2]})
merged = orders.merge(customers, on="product", how="left")
print(merged)`
      },
      {
        title: "Time Series Analysis & Resampling",
        why: "Pandas has first-class time series support with resampling, rolling windows, and date parsing making temporal analysis trivial. Essential for financial data, IoT streams, and time-stamped datasets.",
        code: `import pandas as pd
import numpy as np

# Create time series
dates = pd.date_range("2024-01-01", periods=365, freq="D")
ts = pd.DataFrame({
    "date": dates,
    "value": np.cumsum(np.random.randn(365)) + 100,
    "volume": np.random.randint(100, 1000, 365),
}).set_index("date")

# Resampling: daily to monthly
monthly = ts.resample("M").agg({"value": "last", "volume": "sum"})
monthly["change"] = monthly["value"].pct_change()

# Rolling statistics
ts["ma_7"] = ts["value"].rolling(7).mean()
ts["ma_30"] = ts["value"].rolling(30).mean()
ts["volatility"] = ts["value"].rolling(30).std()

# Shifting for lag features
ts["lag_1"] = ts["value"].shift(1)
ts["lag_7"] = ts["value"].shift(7)
ts["diff_7"] = ts["value"].diff(7)

# Date-based indexing and slicing
jan = ts["2024-01"]
q1 = ts["2024-01-01":"2024-03-31"]
print(f"Q1 stats: mean={q1['value'].mean():.2f}")

# Rolling correlation
ts["corr_30"] = ts["value"].rolling(30).corr(ts["volume"])
print(ts[["value", "ma_7", "ma_30"]].tail())`
      }
    ]
  },
  {
    id: "python-datascience",
    name: "Python Data Science",
    icon: "\u{1F4CA}",
    category: "Data",
    difficulty: "Intermediate",
    description: "Jupyter notebooks, matplotlib workflow, and data pipelines.",
    tutorials: [
      {
        title: "Jupyter Notebook Workflow & Data Exploration",
        why: "Jupyter notebooks combine code, visualizations, and narrative text in one document making analysis shareable, explainable, and easy to iterate on. The standard for reproducible data science.",
        code: `# Cell 1: Import and load data
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
# %matplotlib inline

df = pd.read_csv("sales_data.csv", parse_dates=["date"])

# Cell 2: Quick EDA
print(f"Shape: {df.shape}")
print(f"Column types:\\n{df.dtypes}")
print(f"Missing values:\\n{df.isnull().sum()}")
print(f"Stats:\\n{df.describe()}")

# Cell 3: Distribution plot
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
df["revenue"].hist(bins=30, ax=axes[0], title="Revenue Distribution")
df.groupby("category")["revenue"].sum().plot(kind="bar", ax=axes[1], title="Revenue by Category")
df.set_index("date").resample("M")["revenue"].sum().plot(ax=axes[2], title="Monthly Revenue")
plt.tight_layout()
plt.savefig("eda_report.png", dpi=150)

# Cell 4: Magic commands
# %timeit my_function()
# %load_ext autoreload; %autoreload 2
# %%capture output; slow_function()`
      }
    ]
  },
  {
    id: "python-datastructure",
    name: "Python Data Structure",
    icon: "\u{1F3D7}\uFE0F",
    category: "Data",
    difficulty: "Beginner",
    description: "Algorithms, data structures, and complexity analysis.",
    tutorials: [
      {
        title: "Built-in Data Structures & Their Performance",
        why: "Choosing the right data structure is the difference between O(n) and O(1) lookups. Understanding when to use dicts vs lists vs sets directly impacts program performance at scale.",
        code: `# Lists - ordered, mutable, O(n) search
stack = []
stack.append("first")     # O(1)
stack.append("second")
popped = stack.pop()      # O(1) - LIFO
print(f"Stack: {stack}, Popped: {popped}")

# Deque - O(1) operations on both ends
from collections import deque
queue = deque()
queue.append("task1")     # O(1) enqueue
queue.append("task2")
next_task = queue.popleft()  # O(1) dequeue

# Dict - hash map, O(1) average lookup
user = {"name": "Alice", "role": "admin"}
user.setdefault("permissions", []).append("read")

# Set - O(1) membership test
seen = set()
unique = [x for x in [1, 2, 2, 3, 3, 3] if x not in seen and not seen.add(x)]

# DefaultDict - group items automatically
from collections import defaultdict
groups = defaultdict(list)
for word in ["apple", "banana", "avocado", "blueberry"]:
    groups[word[0]].append(word)
print(dict(groups))`
      },
      {
        title: "Algorithm Patterns: Two Pointers & Sliding Window",
        why: "These patterns solve common array/string problems in O(n) instead of O(n^2). Mastering them unlocks solutions to coding interview staples and real-world data stream processing.",
        code: `# Two pointers: find pair with target sum (sorted array)
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current = arr[left] + arr[right]
        if current == target:
            return (left, right)
        elif current < target:
            left += 1
        else:
            right -= 1
    return None

# Sliding window: max sum of k consecutive elements
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

# Sliding window: longest substring without repeats
def longest_unique_substr(s):
    char_index = {}
    max_len = 0
    start = 0
    for end, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= start:
            start = char_index[ch] + 1
        char_index[ch] = end
        max_len = max(max_len, end - start + 1)
    return max_len

print(two_sum_sorted([1, 2, 3, 4, 5], 9))
print(max_subarray_sum([1, 4, 2, 10, 23, 3], 4))
print(longest_unique_substr("abcabcbb"))`
      }
    ]
  },
  {
    id: "matplotlib",
    name: "Matplotlib",
    icon: "\u{1F4C8}",
    category: "Visualization",
    difficulty: "Beginner",
    description: "Publication-quality plots, subplots, and figure customization.",
    tutorials: [
      {
        title: "Multi-Panel Figures & Customization",
        why: "Matplotlib gives pixel-level control over every element of a figure. Subplots compare related visualizations side-by-side, and customization ensures charts meet publication standards.",
        code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle("Dashboard Overview", fontsize=16, fontweight="bold")

# Line chart
x = np.linspace(0, 10, 100)
axes[0, 0].plot(x, np.sin(x), label="sin", color="#2196F3")
axes[0, 0].plot(x, np.cos(x), label="cos", color="#FF5722")
axes[0, 0].legend(loc="upper right")
axes[0, 0].set_title("Trigonometric Functions")
axes[0, 0].grid(True, alpha=0.3)

# Bar chart
categories = ["Q1", "Q2", "Q3", "Q4"]
values = [23, 45, 56, 78]
axes[0, 1].bar(categories, values, color=["#4CAF50", "#2196F3", "#FF9800", "#E91E63"])
axes[0, 1].set_title("Quarterly Revenue")

# Scatter plot
np.random.seed(42)
axes[1, 0].scatter(np.random.randn(50), np.random.randn(50),
                    c=np.random.rand(50), cmap="viridis", alpha=0.7, s=50)
axes[1, 0].set_title("Scatter Plot")

# Histogram
axes[1, 1].hist(np.random.randn(1000), bins=30, color="#9C27B0", alpha=0.7, edgecolor="white")
axes[1, 1].set_title("Distribution")

plt.tight_layout()
plt.savefig("dashboard.png", dpi=150, bbox_inches="tight")
plt.show()`
      }
    ]
  },
  {
    id: "seaborn",
    name: "Seaborn",
    icon: "\u{1F30A}",
    category: "Visualization",
    difficulty: "Beginner",
    description: "Statistical visualization: heatmaps, distributions, and pair plots.",
    tutorials: [
      {
        title: "Statistical Plots & Heatmaps",
        why: "Seaborn wraps matplotlib with beautiful defaults for statistical visualizations. Heatmaps reveal correlations, pair plots show relationships, and distribution plots expose data patterns instantly.",
        code: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    "hours": np.random.uniform(1, 10, 200),
    "score": np.random.uniform(40, 100, 200),
    "subject": np.random.choice(["Math", "Science", "English"], 200),
    "study_group": np.random.choice(["A", "B", "C"], 200),
})
df["score"] = df["score"] + df["hours"] * 3

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Heatmap of correlations
corr = df[["hours", "score"]].corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, ax=axes[0, 0])
axes[0, 0].set_title("Correlation Heatmap")

# Box plot by category
sns.boxplot(data=df, x="subject", y="score", hue="study_group", ax=axes[0, 1])
axes[0, 1].set_title("Score Distribution")

# Regression plot
sns.regplot(data=df, x="hours", y="score", ax=axes[1, 0], scatter_kws={"alpha": 0.3})
axes[1, 0].set_title("Hours vs Score")

# Violin plot
sns.violinplot(data=df, x="subject", y="score", ax=axes[1, 1])
axes[1, 1].set_title("Score Violin Plot")

plt.tight_layout()
plt.savefig("seaborn_report.png", dpi=150)`
      }
    ]
  },
  {
    id: "bokeh",
    name: "Bokeh",
    icon: "\u{1F3A8}",
    category: "Visualization",
    difficulty: "Intermediate",
    description: "Interactive web-based dashboards and streaming data viz.",
    tutorials: [
      {
        title: "Interactive Plots with Widgets & Callbacks",
        why: "Bokeh generates interactive JavaScript-powered visualizations in the browser. Unlike static matplotlib, Bokeh plots support zooming, hovering, selection, and real-time updates for dashboards.",
        code: `from bokeh.plotting import figure, show
from bokeh.layouts import column
from bokeh.models import Slider, ColumnDataSource, HoverTool
import numpy as np

x = np.linspace(0, 4 * np.pi, 200)
source = ColumnDataSource(data={
    "x": x,
    "y": np.sin(x),
    "color": np.where(np.sin(x) > 0, "#2196F3", "#FF5722"),
})

p = figure(title="Interactive Sine Wave", width=800, height=400,
           x_axis_label="x", y_axis_label="amplitude")
p.scatter("x", "y", source=source, color="color", size=8, alpha=0.7)

hover = HoverTool(tooltips=[("x", "@x{0.2f}"), ("y", "@y{0.4f}")])
p.add_tools(hover)

def update(attr, old, new):
    freq = slider.value
    source.data["y"] = np.sin(freq * x)

slider = Slider(start=0.5, end=3.0, value=1.0, step=0.1, title="Frequency")
slider.on_change("value", update)

layout = column(slider, p)
    show(layout)`
      }
    ]
  },
  {
    id: "pytorch",
    name: "PyTorch",
    icon: "\u{1F525}",
    category: "Deep Learning",
    difficulty: "Advanced",
    description: "GPU-accelerated tensors, autograd, and neural network training.",
    tutorials: [
      {
        title: "Building & Training a Neural Network",
        why: "PyTorch's dynamic computation graph makes debugging natural. Its nn.Module provides a clean abstraction for defining architectures while autograd handles gradients automatically.",
        code: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Generate synthetic data
X = torch.randn(1000, 10)
y = (X[:, 0] * 2 + X[:, 1] * 0.5 - X[:, 2] > 0).float().unsqueeze(1)

dataset = TensorDataset(X, y)
loader = DataLoader(dataset, batch_size=32, shuffle=True)

# Define model
class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(10, 64),
            nn.ReLU(),
            nn.BatchNorm1d(64),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.net(x)

model = Classifier()
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
for epoch in range(20):
    total_loss = 0
    for batch_x, batch_y in loader:
        pred = model(batch_x)
        loss = criterion(pred, batch_y)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    if (epoch + 1) % 5 == 0:
        print(f"Epoch {epoch+1}: loss={total_loss/len(loader):.4f}")`
      },
      {
        title: "Transfer Learning & GPU Acceleration",
        why: "Transfer learning reuses pretrained models to solve new tasks with limited data. PyTorch's .to(device) API makes GPU deployment trivial by moving model and data to CUDA with one line.",
        code: `import torch
import torchvision.models as models
import torchvision.transforms as transforms

# Load pretrained ResNet and adapt for new task
model = models.resnet18(pretrained=True)

# Freeze early layers
for param in model.parameters():
    param.requires_grad = False

# Replace classifier head (1000 classes -> 5)
model.fc = nn.Sequential(
    nn.Linear(512, 128),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(128, 5),
)

# Move to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# Data preprocessing pipeline
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# Check model on device
x = torch.randn(1, 3, 224, 224).to(device)
output = model(x)
print(f"Output shape: {output.shape}")
print(f"Device: {next(model.parameters()).device}")`
      }
    ]
  },
  {
    id: "python-deeplearning",
    name: "Python Deep Learning",
    icon: "\u{1F9E0}",
    category: "Deep Learning",
    difficulty: "Advanced",
    description: "CNNs, RNNs, Transformers, and advanced architectures.",
    tutorials: [
      {
        title: "Building a CNN for Image Classification",
        why: "CNNs are the foundation of computer vision. Understanding convolutional layers, pooling, and feature extraction is essential for image classification, object detection, and medical imaging.",
        code: `import torch
import torch.nn as nn

class ImageClassifier(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 32, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((4, 4)),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)

model = ImageClassifier()
x = torch.randn(8, 3, 32, 32)
print(f"Output: {model(x).shape}")
params = sum(p.numel() for p in model.parameters())
print(f"Parameters: {params:,}")`
      },
      {
        title: "Transformer Architecture from Scratch",
        why: "Transformers power GPT, BERT, and modern NLP. Understanding self-attention, positional encoding, and multi-head attention gives you the intuition to modify and improve these architectures.",
        code: `import torch
import torch.nn as nn
import math

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super().__init__()
        self.heads = heads
        self.head_dim = embed_size // heads
        self.qkv = nn.Linear(embed_size, embed_size * 3)
        self.out = nn.Linear(embed_size, embed_size)

    def forward(self, x):
        B, N, C = x.shape
        qkv = self.qkv(x).reshape(B, N, 3, self.heads, self.head_dim)
        q, k, v = qkv.permute(2, 0, 3, 1, 4).unbind(0)

        attn = (q @ k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        attn = torch.softmax(attn, dim=-1)
        out = (attn @ v).transpose(1, 2).reshape(B, N, C)
        return self.out(out)

class TransformerBlock(nn.Module):
    def __init__(self, embed_size, heads, dropout=0.1):
        super().__init__()
        self.attn = SelfAttention(embed_size, heads)
        self.norm1 = nn.LayerNorm(embed_size)
        self.norm2 = nn.LayerNorm(embed_size)
        self.ff = nn.Sequential(
            nn.Linear(embed_size, embed_size * 4),
            nn.GELU(),
            nn.Linear(embed_size * 4, embed_size),
        )
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        x = x + self.dropout(self.attn(self.norm1(x)))
        x = x + self.dropout(self.ff(self.norm2(x)))
        return x

block = TransformerBlock(embed_size=256, heads=8)
x = torch.randn(2, 16, 256)
print(f"Output: {block(x).shape}")`
      }
    ]
  },
  {
    id: "ml-python",
    name: "ML with Python",
    icon: "\u{1F916}",
    category: "AI/ML",
    difficulty: "Intermediate",
    description: "scikit-learn pipelines, model selection, and evaluation.",
    tutorials: [
      {
        title: "End-to-End ML Pipeline with scikit-learn",
        why: "Pipelines chain preprocessing and modeling into a single object, preventing data leakage and simplifying deployment. Cross-validation ensures your model generalizes to unseen data.",
        code: `import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.impute import SimpleImputer
import pandas as pd

df = pd.DataFrame({
    "age": [25, 30, None, 45, 35],
    "income": [50000, 60000, 75000, None, 55000],
    "city": ["NYC", "LA", "NYC", "SF", "LA"],
    "bought": [0, 1, 1, 1, 0],
})

X = df[["age", "income", "city"]]
y = df["bought"]

# Define preprocessing per column type
numeric_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="constant", fill_value="unknown")),
    ("encoder", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipe, ["age", "income"]),
    ("cat", categorical_pipe, ["city"]),
])

# Full pipeline
full_pipeline = Pipeline([
    ("preprocess", preprocessor),
    ("classify", RandomForestClassifier(n_estimators=100, random_state=42)),
])

# Cross-validation (no data leakage!)
scores = cross_val_score(full_pipeline, X, y, cv=3, scoring="accuracy")
print(f"CV Accuracy: {scores.mean():.3f} +/- {scores.std():.3f}")

full_pipeline.fit(X, y)
preds = full_pipeline.predict(X)
print(f"Predictions: {preds}")`
      }
    ]
  },
  {
    id: "ai-python",
    name: "AI with Python",
    icon: "\u{1F680}",
    category: "AI/ML",
    difficulty: "Advanced",
    description: "LLM integration, RAG pipelines, and AI agent patterns.",
    tutorials: [
      {
        title: "Building a RAG Pipeline with LangChain",
        why: "Retrieval-Augmented Generation grounds LLM responses in your actual data. The model retrieves relevant documents and cites them, making AI reliable for enterprise use cases.",
        code: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader

# Load and split documents
loader = TextLoader("knowledge_base.txt")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500, chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " "]
)
chunks = splitter.split_documents(docs)
print(f"Split {len(docs)} docs into {len(chunks)} chunks")

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)

# RAG chain
llm = ChatOpenAI(model="gpt-4o", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True,
)

result = qa_chain.invoke({"query": "What are the main features?"})
print(f"Answer: {result['result']}")
for doc in result["source_documents"]:
    print(f"Source: {doc.metadata.get('source', 'unknown')}")
    print(f"  Preview: {doc.page_content[:100]}...")`
      },
      {
        title: "AI Agent with Tool Use & Memory",
        why: "AI agents combine LLM reasoning with external tools and persistent memory. They browse the web, execute code, and maintain context, turning a language model into a capable assistant.",
        code: `from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

@tool
def search_database(query: str) -> str:
    """Search the product database."""
    products = {"laptop": "$999", "phone": "$699", "tablet": "$499"}
    for k, v in products.items():
        if k in query.lower():
            return f"Found: {k} at {v}"
    return "No products found"

@tool
def calculate(expression: str) -> str:
    """Evaluate a math expression safely."""
    allowed = set("0123456789+-*/.() ")
    if all(c in allowed for c in expression):
        return str(eval(expression))
    return "Invalid expression"

llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when needed."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, [search_database, calculate], prompt)
executor = AgentExecutor(agent=agent, tools=[search_database, calculate])

memory = ChatMessageHistory()
session_id = "user_123"
session_map = {session_id: memory}

executor_with_memory = RunnableWithMessageHistory(
    executor, lambda sid: session_map[sid],
    input_messages_key="input", history_messages_key="chat_history",
)

config = {"configurable": {"session_id": session_id}}
r1 = executor_with_memory.invoke({"input": "What does a laptop cost?"}, config=config)
print(r1["output"])
r2 = executor_with_memory.invoke({"input": "What about two of those?"}, config=config)
print(r2["output"])`
      }
    ]
  },
  {
    id: "logistic-regression",
    name: "Logistic Regression",
    icon: "\u{1F4C9}",
    category: "AI/ML",
    difficulty: "Beginner",
    description: "Binary and multiclass classification fundamentals.",
    tutorials: [
      {
        title: "Binary Classification & Model Evaluation",
        why: "Logistic regression is the baseline for every classification task. Understanding sigmoid functions, decision boundaries, and metrics like precision/recall gives you the foundation for evaluating any ML model.",
        code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.datasets import make_classification

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=10,
                           n_informative=5, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train logistic regression
model = LogisticRegression(max_iter=1000, C=1.0, penalty="l2")
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Negative", "Positive"]))

# Feature importance via coefficients
importance = np.abs(model.coef_[0])
top_features = np.argsort(importance)[::-1][:5]
print(f"Top 5 features: {top_features}")
print(f"Coefficients: {model.coef_[0][top_features]}")`
      }
    ]
  },
  {
    id: "python-mongodb",
    name: "Python MongoDB",
    icon: "\u{1F343}",
    category: "Database",
    difficulty: "Intermediate",
    description: "Document database operations with PyMongo and aggregation.",
    tutorials: [
      {
        title: "CRUD Operations & Aggregation Pipeline",
        why: "MongoDB stores flexible JSON documents, making it ideal for rapidly evolving schemas. The aggregation pipeline performs complex data transformations without moving data to a separate processing layer.",
        code: `from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db = client["myapp"]
users = db.users

# Insert documents
user_ids = users.insert_many([
    {"name": "Alice", "age": 30, "tags": ["admin", "dev"], "created": datetime.now()},
    {"name": "Bob", "age": 25, "tags": ["dev"], "created": datetime.now()},
    {"name": "Carol", "age": 35, "tags": ["admin"], "created": datetime.now()},
]).inserted_ids

# Find with query operators
young_devs = list(users.find({
    "age": {"$lt": 32},
    "tags": {"$in": ["dev"]},
}).sort("age", 1))

# Aggregation pipeline
pipeline = [
    {"$unwind": "$tags"},
    {"$group": {
        "_id": "$tags",
        "count": {"$sum": 1},
        "avg_age": {"$avg": "$age"},
        "members": {"$push": "$name"},
    }},
    {"$sort": {"count": -1}},
    {"$project": {"tag": "$_id", "count": 1, "avg_age": {"$round": ["$avg_age", 1]}}},
]

results = list(users.aggregate(pipeline))
for r in results:
    print(f"{r['tag']}: {r['count']} members, avg age {r['avg_age']}")
print(f"Inserted {len(user_ids)} users")`
      }
    ]
  },
  {
    id: "mongoengine",
    name: "MongoEngine",
    icon: "\u{1F3D7}\uFE0F",
    category: "Database",
    difficulty: "Intermediate",
    description: "ODM for MongoDB with document schemas and validation.",
    tutorials: [
      {
        title: "Document Modeling & Validation",
        why: "MongoEngine adds structure to MongoDB with schema definitions, field validation, and relationships. You get the flexibility of documents with the safety of type checking.",
        code: `from mongoengine import (
    Document, StringField, IntField, FloatField,
    ListField, ReferenceField, DateTimeField, EmailField,
    EmbeddedDocument, EmbeddedDocumentField,
)
from datetime import datetime

class Address(EmbeddedDocument):
    street = StringField(required=True)
    city = StringField(required=True)
    zipcode = StringField()

class Product(Document):
    name = StringField(required=True, max_length=200, unique=True)
    price = FloatField(min_value=0, required=True)
    stock = IntField(default=0)
    tags = ListField(StringField())
    created_at = DateTimeField(default=datetime.now)

    meta = {
        "ordering": ["-created_at"],
        "indexes": ["name", "tags"],
    }

class Order(Document):
    customer_email = EmailField(required=True)
    products = ListField(ReferenceField(Product))
    total = FloatField()
    address = EmbeddedDocumentField(Address)
    status = StringField(choices=["pending", "shipped", "delivered"], default="pending")

    def calculate_total(self):
        self.total = sum(p.price for p in self.products)
        return self.total

# Usage
product = Product(name="Widget", price=9.99, tags=["electronics", "gadget"])
product.validate()
product.save()

addr = Address(street="123 Main St", city="Singapore")
order = Order(customer_email="user@example.com", products=[product], address=addr)
order.calculate_total()
order.save()
print(f"Order total: \${order.total}")`
      }
    ]
  },
  {
    id: "python-mysql",
    name: "Python MySQL",
    icon: "\u{1F412}",
    category: "Database",
    difficulty: "Intermediate",
    description: "Relational database operations with MySQL connector.",
    tutorials: [
      {
        title: "Connection Pooling & Parameterized Queries",
        why: "SQL injection is the number one web vulnerability. Always use parameterized queries. Connection pooling reuses database connections, reducing overhead for high-traffic applications.",
        code: `import mysql.connector
from mysql.connector import pooling
from contextlib import contextmanager

# Connection pool for efficiency
db_pool = pooling.MySQLConnectionPool(
    pool_name="mypool", pool_size=5,
    host="localhost", user="root", password="secret",
    database="myapp",
)

@contextmanager
def get_cursor(dictionary=True):
    conn = db_pool.get_connection()
    try:
        cursor = conn.cursor(dictionary=dictionary)
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

# Safe parameterized queries (prevents SQL injection)
with get_cursor() as cur:
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.execute(
        "INSERT INTO users (name, email) VALUES (%s, %s)",
        ("Alice", "alice@example.com")
    )

    cur.execute("SELECT * FROM users WHERE email = %s", ("alice@example.com",))
    user = cur.fetchone()
    print(f"User: {user}")
    print(f"Last insert ID: {cur.lastrowid}")`
      }
    ]
  },
  {
    id: "python-postgresql",
    name: "Python PostgreSQL",
    icon: "\u{1F418}",
    category: "Database",
    difficulty: "Intermediate",
    description: "Advanced SQL with psycopg2 and asyncpg.",
    tutorials: [
      {
        title: "Advanced Queries with psycopg2",
        why: "PostgreSQL supports JSON columns, CTEs, window functions, and full-text search. psycopg2 provides efficient, type-safe access to these features for complex data applications.",
        code: `import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from contextlib import contextmanager

@contextmanager
def get_connection():
    conn = psycopg2.connect(
        host="localhost", dbname="myapp",
        user="postgres", password="secret",
        cursor_factory=RealDictCursor,
    )
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# Table creation with advanced features
with get_connection() as conn:
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL,
            total DECIMAL(10,2),
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            status VARCHAR(20) DEFAULT 'pending'
        )
    """)

    # Bulk insert with execute_values
    orders = [(1, 99.99, '{"source": "web"}'),
              (2, 149.50, '{"source": "mobile"}')]
    execute_values(cur, "INSERT INTO orders (customer_id, total, metadata) VALUES %s", orders)

    # Window function: running total per customer
    cur.execute("""
        SELECT id, customer_id, total,
            SUM(total) OVER (PARTITION BY customer_id ORDER BY created_at) as running_total,
            ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at) as rn
        FROM orders ORDER BY customer_id, created_at
    """)
    for row in cur.fetchall():
        print(dict(row))`
      }
    ]
  },
  {
    id: "python-sqlite",
    name: "Python SQLite",
    icon: "\u{1F4E6}",
    category: "Database",
    difficulty: "Beginner",
    description: "Embedded database with zero configuration.",
    tutorials: [
      {
        title: "SQLite3 for Embedded Applications",
        why: "SQLite is the most deployed database in the world, embedded in every phone, browser, and Python install. Perfect for prototyping, local apps, and edge computing.",
        code: `import sqlite3
from contextlib import contextmanager

@contextmanager
def get_db(path="app.db"):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

with get_db() as conn:
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            pinned BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned);
    """)

    conn.execute("INSERT INTO notes (title, content, pinned) VALUES (?, ?, ?)",
                 ("First Note", "Hello world", 1))
    conn.execute("INSERT INTO notes (title, content) VALUES (?, ?)",
                 ("Second Note", "Another note"))

    notes = conn.execute("SELECT * FROM notes WHERE pinned = ?", (1,)).fetchall()
    for note in notes:
        print(f"[{note['id']}] {note['title']}: {note['content']}")

    stats = conn.execute("SELECT COUNT(*) as total, SUM(pinned) as pinned FROM notes").fetchone()
    print(f"Total: {stats['total']}, Pinned: {stats['pinned']}")`
      }
    ]
  },
  {
    id: "python-data-access",
    name: "Python Data Access",
    icon: "\u{1F50C}",
    category: "Database",
    difficulty: "Intermediate",
    description: "Data Access Object patterns and database abstraction.",
    tutorials: [
      {
        title: "DAO Pattern with Repository Abstraction",
        why: "The DAO pattern decouples business logic from database specifics. Swapping SQLite for PostgreSQL or a REST API becomes a one-file change, critical for testability and future refactoring.",
        code: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Optional
import sqlite3

@dataclass
class User:
    id: Optional[int] = None
    name: str = ""
    email: str = ""

class UserRepository(ABC):
    @abstractmethod
    def get(self, user_id: int) -> Optional[User]: ...

    @abstractmethod
    def list_all(self) -> List[User]: ...

    @abstractmethod
    def save(self, user: User) -> User: ...

    @abstractmethod
    def delete(self, user_id: int) -> bool: ...

class SQLiteUserRepository(UserRepository):
    def __init__(self, db_path: str):
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row

    def get(self, user_id: int) -> Optional[User]:
        row = self.conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return User(**dict(row)) if row else None

    def list_all(self) -> List[User]:
        rows = self.conn.execute("SELECT * FROM users").fetchall()
        return [User(**dict(r)) for r in rows]

    def save(self, user: User) -> User:
        cur = self.conn.execute(
            "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
            (user.name, user.email)
        )
        self.conn.commit()
        return User(**dict(cur.fetchone()))

    def delete(self, user_id: int) -> bool:
        self.conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
        self.conn.commit()
        return self.conn.total_changes > 0

# Usage - swap implementation without changing business code
repo: UserRepository = SQLiteUserRepository("app.db")
user = repo.save(User(name="Alice", email="alice@test.com"))
print(f"Created: {user.name} (id={user.id})")`
      }
    ]
  },
  {
    id: "python-data-persistence",
    name: "Python Data Persistence",
    icon: "\u{1F4BE}",
    category: "Database",
    difficulty: "Beginner",
    description: "Pickle, shelve, JSON persistence, and caching.",
    tutorials: [
      {
        title: "Serialization & Caching Strategies",
        why: "Choosing the right persistence format impacts performance and security. Pickle is fast but insecure for untrusted data; JSON is safe but limited; shelve provides a dict-like interface with disk backing.",
        code: `import pickle
import json
import shelve
import hashlib
from pathlib import Path

# JSON persistence (safe, human-readable)
config = {"db_host": "localhost", "port": 5432, "features": ["auth", "api"]}
Path("config.json").write_text(json.dumps(config, indent=2))
loaded = json.loads(Path("config.json").read_text())

# Pickle (fast, supports complex objects, INSECURE for untrusted data)
import numpy as np
model_data = {"weights": np.random.randn(100, 50), "bias": np.zeros(50)}
with open("model.pkl", "wb") as f:
    pickle.dump(model_data, f, protocol=pickle.HIGHEST_PROTOCOL)

with open("model.pkl", "rb") as f:
    restored = pickle.load(f)
print(f"Restored shape: {restored['weights'].shape}")

# Shelve - persistent dict (great for caches)
with shelve.open("cache", writeback=True) as cache:
    cache["user_prefs"] = {"theme": "dark", "lang": "en"}
    cache["results"] = [1, 2, 3]
    print(f"Cached keys: {list(cache.keys())}")

# File-based cache with TTL
class FileCache:
    def __init__(self, path=".cache", ttl=3600):
        self.path = Path(path)
        self.path.mkdir(exist_ok=True)
        self.ttl = ttl

    def get(self, key):
        import time
        f = self.path / hashlib.md5(key.encode()).hexdigest()
        if f.exists():
            data = json.loads(f.read_text())
            if time.time() - data["ts"] < self.ttl:
                return data["value"]
        return None

    def set(self, key, value):
        import time
        f = self.path / hashlib.md5(key.encode()).hexdigest()
        f.write_text(json.dumps({"value": value, "ts": time.time()}))

cache = FileCache(ttl=60)
cache.set("query:python", {"results": 42})
print(f"Cache hit: {cache.get('query:python')}")`
      }
    ]
  },
  {
    id: "pyqt",
    name: "PyQt/PyQt5",
    icon: "\u{1F5A5}\uFE0F",
    category: "GUI",
    difficulty: "Intermediate",
    description: "Cross-platform desktop apps with Qt widgets and signals.",
    tutorials: [
      {
        title: "Building a Desktop App with Signals & Slots",
        why: "PyQt combines Python's ease with Qt's power. The signal/slot mechanism decouples UI events from logic, making your code maintainable. Qt's widget library covers everything from buttons to table views.",
        code: `import sys
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout,
    QPushButton, QLineEdit, QListWidget, QLabel, QStatusBar,
)
from PyQt5.QtCore import Qt

class TodoApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Todo List")
        self.setMinimumSize(400, 500)

        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)

        self.input = QLineEdit()
        self.input.setPlaceholderText("Enter a task...")
        self.input.returnPressed.connect(self.add_task)
        layout.addWidget(self.input)

        self.add_btn = QPushButton("Add Task")
        self.add_btn.clicked.connect(self.add_task)
        layout.addWidget(self.add_btn)

        self.list_widget = QListWidget()
        self.list_widget.itemDoubleClicked.connect(self.complete_task)
        layout.addWidget(self.list_widget)

        self.status = QStatusBar()
        self.setStatusBar(self.status)
        self.update_status()

    def add_task(self):
        text = self.input.text().strip()
        if text:
            self.list_widget.addItem(f"  {text}")
            self.input.clear()
            self.update_status()

    def complete_task(self, item):
        text = item.text()
        if text.startswith("  "):
            item.setText(f"  [DONE] {text.strip()}")
        self.update_status()

    def update_status(self):
        total = self.list_widget.count()
        done = sum(1 for i in range(total)
                   if "[DONE]" in self.list_widget.item(i).text())
        self.status.showMessage(f"Tasks: {done}/{total} completed")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TodoApp()
    window.show()
    sys.exit(app.exec_())`
      }
    ]
  },
  {
    id: "kivy",
    name: "Kivy",
    icon: "\u{1F4F1}",
    category: "GUI",
    difficulty: "Intermediate",
    description: "Multi-touch mobile and desktop app development.",
    tutorials: [
      {
        title: "Cross-Platform Mobile App with Kivy",
        why: "Kivy lets you write Python once and deploy to Android, iOS, and desktop. Its touch-native widget set and KV language make mobile development accessible to Python developers.",
        code: `from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.core.window import Window

Window.size = (400, 600)

class NoteApp(App):
    def build(self):
        self.notes = []
        layout = BoxLayout(orientation="vertical", padding=20, spacing=10)

        self.title_label = Label(
            text="Quick Notes", font_size=28, size_hint_y=0.1
        )
        layout.add_widget(self.title_label)

        self.input = TextInput(
            hint_text="Type a note...", size_hint_y=0.15,
            multiline=True, font_size=18,
        )
        layout.add_widget(self.input)

        self.output = Label(
            text="No notes yet", font_size=16,
            size_hint_y=0.5, valign="top",
            text_size=(360, None),
        )
        layout.add_widget(self.output)

        btn_row = BoxLayout(size_hint_y=0.15, spacing=10)
        add_btn = Button(text="Add Note", font_size=18)
        add_btn.bind(on_press=self.add_note)
        clear_btn = Button(text="Clear All", font_size=18)
        clear_btn.bind(on_press=self.clear_notes)
        btn_row.add_widget(add_btn)
        btn_row.add_widget(clear_btn)
        layout.add_widget(btn_row)

        return layout

    def add_note(self, instance):
        text = self.input.text.strip()
        if text:
            self.notes.append(text)
            self.output.text = "\\n".join(
                f"{i+1}. {n}" for i, n in enumerate(self.notes)
            )
            self.input.text = ""
            self.title_label.text = f"Quick Notes ({len(self.notes)})"

    def clear_notes(self, instance):
        self.notes.clear()
        self.output.text = "No notes yet"
        self.title_label.text = "Quick Notes"

if __name__ == "__main__":
    NoteApp().run()`
      }
    ]
  },
  {
    id: "pygtk",
    name: "PyGTK",
    icon: "\u{1F427}",
    category: "GUI",
    difficulty: "Intermediate",
    description: "GNOME desktop integration and GTK widgets.",
    tutorials: [
      {
        title: "GTK Application with File Dialogs",
        why: "PyGTK integrates natively with GNOME desktops, providing system tray icons, file dialogs, and desktop notifications. GTK's signal system separates UI design from Python logic cleanly.",
        code: `import gi
gi.require_version("Gtk", "3.0")
from gi.repository import Gtk

class TextEditor(Gtk.ApplicationWindow):
    def __init__(self):
        super().__init__(title="Text Editor")
        self.set_default_size(800, 600)

        header = Gtk.HeaderBar(title="Text Editor", show_close_button=True)
        self.set_titlebar(header)

        open_btn = Gtk.Button(label="Open")
        open_btn.connect("clicked", self.on_open)
        header.pack_start(open_btn)

        save_btn = Gtk.Button(label="Save")
        save_btn.connect("clicked", self.on_save)
        header.pack_end(save_btn)

        scroll = Gtk.ScrolledWindow()
        self.textview = Gtk.TextView()
        self.textview.set_monospace(True)
        self.textview.set_left_margin(10)
        scroll.add(self.textview)
        self.add(scroll)

    def on_open(self, button):
        dialog = Gtk.FileChooserDialog(
            title="Open File", parent=self,
            action=Gtk.FileChooserAction.OPEN,
        )
        dialog.add_buttons(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
                          Gtk.STOCK_OPEN, Gtk.ResponseType.OK)
        if dialog.run() == Gtk.ResponseType.OK:
            with open(dialog.get_filename(), "r") as f:
                buf = self.textview.get_buffer()
                buf.set_text(f.read())
        dialog.destroy()

    def on_save(self, button):
        dialog = Gtk.FileChooserDialog(
            title="Save File", parent=self,
            action=Gtk.FileChooserAction.SAVE,
        )
        dialog.add_buttons(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
                          Gtk.STOCK_SAVE, Gtk.ResponseType.OK)
        if dialog.run() == Gtk.ResponseType.OK:
            buf = self.textview.get_buffer()
            start, end = buf.get_bounds()
            with open(dialog.get_filename(), "w") as f:
                f.write(buf.get_text(start, end, True))
        dialog.destroy()`
      }
    ]
  },
  {
    id: "pysimplegui",
    name: "PySimpleGUI",
    icon: "\u2728",
    category: "GUI",
    difficulty: "Beginner",
    description: "Rapid GUI prototyping with simple layouts and events.",
    tutorials: [
      {
        title: "Quick GUI Prototypes in Minutes",
        why: "PySimpleGUI's layout-based approach turns complex GUIs into simple lists. You describe what you want and the framework handles the rest. Perfect for tools, dashboards, and quick prototypes.",
        code: `import PySimpleGUI as sg

# Define layout as list of lists
layout = [
    [sg.Text("File Converter", font=("Helvetica", 16))],
    [sg.Text("Input File:"), sg.Input(key="-IN-"),
     sg.FileBrowse(file_types=(("CSV Files", "*.csv"),))],
    [sg.Text("Output Format:"),
     sg.Combo(["JSON", "XML", "Excel"], default_value="JSON", key="-FMT-")],
    [sg.Checkbox("Include headers", default=True, key="-HDR-")],
    [sg.ProgressBar(100, orientation="h", size=(30, 20), key="-PROG-")],
    [sg.Button("Convert"), sg.Button("Exit")],
    [sg.Multiline(size=(50, 10), key="-OUTPUT-", disabled=True)],
]

window = sg.Window("Converter Tool", layout)

while True:
    event, values = window.read()
    if event in (sg.WIN_CLOSED, "Exit"):
        break

    if event == "Convert":
        input_file = values["-IN-"]
        fmt = values["-FMT-"]
        include_hdr = values["-HDR-"]

        if not input_file:
            sg.popup_error("Please select an input file!")
            continue

        window["-OUTPUT-"].update(f"Converting {input_file} to {fmt}...\\n")
        window["-PROG-"].update(50)

        import csv, json
        with open(input_file, "r") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            output = json.dumps(rows[:5], indent=2) if include_hdr else json.dumps(rows[:5])
            window["-OUTPUT-"].update(output)

        window["-PROG-"].update(100)
        sg.popup(f"Converted {len(rows)} rows to {fmt}!")

window.close()`
      }
    ]
  },
  {
    id: "wxpython",
    name: "WxPython",
    icon: "\u{1F9A2}",
    category: "GUI",
    difficulty: "Intermediate",
    description: "Native widget toolkit for platform-native UIs.",
    tutorials: [
      {
        title: "Native Desktop App with wxPython",
        why: "WxPython wraps wxWidgets C++ library, giving truly native widgets that look right on each platform. Ideal for applications where platform consistency matters more than custom styling.",
        code: `import wx
import wx.grid

class DataGridFrame(wx.Frame):
    def __init__(self):
        super().__init__(None, title="Data Viewer", size=(800, 600))

        panel = wx.Panel(self)
        sizer = wx.BoxSizer(wx.VERTICAL)

        toolbar = wx.BoxSizer(wx.HORIZONTAL)
        self.search = wx.TextCtrl(panel, placeholder="Search...")
        self.search.Bind(wx.EVT_TEXT, self.on_search)
        toolbar.Add(self.search, 1, wx.ALL | wx.EXPAND, 5)

        add_btn = wx.Button(panel, label="Add Row")
        add_btn.Bind(wx.EVT_BUTTON, self.on_add)
        toolbar.Add(add_btn, 0, wx.ALL, 5)
        sizer.Add(toolbar, 0, wx.EXPAND | wx.ALL, 5)

        self.grid = wx.grid.Grid(panel)
        self.grid.CreateGrid(0, 4)
        for i, h in enumerate(["ID", "Name", "Email", "Status"]):
            self.grid.SetColLabelValue(i, h)
            self.grid.SetColSize(i, 150)

        self.data = [
            [1, "Alice", "alice@test.com", "Active"],
            [2, "Bob", "bob@test.com", "Inactive"],
            [3, "Carol", "carol@test.com", "Active"],
        ]
        self.populate_grid(self.data)
        sizer.Add(self.grid, 1, wx.EXPAND | wx.ALL, 5)
        panel.SetSizer(sizer)
        self.Centre()

    def populate_grid(self, rows):
        if self.grid.GetNumberRows() > 0:
            self.grid.DeleteRows(0, self.grid.GetNumberRows())
        for row in rows:
            self.grid.AppendRows(1)
            r = self.grid.GetNumberRows() - 1
            for c, val in enumerate(row):
                self.grid.SetCellValue(r, c, str(val))

    def on_search(self, event):
        query = self.search.GetValue().lower()
        filtered = [r for r in self.data if query in str(r).lower()]
        self.populate_grid(filtered)

    def on_add(self, event):
        self.data.append([len(self.data) + 1, "New User", "new@test.com", "Pending"])
        self.populate_grid(self.data)

app = wx.App()
frame = DataGridFrame()
frame.Show()
    app.MainLoop()`
      }
    ]
  },
  {
    id: "pycharm",
    name: "PyCharm",
    icon: "\u{1F3AF}",
    category: "Tools",
    difficulty: "Beginner",
    description: "Professional Python IDE with debugging and refactoring.",
    tutorials: [
      {
        title: "Productive PyCharm Workflows",
        why: "PyCharm's intelligent code completion, integrated debugger, and refactoring tools dramatically speed up development. Learning keyboard shortcuts and configuration tricks saves time from day one.",
        code: `# PyCharm Live Templates - type shortcut + Tab
# "def" + Tab -> function definition
# "for" + Tab -> for loop

# Configure in: Settings > Editor > Live Templates
# Example custom template:
# Abbreviation: "main"
# Template:
def main():
    \${cursor}
    pass

if __name__ == "__main__":
    main()

# Debug configuration:
# 1. Set breakpoint: click gutter or F9
# 2. Debug: Shift+F9
# 3. Evaluate expression: Alt+F8
# 4. Watch variables in Debug tool window

# Code inspection shortcuts:
# Ctrl+Shift+F7 - highlight all usages
# Ctrl+Alt+O - optimize imports
# Ctrl+Alt+L - reformat code
# Alt+Enter - quick fixes and intentions

print("Learn PyCharm shortcuts for 10x productivity")
print("View > Tool Windows > see all available panels")
print("Alt+1 = Project, Alt+2 = Find, Alt+7 = Structure")`
      }
    ]
  },
  {
    id: "jupyter",
    name: "Jupyter",
    icon: "\u{1F4D3}",
    category: "Tools",
    difficulty: "Beginner",
    description: "Interactive notebooks, magic commands, and kernels.",
    tutorials: [
      {
        title: "Jupyter Magic Commands & Advanced Features",
        why: "Jupyter's magic commands turn notebooks into powerful environments. From profiling code performance to auto-reloading modules, magics eliminate context switching between tools.",
        code: `# Line magics - apply to single line
# %timeit sum(range(1000))
# %who  # list all variables
# %pwd  # show current directory

# Cell magics - apply to entire cell
# %%timeit
# result = sum(x**2 for x in range(10000))

# %%html
# <h1>This renders as HTML</h1>

# Auto-reload modules during development
# %load_ext autoreload
# %autoreload 2

# Rich output
from IPython.display import display, HTML, Markdown
display(HTML("<h3>Rich HTML Output</h3>"))
display(Markdown("**Bold** and *italic* text"))

# Widget-based interactive controls
from ipywidgets import interact, IntSlider, Dropdown
import numpy as np, matplotlib.pyplot as plt

@interact(x=IntSlider(min=0, max=10, value=5),
          func=Dropdown(options=["sin", "cos", "tan"]))
def plot_func(x=5, func="sin"):
    t = np.linspace(0, x, 100)
    plt.plot(t, getattr(np, func)(t))
    plt.title(f"{func}(x) on [0, {x}]")
    plt.show()

# JupyterHub for shared notebooks
print("Use %%timeit to profile entire cells")
print("Use %matplotlib inline for inline plots")`
      }
    ]
  },
  {
    id: "pygame",
    name: "PyGame",
    icon: "\u{1F3AE}",
    category: "Game Dev",
    difficulty: "Intermediate",
    description: "2D game development with sprites, physics, and sound.",
    tutorials: [
      {
        title: "Sprite Management & Game Loop",
        why: "PyGame provides core building blocks for 2D games: a game loop, sprite system, collision detection, and audio. Understanding the input-update-render loop is the foundation of all game development.",
        code: `import pygame
import random

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Catch the Falling Stars")
clock = pygame.time.Clock()

class Star(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((20, 20), pygame.SRCALPHA)
        pygame.draw.polygon(self.image, (255, 215, 0),
            [(10, 0), (13, 7), (20, 7), (14, 12), (16, 20),
             (10, 15), (4, 20), (6, 12), (0, 7), (7, 7)])
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, 780)
        self.rect.y = random.randint(-100, -20)
        self.speed = random.randint(2, 6)

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > 600:
            self.rect.y = random.randint(-100, -20)
            self.rect.x = random.randint(0, 780)

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((40, 40), pygame.SRCALPHA)
        pygame.draw.circle(self.image, (0, 150, 255), (20, 20), 20)
        self.rect = self.image.get_rect(center=(400, 550))

    def update(self):
        self.rect.centerx = pygame.mouse.get_pos()[0]

stars = pygame.sprite.Group([Star() for _ in range(15)])
player = Player()
all_sprites = pygame.sprite.Group(player, *stars)
score = 0
font = pygame.font.Font(None, 36)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    all_sprites.update()
    collected = pygame.sprite.spritecollide(player, stars, True)
    score += len(collected)
    for _ in collected:
        stars.add(Star())

    screen.fill((20, 20, 40))
    all_sprites.draw(screen)
    text = font.render(f"Stars: {score}", True, (255, 255, 255))
    screen.blit(text, (10, 10))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()`
      }
    ]
  },
  {
    id: "python-digital-forensics",
    name: "Python Digital Forensics",
    icon: "\u{1F50D}",
    category: "Security",
    difficulty: "Advanced",
    description: "Disk imaging, file system analysis, and evidence recovery.",
    tutorials: [
      {
        title: "Disk Image Analysis & File Recovery",
        why: "Digital forensics extracts evidence from storage media while maintaining chain of custody. Python automates disk imaging, file carving, and metadata extraction for thousands of artifacts.",
        code: `import hashlib
import os
from datetime import datetime
from pathlib import Path

class DiskAnalyzer:
    def __init__(self, image_path):
        self.image_path = image_path
        self.file_signatures = {
            b"\\x89PNG": "png",
            b"\\xff\\xd8\\xff": "jpg",
            b"%PDF": "pdf",
            b"PK\\x03\\x04": "zip",
            b"GIF8": "gif",
        }

    def compute_hash(self, algorithm="sha256"):
        h = hashlib.new(algorithm)
        with open(self.image_path, "rb") as f:
            while chunk := f.read(8192):
                h.update(chunk)
        return h.hexdigest()

    def carve_files(self, output_dir="recovered"):
        Path(output_dir).mkdir(exist_ok=True)
        recovered = []
        with open(self.image_path, "rb") as f:
            data = f.read()

        for sig, ext in self.file_signatures.items():
            offset = 0
            count = 0
            while True:
                pos = data.find(sig, offset)
                if pos == -1:
                    break
                end = data.find(b"\\x00\\x00\\x00", pos + len(sig) + 100)
                if end == -1:
                    end = min(pos + 100000, len(data))

                filename = f"{ext}_{count:04d}.{ext}"
                filepath = os.path.join(output_dir, filename)
                with open(filepath, "wb") as out:
                    out.write(data[pos:end])
                recovered.append({"file": filepath, "offset": pos, "type": ext})
                count += 1
                offset = pos + 1

        return recovered

    def extract_metadata(self):
        return {
            "image": self.image_path,
            "size_bytes": os.path.getsize(self.image_path),
            "sha256": self.compute_hash("sha256"),
            "md5": self.compute_hash("md5"),
            "analyzed_at": datetime.now().isoformat(),
        }

analyzer = DiskAnalyzer("evidence.raw")
print(f"Hash: {analyzer.compute_hash()[:16]}...")
files = analyzer.carve_files()
print(f"Recovered {len(files)} files")`
      }
    ]
  },
  {
    id: "python-forensics",
    name: "Python Forensics",
    icon: "\u{1F50E}",
    category: "Security",
    difficulty: "Advanced",
    description: "Evidence analysis, log parsing, and forensic reporting.",
    tutorials: [
      {
        title: "Log Analysis & Timeline Reconstruction",
        why: "Forensic log analysis reconstructs attack timelines from scattered evidence. Python parses, correlates, and visualizes log entries across multiple sources for actionable intelligence.",
        code: `import re
import json
from datetime import datetime
from collections import Counter

class ForensicLogAnalyzer:
    def __init__(self):
        self.events = []
        self.suspicious_patterns = [
            (r"failed password", "AUTH_FAILURE"),
            (r"\\bforbidden\\b", "ACCESS_DENIED"),
            (r"sql.*injection", "SQL_INJECTION"),
            (r"<script>", "XSS_ATTEMPT"),
            (r"\\b(rm -rf|del /s)\\b", "DANGEROUS_COMMAND"),
        ]

    def parse_apache_log(self, log_path):
        pattern = r"(\\S+) \\S+ \\S+ \\[(.+?)\\] \\\"(\\S+) (\\S+) \\S+\\\" (\\d+) (\\d+)"
        with open(log_path) as f:
            for line in f:
                match = re.match(pattern, line)
                if match:
                    ip, timestamp, method, path, status, size = match.groups()
                    self.events.append({
                        "source": "apache", "ip": ip,
                        "timestamp": datetime.strptime(timestamp, "%d/%b/%Y:%H:%M:%S %z"),
                        "method": method, "path": path,
                        "status": int(status), "size": int(size),
                    })

    def detect_suspicious(self):
        alerts = []
        for event in self.events:
            text = json.dumps(event).lower()
            for pattern, label in self.suspicious_patterns:
                if re.search(pattern, text):
                    alerts.append({**event, "alert": label})
        return alerts

    def build_timeline(self, events=None):
        events = events or self.events
        return sorted(events, key=lambda e: e.get("timestamp", datetime.min))

    def generate_report(self):
        ip_counts = Counter(e.get("ip", "unknown") for e in self.events)
        status_counts = Counter(e.get("status", 0) for e in self.events)
        alerts = self.detect_suspicious()
        return {
            "total_events": len(self.events),
            "unique_ips": len(ip_counts),
            "top_ips": ip_counts.most_common(10),
            "status_distribution": dict(status_counts),
            "alert_count": len(alerts),
        }

analyzer = ForensicLogAnalyzer()
report = analyzer.generate_report()
print(f"Events: {report['total_events']}")
print(f"Alerts: {report['alert_count']}")`
      }
    ]
  },
  {
    id: "pytest",
    name: "PyTest",
    icon: "\u2705",
    category: "Testing",
    difficulty: "Beginner",
    description: "Fixtures, parametrize, and comprehensive test suites.",
    tutorials: [
      {
        title: "Fixtures, Parametrize & Test Organization",
        why: "PyTest's fixtures manage test setup/teardown automatically, and parametrize runs the same test with different inputs. Together they eliminate duplication and ensure thorough coverage.",
        code: `import pytest

# Fixtures provide reusable setup/teardown
@pytest.fixture
def sample_db():
    db = {"users": [], "counter": 0}
    yield db
    db.clear()

@pytest.fixture(params=["sqlite", "postgres"])
def database(request):
    """Run test against multiple backends."""
    if request.param == "sqlite":
        return {"engine": "sqlite", "path": ":memory:"}
    return {"engine": "postgres", "host": "localhost"}

def add_user(db, name):
    db["counter"] += 1
    db["users"].append({"id": db["counter"], "name": name})
    return db["users"][-1]

def test_add_user(sample_db):
    user = add_user(sample_db, "Alice")
    assert user["name"] == "Alice"
    assert user["id"] == 1
    assert len(sample_db["users"]) == 1

@pytest.mark.parametrize("name,expected_len", [
    ("Alice", 5),
    ("Bob", 3),
    ("Christopher", 11),
])
def test_name_length(sample_db, name, expected_len):
    add_user(sample_db, name)
    assert len(sample_db["users"][0]["name"]) == expected_len

def test_db_connection(database):
    assert "engine" in database

def test_empty_name_raises(sample_db):
    with pytest.raises(ValueError):
        if not "":
            raise ValueError("Name cannot be empty")

@pytest.mark.skip(reason="Not implemented yet")
def test_future_feature():
    pass

# Run: pytest -v --tb=short
# Coverage: pytest --cov=mymodule --cov-report=html`
      }
    ]
  },
  {
    id: "behave",
    name: "Behave",
    icon: "\u{1F952}",
    category: "Testing",
    difficulty: "Intermediate",
    description: "BDD testing with Gherkin syntax and step definitions.",
    tutorials: [
      {
        title: "Writing Gherkin Specs & Step Definitions",
        why: "BDD bridges the gap between business requirements and code. Gherkin's Given/When/Then format makes tests readable by non-developers while step definitions automate verification.",
        code: `# features/calculator.feature
"""
Feature: Calculator
  As a user
  I want to perform basic calculations

  Scenario: Addition
    Given I have entered 5 into the calculator
    And I have entered 3 into the calculator
    When I press add
    Then the result should be 8

  Scenario Outline: Multiple operations
    Given I have entered <a> into the calculator
    And I have entered <b> into the calculator
    When I press <operation>
    Then the result should be <result>

    Examples:
      | a  | b  | operation | result |
      | 10 | 3  | subtract  | 7      |
      | 4  | 5  | multiply  | 20     |
      | 20 | 4  | divide    | 5      |
"""

# steps/calculator.py
from behave import given, when, then

@given("I have entered {number:d} into the calculator")
def step_enter_number(context, number):
    context.calculator = getattr(context, "calculator", None)
    if context.calculator is None:
        from myapp.calculator import Calculator
        context.calculator = Calculator()
    context.calculator.enter(number)

@when("I press add")
def step_press_add(context):
    context.result = context.calculator.add()

@when("I press subtract")
def step_press_subtract(context):
    context.result = context.calculator.subtract()

@when("I press multiply")
def step_press_multiply(context):
    context.result = context.calculator.multiply()

@when("I press divide")
def step_press_divide(context):
    context.result = context.calculator.divide()

@then("the result should be {expected:d}")
def step_check_result(context, expected):
    assert context.result == expected, f"Expected {expected}, got {context.result}"

# Run: behave
# With tags: behave --tags=@smoke`
      }
    ]
  },
  {
    id: "concurrency",
    name: "Concurrency with Python",
    icon: "\u{1F504}",
    category: "Async",
    difficulty: "Advanced",
    description: "Threading, multiprocessing, and asyncio patterns.",
    tutorials: [
      {
        title: "Async I/O & Thread Pool Execution",
        why: "Asyncio handles thousands of concurrent I/O operations in a single thread. ThreadPoolExecutor handles CPU-bound work. Knowing when to use each eliminates bottlenecks in real applications.",
        code: `import asyncio
import aiohttp
from concurrent.futures import ThreadPoolExecutor
import time

# Async HTTP requests - handle thousands concurrently
async def fetch_url(session, url):
    async with session.get(url) as resp:
        return await resp.text()

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

# Thread pool for CPU-bound blocking I/O
def process_file(filepath):
    import hashlib
    with open(filepath, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

def hash_files_parallel(filepaths, max_workers=4):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(process_file, filepaths))
    return results

# Async producer-consumer with queues
async def producer_consumer():
    queue = asyncio.Queue()

    async def producer():
        for i in range(10):
            await queue.put(f"item_{i}")
        await queue.put(None)

    async def consumer(name):
        while True:
            item = await queue.get()
            if item is None:
                break
            print(f"{name} processed {item}")
            await asyncio.sleep(0.1)

    await asyncio.gather(producer(), consumer("W1"), consumer("W2"))

asyncio.run(producer_consumer())`
      },
      {
        title: "Multiprocessing & Shared State",
        why: "Python's GIL limits threading for CPU work. Multiprocessing bypasses it by running code in separate processes. Locks and shared memory enable safe coordination between processes.",
        code: `import multiprocessing
from multiprocessing import Process, Queue, Lock, Value
import os

def worker(task_queue, result_queue, counter, lock):
    while True:
        try:
            num = task_queue.get_nowait()
        except Exception:
            break
        result = num ** 2
        with lock:
            counter.value += 1
        result_queue.put((num, result, os.getpid()))

def process_chunk(numbers):
    task_q = Queue()
    result_q = Queue()
    counter = Value("i", 0)
    lock = Lock()

    for n in numbers:
        task_q.put(n)

    workers = [
        Process(target=worker, args=(task_q, result_q, counter, lock))
        for _ in range(4)
    ]

    for w in workers:
        w.start()
    for w in workers:
        w.join()

    results = []
    while not result_q.empty():
        results.append(result_q.get())
    return results, counter.value

if __name__ == "__main__":
    numbers = list(range(1, 21))
    chunk_size = len(numbers) // 4
    chunks = [numbers[i:i+chunk_size] for i in range(0, len(numbers), chunk_size)]

    with multiprocessing.Pool(4) as pool:
        chunk_results = pool.map(process_chunk, chunks)

    all_results = []
    total = 0
    for results, count in chunk_results:
        all_results.extend(results)
        total += count

    all_results.sort()
    print(f"Processed {total} items across processes")
    print(f"Sample: {all_results[:5]}")`
      }
    ]
  },
  {
    id: "python-network-prog",
    name: "Python Network Prog.",
    icon: "\u{1F310}",
    category: "Network",
    difficulty: "Intermediate",
    description: "Sockets, HTTP clients, and protocol implementation.",
    tutorials: [
      {
        title: "TCP Socket Server & HTTP Client",
        why: "Understanding sockets is fundamental to networking. Python's socket and httpx libraries let you build custom servers, connect to APIs, and implement protocols.",
        code: `import socket
import threading
import http.client
import json

# TCP echo server
def handle_client(conn, addr):
    print(f"Connected: {addr}")
    with conn:
        while True:
            data = conn.recv(1024)
            if not data:
                break
            message = data.decode("utf-8")
            conn.sendall(f"Echo: {message}".encode())
            print(f"[{addr}] {message}")

def start_server(host="127.0.0.1", port=8888):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((host, port))
        s.listen(5)
        print(f"Server listening on {host}:{port}")
        while True:
            conn, addr = s.accept()
            thread = threading.Thread(target=handle_client, args=(conn, addr))
            thread.daemon = True
            thread.start()

# HTTP client
def api_request(host, path, method="GET", body=None):
    conn = http.client.HTTPSConnection(host)
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    body_str = json.dumps(body) if body else None
    conn.request(method, path, body=body_str, headers=headers)
    response = conn.getresponse()
    data = response.read().decode()
    conn.close()
    return {"status": response.status, "data": json.loads(data)}

# Client connection
def tcp_client():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect(("127.0.0.1", 8888))
        s.sendall(b"Hello Server")
        response = s.recv(1024)
        print(f"Server says: {response.decode()}")`
      }
    ]
  },
  {
    id: "rxpy",
    name: "RxPY",
    icon: "\u{1F501}",
    category: "Async",
    difficulty: "Advanced",
    description: "Reactive programming with observables and operators.",
    tutorials: [
      {
        title: "Observable Streams & Operators",
        why: "Reactive programming treats data as streams you can compose, transform, and combine. RxPY's operators chain together complex async logic that would be tangled callback spaghetti.",
        code: `import rx
from rx import operators as ops
from rx.subject import Subject

# Create observable from data
source = rx.of(1, 2, 3, 4, 5)

# Chain operators
result = source.pipe(
    ops.map(lambda x: x * 2),
    ops.filter(lambda x: x > 4),
    ops.scan(lambda acc, val: acc + val, 0),
)

result.subscribe(
    on_next=lambda v: print(f"Value: {v}"),
    on_completed=lambda: print("Done"),
)

# Subject - both observable and observer
events = Subject()

events.pipe(
    ops.filter(lambda e: e["type"] == "click"),
    ops.map(lambda e: e["x"]),
    ops.window_with_time(2),
    ops.flat_map(lambda window: window.pipe(ops.to_list())),
).subscribe(lambda positions: print(f"Clicks in window: {positions}"))

events.on_next({"type": "click", "x": 100})
events.on_next({"type": "hover", "x": 200})
events.on_next({"type": "click", "x": 150})

# Merge multiple streams
mouse_moves = Subject()
scroll_events = Subject()

merged = rx.merge(
    mouse_moves.pipe(ops.map(lambda e: f"move: {e}")),
    scroll_events.pipe(ops.map(lambda e: f"scroll: {e}")),
)
merged.subscribe(print)`
      }
    ]
  },
  {
    id: "python-blockchain",
    name: "Python Blockchain",
    icon: "\u26D3\uFE0F",
    category: "Specialty",
    difficulty: "Advanced",
    description: "Hash chains, proof-of-work, and distributed ledgers.",
    tutorials: [
      {
        title: "Building a Blockchain from Scratch",
        why: "Understanding blockchain internals demystifies crypto technology. Building one teaches hash chaining, proof-of-work consensus, and Merkle trees that make distributed trust possible.",
        code: `import hashlib
import json
import time

class Block:
    def __init__(self, index, transactions, previous_hash, nonce=0):
        self.index = index
        self.timestamp = time.time()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.compute_hash()

    def compute_hash(self):
        block_data = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
        }, sort_keys=True)
        return hashlib.sha256(block_data.encode()).hexdigest()

class Blockchain:
    def __init__(self, difficulty=4):
        self.difficulty = difficulty
        self.chain = [self.create_genesis_block()]
        self.pending = []

    def create_genesis_block(self):
        return Block(0, [], "0" * 64)

    def add_transaction(self, sender, recipient, amount):
        self.pending.append({"from": sender, "to": recipient, "amount": amount})

    def mine_block(self):
        if not self.pending:
            return None

        block = Block(
            index=len(self.chain),
            transactions=self.pending,
            previous_hash=self.chain[-1].hash,
        )

        target = "0" * self.difficulty
        while not block.hash.startswith(target):
            block.nonce += 1
            block.hash = block.compute_hash()

        self.chain.append(block)
        self.pending = []
        return block

    def is_valid(self):
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            if curr.hash != curr.compute_hash():
                return False
            if curr.previous_hash != prev.hash:
                return False
        return True

bc = Blockchain(difficulty=3)
bc.add_transaction("Alice", "Bob", 10)
bc.add_transaction("Bob", "Carol", 5)
block = bc.mine_block()
print(f"Block {block.index}: {block.hash[:16]}... ({block.nonce} iterations)")
print(f"Chain valid: {bc.is_valid()}")`
      }
    ]
  },
  {
    id: "python-text-processing",
    name: "Python Text Processing",
    icon: "\u{1F4DD}",
    category: "Specialty",
    difficulty: "Intermediate",
    description: "NLP, regex patterns, and text normalization.",
    tutorials: [
      {
        title: "Regular Expressions & Text Cleaning",
        why: "Regex is the universal text processing tool from email validation to log parsing to data extraction. Combined with normalization, it transforms messy text into analysis-ready data.",
        code: `import re
from collections import Counter

# Regex patterns for common tasks
patterns = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    "phone": r"\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}",
    "url": r"https?://[^\\s]+",
    "ip": r"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b",
}

text = """
Contact us at support@example.com or call +65-9123-4567.
Visit https://example.com/docs from 192.168.1.1.
Send email to admin@test.org for help.
"""

for name, pattern in patterns.items():
    matches = re.findall(pattern, text)
    print(f"{name}: {matches}")

# Text cleaning pipeline
def clean_text(text):
    text = text.lower()
    text = re.sub(r"<[^>]+>", "", text)          # remove HTML
    text = re.sub(r"http\\S+", "", text)          # remove URLs
    text = re.sub(r"[^a-z0-9\\s]", " ", text)    # keep alphanumeric
    text = re.sub(r"\\s+", " ", text).strip()     # normalize whitespace
    return text

# Word frequency analysis
def word_frequency(text, top_n=10):
    words = clean_text(text).split()
    stop_words = {"the", "a", "an", "is", "are", "in", "to", "of", "and"}
    filtered = [w for w in words if w not in stop_words and len(w) > 2]
    return Counter(filtered).most_common(top_n)

sample = "The quick brown fox jumps over the lazy dog. The dog was not amused."
print(f"Word freq: {word_frequency(sample, 5)}")`
      }
    ]
  },
  {
    id: "python-webscraping",
    name: "Python Web Scraping",
    icon: "\u{1F578}\uFE0F",
    category: "Specialty",
    difficulty: "Intermediate",
    description: "Combined scraping techniques and anti-detection strategies.",
    tutorials: [
      {
        title: "Production Scraping with Anti-Detection",
        why: "Websites actively block scrapers with rate limiting, CAPTCHAs, and fingerprinting. Production scrapers need rotating proxies, session management, and respectful crawling.",
        code: `import requests
from bs4 import BeautifulSoup
import time
import random
import hashlib
from urllib.parse import urljoin

class ProductionScraper:
    def __init__(self):
        self.session = requests.Session()
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
        ]
        self.delay_range = (1, 3)

    def get_page(self, url, retries=3):
        for attempt in range(retries):
            try:
                self.session.headers["User-Agent"] = random.choice(self.user_agents)
                time.sleep(random.uniform(*self.delay_range))

                resp = self.session.get(url, timeout=10)
                if resp.status_code == 429:
                    wait = int(resp.headers.get("Retry-After", 60))
                    print(f"Rate limited, waiting {wait}s")
                    time.sleep(wait)
                    continue

                resp.raise_for_status()
                return BeautifulSoup(resp.text, "html.parser")
            except requests.RequestException as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                time.sleep(2 ** attempt)
        return None

    def extract_links(self, soup, base_url):
        links = set()
        for a in soup.find_all("a", href=True):
            links.add(urljoin(base_url, a["href"]))
        return links

    def extract_table(self, soup, table_selector="table"):
        results = []
        for table in soup.select(table_selector):
            headers = [th.text.strip() for th in table.find_all("th")]
            for row in table.find_all("tr")[1:]:
                cols = [td.text.strip() for td in row.find_all("td")]
                if cols:
                    results.append(dict(zip(headers, cols)) if headers else cols)
        return results

    def detect_content_hash(self, soup):
        text = soup.get_text(strip=True)
        return hashlib.md5(text.encode()).hexdigest()

scraper = ProductionScraper()
soup = scraper.get_page("https://example.com")
if soup:
    links = scraper.extract_links(soup, "https://example.com")
    print(f"Found {len(links)} links")`
      }
    ]
  },
  {
    id: "python-pillow",
    name: "Python Pillow",
    icon: "\u{1F5BC}\uFE0F",
    category: "Image",
    difficulty: "Beginner",
    description: "Image processing: resize, filter, format conversion.",
    tutorials: [
      {
        title: "Image Manipulation & Batch Processing",
        why: "Pillow handles everyday image tasks: resizing for thumbnails, converting formats, applying filters, and adding text overlays. Batch processing pipelines handle thousands of images automatically.",
        code: `from PIL import Image, ImageFilter, ImageDraw, ImageFont
from pathlib import Path

# Open and basic operations
img = Image.open("photo.jpg")
print(f"Size: {img.size}, Mode: {img.mode}")

# Resize maintaining aspect ratio
def resize_fit(image, max_size=800):
    image.thumbnail((max_size, max_size), Image.LANCZOS)
    return image

thumb = resize_fit(img.copy(), 200)
thumb.save("thumbnail.jpg", quality=85)

# Apply filters
blurred = img.filter(ImageFilter.GaussianBlur(radius=3))
sharpened = img.filter(ImageFilter.SHARPEN)
edge_detected = img.filter(ImageFilter.FIND_EDGES)

# Add text watermark
def add_watermark(image, text):
    watermarked = image.copy().convert("RGBA")
    overlay = Image.new("RGBA", watermarked.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font = ImageFont.truetype("arial.ttf", 24)

    bbox = draw.textbbox((0, 0), text, font=font)
    text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pos = (watermarked.width - text_w - 10, watermarked.height - text_h - 10)

    draw.rectangle([pos[0]-5, pos[1]-5, pos[0]+text_w+5, pos[1]+text_h+5],
                   fill=(0, 0, 0, 128))
    draw.text(pos, text, fill=(255, 255, 255, 200), font=font)
    return Image.alpha_composite(watermarked, overlay).convert("RGB")

result = add_watermark(img, "My Photo")
result.save("watermarked.jpg")

# Batch conversion
def batch_resize(input_dir, output_dir, size=600):
    Path(output_dir).mkdir(exist_ok=True)
    for path in Path(input_dir).glob("*.[jJ][pP]*[gG]"):
        img = Image.open(path)
        img.thumbnail((size, size), Image.LANCZOS)
        img.save(Path(output_dir) / path.name, quality=85)
        print(f"Resized: {path.name}")`
      }
    ]
  },
  {
    id: "python-xlsxwriter",
    name: "Python XLSX Writer",
    icon: "\u{1F4CA}",
    category: "Files",
    difficulty: "Beginner",
    description: "Excel file generation with formatting and charts.",
    tutorials: [
      {
        title: "Creating Formatted Excel Reports",
        why: "XLSXWriter generates professional Excel files with charts, conditional formatting, and formulas. Essential for business reporting where stakeholders expect formatted spreadsheets.",
        code: `import xlsxwriter
from datetime import datetime

workbook = xlsxwriter.Workbook("report.xlsx")

# Define formats
title_fmt = workbook.add_format({
    "bold": True, "font_size": 16, "font_color": "#1a1a2e",
    "bottom": 2, "bottom_color": "#e94560",
})
header_fmt = workbook.add_format({
    "bold": True, "bg_color": "#0f3460", "font_color": "white",
    "border": 1, "text_wrap": True, "align": "center",
})
money_fmt = workbook.add_format({"num_format": "$#,##0.00", "border": 1})
total_fmt = workbook.add_format({
    "bold": True, "border": 1, "bg_color": "#e8e8e8",
    "num_format": "$#,##0.00",
})

ws = workbook.add_worksheet("Sales Report")
ws.set_column("A:A", 15)
ws.set_column("B:B", 30)
ws.set_column("C:E", 12)

ws.merge_range("A1:E1", "Q4 2024 Sales Report", title_fmt)
ws.write_row("A3", ["Date", "Product", "Revenue", "Cost", "Margin"], header_fmt)

data = [
    (datetime(2024, 10, 15), "Widget A", 12500, 8000),
    (datetime(2024, 11, 20), "Widget B", 18200, 11000),
    (datetime(2024, 12, 1), "Widget C", 9800, 6500),
    (datetime(2024, 12, 15), "Widget A", 15000, 9200),
]

date_fmt = workbook.add_format({"num_format": "yyyy-mm-dd", "border": 1})
for i, (date, product, revenue, cost) in enumerate(data, start=3):
    ws.write_datetime(i, 0, date, date_fmt)
    ws.write(i, 1, product)
    ws.write(i, 2, revenue, money_fmt)
    ws.write(i, 3, cost, money_fmt)
    ws.write_formula(i, 4, f"=C{i+1}-D{i+1}", money_fmt, (revenue - cost))

row = len(data) + 3
ws.write(row, 1, "TOTAL", header_fmt)
ws.write_formula(row, 2, f"=SUM(C4:C{row})", total_fmt)
ws.write_formula(row, 3, f"=SUM(D4:D{row})", total_fmt)
ws.write_formula(row, 4, f"=SUM(E4:E{row})", total_fmt)

chart = workbook.add_chart({"type": "column"})
chart.add_series({"name": "Revenue", "values": f"=Sales Report!$C$4:$C\${row}"})
chart.add_series({"name": "Cost", "values": f"=Sales Report!$D$4:$D\${row}"})
chart.set_title({"name": "Revenue vs Cost"})
chart.set_size({"width": 600, "height": 400})
ws.insert_chart(f"A{row + 3}", chart)

workbook.close()
print("Report generated: report.xlsx")`
      }
    ]
  },
  {
    id: "opencv-python",
    name: "OpenCV Python",
    icon: "\u{1F441}\uFE0F",
    category: "Vision",
    difficulty: "Advanced",
    description: "Computer vision: detection, tracking, and image analysis.",
    tutorials: [
      {
        title: "Image Processing & Object Detection",
        why: "OpenCV is the industry standard for computer vision. From face detection to edge detection to object tracking, it provides optimized C++ implementations wrapped in a Python API.",
        code: `import cv2
import numpy as np

# Read and preprocess image
img = cv2.imread("photo.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Edge detection
edges = cv2.Canny(blurred, 50, 150)

# Face detection with Haar cascades
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.putText(img, "Face", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

# Color detection in HSV space
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
lower_blue = np.array([100, 50, 50])
upper_blue = np.array([130, 255, 255])
mask = cv2.inRange(hsv, lower_blue, upper_blue)
blue_pixels = cv2.countNonZero(mask)
print(f"Blue pixels: {blue_pixels}")

# Contour detection
contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
for cnt in sorted(contours, key=cv2.contourArea, reverse=True)[:5]:
    area = cv2.contourArea(cnt)
    x, y, w, h = cv2.boundingRect(cnt)
    print(f"Contour: area={area:.0f}, bbox=({x},{y},{w},{h})")

cv2.imwrite("faces_detected.jpg", img)
cv2.imwrite("edges.jpg", edges)
print(f"Detected {len(faces)} faces, {len(contours)} contours")`
      }
    ]
  },
  {
    id: "biopython",
    name: "BioPython",
    icon: "\u{1F9EC}",
    category: "Science",
    difficulty: "Intermediate",
    description: "Bioinformatics: sequence analysis, parsing, and tools.",
    tutorials: [
      {
        title: "Sequence Analysis & FASTA Parsing",
        why: "BioPython provides tools for parsing biological data formats, sequence alignment, and accessing NCBI databases. Essential for bioinformatics pipelines analyzing DNA, RNA, and proteins.",
        code: `from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqUtils import gc_fraction, molecular_weight
from Bio.Align import PairwiseAligner

# Create and analyze sequences
dna = Seq("ATGCGATCGATCGATCGAATTTAAACCCGGG")
print(f"Sequence: {dna}")
print(f"Length: {len(dna)} bp")
print(f"GC content: {gc_fraction(dna):.2%}")
print(f"Molecular weight: {molecular_weight(dna):.1f} Da")

# Transcription and translation
rna = dna.transcribe()
protein = dna.translate(to_stop=True)
print(f"RNA: {rna}")
print(f"Protein: {protein}")

# Pairwise alignment
aligner = PairwiseAligner()
aligner.mode = "local"
seq1 = Seq("ACGTACGTACGT")
seq2 = Seq("ACGACGTACGT")
alignments = aligner.align(seq1, seq2)
print(f"Best alignment score: {alignments[0].score}")

# Parse FASTA files
records = list(SeqIO.parse("sequences.fasta", "fasta"))
for record in records[:3]:
    print(f">{record.id}: {len(record.seq)} bp, GC={gc_fraction(record.seq):.2%}")

SeqIO.write(records[:5], "output.fasta", "fasta")
print(f"Wrote {len(records[:5])} sequences")`
      }
    ]
  },
  {
    id: "cryptography",
    name: "Cryptography with Python",
    icon: "\u{1F510}",
    category: "Security",
    difficulty: "Advanced",
    description: "Encryption, hashing, TLS, and key management.",
    tutorials: [
      {
        title: "Symmetric & Asymmetric Encryption",
        why: "Modern cryptography protects data at rest and in transit. Understanding symmetric vs asymmetric encryption is fundamental to secure system design.",
        code: `from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64, os

# Symmetric encryption with Fernet (AES-128-CBC)
key = Fernet.generate_key()
cipher = Fernet(key)
plaintext = b"Sensitive data: Confidential info"
encrypted = cipher.encrypt(plaintext)
decrypted = cipher.decrypt(encrypted)
print(f"Decrypted: {decrypted.decode()}")

# Password-based key derivation
password = b"my-secure-password"
salt = os.urandom(16)
kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=480000)
derived_key = base64.urlsafe_b64encode(kdf.derive(password))
print(f"Derived key: {derived_key[:20]}...")

# RSA asymmetric encryption
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()
message = b"Top secret message"
encrypted_rsa = public_key.encrypt(message, padding.OAEP(
    mgf=padding.MGF1(algorithm=hashes.SHA256()),
    algorithm=hashes.SHA256(), label=None))
decrypted_rsa = private_key.decrypt(encrypted_rsa, padding.OAEP(
    mgf=padding.MGF1(algorithm=hashes.SHA256()),
    algorithm=hashes.SHA256(), label=None))
print(f"RSA decrypted: {decrypted_rsa.decode()}")

# Digital signature
signature = private_key.sign(message, padding.PSS(
    mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH), hashes.SHA256())
public_key.verify(signature, message, padding.PSS(
    mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH), hashes.SHA256())
print("Signature verified successfully")`
      }
    ]
  },
  {
    id: "falcon",
    name: "Python Falcon",
    icon: "\u{1F985}",
    category: "Web",
    difficulty: "Intermediate",
    description: "High-performance REST API microframework.",
    tutorials: [
      {
        title: "Building High-Performance APIs",
        why: "Falcon is optimized for speed with no request body parsing overhead unless needed. Ideal for microservices where every millisecond of latency matters at scale.",
        code: `import falcon
import json
import time

class RateLimitMiddleware:
    def __init__(self, limit=100, window=60):
        self.limit = limit
        self.window = window
        self.hits = {}

    def process_request(self, req, resp):
        client_ip = req.remote_addr
        now = time.time()
        self.hits = {k: [t for t in v if t > now - self.window]
                     for k, v in self.hits.items()}
        hits = self.hits.get(client_ip, [])
        if len(hits) >= self.limit:
            raise falcon.HTTPTooManyRequests(description="Rate limit exceeded")
        self.hits[client_ip] = hits + [now]

class ItemResource:
    def __init__(self):
        self.items = {}
        self.counter = 0

    def on_get(self, req, resp):
        item_id = req.get_param("id")
        if item_id:
            item = self.items.get(int(item_id))
            if item:
                resp.media = item
            else:
                raise falcon.HTTPNotFound(description="Item not found")
        else:
            resp.media = list(self.items.values())

    def on_post(self, req, resp):
        body = json.loads(req.bounded_stream.read())
        self.counter += 1
        item = {"id": self.counter, **body}
        self.items[self.counter] = item
        resp.status = falcon.HTTP_201
        resp.media = item

    def on_delete(self, req, resp):
        item_id = req.get_param_as_int("id")
        if item_id in self.items:
            del self.items[item_id]
            resp.status = falcon.HTTP_204
        else:
            raise falcon.HTTPNotFound()

app = falcon.App(middleware=[RateLimitMiddleware()])
app.add_route("/items", ItemResource())

def handle_error(req, resp, exc):
    resp.media = {"error": str(exc.description)}
    resp.status = exc.status

app.add_error_handler(falcon.HTTPError, handle_error)
# Run: gunicorn app:app --workers 4`
      }
    ]
  },
  {
    id: "pyspark",
    name: "PySpark",
    icon: "\u26A1",
    category: "Big Data",
    difficulty: "Advanced",
    description: "Distributed computing with Apache Spark in Python.",
    tutorials: [
      {
        title: "DataFrame API & Distributed Processing",
        why: "PySpark distributes data processing across clusters, handling datasets too large for a single machine. Its DataFrame API mirrors pandas but executes on Spark's optimizer.",
        code: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum, avg, when, lit
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# Initialize Spark session
spark = SparkSession.builder \\
    .appName("DataPipeline") \\
    .config("spark.sql.shuffle.partitions", "200") \\
    .getOrCreate()

# Create DataFrame from structured data
schema = StructType([
    StructField("name", StringType(), True),
    StructField("dept", StringType(), True),
    StructField("salary", IntegerType(), True),
])

data = [("Alice", "Engineering", 120000),
        ("Bob", "Marketing", 85000),
        ("Carol", "Engineering", 135000),
        ("Dave", "Marketing", 90000),
        ("Eve", "Engineering", 115000)]

df = spark.createDataFrame(data, schema)
df.show()

# Aggregations and transformations
dept_stats = df.groupBy("dept").agg(
    avg("salary").alias("avg_salary"),
    sum("salary").alias("total_salary"),
    col("name").alias("head_count").count().alias("count"),
)

# Add computed columns
df_with_band = df.withColumn(
    "salary_band",
    when(col("salary") > 120000, "Senior")
    .when(col("salary") > 90000, "Mid")
    .otherwise("Junior")
)

# SQL queries on DataFrames
df.createOrReplaceTempView("employees")
result = spark.sql("""
    SELECT dept, COUNT(*) as count, AVG(salary) as avg_sal
    FROM employees
    GROUP BY dept
    ORDER BY avg_sal DESC
""")
result.show()

# Write to parquet (columnar format for analytics)
df_with_band.write.mode("overwrite").parquet("output/employees")
print("Data written to parquet format")`
      }
    ]
  },
  {
    id: "jython",
    name: "Jython",
    icon: "\u2615",
    category: "JVM",
    difficulty: "Intermediate",
    description: "Python on the JVM with Java library access.",
    tutorials: [
      {
        title: "Python Scripting on the Java Platform",
        why: "Jython lets you run Python code on the JVM, accessing Java libraries directly. Perfect for extending Java applications with Python scripting or using Java's rich ecosystem from Python.",
        code: `# Jython runs on JVM - import Java classes directly
from java.util import ArrayList, HashMap
from java.io import File, FileWriter
import javax.swing as swing
import java.awt as awt

# Use Java collections natively
array_list = ArrayList()
array_list.add("Hello")
array_list.add("World")
print(f"Java ArrayList: {array_list}")
print(f"Contains 'Hello': {array_list.contains('Hello')}")

# Java HashMap as Python dict-like
hash_map = HashMap()
hash_map.put("key1", "value1")
hash_map.put("key2", "value2")
for key in hash_map.keySet():
    print(f"{key} = {hash_map.get(key)}")

# File I/O using Java classes
file = File("test.txt")
writer = FileWriter(file)
writer.write("Written from Jython using Java FileWriter")
writer.close()

# Simple Swing GUI
frame = swing.JFrame("Jython GUI")
label = swing.JLabel("Hello from Jython on JVM!")
frame.add(label)
frame.setSize(300, 200)
frame.setDefaultCloseOperation(swing.JFrame.EXIT_ON_CLOSE)
# frame.setVisible(True)  # uncomment to show

# Python threading with Java
import threading

def java_thread_example():
    for i in range(5):
        print(f"Thread {threading.current_thread().name}: {i}")

t = threading.Thread(target=java_thread_example, name="JythonWorker")
t.start()
t.join()
print("Jython combines Python ease with Java power")`
      }
    ]
  },
  {
    id: "python-design-patterns",
    name: "Python Design Patterns",
    icon: "\u{1F3D7}\uFE0F",
    category: "Architecture",
    difficulty: "Intermediate",
    description: "GoF patterns adapted for Pythonic code.",
    tutorials: [
      {
        title: "Singleton, Observer & Strategy Patterns",
        why: "Design patterns are proven solutions to recurring problems. Python's dynamic nature simplifies many patterns - singletons become decorators, observers use callables, and strategies are just functions.",
        code: `from functools import wraps
from typing import Callable

# Singleton via decorator
def singleton(cls):
    instances = {}
    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    def __init__(self):
        self.connection = "active"
        self.queries = []

    def query(self, sql):
        self.queries.append(sql)
        return f"Result of: {sql}"

db1 = Database()
db2 = Database()
print(f"Same instance: {db1 is db2}")

# Observer pattern
class EventEmitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args, **kwargs):
        for callback in self._listeners.get(event, []):
            callback(*args, **kwargs)

emitter = EventEmitter()
emitter.on("user_created", lambda user: print(f"Welcome email sent to {user}"))
emitter.on("user_created", lambda user: print(f"Audit log: {user} registered"))
emitter.emit("user_created", "Alice")

# Strategy pattern
class Sorter:
    def __init__(self, strategy: Callable = None):
        self._strategy = strategy or sorted

    def sort(self, data):
        return self._strategy(data)

by_length = Sorter(strategy=lambda d: sorted(d, key=len))
by_value = Sorter(strategy=lambda d: sorted(d))
print(f"By length: {by_length.sort(['banana', 'apple', 'cherry'])}")
print(f"By value: {by_value.sort(['banana', 'apple', 'cherry'])}")`
      },
      {
        title: "Factory, Decorator & Chain of Responsibility",
        why: "Factory pattern centralizes object creation, Decorators add behavior dynamically, and Chain of Responsibility passes requests along a pipeline. Python makes all three concise and readable.",
        code: `from abc import ABC, abstractmethod
from typing import Any

# Factory pattern
class Serializer(ABC):
    @abstractmethod
    def serialize(self, data: dict) -> str: ...

class JSONSerializer(Serializer):
    def serialize(self, data):
        import json
        return json.dumps(data, indent=2)

class CSVSerializer(Serializer):
    def serialize(self, data):
        if isinstance(data, list) and data:
            headers = data[0].keys()
            lines = [",".join(headers)]
            for row in data:
                lines.append(",".join(str(row[h]) for h in headers))
            return "\\n".join(lines)
        return ""

def get_serializer(fmt: str) -> Serializer:
    factories = {"json": JSONSerializer, "csv": CSVSerializer}
    return factories[fmt]()

data = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
print(get_serializer("json").serialize(data))

# Chain of Responsibility
class Handler:
    def __init__(self):
        self._next = None

    def set_next(self, handler):
        self._next = handler
        return handler

    def handle(self, request):
        if self._next:
            return self._next.handle(request)
        return None

class AuthHandler(Handler):
    def handle(self, request):
        if not request.get("token"):
            return "Auth failed: no token"
        print("Auth passed")
        return super().handle(request)

class RateLimitHandler(Handler):
    def handle(self, request):
        if request.get("count", 0) > 100:
            return "Rate limit exceeded"
        print("Rate limit passed")
        return super().handle(request)

class FinalHandler(Handler):
    def handle(self, request):
        return "Request processed successfully"

chain = AuthHandler()
chain.set_next(RateLimitHandler()).set_next(FinalHandler())
print(chain.handle({"token": "abc", "count": 50}))`
      }
    ]
  },
  {
    id: "python-web-dev-libs",
    name: "Python Web Dev Libs",
    icon: "\u{1F310}",
    category: "Web",
    difficulty: "Intermediate",
    description: "WSGI/ASGI frameworks, middleware, and deployment.",
    tutorials: [
      {
        title: "WSGI vs ASGI and Deployment Patterns",
        why: "Understanding the difference between WSGI (synchronous) and ASGI (async) is crucial for choosing the right deployment strategy. Gunicorn handles WSGI, Uvicorn handles ASGI, and reverse proxies balance traffic.",
        code: `# WSGI application (synchronous)
class WSGIApp:
    def __init__(self):
        self.routes = {}

    def route(self, path):
        def decorator(func):
            self.routes[path] = func
            return func
        return decorator

    def __call__(self, environ, start_response):
        path = environ.get("PATH_INFO", "/")
        method = environ.get("REQUEST_METHOD", "GET")

        handler = self.routes.get(path)
        if handler:
            status = "200 OK"
            body = handler(environ).encode()
        else:
            status = "404 Not Found"
            body = b"Not Found"

        headers = [("Content-Type", "text/plain"), ("Content-Length", str(len(body)))]
        start_response(status, headers)
        return [body]

wsgi_app = WSGIApp()

@wsgi_app.route("/")
def index(environ):
    return "Hello from WSGI"

# ASGI application (asynchronous)
async def asgi_app(scope, receive, send):
    if scope["type"] == "http":
        path = scope["path"]
        await send({
            "type": "http.response.start",
            "status": 200,
            "headers": [[b"content-type", b"text/plain"]],
        })
        body = f"Hello from ASGI at {path}".encode()
        await send({"type": "http.response.body", "body": body})

# Deployment commands:
# Gunicorn (WSGI): gunicorn app:wsgi_app -w 4 -b 0.0.0.0:8000
# Uvicorn (ASGI): uvicorn app:asgi_app --workers 4 --host 0.0.0.0
# With nginx reverse proxy:
# upstream backend { server 127.0.0.1:8000; }
# server { location / { proxy_pass http://backend; } }`
      }
    ]
  },
  {
    id: "python-pyramid",
    name: "Python Pyramid",
    icon: "\u{1F3D7}\uFE0F",
    category: "Web",
    difficulty: "Intermediate",
    description: "Pylons successor with URL dispatch and views.",
    tutorials: [
      {
        title: "Views, Routes & Templating with Pyramid",
        why: "Pyramid scales from single-file apps to large projects. Its traversal and URL dispatch systems, combined with view configuration, make routing flexible without being magical.",
        code: `from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound
from wsgiref.simple_server import make_server
import json

# Simple Pyramid app
def home_view(request):
    return Response("<h1>Welcome to Pyramid</h1>", content_type="text/html")

@view_config(route_name="api_items", renderer="json")
def list_items(request):
    return {"items": [
        {"id": 1, "name": "Widget", "price": 9.99},
        {"id": 2, "name": "Gadget", "price": 19.99},
    ]}

@view_config(route_name="api_item", renderer="json")
def get_item(request):
    item_id = int(request.matchdict["id"])
    items = {1: {"id": 1, "name": "Widget"}, 2: {"id": 2, "name": "Gadget"}}
    if item_id not in items:
        raise HTTPNotFound()
    return items[item_id]

# Authentication policy
def add_routes(config):
    config.add_route("home", "/")
    config.add_route("api_items", "/api/items")
    config.add_route("api_item", "/api/items/{id}")

with Configurator() as config:
    config.add_routes = add_routes
    config.add_directive("add_routes", add_routes)
    config.scan()
    config.add_route("home", "/")
    config.add_view(home_view, route_name="home")
    app = config.make_wsgi_app()

# Run with: gunicorn app:app -b 0.0.0.0:6543
# Or:  waitress-serve --port=6543 app:app
# Pyramid supports: traversal, URL dispatch, JSON, XML, templates`
      }
    ]
  }
];
