# Expense Tracker with PostgreSQL Internals Analysis

## Overview

This project is a full-stack expense tracking application designed to demonstrate PostgreSQL internal behavior.

Key concepts explored:

* Heap storage
* B-tree indexing
* Query planning
* MVCC (Multi-Version Concurrency Control)

Tech stack:

* Frontend: React
* Backend: FastAPI
* Database: PostgreSQL

---

## Architecture

User → React → FastAPI → PostgreSQL → Query Planner → Execution → Result

---

## Features

* Add, update, and delete expenses
* Filter expenses by date range
* Category-wise aggregation (summary)
* View PostgreSQL query execution plans (EXPLAIN ANALYZE)

---

## Database Internals Mapping

### 1. Filtering Expenses (SELECT)

Application behavior:
Filter expenses by date range.

Query:
SELECT * FROM expenses WHERE date BETWEEN ...;

Database behavior:

* Uses B-tree index on date
* Performs Bitmap Index Scan
* Performs Bitmap Heap Scan
* Applies MVCC visibility checks

---

### 2. Insert (Add Expense)

Application behavior:
User adds a new expense.

Query:
INSERT INTO expenses ...;

Database behavior:

* New tuple inserted into heap storage
* B-tree index updated
* New row version created

---

### 3. Update Expense

Application behavior:
User edits an expense.

Query:
UPDATE expenses SET ...;

Database behavior:

* New version of row created (MVCC)
* Old version remains temporarily
* Index entries updated if needed

---

### 4. Delete Expense

Application behavior:
User deletes an expense.

Query:
DELETE FROM expenses ...;

Database behavior:

* Row is marked as deleted (not immediately removed)
* Cleaned later by VACUUM

---

### 5. Aggregation (Summary Page)

Application behavior:
View total expenses by category.

Query:
SELECT category, SUM(amount) FROM expenses GROUP BY category;

Database behavior:

* Uses GroupAggregate node
* Scans relevant rows
* Performs aggregation in memory

---

## MVCC Explanation

PostgreSQL uses MVCC (Multi-Version Concurrency Control) to allow concurrent reads and writes.

* Multiple versions of a row are stored
* Reads do not block writes
* Each query sees a consistent snapshot of data
* MVCC is applied during heap access

---

## Running the Project

### Backend

cd backend
- source venv/bin/activate
- uvicorn app.main:app --reload

### Frontend

cd frontend
- npm install
- npm run dev

---

## Dataset

* Synthetic dataset (~50,000 rows)
* Generated using SQL
* Covers multiple categories and date ranges

---

## Key Learning

This project demonstrates how application-level operations map directly to PostgreSQL internals:

* Query → Index traversal + heap access
* Insert → Heap insert + index update
* Update → MVCC row versioning
* Delete → Logical deletion + vacuum cleanup
* Aggregation → GroupAggregate execution

---

## Conclusion

The project highlights how PostgreSQL efficiently handles real-world workloads using:

* Heap-based storage
* B-tree indexing
* Cost-based query planning
* MVCC for concurrency control

---
