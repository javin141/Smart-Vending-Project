FROM node:alpine
LABEL authors="luciuschee"
WORKDIR /build
COPY package.json .

RUN npm install
RUN npm install typescript -g

COPY . .
RUN tsc

FROM node:alpine
WORKDIR app
COPY build .
COPY package.json .
RUN npm install

CMD ["node", "index.js"]
