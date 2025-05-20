FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --no-cache

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "dev", "--", "--host"]
