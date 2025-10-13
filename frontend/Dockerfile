# FROM node:22

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# # ใช้คำสั่ง dev server ของ React/Vue
# CMD ["npm", "run", "dev"]



FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js
RUN npm run build

# Expose port ที่ Render assign
EXPOSE 3000

# Start server production
CMD ["npm", "run", "start"]
