ARG NODE_VERSION
ARG PORT

FROM node:22-alpine@sha256:1b2479dd35a99687d6638f5976fd235e26c5b37e8122f786fcd5fe231d63de5b AS builder
RUN apk --no-cache update && apk upgrade
ARG GITLAB_REGISTRY_TOKEN
ENV PORT=${PORT}
WORKDIR /
COPY . .

RUN npm install && \
    mkdir -p ./static/ && \
    npm run build && \
    npm prune --production

FROM node:22-alpine@sha256:1b2479dd35a99687d6638f5976fd235e26c5b37e8122f786fcd5fe231d63de5b

# renovate: datasource=repology depName=alpine_3_22/aws-cli versioning=loose
ENV AWSCLI_VERSION=2.27.25-r0
# renovate: datasource=repology depName=alpine_3_22/jq versioning=loose
ENV JQ_VERSION=1.8.0-r0
# renovate: datasource=repology depName=alpine_3_22/curl versioning=loose
ENV CURL_VERSION=8.14.1-r1

RUN apk upgrade libssl3 libcrypto3 &&  \
    apk --no-cache add aws-cli=${AWSCLI_VERSION} curl=${CURL_VERSION} jq=${JQ_VERSION} \
    && rm -rf /var/cache/apk/*
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

COPY --from=eyq18885.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

CMD ["/setupEnvAndStartService.sh"]
USER node
