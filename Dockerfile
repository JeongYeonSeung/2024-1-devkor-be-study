FROM node:18-alpine As build

WORKDIR /app

ADD . /app/

RUN npm install

RUN npm run build

EXPOSE 3000

ENTRYPOINT npm run start:prod