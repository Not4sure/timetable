FROM node:17-alpine AS build

WORKDIR /usr/src

COPY package.json  ./
RUN yarn install
COPY ./src/ src/

COPY tsconfig.json babel.config.json ./

RUN yarn build
RUN ls dist/

FROM BUILD

WORKDIR /usr/src

COPY --from=build /usr/src/dist/ dist/

ENTRYPOINT node ./dist/index.js