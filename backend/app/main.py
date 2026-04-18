from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from app.schemas import ExpenseCreate
from app.db import get_connection
from app.crud import (
    create_expense,
    get_expenses_by_category,
    get_expenses_by_date_range,
    get_monthly_summary,
)

app = FastAPI(title="Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Expense Tracker API is running"}

@app.post("/expenses")
def add_expense(expense: ExpenseCreate):
    try:
        result = create_expense(expense)
        return {"message": "Expense added successfully", "expense": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/category/{category}")
def expenses_by_category(category: str):
    try:
        result = get_expenses_by_category(category)
        return {"category": category, "expenses": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/date-range")
def expenses_by_date_range(
    start_date: date = Query(...),
    end_date: date = Query(...)
):
    try:
        result = get_expenses_by_date_range(start_date, end_date)
        return {
            "start_date": start_date,
            "end_date": end_date,
            "expenses": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/monthly-summary")
def monthly_summary(
    start_date: date = Query(...),
    end_date: date = Query(...)
):
    try:
        result = get_monthly_summary(start_date, end_date)
        return {
            "start_date": start_date,
            "end_date": end_date,
            "summary": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/expenses/explain")
def explain_query(start_date: date, end_date: date):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    EXPLAIN ANALYZE
    SELECT * FROM expenses
    WHERE date BETWEEN %s AND %s;
    """

    cur.execute(query, (start_date, end_date))
    result = cur.fetchall()

    cur.close()
    conn.close()

    plan = [list(row.values())[0] for row in result]
    return {"plan": plan}