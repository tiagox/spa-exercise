FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build-web

EXPOSE 8080

CMD [ "npm", "start" ]
