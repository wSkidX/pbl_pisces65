FROM node:14
WORKDIR /app

# Copy package.docker.json (tanpa dependensi shared package)
COPY services/jadwal-service/package.docker.json ./package.json

# Install dependencies 
RUN npm install --no-package-lock --omit=optional

# Buat direktori untuk shared package
RUN mkdir -p /app/node_modules/pisces65-shared

# Copy shared package files ke dalam node_modules
COPY shared/index.js /app/node_modules/pisces65-shared/
COPY shared/package.json /app/node_modules/pisces65-shared/
COPY shared/middleware /app/node_modules/pisces65-shared/middleware

# Copy seluruh kode service kecuali package.json (karena sudah diganti)
COPY services/jadwal-service/app.js /app/
COPY services/jadwal-service/index.js /app/
COPY services/jadwal-service/routes /app/routes/
COPY services/jadwal-service/controllers /app/controllers/
COPY services/jadwal-service/models /app/models/
COPY services/jadwal-service/domain /app/domain/
COPY services/jadwal-service/repositories /app/repositories/
COPY services/jadwal-service/config /app/config/
COPY services/jadwal-service/migrations /app/migrations/

# Buat file prometheus-setup.js langsung di container
RUN echo 'const promClient = require("prom-client");\nconst register = new promClient.Registry();\npromClient.collectDefaultMetrics({ register });\nmodule.exports = register;' > /app/prometheus-setup.js

# Pastikan file config.js ada untuk Sequelize CLI
COPY services/jadwal-service/config/config.js /app/config/

# Buat direktori migrations jika tidak ada
RUN mkdir -p /app/migrations

CMD ["npm", "start"]
