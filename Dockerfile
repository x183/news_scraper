FROM node:alpine3.16

WORKDIR /app
COPY . .
RUN npm i

CMD ["npm", "start"]
