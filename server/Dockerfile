FROM node:20-alpine
RUN apk add --update yarn
RUN mkdir /app
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN yarn global add typescript 
RUN yarn add sharp --ignore-engines
COPY . .
CMD ["yarn", "run", "start"]
EXPOSE 9999
