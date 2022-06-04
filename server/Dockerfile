FROM docker.io/library/node:14.17.4-alpine3.14 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run dev

FROM base as build
COPY src src/
RUN npm run build

EXPOSE 3001 
CMD npm run start
