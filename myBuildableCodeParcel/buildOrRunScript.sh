#!/usr/bin/bash

APP_TAG="parcel-visualizer-bp"

buildLibrary() {
    echo "$(tput setaf 3)[BASH]$(tput init) Building the drawing library"
    npx parcel src/myDrawlib.ts
}

runParcelLocally() {
    echo "$(tput setaf 3)[BASH]$(tput init) Running the drawing library locally"
    npx parcel src/index.html
}

buildDockerImage() {
    echo "$(tput setaf 3)[BASH]$(tput init) Building the Docker image (with a \"$APP_TAG\" tag"
    docker build -t $APP_TAG .
}

runDockerImage() {
    echo "$(tput setaf 3)[BASH]$(tput init) Running the Docker image (with a \"$APP_TAG\" tag"
    docker run -p 80:80 -p 1234:1234 -v $(pwd)/src:/usr/app/src/ $APP_TAG
}

selectAction() {
    echo -e "$(tput setaf 3)[BASH]$(tput init) Please select if you want to:"
    echo -e "1. Just build the drawing library - needed for the VSC extension"
    echo -e "2. Run the drawing library locally"
    echo -e "3. Build and run the drawlib Docker image"
    echo -e "4. Just run the drawlib Docker image (in case the image is already built)"
    read selectedAction
}

#Main function
selectAction
if [ $selectedAction == 1 ]; then
    buildLibrary
elif [ $selectedAction == 2 ]; then
    runParcelLocally    
elif [ $selectedAction == 3 ]; then
    buildDockerImage
    runDockerImage
elif [ $selectedAction == 4 ]; then
    runDockerImage
else 
    echo "$(tput setaf 3)[BASH]$(tput init)Invalid input. Please try again"
    selectAction
fi
