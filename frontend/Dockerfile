FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ใช้คำสั่ง dev server ของ React/Vue
CMD ["npm", "run", "dev"]
