#!/bin/bash
PROJECT_NAME=$(basename $(pwd))
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
  cd env
  docker-compose run --service-ports --rm web
  cd ..
elif [[ $OPTION = "2" ]] ;then
  clear
  echo "Running TESTS..."
  cd env/test/
  docker-compose run --service-ports --rm web
  cd ../../
elif [[ $OPTION = "3" ]] ;then
  clear
  echo "Running PRODUCTION... soon"
  cd env/prod/
  docker-compose run --service-ports --rm web
  cd ../../
elif [[ $OPTION = "4" ]] ;then
  clear
  echo "Building IMAGE..."
  cd env
  docker-compose build
  cd ..
elif [[ $OPTION = "5" ]] ;then
  clear
  echo "Running CONTAINER..."
  cd env/run
  docker-compose run --service-ports --rm web
  cd ../../
else
  clear
  echo "Bye."
fi
