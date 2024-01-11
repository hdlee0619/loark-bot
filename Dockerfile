# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM node:18-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY package*.json ./
ENV NODE_ENV=production
RUN yarn install --production
CMD ["yarn", "start:prod"]