"""
Dedicated SQL Laboratory Engine for Data Engineering Practice.
Manages an isolated, rich analytical database with Employees, Customers, Orders,
Web Events, and Star Schema Data Warehouse Fact/Dimension tables.
Executes real SQL queries, measures execution time, provides EXPLAIN query plans,
and verifies exercise solutions.
"""

import os
import time
import sqlite3
import logging
from typing import Dict, Any, List, Optional
from django.conf import settings

logger = logging.getLogger(__name__)

class SQLEngine:
    _instance: Optional['SQLEngine'] = None

    def __init__(self):
        data_dir = getattr(settings, 'DATA_DIR', os.path.join(settings.BASE_DIR, 'data'))
        os.makedirs(data_dir, exist_ok=True)
        self.db_path = os.path.join(data_dir, 'academics_sql_sandbox.db')
        self._initialize_database()

    @classmethod
    def get_instance(cls) -> 'SQLEngine':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=5.0)
        conn.row_factory = sqlite3.Row
        return conn

    def _initialize_database(self, force: bool = False):
        """Creates and populates the sample data engineering schema and datasets."""
        if not force and os.path.exists(self.db_path) and os.path.getsize(self.db_path) > 1024:
            return

        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()

        # 1. Departments & Employees
        cur.executescript("""
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS payments;
        DROP TABLE IF EXISTS website_events;
        DROP TABLE IF EXISTS dim_customer;
        DROP TABLE IF EXISTS dim_product;
        DROP TABLE IF EXISTS dim_date;
        DROP TABLE IF EXISTS fact_sales;

        CREATE TABLE departments (
            dept_id INTEGER PRIMARY KEY,
            dept_name TEXT NOT NULL,
            location TEXT NOT NULL,
            budget REAL
        );

        CREATE TABLE employees (
            emp_id INTEGER PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            dept_id INTEGER,
            salary REAL NOT NULL,
            hire_date TEXT NOT NULL,
            manager_id INTEGER,
            FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        );

        -- Seed Departments
        INSERT INTO departments VALUES
        (10, 'Data Engineering', 'Bengaluru', 8500000),
        (20, 'Analytics & BI', 'Chennai', 4200000),
        (30, 'Platform & Cloud', 'Hyderabad', 6500000),
        (40, 'Machine Learning', 'Pune', 7200000);

        -- Seed Employees
        INSERT INTO employees VALUES
        (101, 'Akshatha', 'Rao', 10, 1450000, '2022-06-15', NULL),
        (102, 'Saketh', 'Varma', 10, 1500000, '2022-05-04', 101),
        (103, 'Priya', 'Nair', 10, 1150000, '2023-01-10', 101),
        (104, 'Vikram', 'Sharma', 20, 950000, '2022-09-01', NULL),
        (105, 'Ananya', 'Deshmukh', 20, 980000, '2023-03-20', 104),
        (106, 'Rahul', 'Verma', 30, 1350000, '2021-11-12', NULL),
        (107, 'Meera', 'Iyer', 30, 1200000, '2022-08-18', 106),
        (108, 'Karthik', 'Sundaram', 40, 1600000, '2021-04-01', NULL),
        (109, 'Sneha', 'Patel', 40, 1300000, '2023-05-15', 108);

        -- 2. E-Commerce Customers, Products, Orders
        CREATE TABLE customers (
            customer_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            city TEXT NOT NULL,
            country TEXT DEFAULT 'India',
            signup_date TEXT NOT NULL
        );

        CREATE TABLE products (
            product_id INTEGER PRIMARY KEY,
            product_name TEXT NOT NULL,
            category TEXT NOT NULL,
            unit_price REAL NOT NULL,
            unit_cost REAL NOT NULL
        );

        CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            order_date TEXT NOT NULL,
            status TEXT NOT NULL,
            total_amount REAL NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        );

        CREATE TABLE order_items (
            item_id INTEGER PRIMARY KEY,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );

        CREATE TABLE payments (
            payment_id INTEGER PRIMARY KEY,
            order_id INTEGER NOT NULL,
            payment_method TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL,
            payment_time TEXT NOT NULL
        );

        CREATE TABLE website_events (
            event_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            session_id TEXT NOT NULL,
            event_type TEXT NOT NULL,
            page_url TEXT NOT NULL,
            event_timestamp TEXT NOT NULL
        );

        -- Seed Customers
        INSERT INTO customers VALUES
        (1, 'Akshatha Rao', 'akku@example.com', 'Chennai', 'India', '2023-01-15'),
        (2, 'Saketh Varma', 'saki@example.com', 'Chennai', 'India', '2023-01-16'),
        (3, 'Rohan Mehta', 'rohan@example.com', 'Mumbai', 'India', '2023-02-10'),
        (4, 'Tanvi Kapoor', 'tanvi@example.com', 'Delhi', 'India', '2023-02-28'),
        (5, 'Siddharth Jain', 'sid@example.com', 'Bengaluru', 'India', '2023-03-05');

        -- Seed Products
        INSERT INTO products VALUES
        (201, 'MacBook Pro M3', 'Laptops', 169900.0, 130000.0),
        (202, 'Dell XPS 15', 'Laptops', 145000.0, 110000.0),
        (203, 'Sony WH-1000XM5', 'Audio', 29990.0, 19000.0),
        (204, 'Apple AirPods Pro', 'Audio', 24900.0, 16000.0),
        (205, 'Keychron Mechanical Keyboard', 'Accessories', 8999.0, 5200.0),
        (206, 'Logitech MX Master 3S', 'Accessories', 9495.0, 6000.0),
        (207, 'LG UltraWide 34 Monitor', 'Monitors', 45000.0, 32000.0);

        -- Seed Orders
        INSERT INTO orders VALUES
        (1001, 1, '2024-01-05', 'Completed', 178899.0),
        (1002, 2, '2024-01-10', 'Completed', 39485.0),
        (1003, 3, '2024-01-15', 'Completed', 145000.0),
        (1004, 1, '2024-02-01', 'Completed', 24900.0),
        (1005, 4, '2024-02-14', 'Cancelled', 29990.0),
        (1006, 5, '2024-02-20', 'Completed', 54495.0),
        (1007, 2, '2024-03-01', 'Completed', 45000.0);

        -- Seed Order Items
        INSERT INTO order_items VALUES
        (1, 1001, 201, 1, 169900.0),
        (2, 1001, 205, 1, 8999.0),
        (3, 1002, 203, 1, 29990.0),
        (4, 1002, 206, 1, 9495.0),
        (5, 1003, 202, 1, 145000.0),
        (6, 1004, 204, 1, 24900.0),
        (7, 1005, 203, 1, 29990.0),
        (8, 1006, 207, 1, 45000.0),
        (9, 1006, 206, 1, 9495.0),
        (10, 1007, 207, 1, 45000.0);

        -- Seed Payments
        INSERT INTO payments VALUES
        (501, 1001, 'UPI', 178899.0, 'Success', '2024-01-05 10:15:00'),
        (502, 1002, 'Credit Card', 39485.0, 'Success', '2024-01-10 14:32:00'),
        (503, 1003, 'NetBanking', 145000.0, 'Success', '2024-01-15 18:20:00'),
        (504, 1004, 'UPI', 24900.0, 'Success', '2024-02-01 11:05:00'),
        (505, 1005, 'UPI', 29990.0, 'Refunded', '2024-02-14 16:45:00'),
        (506, 1006, 'Credit Card', 54495.0, 'Success', '2024-02-20 09:12:00'),
        (507, 1007, 'UPI', 45000.0, 'Success', '2024-03-01 20:00:00');

        -- Seed Website Events
        INSERT INTO website_events VALUES
        (1, 1, 'sess_101', 'page_view', '/products/laptops', '2024-01-05 10:02:11'),
        (2, 1, 'sess_101', 'add_to_cart', '/cart', '2024-01-05 10:08:45'),
        (3, 1, 'sess_101', 'checkout', '/checkout', '2024-01-05 10:14:02'),
        (4, 2, 'sess_102', 'search', '/search?q=headphones', '2024-01-10 14:20:10'),
        (5, 2, 'sess_102', 'add_to_cart', '/cart', '2024-01-10 14:28:30'),
        (6, 2, 'sess_102', 'checkout', '/checkout', '2024-01-10 14:31:00');

        -- 3. Kimball Star Schema Data Warehouse Fact & Dimensions
        CREATE TABLE dim_customer (
            cust_key INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            segment TEXT NOT NULL,
            city TEXT NOT NULL,
            effective_date TEXT NOT NULL,
            end_date TEXT,
            is_current INTEGER DEFAULT 1
        );

        CREATE TABLE dim_product (
            prod_key INTEGER PRIMARY KEY,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            category TEXT NOT NULL,
            brand TEXT NOT NULL
        );

        CREATE TABLE dim_date (
            date_key INTEGER PRIMARY KEY,
            full_date TEXT NOT NULL,
            year INTEGER NOT NULL,
            quarter INTEGER NOT NULL,
            month_name TEXT NOT NULL,
            day_of_week TEXT NOT NULL
        );

        CREATE TABLE fact_sales (
            sales_key INTEGER PRIMARY KEY,
            date_key INTEGER NOT NULL,
            cust_key INTEGER NOT NULL,
            prod_key INTEGER NOT NULL,
            order_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            revenue REAL NOT NULL,
            profit REAL NOT NULL,
            FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
            FOREIGN KEY (cust_key) REFERENCES dim_customer(cust_key),
            FOREIGN KEY (prod_key) REFERENCES dim_product(prod_key)
        );

        -- Seed Dim Customer (SCD Type 2)
        INSERT INTO dim_customer VALUES
        (1, 1, 'Akshatha Rao', 'VIP', 'Chennai', '2023-01-15', NULL, 1),
        (2, 2, 'Saketh Varma', 'VIP', 'Chennai', '2023-01-16', NULL, 1),
        (3, 3, 'Rohan Mehta', 'Regular', 'Mumbai', '2023-02-10', NULL, 1),
        (4, 4, 'Tanvi Kapoor', 'Regular', 'Delhi', '2023-02-28', NULL, 1),
        (5, 5, 'Siddharth Jain', 'Premium', 'Bengaluru', '2023-03-05', NULL, 1);

        -- Seed Dim Product
        INSERT INTO dim_product VALUES
        (1, 201, 'MacBook Pro M3', 'Laptops', 'Apple'),
        (2, 202, 'Dell XPS 15', 'Laptops', 'Dell'),
        (3, 203, 'Sony WH-1000XM5', 'Audio', 'Sony'),
        (4, 204, 'Apple AirPods Pro', 'Audio', 'Apple'),
        (5, 205, 'Keychron K2 Keyboard', 'Accessories', 'Keychron'),
        (6, 206, 'Logitech MX Master 3S', 'Accessories', 'Logitech'),
        (7, 207, 'LG UltraWide 34 Monitor', 'Monitors', 'LG');

        -- Seed Dim Date
        INSERT INTO dim_date VALUES
        (20240105, '2024-01-05', 2024, 1, 'January', 'Friday'),
        (20240110, '2024-01-10', 2024, 1, 'January', 'Wednesday'),
        (20240115, '2024-01-15', 2024, 1, 'January', 'Monday'),
        (20240201, '2024-02-01', 2024, 1, 'February', 'Thursday'),
        (20240220, '2024-02-20', 2024, 1, 'February', 'Tuesday'),
        (20240301, '2024-03-01', 2024, 1, 'March', 'Friday');

        -- Seed Fact Sales
        INSERT INTO fact_sales VALUES
        (1, 20240105, 1, 1, 1001, 1, 169900.0, 39900.0),
        (2, 20240105, 1, 5, 1001, 1, 8999.0, 3799.0),
        (3, 20240110, 2, 3, 1002, 1, 29990.0, 10990.0),
        (4, 20240110, 2, 6, 1002, 1, 9495.0, 3495.0),
        (5, 20240115, 3, 2, 1003, 1, 145000.0, 35000.0),
        (6, 20240201, 1, 4, 1004, 1, 24900.0, 8900.0),
        (7, 20240220, 5, 7, 1006, 1, 45000.0, 13000.0),
        (8, 20240220, 5, 6, 1006, 1, 9495.0, 3495.0),
        (9, 20240301, 2, 7, 1007, 1, 45000.0, 13000.0);
        """)

        conn.commit()
        conn.close()
        logger.info(f"Initialized Academics SQL Sandbox Database at {self.db_path}")

    def reset_database(self) -> None:
        """Resets the sample database back to pristine seed data."""
        self._initialize_database(force=True)

    def get_schema(self) -> List[Dict[str, Any]]:
        """Returns metadata for all available tables and columns."""
        conn = self._get_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
        tables = [row[0] for row in cur.fetchall()]

        schema_list = []
        for tbl in tables:
            cur.execute(f"PRAGMA table_info({tbl});")
            columns = []
            for col in cur.fetchall():
                columns.append({
                    "cid": col[0],
                    "name": col[1],
                    "type": col[2],
                    "notnull": bool(col[3]),
                    "dflt_value": col[4],
                    "pk": bool(col[5])
                })
            
            cur.execute(f"SELECT COUNT(*) FROM {tbl};")
            row_count = cur.fetchone()[0]

            cur.execute(f"SELECT * FROM {tbl} LIMIT 3;")
            sample_rows = [dict(r) for r in cur.fetchall()]

            schema_list.append({
                "table_name": tbl,
                "columns": columns,
                "row_count": row_count,
                "sample_rows": sample_rows
            })

        conn.close()
        return schema_list

    def execute_query(self, query: str, user_id: str = "default_user", max_rows: int = 500) -> Dict[str, Any]:
        """
        Safely executes a query against the sandbox database.
        Returns columns, rows, execution time, and row count.
        """
        clean_query = query.strip()
        if not clean_query:
            return {"success": False, "error": "Query cannot be empty."}

        # Guard against destructive commands to preserve sandbox stability
        disallowed = ['ATTACH', 'DETACH', 'PRAGMA schema_version']
        upper_query = clean_query.upper()
        for forbidden in disallowed:
            if forbidden in upper_query:
                return {"success": False, "error": f"Operation '{forbidden}' is restricted in sandbox."}

        start_time = time.time()
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()

            # Execute query
            cur.execute(clean_query)

            if cur.description:
                columns = [desc[0] for desc in cur.description]
                rows = []
                for row in cur.fetchmany(max_rows):
                    rows.append(list(row))
                
                execution_time_ms = round((time.time() - start_time) * 1000, 2)
                row_count = len(rows)

                # Persist query history asynchronously or via direct insert
                self._record_history(user_id, clean_query, 'success', execution_time_ms, row_count)

                return {
                    "success": True,
                    "query": clean_query,
                    "columns": columns,
                    "rows": rows,
                    "row_count": row_count,
                    "execution_time_ms": execution_time_ms,
                    "truncated": row_count >= max_rows
                }
            else:
                conn.commit()
                execution_time_ms = round((time.time() - start_time) * 1000, 2)
                affected = cur.rowcount
                self._record_history(user_id, clean_query, 'success', execution_time_ms, affected)
                return {
                    "success": True,
                    "query": clean_query,
                    "columns": ["message"],
                    "rows": [[f"Query executed successfully. Rows affected: {affected}"]],
                    "row_count": affected,
                    "execution_time_ms": execution_time_ms,
                    "truncated": False
                }
        except Exception as e:
            execution_time_ms = round((time.time() - start_time) * 1000, 2)
            self._record_history(user_id, clean_query, 'error', execution_time_ms, 0)
            return {
                "success": False,
                "query": clean_query,
                "error": str(e),
                "execution_time_ms": execution_time_ms
            }
        finally:
            if conn:
                conn.close()

    def _record_history(self, user_id: str, query: str, status: str, time_ms: float, row_count: int):
        try:
            from academics.models import SQLQueryHistory
            SQLQueryHistory.objects.create(
                user_id=user_id,
                query=query[:2000],
                status=status,
                execution_time_ms=time_ms,
                row_count=row_count
            )
        except Exception:
            pass

    def validate_exercise(self, user_sql: str, expected_sql: str, user_id: str = "default_user") -> Dict[str, Any]:
        """
        Runs both user query and reference query and compares column outputs and row values.
        """
        user_res = self.execute_query(user_sql, user_id=user_id)
        if not user_res["success"]:
            return {
                "passed": False,
                "error": f"Query Error: {user_res['error']}",
                "user_result": user_res
            }

        expected_res = self.execute_query(expected_sql, user_id="system_validator")
        if not expected_res["success"]:
            return {
                "passed": False,
                "error": "Internal validator error.",
                "user_result": user_res
            }

        user_rows = user_res["rows"]
        exp_rows = expected_res["rows"]

        # Normalize floats and string representations for comparison
        def normalize_row(row):
            return tuple(round(x, 2) if isinstance(x, float) else str(x).strip() for x in row)

        user_norm = sorted([normalize_row(r) for r in user_rows])
        exp_norm = sorted([normalize_row(r) for r in exp_rows])

        passed = (user_norm == exp_norm)

        return {
            "passed": passed,
            "user_row_count": len(user_rows),
            "expected_row_count": len(exp_rows),
            "execution_time_ms": user_res["execution_time_ms"],
            "user_result": user_res,
            "expected_result": expected_res,
            "feedback": "Perfect! Your query output matches the expected result exactly. ✨" if passed else "The output did not match the expected solution. Check your filtering, grouping, or ordering logic."
        }
