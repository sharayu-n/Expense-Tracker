from app.db import get_connection


# ✅ Insert Expense (Heap + Index update)
def create_expense(expense):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    INSERT INTO expenses (amount, category, date, description)
    VALUES (%s, %s, %s, %s)
    RETURNING *;
    """

    cur.execute(query, (
        expense.amount,
        expense.category,
        expense.date,
        expense.description
    ))

    result = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    return result


# ✅ Filter by Category (Index usage possible)
def get_expenses_by_category(category):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT * FROM expenses
    WHERE category = %s
    ORDER BY date;
    """

    cur.execute(query, (category,))
    result = cur.fetchall()

    cur.close()
    conn.close()

    return result


# ✅ Filter by Date Range (B-tree RANGE SCAN 🔥)
def get_expenses_by_date_range(start_date, end_date):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT * FROM expenses
    WHERE date BETWEEN %s AND %s
    ORDER BY date;
    """

    cur.execute(query, (start_date, end_date))
    result = cur.fetchall()

    cur.close()
    conn.close()

    return result


# ✅ Monthly Aggregation (GroupAggregate)
def get_monthly_summary(start_date, end_date):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT category, SUM(amount) as total
    FROM expenses
    WHERE date BETWEEN %s AND %s
    GROUP BY category;
    """

    cur.execute(query, (start_date, end_date))
    result = cur.fetchall()

    cur.close()
    conn.close()

    return result

def update_expense(expense_id, expense):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    UPDATE expenses
    SET amount = %s,
        category = %s,
        date = %s,
        description = %s
    WHERE id = %s
    RETURNING *;
    """

    cur.execute(
        query,
        (
            expense.amount,
            expense.category,
            expense.date,
            expense.description,
            expense_id,
        ),
    )

    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return result


def delete_expense(expense_id):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    DELETE FROM expenses
    WHERE id = %s
    RETURNING *;
    """

    cur.execute(query, (expense_id,))
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return result