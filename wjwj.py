import time
import json
import random
import requests

API_BASE = "https://pisces65.my.id/api/sensor"

# Fungsi untuk mengirim data ke endpoint HTTP

def send_post(endpoint, payload):
    url = f"{API_BASE}/{endpoint}"
    try:
        resp = requests.post(url, json=payload, timeout=5)
        return resp
    except Exception as e:
        print(f"[ERROR] Gagal POST ke {url}: {e}")
        return None

random.seed(time.time())  # agar hasil random beda setiap run

def send_sensor_data():
    payload = {
        "jumlahPakanKering": round(random.uniform(1, 10), 2),
        "jumlahAir": random.randint(3, 15),
        "mode": "manual",
        "waktu_pakan": time.strftime("%Y-%m-%dT%H:%M:%S")
    }
    return send_post("data", payload)

if __name__ == "__main__":
    while True:
        try:
            resp = send_sensor_data()
            if resp and resp.status_code == 201:
                data = resp.json().get('data', {})
                print(f"[OK] feed={data.get('feed_level_cm')} air={data.get('water_level_cm')} t={data.get('last_update')}")
            else:
                print(f"[ERR] status={resp.status_code if resp else 'NO RESP'}")
            time.sleep(1)
        except KeyboardInterrupt:
            print("\nStopped by user.")
            break

        time.sleep(5)