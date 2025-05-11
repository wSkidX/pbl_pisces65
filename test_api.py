import requests
import json

BASE_URL = "http://localhost:8080"

# Helper for pretty print

def print_result(title, resp):
    print(f"\n=== {title} ===")
    print(f"Status: {resp.status_code}")
    try:
        print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(resp.text)

# AUTH
user = {
    "email": "testuser@example.com",
    "password": "testpass123",
    "nama": "Jaki",
    "nohp": "08123456789",
    "alamat": "Padang"
}

print("\n# AUTH SERVICE")
resp = requests.post(f"{BASE_URL}/auth/register", json=user)
print_result("Register", resp)

resp = requests.post(f"{BASE_URL}/auth/login", json={"email": user["email"], "password": user["password"]})
print_result("Login", resp)

resp = requests.get(f"{BASE_URL}/auth/users")
print_result("List Users", resp)

# JADWAL
print("\n# JADWAL SERVICE")
jadwal = {
    "nama": "Pagi",
    "waktu": "07:00",
    "keterangan": "Jadwal pagi"
}

resp = requests.post(f"{BASE_URL}/jadwal/add", json=jadwal)
print_result("Add Jadwal", resp)

resp = requests.get(f"{BASE_URL}/jadwal/get")
print_result("List Jadwal", resp)

if resp.ok and len(resp.json()) > 0:
    jadwal_id = resp.json()[0].get("id")
    if jadwal_id:
        resp = requests.get(f"{BASE_URL}/jadwal/get/{jadwal_id}")
        print_result("Get Jadwal by ID", resp)
        resp = requests.put(f"{BASE_URL}/jadwal/update/{jadwal_id}", json={"nama": "Update Pagi", "waktu": "08:00", "keterangan": "Update jadwal"})
        print_result("Update Jadwal", resp)
        resp = requests.delete(f"{BASE_URL}/jadwal/delete/{jadwal_id}")
        print_result("Delete Jadwal", resp)

# SENSOR
print("\n# SENSOR SERVICE")
sensor = {
    "jenis": "pH",
    "nilai": 7.5,
    "waktu": "2025-05-11T07:00:00"
}

resp = requests.post(f"{BASE_URL}/sensor/data", json=sensor)
print_result("Add Sensor Data", resp)

resp = requests.get(f"{BASE_URL}/sensor/data")
print_result("List Sensor Data", resp)

if resp.ok and len(resp.json()) > 0:
    sensor_id = resp.json()[0].get("id")
    if sensor_id:
        resp = requests.get(f"{BASE_URL}/sensor/data/{sensor_id}")
        print_result("Get Sensor Data by ID", resp)
        resp = requests.put(f"{BASE_URL}/sensor/data/{sensor_id}", json={"jenis": "DO", "nilai": 5.2, "waktu": "2025-05-11T08:00:00"})
        print_result("Update Sensor Data", resp)
        resp = requests.delete(f"{BASE_URL}/sensor/data/{sensor_id}")
        print_result("Delete Sensor Data", resp)

print("\nSelesai. Semua endpoint sudah dites.")
