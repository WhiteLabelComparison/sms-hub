FROM node:7.9-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

EXPOSE 7890
CMD [ "npm", "start" ]
