import time
import json
import random
import requests

API_BASE = "http://localhost:8080/sensor"
AUTH_BASE = "http://localhost:8080/auth"

# Fungsi login untuk mendapatkan JWT token
def login(email, password):
    payload = {"email": email, "password": password}
    try:
        resp = requests.post(f"{AUTH_BASE}/login", json=payload, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            token = data.get("token") or data.get("access_token")
            if token:
                print("[INFO] Login berhasil. Token didapat.")
                return token
            else:
                print(f"[ERR] Login response tidak ada token: {data}")
                return None
        else:
            print(f"[ERR] Login gagal: {resp.status_code} {resp.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Gagal login: {e}")
        return None

# Fungsi untuk mengirim data sensor dengan Authorization header
def send_sensor_data(token=None):
    url = f"{API_BASE}/data"
    # Format waktu ISO8601 yang kompatibel dengan toISOString di JavaScript
    current_time = time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())
    payload = {
        "jumlahPakanKering": round(random.uniform(1, 10), 2),
        "jumlahAir": random.randint(3, 15),
        "waktu": current_time,
        "timestamp": current_time
    }
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=5)
        return resp
    except Exception as e:
        print(f"[ERROR] Gagal POST ke {url}: {e}")
        return None

if __name__ == "__main__":
    # Ganti dengan user test Anda
    EMAIL = "testuser@mail.com"
    PASSWORD = "testpass"
    token = login(EMAIL, PASSWORD)
    if not token:
        print("[FATAL] Tidak bisa dapat token, keluar.")
    else:
        while True:
            try:
                resp = send_sensor_data(token)
                if resp is not None:
                    try:
                        res_json = resp.json()
                    except Exception:
                        res_json = resp.text
                    if resp.status_code == 201:
                        data = res_json.get('data', {}) if isinstance(res_json, dict) else {}
                        print(f"[OK] feed={data.get('feed_level_cm')} air={data.get('water_level_cm')} t={data.get('last_update')}")
                    else:
                        print(f"[ERR] status={resp.status_code}, response={res_json}")
                else:
                    print(f"[ERR] Tidak ada response dari server")
                time.sleep(5)
            except KeyboardInterrupt:
                print("\nStopped by user.")
                break