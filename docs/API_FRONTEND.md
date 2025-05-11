# Dokumentasi Penggunaan API untuk Frontend

## Autentikasi (Auth Service)
### Register
- **Endpoint:** `POST /auth/register`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - 201: `{ message, userId }`
  - 400: `{ error }`

### Login
- **Endpoint:** `POST /auth/login`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - 200: `{ message, token }`
  - 401: `{ error }`

## Jadwal (Jadwal Service)
### Tambah Jadwal
- **Endpoint:** `POST /jadwal/add`
- **Body:**
  ```json
  {
    "waktu": "HH:mm:ss",
    "keterangan": "string"
  }
  ```
- **Response:**
  - 201: `{ message, jadwalId }`

### Lihat Semua Jadwal
- **Endpoint:** `GET /jadwal/get`
- **Response:**
  - 200: `[ { id, waktu, keterangan }, ... ]`

### Update Jadwal
- **Endpoint:** `PUT /jadwal/update/:id`
- **Body:**
  ```json
  {
    "waktu": "HH:mm:ss",
    "keterangan": "string"
  }
  ```

### Hapus Jadwal
- **Endpoint:** `DELETE /jadwal/delete/:id`

## Sensor (Sensor Service)
### Kirim Data Sensor
- **Endpoint:** `POST /sensor/data`
- **Body:**
  ```json
  {
    "type": "ultrasonik|ph|suhu|...",
    "value": <angka>
  }
  ```

## 📚 Dokumentasi Endpoint Frontend

### Auth
- **Login:** `POST /auth/login` { email, password }
- **Logout:** `POST /auth/logout`
- **Register:** `POST /auth/register` { email, password, nama, nohp, alamat }

### Jadwal
- **Lihat Semua Jadwal:** `GET /jadwal`
- **Tambah Jadwal:** `POST /jadwal` { waktu_tanggal, waktu_jam }
- **Update Jadwal:** `PUT /jadwal/:id` { waktu_tanggal, waktu_jam }
- **Hapus Jadwal:** `DELETE /jadwal/:id`

### Sensor
- **Lihat Semua Data Sensor:** `GET /sensor/data`
- **Lihat Data Sensor by ID:** `GET /sensor/data/:id`
- **Tambah Data Sensor:** `POST /sensor/data` { jumlahPakanKering, jumlahAir, mode, waktu_pakan }
- **Update Data Sensor:** `PUT /sensor/data/:id` { jumlahPakanKering, jumlahAir, mode, waktu_pakan }
- **Hapus Data Sensor:** `DELETE /sensor/data/:id`

---

## Contoh Penggunaan di Frontend (JavaScript/Fetch)

```js
// Login
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'testuser@mail.com', password: 'pass' })
})
  .then(res => res.json())
  .then(data => console.log('Login:', data));

// Register
fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'testuser@mail.com',
    password: 'pass',
    nama: 'Test User',
    nohp: '08123456789',
    alamat: 'Jl. Contoh No. 1'
  })
})
  .then(res => res.json())
  .then(data => console.log('Register:', data));

// Logout
fetch('/auth/logout', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('Logout:', data));

// Ambil semua jadwal
fetch('/jadwal')
  .then(res => res.json())
  .then(data => console.log('Jadwal:', data));

// Tambah jadwal
fetch('/jadwal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ waktu_tanggal: '2025-05-12', waktu_jam: '10:00:00' })
})
  .then(res => res.json())
  .then(data => console.log('Tambah Jadwal:', data));

// Ambil semua data sensor
fetch('/sensor/data')
  .then(res => res.json())
  .then(data => console.log('Sensor:', data));

// Tambah data sensor
fetch('/sensor/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jumlahPakanKering: 123.45, jumlahAir: 10, mode: 'manual' })
})
  .then(res => res.json())
  .then(data => console.log('Tambah Sensor:', data));
```

---

**Catatan:**
- Semua endpoint diasumsikan sudah behind API Gateway dan session/cookie sudah otomatis di-handle browser.
- Untuk update/hapus, tinggal ganti method dan tambahkan ID di URL.
  .then(data => console.log(data));
```
