FROM alpine:latest

RUN apk add --update nginx && rm -rf /var/cache/apk/*
#COPY docker/config/nginx.conf /etc/nginx/nginx.conf
#COPY docker/config/vhost.conf /etc/nginx/conf.d/vhost.conf

# forward request and error logs to docker log collector
RUN ln -svf /dev/stdout /var/log/nginx/access.log \
    && ln -svf /dev/stdout /var/log/nginx/error.log

RUN ip -4 route list match 0/0 | awk '{print $3 "host.docker.internal"}' >> /etc/hosts

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
