FROM node:20-alpine AS builder
LABEL authors="luciuschee"
WORKDIR /sv-backend
RUN echo Please ensure that you have the frontend built!
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install typescript -g
COPY . .
RUN tsc --outDir ./build/
#COPY / /frontend
#WORKDIR /frontend
#RUN npm run build
#WORKDIR /sv-backend
RUN echo build done

FROM node:alpine AS production
WORKDIR /app
RUN chown node:node .
# non root user
USER node
COPY package.json ./
RUN npm install
COPY --from=builder /sv-backend/build build/
COPY --from=builder /sv-backend/frontend-build frontend-build/
EXPOSE 6788:6788
ENTRYPOINT ["node", "build/index.js"]
