FROM node:20-alpine AS builder
LABEL authors="luciuschee"
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install typescript -g
COPY . .
RUN tsc --outDir ./build/
RUN echo build done

FROM node:alpine AS production
WORKDIR /app
RUN chown node:node .
# non root user
USER node
COPY package.json ./
RUN npm install
COPY --from=builder /app/build build/
EXPOSE 6788:6788
ENTRYPOINT ["node", "build/index.js"]
