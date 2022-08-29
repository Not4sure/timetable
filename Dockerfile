FROM node:17-alpine as back-build

WORKDIR /app

COPY package.json  ./
RUN yarn install
COPY ./src/ src/

COPY tsconfig.json babel.config.json ./

RUN yarn build

FROM node:16-alpine as front-build

WORKDIR /app
COPY ./AIRTimeTable /app
RUN yarn
RUN yarn build

FROM node:17-alpine

WORKDIR /app
COPY package.json package.json
RUN yarn install --production=true
COPY --from=back-build /app/dist dist
COPY --from=front-build /app/dist/AIRTimeTable public

ENTRYPOINT node ./dist/index.js