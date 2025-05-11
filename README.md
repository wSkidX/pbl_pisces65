# Pisces65 IoT Feeder 🐟🚀

# IoT Feeder Otomatis Akuakultur

Sistem feeder otomatis berbasis microservices untuk akuakultur. Modular, scalable, dan gampang di-deploy untuk pengembang indie.

---

## 🚀 Fitur Utama
- **Autentikasi User** (session/cookie, bcrypt)
- **CRUD Jadwal Pakan & Air** (otomatis/manual)
- **Manajemen & Logging Data Sensor** (pakan, air, dsb)
- **API Gateway** (routing, proteksi)
- **Monitoring** (Grafana, Prometheus)
- **Docker Compose, Hot Reload**

---

## ⚙️ Teknologi
- Node.js, Express, Sequelize (MySQL)
- Docker Compose
- Grafana, Prometheus
- MQTT/Mosquitto (opsional, untuk sensor/ESP32)

---

## 🔥 Cara Jalankan
1. **Clone repo & install dependencies**
   ```sh
   git clone <repo-url>
   cd PBL
   npm install
   ```
2. **Copy env contoh & edit sesuai kebutuhan**
   ```sh
   cp .env.example .env
   # edit DB, SESSION_SECRET, dsb
   ```
3. **Jalankan semua service**
   ```sh
   docker-compose up --build
   # atau npm run dev di masing-masing service (tanpa docker)
   ```
4. **Akses API** via Postman/frontend, atau lihat monitoring di Grafana.

---

## 🏗️ Arsitektur Microservices

![Arsitektur Mikroservice](docs/arsitektur-mikroservice.png)

- **auth-service:** login, register, session
- **jadwal-service:** CRUD jadwal pakan/air
- **sensor-service:** logging data sensor
- **api-gateway:** entry point, proteksi route
- **grafana/prometheus:** monitoring

---

## 📖 Dokumentasi API
Lihat file `docs/API_ESP32.md` atau dokumentasi Postman di repo ini.

---

## 🙌 Kontribusi
Pull request & issue welcome! Project ini open buat belajar & pengembangan lebih lanjut.

---

## Lisensi
MIT

flowchart TD
    subgraph User
      FE[Frontend ]
    end
    FE --> GW(API_Gateway)
    GW --> AUTH(Auth_Service)
    GW --> JADWAL(Jadwal_Service)
    GW --> SENSOR(Sensor_Service)
    AUTH --> DB1[(Database User)]
    JADWAL --> DB2[(Database Jadwal)]
    SENSOR --> DB3[(Database Sensor)]
    ESP32[ESP32/IoT Device] -- Kirim Data Sensor --> GW
    Prometheus -.-> GW
    Prometheus -.-> AUTH
    Prometheus -.-> JADWAL
    Prometheus -.-> SENSOR
    Grafana -.-> Prometheus
```

</details>

> Diagram di atas dapat dilihat langsung di editor markdown yang support Mermaid (misal: VSCode + plugin Markdown Preview Mermaid, GitHub, dll).

> Ganti gambar `docs/arsitektur-mikroservice.png` dengan diagram arsitektur asli jika ingin tampilan visual yang lebih baik.


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

### 📡 API Gateway Endpoint (Akses dari luar)
Semua endpoint service dapat diakses melalui API Gateway dengan path yang lebih singkat:

#### Auth
| Method | Endpoint         | Deskripsi           |
|--------|------------------|---------------------|
| POST   | /auth/register   | Register user       |
| POST   | /auth/login      | Login user, session |
| POST   | /auth/logout     | Logout session      |
| GET    | /auth/users      | List user           |
| GET    | /auth/users/:id  | Get user by id      |
| PUT    | /auth/users/:id  | Update user         |
| DELETE | /auth/users/:id  | Delete user         |

#### Jadwal
| Method | Endpoint               | Deskripsi           |
|--------|------------------------|---------------------|
| POST   | /jadwal/add            | Tambah jadwal       |
| GET    | /jadwal/get            | List semua jadwal   |
| GET    | /jadwal/get/:id        | Detail jadwal       |
| PUT    | /jadwal/update/:id     | Update jadwal       |
| DELETE | /jadwal/delete/:id     | Hapus jadwal        |

#### Sensor
| Method | Endpoint         | Deskripsi             |
|--------|------------------|-----------------------|
| POST   | /sensor          | Tambah data sensor    |
| GET    | /sensor          | List data sensor      |
| GET    | /sensor/:id      | Detail data sensor    |
| PUT    | /sensor/:id      | Update data sensor    |
| DELETE | /sensor/:id      | Hapus data sensor     |


---

## 🚦 Testing Otomatis Microservices (Tanpa MySQL)

- Semua service sudah support testing tanpa MySQL, cukup dengan SQLite in-memory.
- Jalankan semua test sekaligus dengan:
  ```powershell
  .\test-all.ps1
  ```
- Atau test per service:
  ```powershell
  $env:NODE_ENV="test"; npm test
  ```
- Test akan otomatis menggunakan SQLite dan tidak membutuhkan koneksi MySQL.

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
