FROM node:18

WORKDIR /src/server

COPY packge*.json ./

RUN npm i

COPY ./src .

ENV PORT=8181

EXPOSE 8181

CMD [ "npm", "start" ]