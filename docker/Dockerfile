###
# Development environment for the ms-web web application (Static portion)
###
FROM node:7.4.0
MAINTAINER Mxi Technologies

#SSH key to use with NPM (provided as build-arg when building locally)
ARG SSH_KEY

#UID and HOME mapping to use when creating the development user.
#It must be provided as an argument when building the image. This makes development and
#file mapping between host and container way easier.

ARG DEV_HOME

ENV HOME $DEV_HOME
ENV SSH_KEY_DIR /ssh
ENV USER_NAME ms-web

RUN mkdir -p $HOME && \
    mkdir -p $SSH_KEY_DIR

#add user without password enabling
RUN adduser --disabled-password --gecos '' $USER_NAME

#If we provided and ssh key (local dev), output the content to a local file, enable it and disable prompting
#for bitbucket host validation
#Location to mount the source code (src) root (from the host)

VOLUME $HOME
WORKDIR $HOME

#Kendo registry & credentials
#COPY .npmrc $HOME
#assign privilage for the docker user to modified the repo dir
RUN chown -R $USER_NAME:$USER_NAME $SSH_KEY_DIR
RUN chown -R $USER_NAME:$USER_NAME $HOME

#In progress as user $USER_NAME
USER $USER_NAME

# #Default execution of chained commands:
# # 1) Install the dependencies
# # 2) Execute the development server
CMD (cd ./project && \ npm install --quiet -g @angular/cli && \
        ng serve -o --host 0.0.0.0 --port 4200)
