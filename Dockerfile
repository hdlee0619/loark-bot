# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build

# On Docker test stage
FROM node:18-alpine as docker-test-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY package*.json ./
ENV NODE_ENV=development
RUN yarn install --production
CMD ["yarn", "start:dev"]

# Production stage
FROM node:18-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY package*.json ./
ENV NODE_ENV=production
RUN yarn install --production
CMD ["yarn", "start:prod"]