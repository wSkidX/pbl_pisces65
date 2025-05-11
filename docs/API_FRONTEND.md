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

### Lihat Semua Data Sensor
- **Endpoint:** `GET /sensor/data`

### Lihat Data Sensor by ID
- **Endpoint:** `GET /sensor/data/:id`


## Contoh Penggunaan di Frontend (JavaScript/Fetch)
```js
// Login
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Ambil jadwal
fetch('/jadwal/get')
  .then(res => res.json())
  .then(data => console.log(data));
```
