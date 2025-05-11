# Dokumentasi Penggunaan API untuk ESP32

ESP32 dapat berkomunikasi dengan API Gateway menggunakan HTTP (REST API). Berikut adalah panduan dan contoh kode dasar untuk mengirim dan mengambil data.

## 1. Kirim Data Sensor ke Server
- **Endpoint:** `POST /sensor/data`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "type": "ultrasonik",
    "value": 123.45
  }
  ```

### Contoh Kode (Arduino ESP32 + WiFiClient)
```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "NAMA_WIFI";
const char* password = "PASSWORD_WIFI";
const char* serverName = "http://<IP_GATEWAY>:8080/sensor/data";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    String httpRequestData = "{\"type\":\"ultrasonik\",\"value\":123.45}";
    int httpResponseCode = http.POST(httpRequestData);
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
    http.end();
  }
  delay(60000); // Kirim data tiap 1 menit
}
```

## 2. Ambil Jadwal dari Server
- **Endpoint:** `GET /jadwal/get`

### Contoh Kode (ESP32 HTTPClient)
```cpp
// ...setup WiFi seperti di atas...

void getJadwal() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://<IP_GATEWAY>:8080/jadwal/get");
    int httpResponseCode = http.GET();
    String payload = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(payload);
    http.end();
  }
}
```

## Tips
- Ganti `<IP_GATEWAY>` dengan IP server API Gateway Anda.
- Pastikan port dan endpoint sesuai dengan konfigurasi API Gateway.
- Gunakan delay atau mekanisme interval agar tidak membanjiri server dengan request.
