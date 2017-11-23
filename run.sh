#!/bin/bash
PROJECT_NAME=$(basename $(pwd))
DOCKER_DIR=docker/dev
clear
echo
echo "PROJECT -> " $PROJECT_NAME
echo
echo "Choose an option:"
echo
echo "1.- [Run DEVELOPMENT environment]"
echo "2.- [Run TESTS]"
echo "3.- [Run PRODUCTION environment (not yet)]"
echo
echo "4.- [Build IMAGE]"
echo "5.- [Run CONTAINER]"
echo "[x] [Exit]"

read -n 2 OPTION
echo

if [[ $OPTION = "1" ]] ;then
  clear
  echo "Running DEVELOPMENT..."
  echo ""
  cd $DOCKER_DIR
  docker-compose run --service-ports --rm web
  cd ../../
elif [[ $OPTION = "2" ]] ;then
  clear
  echo "Running TESTS..."
  cd $DOCKER_DIR/test/
  docker-compose run --service-ports --rm web
  cd ../../
elif [[ $OPTION = "3" ]] ;then
  clear
  echo "Running PRODUCTION..."
  #cd $DOCKER_DIR/prod/
  #docker-compose run --service-ports --rm web
  #cd ../../
  docker run -it -u $UID -v $(pwd):$(pwd) -p 4200:4200 --rm $PROJECT_NAME-dev /bin/bash -c 'npm install --quiet && npm run ng serve'
elif [[ $OPTION = "4" ]] ;then
  clear
  echo "Building IMAGE..."
  #cd $DOCKER_DIR
  #docker-compose build
  #cd ..
  docker build -f docker/Dockerfile -t $PROJECT_NAME-prod --build-arg ACTION=build .
elif [[ $OPTION = "5" ]] ;then
  clear
  echo "Running CONTAINER..."
  cd $DOCKER_DIR/run
  docker-compose run --service-ports --rm web
  cd ../../
else
  clear
  echo "Bye."
fi
