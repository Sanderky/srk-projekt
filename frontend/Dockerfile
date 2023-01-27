FROM node:18-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3030
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf