#!/usr/bin/bash

APP_TAG="parcel-visualizer-bp"
SCRIPT_HEADER="$(tput setaf 3)[SCRIPT]$(tput init)"
PARCEL_DIRECTORY_NAME="myBuildableCodeParcel"

buildLibrary() {
    echo "$SCRIPT_HEADER Building the drawing library"
    npx parcel build $PARCEL_DIRECTORY_NAME/src/myDrawlib.ts --dist-dir $PARCEL_DIRECTORY_NAME/dist
    echo "$SCRIPT_HEADER Library built. Exiting..."
}

runParcelLocally() {
    echo "$SCRIPT_HEADER Running the drawing library locally"
    npx parcel $PARCEL_DIRECTORY_NAME/src/index.html --dist-dir $PARCEL_DIRECTORY_NAME/dist
}

buildDockerImage() {
    echo "$SCRIPT_HEADER Building the Docker image (with a \"$APP_TAG\" tag"
    docker build -t $APP_TAG $PARCEL_DIRECTORY_NAME
}

runDockerImage() {
    echo "$SCRIPT_HEADER Running the Docker image (with a \"$APP_TAG\" tag"
    docker run -p 80:80 -p 1234:1234 -v $(pwd)/$PARCEL_DIRECTORY_NAME/src:/usr/app/src/ $APP_TAG
}

selectAction() {
    echo -e "$SCRIPT_HEADER Please select if you want to:"
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
    echo "$SCRIPT_HEADER Invalid input. Please try again"
    selectAction
fi
