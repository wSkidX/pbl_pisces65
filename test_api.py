"""
Pisces65 API Gateway Automated Test Script

Fitur yang diuji:
- Auth Service: register, login
- Jadwal Service: add, get, update, delete
- Sensor Service: add, get, update, delete

Cara pakai:
1. Pastikan API Gateway sudah berjalan (lihat BASE_URL).
2. Jalankan: python test_api.py [auth|jadwal|sensor|notification|dashboard|all]
3. Cek output di terminal.
"""
import requests
import argparse
import logging
import json
from colorama import init, Fore, Style

# Inisialisasi logging
init(autoreset=True)
logging.basicConfig(level=logging.INFO, format='%(message)s')

BASE_URL = 'http://localhost:8080'
s = requests.Session()

def login():
    payload = {
        "email": "testuser@mail.com",
        "password": "testpass"
    }
    try:
        resp = s.post(f'{BASE_URL}/auth/login', json=payload, timeout=10)
        if resp.status_code == 200:
            return True
        else:
            logging.error(f'Login gagal: {resp.status_code} {resp.json()}')
            return False
    except Exception as e:
        logging.error(f'Login gagal: {e}')
        return False

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
        logging.info(f'Register: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Register: ERROR {e}')

    # Login
    if login():
        logging.info('Login berhasil')
    else:
        logging.error('Login gagal')

    # Cek akses endpoint yang butuh session (GET /auth)
    try:
        resp = s.get(f'{BASE_URL}/auth')
        logging.info(f'Get All Users (dengan session): {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Get All Users (dengan session): ERROR {e}')

    # Logout
    try:
        resp = s.post(f'{BASE_URL}/auth/logout')
        logging.info(f'Logout: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Logout: ERROR {e}')

    # Cek akses endpoint lagi setelah logout
    try:
        resp = s.get(f'{BASE_URL}/auth')
        logging.info(f'Get All Users (setelah logout): {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Get All Users (setelah logout): ERROR {e}')

