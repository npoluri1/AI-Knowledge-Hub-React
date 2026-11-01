const fs = require('fs');
let content = fs.readFileSync('src/data/pythonTutorialsData.js', 'utf8');

// Remove the trailing ] and ; to append more
content = content.trimEnd();
if (content.endsWith('];')) content = content.slice(0, -2);
if (content.endsWith(']')) content = content.slice(0, -1);

const more = [
{
  id:'numpy', name:'NumPy', icon:'??', category:'data', difficulty:'beginner',
  description:'Fundamental package for scientific computing with n-dimensional arrays',
  tags:['NumPy','Arrays','Scientific Computing','Linear Algebra'], prerequisites:['Python basics'],
  theory:[
    {type:'heading',text:'What is NumPy?'},
    {type:'paragraph',text:'NumPy (Numerical Python) is the foundational library for scientific computing. Its core object is the ndarray: a homogeneous n-dimensional array enabling fast vectorized operations. NumPy arrays store data in contiguous memory, making operations 10-100x faster than Python lists because they run in optimized C loops.'},
    {type:'heading',text:'Vectorization & Broadcasting'},
    {type:'paragraph',text:'Vectorization removes explicit loops — apply a function to an entire array at once. Broadcasting allows operating on arrays of different shapes by aligning and repeating dimensions. NumPy also provides linear algebra (np.linalg), random number generation (np.random), Fourier transforms (np.fft), and statistics.'}
  ],
  concepts:[
    {name:'ndarray',description:'Fast homogeneous n-dimensional array — the core data structure.'},
    {name:'dtype',description:'Element type (int64, float32, bool) fixing memory footprint.'},
    {name:'Broadcasting',description:'Operating on arrays of different shapes.'},
    {name:'Vectorization',description:'Array operations in C loops instead of Python loops.'},
    {name:'Views vs Copies',description:'Slicing returns views; .copy() creates independent copies.'},
    {name:'Random Module',description:'np.random for distributions and shuffling.'}
  ],
  codeExamples:[
    {title:'Creating Arrays',description:'Ways to build ndarrays',language:'python',code:`import numpy as np\n\na = np.array([1, 2, 3, 4])\nprint(a, a.shape, a.dtype)\n\nz = np.zeros((2, 3))\nr = np.arange(0, 10, 2)\nl = np.linspace(0, 1, 5)\nrnd = np.random.rand(3, 3)\nprint(z, r, l, sep="\\n")`},
    {title:'Vectorized Operations',description:'Fast element-wise math',language:'python',code:`x = np.array([1, 2, 3])\ny = np.array([4, 5, 6])\nprint(x + y)     # [5 7 9]\nprint(x * 2)     # [2 4 6]\nprint(np.sqrt(x))\nprint(x.dot(y))  # 32\nprint(np.mean(x), np.std(x))`},
    {title:'Reshaping & Broadcasting',description:'Shape manipulation',language:'python',code:`a = np.arange(12)\nm = a.reshape(3, 4)\nprint(m)\nprint(m.T.shape)  # (4, 3)\n\ncol = np.array([1,2,3]).reshape(3,1)\nrow = np.array([10,20,30,40])\nresult = col + row  # broadcasting (3,4)\nprint(result)`},
    {title:'Linear Algebra',description:'Matrix operations',language:'python',code:`A = np.array([[2,1],[1,3]])\nb = np.array([1,2])\n\nx = np.linalg.solve(A, b)\nprint(x)           # [-0.2  1.4]\n\nvals, vecs = np.linalg.eig(A)\nprint(vals)\nprint(A @ np.linalg.inv(A))  # identity`}
  ],
  useCases:[
    {title:'Data Preprocessing',description:'Every pandas DataFrame stores NumPy arrays underneath.'},
    {title:'Image Processing',description:'Images are 3D arrays; NumPy does crops, flips, filtering.'},
    {title:'Signal Processing',description:'np.fft performs Fourier transforms for audio analysis.'},
    {title:'Simulation',description:'np.random generates millions of samples for Monte Carlo.'}
  ],
  bestPractices:['Always vectorize over Python loops','Understand views vs copies for memory safety','Set random seeds for reproducibility','Use appropriate dtypes for memory control'],
  commonErrors:[
    {error:'ValueError: operands could not broadcast',fix:'Check shapes with .shape and reshape before combining.'},
    {error:'MemoryError with huge arrays',fix:'Use float32 or int32 instead of 64-bit defaults.'},
    {error:'Setting array element with sequence',fix:'Ensure all rows have equal length or use dtype=object.'}
  ]
},
{
  id:'python-pandas', name:'Python Pandas', icon:'??', category:'data', difficulty:'beginner',
  description:'DataFrames and Series for data manipulation, analysis, and time series',
  tags:['Pandas','DataFrame','Data Analysis','CSV'], prerequisites:['Python basics','NumPy basics'],
  theory:[
    {type:'heading',text:'What is Pandas?'},
    {type:'paragraph',text:'Pandas is the Python library for data manipulation built on NumPy. Its core structures are Series (1D labeled array) and DataFrame (2D table). Typical workflows: import (read_csv), inspect (head, info, describe), clean (dropna, fillna), select (loc, iloc, masks), transform (apply, map), aggregate (groupby, pivot_table), and merge (merge, concat).'},
    {type:'heading',text:'Performance'},
    {type:'paragraph',text:'Prefer vectorized pandas methods over row-wise apply. Always check dtypes after reading CSVs. Use .copy() before chained assignment. Chain operations with .pipe for readability.'}
  ],
  concepts:[
    {name:'Series',description:'1D labeled array with index.'},
    {name:'DataFrame',description:'2D tabular structure with labeled rows and columns.'},
    {name:'loc / iloc',description:'Label-based vs integer-position selection.'},
    {name:'groupby',description:'Split-apply-combine aggregation.'},
    {name:'Merge/Concat',description:'Combine DataFrames via joins or stacking.'},
    {name:'Pivot Tables',description:'Reshape and aggregate like a spreadsheet.'}
  ],
  codeExamples:[
    {title:'Reading & Inspecting',description:'Load and explore data',language:'python',code:`import pandas as pd\n\ndf = pd.DataFrame({\n    "product": ["A","B","C","A","B"],\n    "region": ["East","East","West","West","East"],\n    "amount": [120,85,300,90,110]\n})\nprint(df.head())\nprint(df.info())\nprint(df.describe())`},
    {title:'Filtering',description:'Boolean masks',language:'python',code:`# filter\nbig = df[df["amount"] > 100]\n\n# multiple conditions\nhigh_west = df[(df["amount"]>100) & (df["region"]=="West")]\n\n# query\nprint(df.query("amount > 100 and region == 'East'"))`},
    {title:'GroupBy & Aggregation',description:'Split-apply-combine',language:'python',code:`total = df.groupby("product")["amount"].sum()\nprint(total)\n\nstats = df.groupby("region").agg(\n    total=("amount","sum"),\n    avg=("amount","mean")\n)\nprint(stats)\n\npv = df.pivot_table(values="amount", index="region",\n                    columns="product", aggfunc="sum", fill_value=0)\nprint(pv)`},
    {title:'Cleaning',description:'Handle missing values',language:'python',code:`df2 = df.copy()\ndf2.loc[2, "amount"] = None\n\nprint(df2["amount"].fillna(df2["amount"].mean()))\n\ndf["amount_doubled"] = df["amount"] * 2\ndf["product_lower"] = df["product"].str.lower()\ndf["tier"] = pd.cut(df["amount"], bins=[0,100,200,500],\n                    labels=["low","mid","high"])`}
  ],
  useCases:[
    {title:'Business Reporting',description:'Aggregate sales/CRM into dashboards with groupby/pivot.'},
    {title:'ETL Pipelines',description:'Read CSVs/APIs, clean, transform, write to database.'},
    {title:'EDA',description:'Quickly profile distributions and correlations before modeling.'},
    {title:'Financial Analysis',description:'Resample stock prices and compute rolling volatility.'}
  ],
  bestPractices:['Prefer vectorized methods over apply','Use .copy() before chained assignment','Check dtypes after CSV reads','Use category dtype for low-cardinality strings'],
  commonErrors:[
    {error:'SettingWithCopyWarning',fix:'Use df.loc[:, "col"] = ... or add .copy() explicitly.'},
    {error:'KeyError: "column"',fix:'Check df.columns for exact name; use df.reindex for safe selection.'},
    {error:'Mixed types in aggregation',fix:'Downcast with .astype() before grouping.'}
  ]
},
{
  id:'matplotlib', name:'Matplotlib', icon:'??', category:'data', difficulty:'beginner',
  description:'Publication-quality plotting: figures, axes, charts, and styling',
  tags:['Matplotlib','Visualization','Plots'], prerequisites:['Python basics'],
  theory:[
    {type:'heading',text:'Matplotlib Fundamentals'},
    {type:'paragraph',text:'Matplotlib is Python\'s most established plotting library. The two interfaces are pyplot (stateful, MATLAB-like) and object-oriented (explicit Figure/Axes). The OO interface is recommended — it makes intent explicit. The Figure is the canvas; Axes are the coordinate regions; Artists are drawable elements.'},
    {type:'paragraph',text:'Matplotlib pairs with NumPy, integrates with pandas via DataFrame.plot(), and renders to PNG, SVG, PDF at arbitrary DPI. For interactive web dashboards, pair with mplcursors or serve via Flask.'}
  ],
  concepts:[
    {name:'Figure',description:'Top-level canvas containing all axes.'},
    {name:'Axes',description:'Coordinate region with ticks, labels, and plots.'},
    {name:'Subplots',description:'Rectangular grids of multiple axes.'},
    {name:'rcParams',description:'Global defaults for consistent styling.'},
    {name:'Artists',description:'Every drawable element with configurable properties.'}
  ],
  codeExamples:[
    {title:'Line & Scatter',description:'Basic plotting',language:'python',code:`import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\n\nplt.figure(figsize=(8, 4))\nplt.plot(x, y, marker="o", linestyle="--", label="Linear")\nplt.xlabel("X axis")\nplt.ylabel("Y axis")\nplt.title("Example Plot")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.savefig("plot.png", dpi=150)`},
    {title:'Subplots OO',description:'Object-oriented multi-plot',language:'python',code:`import numpy as np\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\nx = np.linspace(0, 10, 100)\n\naxes[0,0].plot(x, np.sin(x))\naxes[0,0].set_title("Sine")\n\naxes[0,1].bar(["A","B","C"], [12,5,7])\naxes[0,1].set_title("Bar chart")\n\naxes[1,0].hist(np.random.randn(500), bins=30)\naxes[1,0].set_title("Histogram")\n\naxes[1,1].pie([40,30,20], labels=["X","Y","Z"], autopct="%1.1f%%")\naxes[1,1].set_title("Pie")\n\nfig.tight_layout()`},
    {title:'Annotations',description:'Text and arrows',language:'python',code:`fig, ax = plt.subplots(figsize=(8, 5))\nx = [0,1,2,3,4]\ny = [10,45,23,78,90]\nax.plot(x, y, linewidth=2.5, marker="D")\nax.set_xticks(x)\nax.set_xticklabels(["Jan","Feb","Mar","Apr","May"], rotation=45)\nax.annotate("Peak", xy=(4,90), xytext=(3,75),\n            arrowprops=dict(arrowstyle="->", color="red"))\nplt.tight_layout()`}
  ],
  useCases:[
    {title:'Data Exploration',description:'Quick histograms reveal distributions during analysis.'},
    {title:'Business Dashboards',description:'KPI trends rendered from pandas into management reports.'},
    {title:'Scientific Publishing',description:'Publication-grade figures with LaTeX math and vector output.'},
    {title:'ML Explainability',description:'Plot training curves, confusion matrices, feature importances.'}
  ],
  bestPractices:['Use OO interface (fig, ax = plt.subplots)','Call tight_layout() before saving','Use consistent style sheets','Save vector formats for documentation, PNG at 300 DPI for slides'],
  commonErrors:[
    {error:'Figures not showing in Jupyter',fix:'Add %matplotlib inline magic or call plt.show().'},
    {error:'Labels cut off',fix:'Call plt.tight_layout() or use constrained_layout=True.'},
    {error:'Memory leaks',fix:'Close figures with plt.close() after saving in batch jobs.'}
  ]
},
{
  id:'seaborn', name:'Seaborn', icon:'??', category:'data', difficulty:'beginner',
  description:'Statistical data visualization built on Matplotlib',
  tags:['Seaborn','Statistics','Visualization','Heatmaps'], prerequisites:['Matplotlib basics'],
  theory:[
    {type:'heading',text:'Seaborn Overview'},
    {type:'paragraph',text:'Seaborn specializes in statistical charts with attractive defaults. It takes DataFrames directly, manages color palettes, and bundles statistical estimation (confidence intervals, KDEs, regressions) out of the box. The key abstractions are figure-level (relplot, catplot, displot) and axes-level (scatterplot, boxplot, histplot) functions.'},
    {type:'paragraph',text:'Seaborn computes and displays confidence bands automatically via bootstrapping, merging statistical inference with visualization.'}
  ],
  concepts:[
    {name:'hue parameter',description:'Colors points by a categorical column automatically.'},
    {name:'Confidence Intervals',description:'Seaborn plots bootstrapped CIs on aggregates.'},
    {name:'Palettes',description:'Color choices: hls, husl, "colorblind", "rocket".'},
    {name:'KDE',description:'Kernel density estimation for smooth distributions.'},
    {name:'Heatmap',description:'Visualizes correlation matrices and 2D grids.'},
    {name:'Pairplot',description:'All bivariate relationships at once.'}
  ],
  codeExamples:[
    {title:'Scatter with Hue',description:'Categorized scatter',language:'python',code:`import seaborn as sns\nimport matplotlib.pyplot as plt\n\ndf = sns.load_dataset("penguins")\nsns.scatterplot(data=df, x="bill_length_mm",\n                y="flipper_length_mm", hue="species")\nplt.title("Penguin dimensions")\nplt.show()`},
    {title:'Box & Violin',description:'Distribution by category',language:'python',code:`fig, axes = plt.subplots(1, 2, figsize=(12, 5))\nsns.boxplot(data=df, x="species", y="body_mass_g", ax=axes[0])\nsns.violinplot(data=df, x="species", y="bill_depth_mm", ax=axes[1])\nplt.suptitle("Distributions by species")\nplt.show()`},
    {title:'Heatmap',description:'Correlation matrix',language:'python',code:`corr = df[["bill_length_mm","bill_depth_mm","flipper_length_mm","body_mass_g"]].corr()\nplt.figure(figsize=(7,6))\nsns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")\nplt.title("Correlation Matrix")\nplt.show()`}
  ],
  useCases:[
    {title:'EDA',description:'Pairplots and heatmaps reveal relationships quickly.'},
    {title:'Statistical Reporting',description:'Barplots with error bars communicate estimates.'},
    {title:'Feature Review',description:'Distribution plots check normality before ML transforms.'}
  ],
  bestPractices:['Pass DataFrames and column names directly','Combine seaborn with Matplotlib for final styling','Use modest palette sizes (<=8)','Downsample before scatterplot on large data'],
  commonErrors:[
    {error:'TypeError: hue must be categorical',fix:'Ensure hue values are strings/categorical, not continuous floats.'},
    {error:'Slow plots on large data',fix:'Sample or drop KDE estimation where not needed.'},
    {error:'Overlapping labels',fix:'Use sns.set_theme(rc={"figure.autolayout":True}).'}
  ]
},
{
  id:'scipy', name:'SciPy', icon:'??', category:'data', difficulty:'intermediate',
  description:'Scientific computing: optimization, integration, interpolation, statistics',
  tags:['SciPy','Optimization','Numerical','Science'], prerequisites:['NumPy','Calculus basics'],
  theory:[
    {type:'heading',text:'What is SciPy?'},
    {type:'paragraph',text:'SciPy layers scientific algorithms on NumPy: optimization (scipy.optimize), integration (scipy.integrate), interpolation, linear algebra (scipy.linalg — LAPACK-powered), statistics (scipy.stats), signal processing (scipy.signal), and sparse matrices (scipy.sparse). Its algorithms are battle-tested C/Fortran implementations.'},
    {type:'paragraph',text:'Use SciPy when problems move beyond array math: minimizing cost functions, solving ODEs, integrating without closed forms, fitting splines, or testing statistical hypotheses.'}
  ],
  concepts:[
    {name:'Optimization',description:'scipy.optimize.minimize for parameter estimation.'},
    {name:'Integration',description:'quad for integrals; solve_ivp for ODEs.'},
    {name:'Interpolation',description:'interp1d, griddata, RBFInterpolator.'},
    {name:'Statistics',description:'scipy.stats: distributions, ttest, ANOVA.'},
    {name:'Sparse Matrices',description:'Efficient storage for large mostly-zero matrices.'}
  ],
  codeExamples:[
    {title:'Optimization',description:'Minimize Rosenbrock',language:'python',code:`from scipy.optimize import minimize\nimport numpy as np\n\ndef rosen(x): return (1-x[0])**2 + 100*(x[1]-x[0]**2)**2\n\nres = minimize(rosen, [0, 0])\nprint(f"min={res.fun:.6f} at {res.x}")  # ~0 at [1,1]`},
    {title:'Curve Fitting',description:'Nonlinear regression',language:'python',code:`from scipy.optimize import curve_fit\n\ndef model(x, a, b): return a * np.exp(-b * x)\n\nx = np.linspace(0, 4, 50)\ny = 3 * np.exp(-0.5*x) + 0.1*np.random.randn(50)\nparams, cov = curve_fit(model, x, y)\nprint(f"a={params[0]:.2f}, b={params[1]:.2f}")  # ~3, ~0.5`},
    {title:'Integrals & ODEs',description:'Mathematical operations',language:'python',code:`from scipy.integrate import quad, solve_ivp\n\nresult, err = quad(lambda x: x**2, 0, 1)\nprint(f"integral={result:.4f}")  # 0.3333\n\nsol = solve_ivp(lambda t, y: y, (0,1), [1], t_eval=[0,0.5,1])\nprint(sol.y)  # ~[[1.0, 1.648, 2.718]]`},
    {title:'Statistics Tests',description:'Hypothesis testing',language:'python',code:`import scipy.stats as stats\n\ng1 = stats.norm.rvs(5, size=30, random_state=1)\ng2 = stats.norm.rvs(5.5, size=30, random_state=2)\nt, p = stats.ttest_ind(g1, g2)\nprint(f"t={t:.3f}, p={p:.3f}")\n\nq90 = stats.norm.ppf(0.90)\nprint(f"90th percentile: {q90:.2f}")`}
  ],
  useCases:[
    {title:'Portfolio Optimization',description:'Minimize risk given expected returns.'},
    {title:'Sensor Calibration',description:'curve_fit calibrates response curves.'},
    {title:'Clinical Statistics',description:'t-tests and ANOVA for medical research.'},
    {title:'Physics Simulation',description:'solve_ivp integrates equations of motion.'}
  ],
  bestPractices:['Pass analytical gradients to minimize for speed','Provide bounds to avoid nonsensical regions','Use sparse solvers for large sparse matrices','Set random_state for reproducible results'],
  commonErrors:[
    {error:'Optimization did not converge',fix:'Scale variables, pass better initial guesses, or try different method.'},
    {error:'LinAlgError: matrix singular',fix:'Matrix non-invertible; add regularization or check for dependent rows.'}
  ]
},
{
  id:'sympy', name:'SymPy', icon:'??', category:'data', difficulty:'intermediate',
  description:'Symbolic mathematics: algebra, calculus, equation solving, and LaTeX rendering',
  tags:['SymPy','Symbolic Math','Calculus','Algebra'], prerequisites:['Python basics','Math'],
  theory:[
    {type:'heading',text:'Symbolic Computing'},
    {type:'paragraph',text:'SymPy performs exact symbolic mathematics: simplifying expressions, solving equations symbolically, computing derivatives/integrals as expressions, manipulating matrices exactly, and rendering LaTeX. It is a complete computer algebra system in pure Python.'},
    {type:'paragraph',text:'Key operations: symbols (variables with assumptions), simplify/expand/factor, calculus (diff/integrate/limit/series), solving (solve/linsolve/dsolve), and printing (latex/pretty).'}
  ],
  concepts:[
    {name:'Symbol',description:'A variable representing a mathematical unknown.'},
    {name:'simplify',description:'Find the simplest equivalent form.'},
    {name:'subs',description:'Substitute symbol values for numeric evaluation.'},
    {name:'dsolve',description:'Solve ordinary differential equations symbolically.'},
    {name:'latex()',description:'Render expressions as LaTeX source.'}
  ],
  codeExamples:[
    {title:'Algebra',description:'Exact arithmetic and simplification',language:'python',code:`import sympy as sp\nx, y = sp.symbols("x y")\n\nexpr = sp.expand((x+1)**3)\nprint(expr)       # x**3 + 3*x**2 + 3*x + 1\nprint(sp.factor(expr))  # (x + 1)**3\n\nsimplified = sp.simplify(sp.sin(x)**2 + sp.cos(x)**2)\nprint(simplified)  # 1`},
    {title:'Calculus',description:'Derivatives, integrals, limits',language:'python',code:`import sympy as sp\nx, t = sp.symbols("x t")\n\nprint(sp.diff(sp.sin(x)*sp.exp(x), x))\nprint(sp.integrate(x**2, x))   # x**3/3\nprint(sp.limit(sp.sin(x)/x, x, 0))  # 1\n\nseries = sp.series(sp.exp(x), x, 0, 5)\nprint(series)`},
    {title:'Solving Equations',description:'Symbolic solvers',language:'python',code:`import sympy as sp\nx, y = sp.symbols("x y")\n\nprint(sp.solve(x**2 - 5*x + 6, x))  # [2, 3]\n\nsol = sp.linsolve([x+y-5, 2*x-y-1], x, y)\nprint(sol)  # {(2, 3)}`},
    {title:'Matrices & LaTeX',description:'Exact linear algebra',language:'python',code:`import sympy as sp\n\nA = sp.Matrix([[1,2],[3,4]])\nprint(A.inv())\nprint(A.det())   # -2\nprint(A.eigenvals())\n\nexpr = sp.integrate(sp.exp(-x**2), x)\nprint(sp.latex(expr))`}
  ],
  useCases:[
    {title:'Formula Derivation',description:'Verify hand derivations automatically.'},
    {title:'Physics & Engineering',description:'Solve kinematics and circuit ODEs symbolically.'},
    {title:'Math Education',description:'Generate step-by-step algebra and calculus examples.'}
  ],
  bestPractices:['Declare symbol assumptions (real/positive) for stronger simplification','Use .subs() for numeric evaluation at the end','Prefer exact rationals where precision matters'],
  commonErrors:[
    {error:'Infinite recursion in simplify',fix:'Try targeted transforms (expand, factor) instead.'},
    {error:'AttributeError: not sympy object',fix:'Wrap floats with sp.symbols or sp.Rational.'}
  ]
},
{
  id:'bokeh', name:'Bokeh', icon:'??', category:'data', difficulty:'intermediate',
  description:'Interactive browser visualizations with glyphs, widgets, and server apps',
  tags:['Bokeh','Interactive','Dashboards','JavaScript'], prerequisites:['Matplotlib basics'],
  theory:[
    {type:'heading',text:'Bokeh for Interactive Visualization'},
    {type:'paragraph',text:'Bokeh creates interactive plots rendered in the browser via HTML/JS. Charts support zooming, panning, hovering, linked brushing, and live widgets without writing JavaScript. It targets dashboards and data apps where users explore data themselves.'},
    {type:'list',items:['Glyphs: circles, lines, bars on figure objects','DataSource: ColumnDataSource shared between glyphs','Tools: hover, zoom, pan, box_select','Widgets: sliders, dropdowns, buttons with Python callbacks','Server mode: Python/JS state in sync for live apps']}
  ],
  concepts:[
    {name:'Figure',description:'Plot canvas with glyphs and tools.'},
    {name:'Glyph',description:'Visual marks drawn from data.'},
    {name:'ColumnDataSource',description:'Shared data table powering interactions.'},
    {name:'Hover Tool',description:'Tooltips at cursor position.'},
    {name:'Layout',description:'gridplot, row, column for composition.'}
  ],
  codeExamples:[
    {title:'Interactive Scatter',description:'Scatter with hover tooltips',language:'python',code:`from bokeh.plotting import figure, show\nfrom bokeh.models import HoverTool, ColumnDataSource\n\nsource = ColumnDataSource(data=dict(\n    x=[1,2,3,4,5], y=[6,7,2,4,5],\n    label=["A","B","C","D","E"]))\n\np = figure(tools="pan,wheel_zoom,reset")\np.circle("x","y", size=18, source=source, fill_color="navy", alpha=0.8)\np.add_tools(HoverTool(tooltips=[("label","@label"),("x","@x"),("y","@y")]))\nshow(p)`},
    {title:'Bar Charts',description:'Categorical data',language:'python',code:`from bokeh.plotting import figure, show\nfrom bokeh.transform import factor_cmap\nfrom bokeh.palettes import Category10\n\ncats = ["Q1","Q2","Q3","Q4"]\nsrc = dict(categories=cats, amounts=[10,25,33,48])\np = figure(x_range=cats, height=350, title="Revenue")\np.vbar(x="categories", top="amounts", width=0.6, source=src,\n       fill_color=factor_cmap("categories",palette=Category10[4],factors=cats))\nshow(p)`}
  ],
  useCases:[
    {title:'Analytics Dashboards',description:'Self-hosted dashboards with linked filters.'},
    {title:'Exploratory Apps',description:'Adjust controls and see updated plots immediately.'},
    {title:'Live Monitoring',description:'Streams update charts for server health.'}
  ],
  bestPractices:['Use ColumnDataSource everywhere for uniformity','Keep tooltip fields to a handful','Use gridplot for aligned axes','Cap data with CDSView for large datasets'],
  commonErrors:[
    {error:'Blank plot (BokehJS not loaded)',fix:'Include generated script+div correctly; run output_notebook() for Jupyter.'},
    {error:'Widgets not updating',fix:'Widget callbacks only run with bokeh serve, not static embed.'}
  ]
},
{
  id:'biopython', name:'BioPython', icon:'??', category:'data', difficulty:'intermediate',
  description:'Bioinformatics: sequences, FASTA/GenBank parsing, BLAST, and phylogenetics',
  tags:['Bioinformatics','DNA','Sequences'], prerequisites:['Python basics','Basic biology'],
  theory:[
    {type:'heading',text:'Bioinformatics with Biopython'},
    {type:'paragraph',text:'Biopython is the standard Python toolkit for computational biology. It provides SeqRecord/Seq objects, parsers for FASTA/GenBank/PDB, NCBI BLAST and Entrez interfaces, alignment tools, and phylogenetic tree handling. Researchers use it for genomics, transcriptomics, and protein annotation.'}
  ],
  concepts:[
    {name:'Seq',description:'Biological string with complement, reverse_complement methods.'},
    {name:'SeqRecord',description:'Sequence plus metadata and annotations.'},
    {name:'SeqIO',description:'Format-agnostic reader/writer for ~20 formats.'},
    {name:'NCBI Entrez',description:'REST interface for NCBI searches and record fetching.'},
    {name:'Phylogeny',description:'Read and manipulate evolutionary trees.'}
  ],
  codeExamples:[
    {title:'DNA Operations',description:'Sequence manipulation',language:'python',code:`from Bio.Seq import Seq\n\ndna = Seq("ATGCTAGATCGTACG")\nprint(dna.complement())       # TACGATCTAGCATGC\nprint(dna.reverse_complement())  # CGTACGATCTAGCAT\nprint(dna.transcribe())       # AUGCUAGAUGCAUG\nprint(dna.translate())        # MLDSTY`},
    {title:'Parse FASTA',description:'Read sequences',language:'python',code:`from Bio import SeqIO\n\ndef gc_content(seq):\n    g, c = seq.count("G"), seq.count("C")\n    return (g+c) / len(seq) * 100\n\nfor record in SeqIO.parse("seqs.fasta", "fasta"):\n    print(f"{record.id}: {len(record.seq)}bp GC={gc_content(record.seq):.1f}%")`},
    {title:'BLAST Search',description:'Remote homology search',language:'python',code:`from Bio.Blast import NCBIWWW, NCBIXML\n\nresult = NCBIWWW.qblast("blastn", "nt", "ATGCTAGATCGTACG")\nrecords = NCBIXML.parse(result)\nfor rec in records:\n    for aln in rec.alignments[:3]:\n        print(aln.title, aln.hsps[0].expect)`}
  ],
  useCases:[
    {title:'Genome QC',description:'Parse FASTQ to compute N50 and GC content.'},
    {title:'Variant Calling',description:'Filter annotated VCF for candidate mutations.'},
    {title:'Protein Annotation',description:'BLAST against databases for function assignment.'},
    {title:'Phylogenetics',description:'Build gene trees to study evolution.'}
  ],
  bestPractices:['Use streaming SeqIO.parse for huge files','Cache NCBI queries to disk','Normalize sequence case before comparing','Validate alphabet against expectations'],
  commonErrors:[
    {error:'IncorrectAlphabetError',fix:'Characters don\'t match declared alphabet; use IUPAC.ambiguous_dna.'},
    {error:'Network fetch timeouts',fix:'Add retries, respect NCBI limits, include email parameter.'}
  ]
},
{
  id:'python-mongodb', name:'Python MongoDB', icon:'??', category:'data', difficulty:'beginner',
  description:'PyMongo: CRUD, aggregation, indexing, and GridFS with MongoDB',
  tags:['MongoDB','PyMongo','NoSQL','Database'], prerequisites:['Python basics','Basic DB concepts'],
  theory:[
    {type:'heading',text:'MongoDB and PyMongo'},
    {type:'paragraph',text:'MongoDB stores JSON-like BSON documents in collections. PyMongo is the official Python driver supporting CRUD, aggregation pipelines, indexes, transactions, and GridFS for large files. Documents map naturally to Python dicts.'}
  ],
  concepts:[
    {name:'Collection',description:'Group of documents (analogous to SQL table).'},
    {name:'BSON',description:'Binary JSON with ObjectId, datetime, Decimal128.'},
    {name:'Query Operators',description:'$gt, $in, $regex, $elemMatch for flexible filters.'},
    {name:'Aggregation Pipeline',description:'Chained stages for analytics.'},
    {name:'Indexes',description:'Speed up queries; unique indexes enforce constraints.'},
    {name:'GridFS',description:'File storage splitting large objects across chunks.'}
  ],
  codeExamples:[
    {title:'Connect & Insert',description:'Basic writes',language:'python',code:`from pymongo import MongoClient\n\nclient = MongoClient("mongodb://localhost:27017/")\ndb = client["shop"]\nproducts = db["products"]\n\nproducts.insert_one({"name":"Mouse","price":29.99,"stock":150})\nproducts.insert_many([{"name":"Keyboard","price":49.99},{"name":"Monitor","price":199.99}])`},
    {title:'Querying',description:'Finding documents',language:'python',code:`mice = products.find_one({"name":"Mouse"})\ncheap = products.find({"price":{"$lt":100}})\nfor p in cheap: print(p["name"], p["price"])\n\nnames = products.find({},{"name":1,"_id":0})\nprint([d["name"] for d in names])`},
    {title:'Updates & Aggregation',description:'Modify and analyze',language:'python',code:`products.update_one({"name":"Mouse"},{"$set":{"price":24.99},"$inc":{"stock":-5}})\n\npipeline = [\n    {"$match":{"status":"completed"}},\n    {"$group":{"_id":"$category","total":{"$sum":"$amount"},"count":{"$sum":1}}},\n    {"$sort":{"total":-1}}\n]\nfor row in db.sales.aggregate(pipeline): print(row)`}
  ],
  useCases:[
    {title:'Content Management',description:'Store heterogeneous CMS structures.'},
    {title:'Real-time Analytics',description:'Aggregation dashboards over event streams.'},
    {title:'IoT Storage',description:'Time-stamped sensor documents.'}
  ],
  bestPractices:['Create indexes on queried fields','Use projections to limit fields','Enable SSL in production','Never hardcode credentials'],
  commonErrors:[
    {error:'ServerSelectionTimeoutError',fix:'Check host/port and connection string.'},
    {error:'KeyError accessing field',fix:'Use .get("field", default) or check document schema.'}
  ]
}
];

fs.writeFileSync('src/data/pythonTutorialsData.js',
  content + ',\n' + more.map(t=>JSON.stringify(t)).join(',\n') + ']\n');
console.log('Total tutorials now: ' + (5 + more.length));
