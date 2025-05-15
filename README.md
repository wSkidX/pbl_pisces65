# 📖 Dokumentasi Pisces65 IoT Feeder

## 🏗️ Arsitektur Aplikasi

Pisces65 IoT Feeder menggunakan arsitektur microservices dengan pendekatan Domain-Driven Design (DDD). Aplikasi ini terdiri dari beberapa service yang berjalan secara independen dan berkomunikasi melalui API Gateway.

### Pendekatan Domain-Driven Design (DDD)

Aplikasi ini mengimplementasikan pendekatan DDD dengan struktur sebagai berikut:

- **Domain Layer**: Berisi model dan domain service yang merepresentasikan konsep bisnis dan logika bisnis
- **Repository Layer**: Bertanggung jawab untuk akses data dan abstraksi database
- **Application Layer**: Berisi controller dan use case yang mengkoordinasikan alur aplikasi
- **Infrastructure Layer**: Berisi implementasi teknis seperti database, messaging, dan external service

### Microservices

Aplikasi ini terdiri dari beberapa service:

- **API Gateway**: Entry point untuk semua request, mengarahkan request ke service yang sesuai
- **Auth Service**: Menangani autentikasi dan manajemen user
- **Jadwal Service**: Menangani jadwal feeding dan eksekusi feeding
- **Sensor Service**: Menangani data sensor dan monitoring
- **Notification Service**: Menangani notifikasi untuk user

## 🚀 Cara Menjalankan Aplikasi

### Menggunakan Docker Compose

```bash
# Clone repository
git clone https://github.com/username/pisces65.git
cd pisces65

# Jalankan dengan Docker Compose
docker-compose up -d
```

### Tanpa Docker

```bash
# Clone repository
git clone https://github.com/username/pisces65.git
cd pisces65

# Install dependencies untuk shared package
cd shared
npm install
cd ..

# Install dependencies dan jalankan setiap service
cd services/auth-service
npm install
npm run dev

# Lakukan hal yang sama untuk service lainnya
```

## 🔗 API Endpoints

### Notification Service

#### GET `/api/notifications`
Mendapatkan semua notifikasi untuk user tertentu.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "type": "feed_level_low",
    "title": "Peringatan: Level Pakan Rendah",
    "message": "Level pakan Anda saat ini 15%. Segera isi ulang pakan untuk mencegah kegagalan feeding.",
    "status": "unread",
    "priority": "high",
    "data": { "feed_level": 15 },
    "created_at": "2025-05-15T01:30:00Z",
    "updated_at": "2025-05-15T01:30:00Z"
  }
]
```

#### GET `/api/notifications/unread`
Mendapatkan notifikasi yang belum dibaca untuk user tertentu.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "type": "feed_level_low",
    "title": "Peringatan: Level Pakan Rendah",
    "message": "Level pakan Anda saat ini 15%. Segera isi ulang pakan untuk mencegah kegagalan feeding.",
    "status": "unread",
    "priority": "high",
    "data": { "feed_level": 15 },
    "created_at": "2025-05-15T01:30:00Z",
    "updated_at": "2025-05-15T01:30:00Z"
  }
]
```

#### GET `/api/notifications/unread/count`
Mendapatkan jumlah notifikasi yang belum dibaca untuk user tertentu.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 5
}
```

#### PUT `/api/notifications/:id/read`
Menandai notifikasi sebagai sudah dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Notifikasi berhasil ditandai sebagai sudah dibaca",
  "notification": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "read",
    "updated_at": "2025-05-15T01:35:00Z"
  }
}
```

#### PUT `/api/notifications/read-all`
Menandai semua notifikasi user sebagai sudah dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Semua notifikasi berhasil ditandai sebagai sudah dibaca"
}
```

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
