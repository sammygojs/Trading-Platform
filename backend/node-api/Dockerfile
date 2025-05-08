FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the app (including index.js)
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 5003

# Start the app
CMD ["node", "index.js"]
