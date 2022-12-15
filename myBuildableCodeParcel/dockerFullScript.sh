#!/usr/bin/bash

APP_TAG="parcel-visualizer-bp"

echo "$(tput setaf 3)[BASH]$(tput init) Building the Docker image (with a \"$APP_TAG\" tag"
docker build -t $APP_TAG .

echo "$(tput setaf 3)[BASH]$(tput init) Running the Docker image (with a \"$APP_TAG\" tag"
docker run -p 80:80 -p 1234:1234 $APP_TAG

