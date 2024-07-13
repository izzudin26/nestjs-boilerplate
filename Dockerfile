FROM node:alpine3.19

WORKDIR /app

COPY package*.json .
RUN npm install

ENV DB_NAME "postgres"
ENV DB_PASSWORD "postgres"
ENV DB_USERNAME "postgres"
ENV DB_HOST "localhost"
ENV DB_PORT "5432"

ENV PORT 3000
ENV NODE_ENV "dev"
COPY . .
RUN npm run build

CMD ["npm", "start"]