FROM node:18-alpine

WORKDIR /app

# Copy package.docker.json (tanpa dependensi shared package)
COPY services/notification-service/package.docker.json ./package.json

# Install dependencies 
RUN npm install --no-package-lock --omit=optional

# Buat direktori untuk shared package
RUN mkdir -p /app/node_modules/pisces65-shared

# Copy shared package files ke dalam node_modules
COPY shared/index.js /app/node_modules/pisces65-shared/
COPY shared/package.json /app/node_modules/pisces65-shared/
COPY shared/middleware /app/node_modules/pisces65-shared/middleware

# Copy seluruh kode service kecuali package.json (karena sudah diganti)
COPY services/notification-service/app.js /app/
COPY services/notification-service/index.js /app/
COPY services/notification-service/routes /app/routes/
COPY services/notification-service/controllers /app/controllers/
COPY services/notification-service/models /app/models/
COPY services/notification-service/domain /app/domain/
COPY services/notification-service/repositories /app/repositories/
COPY services/notification-service/config /app/config/
COPY services/notification-service/migrations /app/migrations/

# Pastikan file config.js ada untuk Sequelize CLI
COPY services/notification-service/config/config.js /app/config/
COPY services/notification-service/config/config.json /app/config/

# Buat direktori migrations jika tidak ada
RUN mkdir -p /app/migrations

EXPOSE 3003

CMD ["npm", "start"]
