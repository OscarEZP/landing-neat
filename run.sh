#!/bin/bash
PROJECT_NAME=$(basename $(pwd))
DOCKER_DEV_DIR=docker/dev

clear
cd $DOCKER_DEV_DIR

# Options
echo
echo "PROJECT -> " $PROJECT_NAME
echo
echo "Choose an option:"
echo
echo "1.- [Run DEVELOPMENT environment]"
echo "2.- [Run TESTS]"
echo "3.- [Run PRODUCTION environment]"
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
  docker-compose down
  docker-compose run --service-ports --rm web
elif [[ $OPTION = "2" ]] ;then
  clear
  echo "Running TESTS..."
  docker-compose down
  docker-compose run --service-ports --rm test
elif [[ $OPTION = "3" ]] ;then
  clear
  echo "Running PRODUCTION..."
# docker-compose down
# docker-compose run --service-ports --rm prod
# docker run -it -u $UID -v $(pwd):$(pwd) -p 4200:4200 --rm $PROJECT_NAME-dev /bin/bash -c 'npm install --quiet && npm run ng build'
elif [[ $OPTION = "4" ]] ;then
  clear
  echo "Building IMAGE..."
  docker-compose build
elif [[ $OPTION = "5" ]] ;then
  clear
  echo "Running CONTAINER..."
  docker build -t moc-web-interactive ./
  docker run -v $(pwd)/../../:/var/www/html/ -it moc-web-interactive /bin/bash
else
  clear
  echo "Bye."
fi
cd ../../
