#!/bin/bash
PROJECT_NAME=$(basename $(pwd))
DOCKER_DIR=docker
DEV_DIR=dev
SONAR_DIR=sonar

clear
# Options
echo
echo "PROJECT -> " $PROJECT_NAME
echo
echo "Choose an option:"
echo
echo "1.- [Run DEVELOPMENT(STAGING) environment]"
echo "2.- [Run TESTS]"
echo "3.- [Run SONAR]"
echo "4.- [Run DEVELOPMENT(LOCAL) environment]"
echo
echo "5.- [Build IMAGE]"
echo "6.- [Run CONTAINER]"
echo "[x] [Exit]"

read -n 2 OPTION
echo

if [[ $OPTION = "1" ]] ;then
  clear
  cd $DOCKER_DIR/$DEV_DIR
  echo "Running DEVELOPMENT(STAGING)..."
  echo ""
  docker-compose down
  docker-compose run --service-ports --rm web
  cd ../../
elif [[ $OPTION = "2" ]] ;then
  clear
  cd $DOCKER_DIR/$DEV_DIR
  echo "Running TESTS..."
  docker-compose down
  docker-compose run --service-ports --rm test
  cd ../../
elif [[ $OPTION = "3" ]] ;then
  clear
  cd $DOCKER_DIR/$SONAR_DIR
  echo "Running SONAR..."
  docker-compose down
  docker-compose up
  sonnar-scanner
  cd ../../
elif [[ $OPTION = "4" ]] ;then
  clear
  cd $DOCKER_DIR/$DEV_DIR
  echo "Running DEVELOPMENT(LOCAL)..."
  docker-compose down
  docker-compose run --service-ports --rm local
  cd ../../
elif [[ $OPTION = "5" ]] ;then
  clear
  cd $DOCKER_DIR/$DEV_DIR
  echo "Building IMAGE..."
  docker-compose build
  cd ../../
elif [[ $OPTION = "6" ]] ;then
  clear
  echo "Running CONTAINER..."
  docker build -t moc-web-interactive ./$DOCKER_DIR/$DEV_DIR/
  docker run -v $(pwd):/var/www/html/ -it moc-web-interactive /bin/bash
else
  clear
  echo "Bye."
fi