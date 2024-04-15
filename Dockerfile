FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

USER root
RUN npm install

RUN npm install -g serverless

COPY . .
RUN npm run build

RUN npm cache clean --force

EXPOSE 3000 3001

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["node"]
CMD ["dist/main.js"]