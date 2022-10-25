FROM node:16.17-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add --no-cache git
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

RUN yarn

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["npx", "serve", "-s", "build"]
