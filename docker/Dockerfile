#Production dockerfile that uses nginx to serve the web static web server.

FROM nginx:1.13.8-alpine
MAINTAINER Mxi Technologies


ENV DIST_DIR dist
ENV WEB_DIR /usr/share/nginx/html
ENV HOME /usr/share/nginx
ENV NGINX_DIR /etc/nginx
ENV NGINX_CONFIG docker/nginx.conf

WORKDIR  $WEB_DIR

#Copy the build artifacts in the static web folder
COPY $DIST_DIR $WEB_DIR

#Added custom nginx config file to make Angular HTML5 routing work
COPY $NGINX_CONFIG $NGINX_DIR
