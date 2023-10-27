FROM node:16.19.0-alpine as nodemodule
WORKDIR /app
COPY package.json ./package.json
RUN npm install

FROM node:16.19.0-alpine as builder
WORKDIR /app
COPY . .
COPY --from=nodemodule /app/node_modules ./node_modules
RUN npm run build

FROM node:16.19.0-alpine as runner
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/nest-cli.json ./nest-cli.json
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/run-container.sh ./run-container.sh
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json

COPY --from=nodemodule /app/node_modules ./node_modules

EXPOSE 3000

CMD ["/bin/sh", "run-container.sh"]
