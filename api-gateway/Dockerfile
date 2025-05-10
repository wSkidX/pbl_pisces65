# Gunakan image Node.js sebagai base image
FROM node:14

# Set working directory
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Ekspose port yang digunakan oleh API Gateway
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
