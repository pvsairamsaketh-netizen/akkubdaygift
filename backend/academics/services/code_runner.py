"""
Safe Python & Data Engineering Code Runner Service.
Executes Python code in an isolated subprocess with strict timeouts,
output limits, and automated test case evaluation.
"""

import sys
import time
import subprocess
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class CodeRunner:
    _instance: Optional['CodeRunner'] = None

    @classmethod
    def get_instance(cls) -> 'CodeRunner':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def run_code(
        self,
        code: str,
        stdin_input: str = "",
        timeout_seconds: float = 5.0,
        test_cases: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Executes Python code safely in a separate subprocess.
        If test_cases is provided, runs each test case against the user code.
        """
        if not code or not code.strip():
            return {
                "success": False,
                "error": "No code provided to execute.",
                "stdout": "",
                "stderr": "",
                "execution_time_ms": 0
            }

        # Basic security guard: block dangerous OS-level calls in user sandbox
        forbidden_patterns = [
            "__import__('os').system",
            "subprocess.Popen",
            "shutil.rmtree",
            "os.remove",
            "os.unlink",
            "os.rmdir",
            "forkbomb",
            ":(){ :|:& };:"
        ]
        for pattern in forbidden_patterns:
            if pattern in code:
                return {
                    "success": False,
                    "error": f"Security restriction: '{pattern}' is not permitted in the placement sandbox.",
                    "stdout": "",
                    "stderr": "",
                    "execution_time_ms": 0
                }

        # If test cases are provided, evaluate them
        if test_cases and len(test_cases) > 0:
            return self._evaluate_test_cases(code, test_cases, timeout_seconds)

        # Standalone execution
        start_time = time.time()
        try:
            proc = subprocess.run(
                [sys.executable, "-c", code],
                input=stdin_input,
                capture_output=True,
                text=True,
                timeout=timeout_seconds
            )
            execution_time_ms = round((time.time() - start_time) * 1000, 2)
            stdout = proc.stdout[:10000] if proc.stdout else ""
            stderr = proc.stderr[:10000] if proc.stderr else ""

            return {
                "success": proc.returncode == 0,
                "stdout": stdout,
                "stderr": stderr,
                "exit_code": proc.returncode,
                "execution_time_ms": execution_time_ms,
                "error": None if proc.returncode == 0 else (stderr or f"Process exited with code {proc.returncode}")
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": f"Time Limit Exceeded: Code exceeded the {timeout_seconds}s limit. Check for infinite loops or inefficient algorithms.",
                "stdout": "",
                "stderr": "TimeoutExpired",
                "execution_time_ms": round(timeout_seconds * 1000, 2)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "stdout": "",
                "stderr": str(e),
                "execution_time_ms": round((time.time() - start_time) * 1000, 2)
            }

    def _evaluate_test_cases(
        self,
        user_code: str,
        test_cases: List[Dict[str, Any]],
        timeout_seconds: float
    ) -> Dict[str, Any]:
        """Runs user code against each test case and checks input/output matching."""
        results = []
        all_passed = True
        total_time_ms = 0

        for idx, tc in enumerate(test_cases):
            tc_input = str(tc.get("input", ""))
            expected_output = str(tc.get("expected_output", "")).strip()
            is_hidden = tc.get("hidden", False)

            start = time.time()
            try:
                proc = subprocess.run(
                    [sys.executable, "-c", user_code],
                    input=tc_input,
                    capture_output=True,
                    text=True,
                    timeout=timeout_seconds
                )
                t_ms = round((time.time() - start) * 1000, 2)
                total_time_ms += t_ms
                actual_output = proc.stdout.strip() if proc.stdout else ""

                passed = (proc.returncode == 0 and actual_output == expected_output)
                if not passed:
                    all_passed = False

                results.append({
                    "test_case_id": idx + 1,
                    "input": "[Hidden Test]" if is_hidden else tc_input,
                    "expected_output": "[Hidden Test]" if is_hidden else expected_output,
                    "actual_output": actual_output,
                    "passed": passed,
                    "error": proc.stderr if proc.returncode != 0 else None,
                    "execution_time_ms": t_ms,
                    "hidden": is_hidden
                })
            except subprocess.TimeoutExpired:
                all_passed = False
                results.append({
                    "test_case_id": idx + 1,
                    "input": "[Hidden Test]" if is_hidden else tc_input,
                    "expected_output": "[Hidden Test]" if is_hidden else expected_output,
                    "actual_output": "Time Limit Exceeded",
                    "passed": False,
                    "error": f"Timeout (> {timeout_seconds}s)",
                    "execution_time_ms": round(timeout_seconds * 1000, 2),
                    "hidden": is_hidden
                })

        passed_count = sum(1 for r in results if r["passed"])
        status_label = "Accepted" if all_passed else "Wrong Answer" if any(not r["passed"] and not r.get("error") for r in results) else "Runtime Error"

        return {
            "success": all_passed,
            "status": status_label,
            "passed_count": passed_count,
            "total_count": len(test_cases),
            "test_results": results,
            "execution_time_ms": total_time_ms,
            "feedback": "All test cases passed! Fantastic job! 🎉" if all_passed else f"{passed_count}/{len(test_cases)} tests passed. Review the failing cases to debug edge conditions."
        }
