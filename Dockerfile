FROM keymetrics/pm2:latest-alpine

ARG CONF_TYPE_ARG
ENV CONF_TYPE=$CONF_TYPE_ARG

RUN mkdir /app
RUN mkdir /data
RUN mkdir /data/files
RUN echo "[Setup Software]" \
 && apk update \
 && apk add bash git make gcc g++ python build-base

WORKDIR /app
COPY . /app/LaborX-backend
RUN echo "[Checkout & build the app]" \
 && cd LaborX-backend \
 && git log -1 \
 && yarn --no-lockfile

EXPOSE 3000

WORKDIR /app/LaborX-backend

ENTRYPOINT ["./start.sh"]

