FROM node:17-alpine

WORKDIR /usr/src

COPY package.json  ./
RUN yarn install --production
COPY ./src/ src/

COPY tsconfig.json babel.config.json ./

RUN yarn build

ENTRYPOINT node ./dist/index.js