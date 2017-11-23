#############################################################
# Based on Ubuntu 16.04
#############################################################

# Image
FROM ubuntu:16.04

# Updating repositories
RUN apt-get update

# Downloading apps
RUN apt-get -y install sudo
RUN sudo apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN sudo apt-get -y install -y nodejs
RUN sudo apt-get -y install -y build-essential
RUN sudo apt-get -y install -y libfontconfig
RUN sudo npm install -g @angular/cli

# Moving to Project directory
WORKDIR '/var/www/html/'
