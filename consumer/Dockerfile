FROM denoland/deno:alpine-1.42.2

EXPOSE 7778

WORKDIR /app

COPY . .

CMD [ "run", "--unstable", "--watch", "--allow-net", "app.js" ]