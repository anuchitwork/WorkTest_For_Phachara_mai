FROM node:22

WORKDIR /app

# copy package.json ก่อนเพื่อติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# copy source code ทั้งหมด
COPY . .

# ถ้าใช้ nodemon สำหรับ dev
CMD ["npm", "run", "start"]
