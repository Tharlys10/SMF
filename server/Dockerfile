FROM node:14 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
COPY ./src/shared/static/default.png ./dist/shared/static/



FROM node:14
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
