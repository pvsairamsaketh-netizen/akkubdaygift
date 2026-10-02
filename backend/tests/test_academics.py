"""
Comprehensive Automated Tests for Academics Module:
1. SQL Sandbox Execution (SELECT, JOIN, Window functions)
2. SQL Sandbox Exercise Verification
3. Python CodeRunner isolated execution and test case evaluation
4. Notes CRUD API with User Isolation
5. Progress & Spaced Repetition API
"""

import pytest
from rest_framework.test import APIClient
from academics.models import AcademicNote, AcademicProgress
from academics.services.sql_engine import SQLEngine
from academics.services.code_runner import CodeRunner

@pytest.fixture(autouse=True)
def clean_academics_db():
    AcademicNote.objects.all().delete()
    AcademicProgress.objects.all().delete()
    yield

@pytest.mark.django_db
def test_sql_engine_query_and_schema():
    engine = SQLEngine.get_instance()
    schema = engine.get_schema()
    assert len(schema) >= 5
    table_names = [t["table_name"] for t in schema]
    assert "employees" in table_names
    assert "departments" in table_names
    assert "fact_sales" in table_names

    res = engine.execute_query("SELECT COUNT(*) as cnt FROM employees;")
    assert res["success"] is True
    assert res["rows"][0][0] > 0

@pytest.mark.django_db
def test_sql_exercise_validation():
    engine = SQLEngine.get_instance()
    user_sql = "SELECT dept_name FROM departments WHERE location = 'Bengaluru';"
    expected_sql = "SELECT dept_name FROM departments WHERE location = 'Bengaluru';"
    res = engine.validate_exercise(user_sql, expected_sql)
    assert res["passed"] is True

    wrong_sql = "SELECT dept_name FROM departments WHERE location = 'Chennai';"
    wrong_res = engine.validate_exercise(wrong_sql, expected_sql)
    assert wrong_res["passed"] is False

@pytest.mark.django_db
def test_code_runner_standalone_and_tests():
    runner = CodeRunner.get_instance()
    res = runner.run_code("print('Hello Akku Data Engineer')")
    assert res["success"] is True
    assert "Hello Akku Data Engineer" in res["stdout"]

    # Test cases
    code = "import sys\nval = int(sys.stdin.read().strip())\nprint(val * 2)"
    tc = [
        {"input": "10", "expected_output": "20"},
        {"input": "25", "expected_output": "50"}
    ]
    tc_res = runner.run_code(code, test_cases=tc)
    assert tc_res["success"] is True
    assert tc_res["passed_count"] == 2
    assert tc_res["status"] == "Accepted"

@pytest.mark.django_db
def test_notes_api_crud_and_isolation():
    client = APIClient()

    # Create note for user_a
    res = client.post(
        '/api/academics/notes/',
        {
            'title': 'Spark Broadcast Join Notes',
            'content': 'Broadcast joins avoid shuffling by broadcasting the small dataset to all executors.',
            'category': 'Spark',
            'day_number': 66,
            'topic_id': 'spark_broadcast_join'
        },
        format='json',
        HTTP_X_USER_ID='user_a'
    )
    assert res.status_code == 201
    note_id = res.json()['id']

    # Retrieve note as user_a
    get_res = client.get('/api/academics/notes/', HTTP_X_USER_ID='user_a')
    assert get_res.status_code == 200
    assert get_res.json()['total_notes'] == 1
    assert get_res.json()['notes'][0]['title'] == 'Spark Broadcast Join Notes'

    # User_b should NOT see user_a's note
    b_res = client.get('/api/academics/notes/', HTTP_X_USER_ID='user_b')
    assert b_res.status_code == 200
    assert b_res.json()['total_notes'] == 0

    # Delete note
    del_res = client.delete(f'/api/academics/notes/{note_id}/', HTTP_X_USER_ID='user_a')
    assert del_res.status_code == 200
    assert not AcademicNote.objects.filter(id=note_id).exists()

@pytest.mark.django_db
def test_progress_api():
    client = APIClient()

    res = client.post(
        '/api/academics/progress/',
        {
            'completed_days': [1, 2, 3],
            'day_status': {'1': {'learned': True, 'mcq': 100}},
            'streak_count': 5
        },
        format='json',
        HTTP_X_USER_ID='akku'
    )
    assert res.status_code == 200
    data = res.json()
    assert data['streak_count'] == 5
    assert data['completed_days'] == [1, 2, 3]
    assert data['completion_percentage'] == 3.0
