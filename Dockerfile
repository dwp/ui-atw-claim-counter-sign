ARG NODE_VERSION
ARG PORT

FROM node:${NODE_VERSION} AS builder
RUN apk --no-cache update && apk upgrade
ARG GITLAB_REGISTRY_TOKEN
ENV PORT=${PORT}
WORKDIR /
COPY . .

RUN npm install && \
    mkdir -p ./static/ && \
    npm run build && \
    npm prune --production

FROM node:${NODE_VERSION}
RUN apk upgrade libssl3 libcrypto3 && apk --no-cache add aws-cli=1.25.97-r0 jq=1.6-r2 curl=8.1.2-r0 && rm -rf /var/cache/apk/*
WORKDIR /
COPY --from=builder app.js .
COPY --from=builder /app/ /app/
COPY --from=builder /config/ /config/
COPY --from=builder /static/ /static/
COPY --from=builder /node_modules/ /node_modules/
COPY --from=builder package.json .
COPY setupEnvAndStartService.sh /setupEnvAndStartService.sh
RUN mkdir -p /certs && chmod -R 755 /certs && chmod +x /setupEnvAndStartService.sh
RUN mkdir /sessions && chown -R node /sessions /static /certs
EXPOSE ${PORT}
CMD ["/setupEnvAndStartService.sh"]
USER node
