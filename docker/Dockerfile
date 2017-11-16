#Production dockerfile that uses nginx to serve the ms-web static web server.

FROM nginx:1.10-alpine
MAINTAINER Mxi Technologies

#ARG ACTION
#ENV ACTION $ACTION

ENV DIST_DIR dist
ENV WEB_DIR /usr/share/nginx/html
ENV HOME /usr/share/nginx
ENV NGINX_DIR /etc/nginx
ENV NGINX_CONFIG docker/nginx.conf

WORKDIR  $WEB_DIR

VOLUME $HOME
WORKDIR $HOME

#add user without password enabling
#RUN adduser --disabled-password --gecos '' $USER_NAME

#assign privilage for the docker user to modified the repo dir
#RUN chown -R $USER_NAME:$USER_NAME $HOME

#Default execution of chained commands:
# 1) Install the dependencies
# 2) Execute the development server
#CMD (cd project && \
#    npm install --quiet && \
#    npm run $ACTION)

#Copy the build artifacts in the static web folder
#COPY $DIST_DIR $WEB_DIR

#Added custom nginx config file to make Angular HTML5 routing work
#COPY $NGINX_CONFIG $NGINX_DIR
