# Dockerfile
FROM node:12

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
