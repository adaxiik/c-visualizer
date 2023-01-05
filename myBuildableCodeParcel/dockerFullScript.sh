#!/usr/bin/bash

APP_TAG="parcel-visualizer-bp"

buildDockerImage() {
    echo "$(tput setaf 3)[BASH]$(tput init) Building the Docker image (with a \"$APP_TAG\" tag"
    docker build -t $APP_TAG .
}

runDockerImage() {
    echo "$(tput setaf 3)[BASH]$(tput init) Running the Docker image (with a \"$APP_TAG\" tag"
    docker run -p 80:80 -p 1234:1234 -v $(pwd)/src:/usr/app/src/ $APP_TAG
}

selectAction() {
    echo -e "$(tput setaf 3)[BASH]$(tput init) Please select if you want to:\n1. Build and run the Docker image\n2. Just run the Docker image (in case the image is already built)"
    read selectedAction
}

#Main function
selectAction
if [ $selectedAction == 1 ]; then
    buildDockerImage
    runDockerImage
elif [ $selectedAction == 2 ]; then
    runDockerImage
else 
    echo "$(tput setaf 3)[BASH]$(tput init)Invalid input. Please try again"
    selectAction
fi
