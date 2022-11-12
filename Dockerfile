FROM node:lts-alpine3.16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run swagger-autogen

EXPOSE 5000

CMD [ "npm", "run", "start" ]
