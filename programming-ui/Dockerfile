FROM node:lts-alpine3.17

EXPOSE 3000

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install --force 
#Im forcing the install for the svelte-confetti. If there are any potential bugs, I will revert back and not use the confetti

COPY . .

CMD [ "astro", "dev" ]