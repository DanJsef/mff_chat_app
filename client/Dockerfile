FROM docker.io/library/node:14.17.4-alpine3.14 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base as build
COPY public public/
COPY src src/
RUN npm run build --production

FROM docker.io/library/nginx:1.21.1-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
