import requests

BASE_URL = "http://127.0.0.1:8000"

tests = [
    {"name": "TC1 - Handwriting Healthy", "url": f"{BASE_URL}/predict/handwriting", "file": "test_samples/handwriting_healthy.png", "expected": "Healthy"},
    {"name": "TC2 - Handwriting Parkinson", "url": f"{BASE_URL}/predict/handwriting", "file": "test_samples/handwriting_parkinson.png", "expected": "Parkinson"},
    {"name": "TC3 - MRI Healthy", "url": f"{BASE_URL}/predict/mri", "file": "test_samples/mri_healthy.png", "expected": "Healthy"},
    {"name": "TC4 - MRI Parkinson", "url": f"{BASE_URL}/predict/mri", "file": "test_samples/mri_parkinson.png", "expected": "Parkinson"},
    {"name": "TC5 - Voice Healthy", "url": f"{BASE_URL}/predict/voice", "file": "test_samples/voice_healthy.wav", "expected": "Healthy"},
    {"name": "TC6 - Voice Parkinson", "url": f"{BASE_URL}/predict/voice", "file": "test_samples/voice_parkinson.wav", "expected": "Parkinson"},
]

passed = 0

print("\n=== SYSTEM TESTING STARTED ===\n")

for test in tests:
    try:
        # ✅ CORRECT file open method
        with open(test["file"], "rb") as f:
            files = {
                "file": (test["file"], f, "application/octet-stream")
            }

            response = requests.post(test["url"], files=files)

        result = response.json()["prediction"]

        if result == test["expected"]:
            print(f"{test['name']} -> PASS")
            passed += 1
        else:
            print(f"{test['name']} -> FAIL (Expected: {test['expected']}, Got: {result})")

    except Exception as e:
        print(f"{test['name']} -> ERROR ({e})")

print("\n=== TEST SUMMARY ===")
print(f"Total Tests: {len(tests)}")
print(f"Passed: {passed}")
print(f"Failed: {len(tests) - passed}")
print(f"Accuracy: {(passed/len(tests))*100:.2f}%")