def test_jadwal():
    print("\n=== JADWAL SERVICE ===")
    # Add Jadwal
    try:
        resp = s.post(f'{BASE_URL}/jadwal/add', json={
            "waktu_tanggal": "2025-05-12",
            "waktu_jam": "10:00:00"
        })
        logging.info(f'Add Jadwal: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Add Jadwal: ERROR {e}')

    # Get Semua Jadwal
    try:
        resp = requests.get(f'{BASE_URL}/jadwal/get')
        logging.info(f'Get Jadwal: {resp.status_code} {resp.json()}')
        jadwals = resp.json()
    except Exception as e:
        logging.error(f'Get Jadwal: ERROR {e}')
        jadwals = []

    # Get, Update, Delete Jadwal by ID
    if jadwals:
        jadwal_id = jadwals[0].get('id')
        try:
            resp = requests.get(f'{BASE_URL}/jadwal/get/{jadwal_id}')
            logging.info(f'Get Jadwal by ID: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'Get Jadwal by ID: ERROR {e}')
        try:
            resp = requests.put(f'{BASE_URL}/jadwal/update/{jadwal_id}', json={"waktu": "11:00:00", "keterangan": "Update Pakan"})
            logging.info(f'Update Jadwal: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'Update Jadwal: ERROR {e}')
        try:
            resp = requests.delete(f'{BASE_URL}/jadwal/delete/{jadwal_id}')
            logging.info(f'Delete Jadwal: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'Delete Jadwal: ERROR {e}')
    else:
        logging.info('Tidak ada jadwal untuk test by ID, update, atau delete')

def test_sensor():
    print("\n=== SENSOR SERVICE ===")
    # Add Sensor Data
    try:
        resp = s.post(f'{BASE_URL}/sensor/data', json={
            "jumlahPakanKering": 123.45,
            "jumlahAir": 10.0
        })
        logging.info(f'Add Sensor: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Add Sensor: ERROR {e}')

    # Get Semua Sensor Data
    try:
        resp = requests.get(f'{BASE_URL}/sensor/data')
        logging.info(f'Get Sensor: {resp.status_code} {resp.json()}')
        sensors = resp.json()
    except Exception as e:
        logging.error(f'Get Sensor: ERROR {e}')
        sensors = []

    # Get, Update, Delete Sensor by ID
    if sensors:
        sensor_id = sensors[0].get('id')
        try:
            resp = requests.get(f'{BASE_URL}/sensor/data/{sensor_id}')
            logging.info(f'Get Sensor by ID: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'Get Sensor by ID: ERROR {e}')
        # Update (jika didukung)
        try:
            resp = requests.put(f'{BASE_URL}/sensor/data/{sensor_id}', json={"type": "ultrasonik", "value": 200.00})
            logging.info(f'Update Sensor: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'Update Sensor: ERROR {e}')
        # Delete (jika didukung)
        try:
            resp = requests.delete(f'{BASE_URL}/sensor/data/{sensor_id}')
            logging.info(f'Delete Sensor: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'Delete Sensor: ERROR {e}')
    else:
        logging.info('Tidak ada data sensor untuk test by ID, update, atau delete')

def publish_dummy_sensor():
    try:
        import paho.mqtt.client as mqtt
    except ImportError:
        logging.error('[INFO] Modul paho-mqtt belum terinstall. Jalankan: pip install paho-mqtt')
        return
    import time, json
    MQTT_BROKER = "localhost"
    MQTT_PORT = 1883
    client = mqtt.Client()
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        # Data real-time (ultrasonik, motor, servo, rtc)
        client.publish("sensor/ultrasonik", json.dumps({
            "feed_level_cm": 7.2,
            "water_level_cm": 12.5
        }))
        client.publish("sensor/motor", json.dumps({
            "status": "ON",
            "duration_sec": 15
        }))
        client.publish("sensor/servo", json.dumps({
            "status": "OPEN"
        }))
        client.publish("sensor/rtc", json.dumps({
            "rtc_time": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }))
        # Log feeding event
        client.publish("event/feeding", json.dumps({
            "executed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "feed_used_gram": 30,
            "water_used_ml": 150,
            "status": "success",
            "message": "Feeding executed successfully",
            "motor_duration_sec": 15,
            "total_duration_sec": 20
        }))
        logging.info('[INFO] Dummy MQTT data published!')
        client.disconnect()
    except Exception as e:
        logging.error(f'[WARN] Gagal publish ke MQTT broker: {e}')

def test_dashboard():
    print("\n=== DASHBOARD SUMMARY ===")
    publish_dummy_sensor()
    try:
        resp = s.get(f'{BASE_URL}/dashboard')
        logging.info(f'Dashboard: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Dashboard: ERROR {e}')

def test_jadwal_extra():
    print("\n=== JADWAL SERVICE (Next & Last Feeding Log) ===")
    try:
        resp = s.get(f'{BASE_URL}/jadwal/next')
        logging.info(f'Next Jadwal: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Next Jadwal: ERROR {e}')
    try:
        resp = s.get(f'{BASE_URL}/jadwal/last_feeding_log')
        logging.info(f'Last Feeding Log: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Last Feeding Log: ERROR {e}')

def test_sensor_extra():

def test_notification():
    print("\n=== NOTIFICATION SERVICE ===")
    if not login():
        logging.error('Login gagal, tidak bisa test notification')
        return
    # 1. Create notification (POST)
    try:
        payload = {
            "title": "Test Notif",
            "message": "Ini notifikasi via API Gateway",
            "type": "info"
        }
        resp = s.post(f'{BASE_URL}/notification/notifications', json=payload)
        logging.info(f'Create Notification: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Create Notification: ERROR {e}')
    # 2. Get all notifications (GET)
    try:
        resp = s.get(f'{BASE_URL}/notification/notifications')
        logging.info(f'Get All Notifications: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Get All Notifications: ERROR {e}')
    # 3. Get unread notifications (GET)
    try:
        resp = s.get(f'{BASE_URL}/notification/notifications/unread')
        logging.info(f'Get Unread Notifications: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Get Unread Notifications: ERROR {e}')
    # 4. Mark all as read (PUT)
    try:
        resp = s.put(f'{BASE_URL}/notification/notifications/read-all')
        logging.info(f'Mark All As Read: {resp.status_code} {resp.json()}')
    except Exception as e:
        logging.error(f'Mark All As Read: ERROR {e}')

    print("\n=== SENSOR SERVICE (Realtime & System) ===")
    for path, desc in [
        ('status', 'Sensor Status'),
        ('logs', 'Feeding Logs'),
        ('system_status', 'System Status'),
        ('current_stock', 'Current Stock')
    ]:
        try:
            resp = s.get(f'{BASE_URL}/sensor/{path}')
            logging.info(f'{desc}: {resp.status_code} {resp.json()}')
        except Exception as e:
            logging.error(f'{desc}: ERROR {e}')

def main():
    parser = argparse.ArgumentParser(description='Pisces65 API Gateway Automated Test Script')
    parser.add_argument('service', choices=['auth', 'jadwal', 'sensor', 'notification', 'dashboard', 'all'], help='Service yang diuji')
    args = parser.parse_args()

    if args.service == 'auth':
        test_auth()
    elif args.service == 'jadwal':
        test_jadwal()
    elif args.service == 'sensor':
        test_sensor()
    elif args.service == 'notification':
        test_notification()
    elif args.service == 'dashboard':
        test_dashboard()
    elif args.service == 'all':
        test_auth()
        test_jadwal()
        test_jadwal_extra()
        test_sensor()
        test_sensor_extra()
        test_notification()
        test_dashboard()

    logging.info(f'{Fore.GREEN}Test selesai{Style.RESET_ALL}')

if __name__ == "__main__":
    main()
