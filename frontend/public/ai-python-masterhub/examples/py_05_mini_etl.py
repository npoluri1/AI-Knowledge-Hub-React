import csv, sqlite3, statistics, tempfile, pathlib

RAW = """id,name,dept,salary
1,Ada,eng,180000
2,Grace,eng,195000
3,Alan,math,
4,Katherine,nasa,150000
bad,row,x
5,Edsger,math,175000"""

def extract(raw: str):
    for row in csv.DictReader(raw.splitlines()):
        try:
            yield {"id": int(row["id"]), "name": row["name"].strip(),
                   "dept": row["dept"].lower(), "salary": float(row["salary"])}
        except (KeyError, ValueError) as e:
            print("skipped bad row:", row, "->", e)

def load(rows, db: pathlib.Path):
    con = sqlite3.connect(db); con.row_factory = sqlite3.Row
    con.execute("CREATE TABLE IF NOT EXISTS emp(id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary REAL)")
    with con:
        con.executemany("INSERT INTO emp VALUES(:id,:name,:dept,:salary)",
                        [r for r in rows if r.get("salary")])
    return con

if __name__ == "__main__":
    db = pathlib.Path(tempfile.gettempdir()) / "hr.db"
    db.unlink(missing_ok=True)
    con = load(extract(RAW), db)
    rows = con.execute("SELECT dept, salary FROM emp").fetchall()
    by_dept: dict[str, list[float]] = {}
    for r in rows: by_dept.setdefault(r["dept"], []).append(r["salary"])
    for dept, pays in sorted(by_dept.items()):
        print(f"{dept:6} n={len(pays)} mean={statistics.mean(pays):,.0f} max={max(pays):,.0f}")
    con.close()