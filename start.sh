#!/bin/sh

pm2-runtime start ecosystem.config.js --env $(echo $CONF_TYPE)

