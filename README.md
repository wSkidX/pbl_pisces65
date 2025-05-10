# Pisces65 IoT Feeder 🐟🚀

Sistem IoT feeder otomatis untuk akuakultur, berbasis arsitektur microservices dengan Node.js, Express, Sequelize, dan Docker Compose. Dirancang untuk pengembang indie yang ingin solusi modular, scalable, dan mudah di-deploy!

---

## ✨ Fitur Utama
- **Autentikasi & Manajemen User** (Session, Cookie, Bcrypt)
- **CRUD Jadwal Pemberian Pakan & Air**
- **Manajemen Data Sensor**
- **API Gateway & Monitoring (Grafana, Prometheus)**
- **Dockerized, Hot Reload, dan Mudah Dikembangkan**

---

## 🗂️ Struktur Direktori
```
services/
  ├── auth-service/
  ├── jadwal-service/
  └── sensor-service/
```

---

## ⚡ Instalasi Cepat

1. **Clone repo**
   ```bash
   git clone https://github.com/wSkidX/pbl_pisces65.git
   cd pbl_pisces65
   ```
2. **Edit file `.env`** (opsional, default sudah aman)
   ```env
   MYSQL_ALLOW_EMPTY_PASSWORD=yes
   MYSQL_DATABASE=db_authService
   DB_HOST=mysql
   DB_PORT=3306
   DB_NAME=db_authService
   DB_USER=root
   DB_PASSWORD=
   JWT_SECRET=your_jwt_secret
   ```
3. **Jalankan semua service**
   ```bash
   docker-compose up --build
   ```
4. **Akses API Gateway**
   - http://localhost:8080

---

## 🧩 Service & API Endpoint

### 1. Auth Service (`/auth-service`)
| Method | Endpoint   | Deskripsi           |
|--------|------------|---------------------|
| POST   | /register  | Register user       |
| POST   | /login     | Login user, session |
| POST   | /logout    | Logout session      |
| GET    | /          | List user           |
| GET    | /:id       | Get user by id      |
| PUT    | /:id       | Update user         |
| DELETE | /:id       | Delete user         |

### 2. Jadwal Service (`/jadwal-service`)
| Method | Endpoint         | Deskripsi           |
|--------|------------------|---------------------|
| POST   | /jadwals         | Tambah jadwal       |
| GET    | /jadwals         | List semua jadwal   |
| GET    | /jadwals/:id     | Detail jadwal       |
| PUT    | /jadwals/:id     | Update jadwal       |
| DELETE | /jadwals/:id     | Hapus jadwal        |

### 3. Sensor Service (`/sensor-service`)
| Method | Endpoint     | Deskripsi             |
|--------|--------------|-----------------------|
| POST   | /data        | Tambah data sensor    |
| GET    | /data        | List data sensor      |
| GET    | /data/:id    | Detail data sensor    |
| PUT    | /data/:id    | Update data sensor    |
| DELETE | /data/:id    | Hapus data sensor     |

---

## ⚙️ Konfigurasi Environment
- Semua konfigurasi env bisa diatur di `.env` atau langsung di `docker-compose.yml`.
- Default: MySQL root tanpa password (`MYSQL_ALLOW_EMPTY_PASSWORD=yes`)

---

## 🐳 Perintah Docker Compose
- Jalankan semua service:
  ```bash
  docker-compose up --build
  ```
- Stop & hapus container + network:
  ```bash
  docker-compose down -v
  ```
- Cek log:
  ```bash
  docker-compose logs -f
  ```

---

## 🛡️ Security & Session
- Login menggunakan session cookie (`express-session`, `cookie-parser`)
- Password di-hash dengan bcrypt
- Semua endpoint sensitif hanya bisa diakses jika sudah login

---

## 🗄️ Database
- Migrasi otomatis dijalankan saat container start
- Skema utama:
  - **Users**: userid, email, password, nama, nohp, alamat
  - **Jadwal**: idjadwal, waktu_tanggal, waktu_jam, status
  - **SensorData**: id, jumlahPakanKering, jumlahAir

---

## 🚑 Troubleshooting
- **Access denied for user 'root'...**
  - Pastikan password MySQL kosong di `.env` & `docker-compose.yml`
  - Restart dengan `docker-compose down -v && docker-compose up --build`
- **Error module not found**
  - Pastikan semua file/folder sudah sesuai struktur di atas
- **Migrate gagal**
  - Cek env DB_NAME, DB_USER, DB_PASSWORD sudah konsisten

---

## Lisensi
MIT
