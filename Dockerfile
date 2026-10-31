FROM node:18-alpine
WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY public ./public

ENV PORT=3000
EXPOSE 3000

# Run as the non-root user shipped with the node image
USER node
CMD ["node", "src/server.js"]
