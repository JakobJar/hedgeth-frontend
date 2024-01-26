FROM node:lts

RUN mkdir /app
WORKDIR /app

COPY package.json tsconfig.json nuxt.config.ts /app/
COPY app.vue /app/
COPY ./server/ /app/server/
COPY ./public/ /app/public/
COPY ./prisma/ /app/prisma/
COPY ./plugins/ /app/plugins/
COPY ./pages/ /app/pages/
COPY ./layouts/ /app/layouts/
COPY ./composables/ /app/composables/
COPY ./components/ /app/components/
COPY ./assets/ /app/assets/

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
