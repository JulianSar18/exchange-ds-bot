FROM node:16.6 
FROM mcr.microsoft.com/playwright:focal
WORKDIR /TRM
COPY package*.json ./
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev
RUN npm install 
COPY . .
CMD npm run start