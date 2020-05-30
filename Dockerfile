FROM hayd/alpine-deno:1.0.2

WORKDIR /app
USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .
RUN deno cache mod.ts
