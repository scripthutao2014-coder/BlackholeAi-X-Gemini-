# Menggunakan Node.js versi 20
FROM node:20-slim

WORKDIR /app

# Salin package.json dan install dependensi
COPY package*.json ./
RUN npm install

# Salin seluruh kode project
COPY . .

# Build frontend React
RUN npm run build

# Beritahu port yang digunakan Hugging Face (default: 7860)
ENV PORT=7860
EXPOSE 7860

# Jalankan aplikasi menggunakan build server yang sudah ada
CMD ["npm", "start"]
