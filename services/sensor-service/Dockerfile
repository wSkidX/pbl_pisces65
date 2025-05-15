FROM node:14
WORKDIR /app

# Copy package.docker.json (tanpa dependensi shared package)
COPY services/sensor-service/package.docker.json ./package.json

# Install dependencies 
RUN npm install --no-package-lock --omit=optional

# Buat direktori untuk shared package
RUN mkdir -p /app/node_modules/pisces65-shared

# Copy shared package files ke dalam node_modules
COPY shared/index.js /app/node_modules/pisces65-shared/
COPY shared/package.json /app/node_modules/pisces65-shared/
COPY shared/middleware /app/node_modules/pisces65-shared/middleware

# Copy seluruh kode service kecuali package.json (karena sudah diganti)
COPY services/sensor-service/app.js /app/
COPY services/sensor-service/index.js /app/
COPY services/sensor-service/prometheus-setup.js /app/
COPY services/sensor-service/routes /app/routes/
COPY services/sensor-service/controllers /app/controllers/
COPY services/sensor-service/models /app/models/
COPY services/sensor-service/domain /app/domain/
COPY services/sensor-service/repositories /app/repositories/
COPY services/sensor-service/config /app/config/
COPY services/sensor-service/migrations /app/migrations/

# Pastikan file config.js ada untuk Sequelize CLI
COPY services/sensor-service/config/config.js /app/config/

# Buat direktori migrations jika tidak ada
RUN mkdir -p /app/migrations

CMD ["npm", "start"]