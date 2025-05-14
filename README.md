# 📖 Dokumentasi API Pisces65 IoT Feeder

## 🔗 API Gateway Endpoint (Dashboard)

### GET `/dashboard`
Gabungan data real-time, histori, jadwal, dan status sistem untuk frontend/dashboard.

**Response:**
```json
{
  "user": { "id": 1, "username": "admin" },
  "sensor_status": {
    "feed_level_cm": 7.2,
    "water_level_cm": 12.5,
    "motor_status": "ON",
    "motor_duration_sec": 15,
    "servo_status": "OPEN",
    "rtc_time": "2025-05-12T17:30:00Z",
    "last_update": "2025-05-12T17:30:01Z"
  },
  "feeding_logs": [
    {
      "executed_at": "2025-05-12T17:00:02Z",
      "feed_used_gram": 30,
      "water_used_ml": 150,
      "status": "success",
      "message": "Feeding executed successfully",
      "motor_duration_sec": 15,
      "total_duration_sec": 30
    }
  ],
  "system_status": {
    "all_sensor_ok": true,
    "error_log": [
      { "time": "2025-05-12T17:10:00Z", "message": "Motor gagal start" }
    ],
    "notification": "Stok pakan menipis"
  },
  "next_schedule": {
    "id": 15,
    "time": "17:00:00",
    "repeat_daily": true,
    "feed_amount_gram": 30,
    "water_volume_ml": 150
  },
  "last_feeding_log": {
    "executed_at": "2025-05-09T17:00:02Z",
    "feed_used_gram": 30,
    "water_used_ml": 150,
    "status": "success",
    "message": "Feeding executed successfully"
  }
}
```

---

## 🔗 Sensor-Service Endpoint

### GET `/sensor/status`
Data real-time seluruh sensor dan aktuator.

### GET `/sensor/logs`
Histori log pemberian pakan terbaru (max 100 data).

### GET `/sensor/system_status`
Status sistem, error log, dan notifikasi penting.

### GET `/sensor/current_stock`
Data level pakan & air terkini (khusus untuk kebutuhan ringkas).

**Contoh response tiap endpoint:**

#### `/sensor/status`
```json
{
  "feed_level_cm": 7.2,
  "water_level_cm": 12.5,
  "motor_status": "ON",
  "motor_duration_sec": 15,
  "servo_status": "OPEN",
  "rtc_time": "2025-05-12T17:30:00Z",
  "last_update": "2025-05-12T17:30:01Z"
}
```

#### `/sensor/logs`
```json
[
  {
    "executed_at": "2025-05-12T17:00:02Z",
    "feed_used_gram": 30,
    "water_used_ml": 150,
    "status": "success",
    "message": "Feeding executed successfully",
    "motor_duration_sec": 15,
    "total_duration_sec": 30
  }
]
```

#### `/sensor/system_status`
```json
{
  "all_sensor_ok": true,
  "error_log": [
    { "time": "2025-05-12T17:10:00Z", "message": "Motor gagal start" }
  ],
  "notification": "Stok pakan menipis"
}
```

#### `/sensor/current_stock`
```json
{
  "feed_level_cm": 7.2,
  "water_level_cm": 12.5,
  "last_update": "2025-05-12T17:30:01Z"
}
```

---

## 🔗 Jadwal-Service Endpoint

### GET `/jadwal/next`
Jadwal pemberian pakan berikutnya.

### GET `/jadwal/last_feeding_log`
Log eksekusi pemberian pakan terakhir.

**Contoh response:**
```json
{
  "id": 15,
  "time": "17:00:00",
  "repeat_daily": true,
  "feed_amount_gram": 30,
  "water_volume_ml": 150
}
```

```json
{
  "executed_at": "2025-05-09T17:00:02Z",
  "feed_used_gram": 30,
  "water_used_ml": 150,
  "status": "success",
  "message": "Feeding executed successfully"
}
```

---

## ℹ️ Catatan
- Semua endpoint diakses via API Gateway pada port 8080.
- Gunakan Postman, curl, atau frontend untuk konsumsi API.
- Untuk endpoint sensor, data akan selalu real-time selama ESP32 publish ke MQTT.
- Endpoint histori/log feeding dibatasi 100 data terbaru.
- Endpoint `/dashboard` sangat cocok untuk kebutuhan frontend dashboard monitoring.
