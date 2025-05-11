"""
Pisces65 API Gateway Automated Test Script

Fitur yang diuji:
- Auth Service: register, login
- Jadwal Service: add, get, update, delete
- Sensor Service: add, get, update, delete

Cara pakai:
1. Pastikan API Gateway sudah berjalan (lihat BASE_URL).
2. Jalankan: python test_api.py
3. Cek output di terminal.
"""
import requests

BASE_URL = 'http://localhost:8080'
s = requests.Session()

# ---------- AUTH SERVICE ----------
def test_auth():
    print("\n=== AUTH SERVICE ===")
    # Register
    payload = {
        "email": "testuser@mail.com",
        "password": "testpass",
        "nama": "Test User",
        "nohp": "08123456789",
        "alamat": "Jl. Contoh No. 1"
    }
    try:
        resp = s.post(f'{BASE_URL}/auth/register', json=payload, timeout=10)
        print('Register:', resp.status_code, resp.json())
    except Exception as e:
        print('Register: ERROR', e)
    # Login
    try:
        resp = s.post(f'{BASE_URL}/auth/login', json={"email": "testuser@mail.com", "password": "testpass"}, timeout=10)
        print('Login:', resp.status_code, resp.json())
    except Exception as e:
        print('Login: ERROR', e)

    # Cek akses endpoint yang butuh session (GET /auth)
    try:
        resp = s.get(f'{BASE_URL}/auth')
        print('Get All Users (dengan session):', resp.status_code, resp.json())
    except Exception as e:
        print('Get All Users (dengan session): ERROR', e)

    # Logout
    try:
        resp = s.post(f'{BASE_URL}/auth/logout')
        print('Logout:', resp.status_code, resp.json())
    except Exception as e:
        print('Logout: ERROR', e)

    # Cek akses endpoint lagi setelah logout
    try:
        resp = s.get(f'{BASE_URL}/auth')
        print('Get All Users (setelah logout):', resp.status_code, resp.json())
    except Exception as e:
        print('Get All Users (setelah logout): ERROR', e)

# ---------- JADWAL SERVICE ----------
def test_jadwal():
    print("\n=== JADWAL SERVICE ===")
    # Add Jadwal
    try:
        resp = s.post(f'{BASE_URL}/jadwal/add', json={
            "waktu_tanggal": "2025-05-12",
            "waktu_jam": "10:00:00"
        })
        print('Add Jadwal:', resp.status_code, resp.json())
    except Exception as e:
        print('Add Jadwal: ERROR', e)
    # Get Semua Jadwal
    try:
        resp = requests.get(f'{BASE_URL}/jadwal/get')
        print('Get Jadwal:', resp.status_code, resp.json())
        jadwals = resp.json()
    except Exception as e:
        print('Get Jadwal: ERROR', e)
        jadwals = []
    # Get, Update, Delete Jadwal by ID
    if jadwals:
        jadwal_id = jadwals[0].get('id')
        try:
            resp = requests.get(f'{BASE_URL}/jadwal/get/{jadwal_id}')
            print('Get Jadwal by ID:', resp.status_code, resp.json())
        except Exception as e:
            print('Get Jadwal by ID: ERROR', e)
        try:
            resp = requests.put(f'{BASE_URL}/jadwal/update/{jadwal_id}', json={"waktu": "11:00:00", "keterangan": "Update Pakan"})
            print('Update Jadwal:', resp.status_code, resp.json())
        except Exception as e:
            print('Update Jadwal: ERROR', e)
        try:
            resp = requests.delete(f'{BASE_URL}/jadwal/delete/{jadwal_id}')
            print('Delete Jadwal:', resp.status_code, resp.json())
        except Exception as e:
            print('Delete Jadwal: ERROR', e)
    else:
        print('Tidak ada jadwal untuk test by ID, update, atau delete')

# ---------- SENSOR SERVICE ----------
def test_sensor():
    print("\n=== SENSOR SERVICE ===")
    # Add Sensor Data
    try:
        resp = s.post(f'{BASE_URL}/sensor/data', json={
            "jumlahPakanKering": 123.45,
            "jumlahAir": 10.0
        })
        print('Add Sensor:', resp.status_code, resp.json())
    except Exception as e:
        print('Add Sensor: ERROR', e)
    # Get Semua Sensor Data
    try:
        resp = requests.get(f'{BASE_URL}/sensor/data')
        print('Get Sensor:', resp.status_code, resp.json())
        sensors = resp.json()
    except Exception as e:
        print('Get Sensor: ERROR', e)
        sensors = []
    # Get, Update, Delete Sensor by ID
    if sensors:
        sensor_id = sensors[0].get('id')
        try:
            resp = requests.get(f'{BASE_URL}/sensor/data/{sensor_id}')
            print('Get Sensor by ID:', resp.status_code, resp.json())
        except Exception as e:
            print('Get Sensor by ID: ERROR', e)
        # Update (jika didukung)
        try:
            resp = requests.put(f'{BASE_URL}/sensor/data/{sensor_id}', json={"type": "ultrasonik", "value": 200.00})
            print('Update Sensor:', resp.status_code, resp.json())
        except Exception as e:
            print('Update Sensor: ERROR', e)
        # Delete (jika didukung)
        try:
            resp = requests.delete(f'{BASE_URL}/sensor/data/{sensor_id}')
            print('Delete Sensor:', resp.status_code, resp.json())
        except Exception as e:
            print('Delete Sensor: ERROR', e)
    else:
        print('Tidak ada data sensor untuk test by ID, update, atau delete')

if __name__ == "__main__":
    test_auth()
    test_jadwal()
    test_sensor()
