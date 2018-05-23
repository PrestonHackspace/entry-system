FROM node:carbon

RUN apt update && apt install tmux

WORKDIR /opt/entry-system
COPY docker/dev/start.sh .

WORKDIR /opt/entry-system/client
COPY client .
COPY common/src src/common
RUN yarn

WORKDIR /opt/entry-system/server
COPY server .
COPY common/src src/common
RUN yarn

WORKDIR /opt/entry-system

EXPOSE 8084
CMD [ "bash", "start.sh" ]
