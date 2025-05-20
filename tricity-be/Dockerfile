FROM node:20-alpine

WORKDIR /app

RUN npm install -g ts-node nodemon

COPY package*.json ./

RUN npm install --no-cache

COPY . .

EXPOSE ${PORT}

CMD ["nodemon", "--watch", "src", "--ext", "ts", "--exec", "ts-node", "src/index.ts"]
