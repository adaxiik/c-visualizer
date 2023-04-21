#!/usr/bin/bash

APP_TAG="parcel-visualizer-bp"
SCRIPT_HEADER="$(tput setaf 3)[SCRIPT]$(tput init)"
PARCEL_DIRECTORY_NAME="myDrawingLibrary"
EXTENSION_DIRECTORY_NAME="visualizerExtension"
PARCEL_BUILD_SLEEP_TIME=4

packageExtension() {
   echo "$SCRIPT_HEADER Moving into the extension's directory"
   cd $EXTENSION_DIRECTORY_NAME
   echo "$SCRIPT_HEADER Running the vsce (Visual Studio Code Extensions) package command"
   vsce package --out ../
   echo "$SCRIPT_HEADER Returning from the extension's directory"
   cd ..
   echo "$SCRIPT_HEADER Extension built. Exiting..."
}

buildLibrary() {
    echo "$SCRIPT_HEADER Building the drawing library"
    npx parcel $PARCEL_DIRECTORY_NAME/src/myDrawlib.ts --dist-dir $PARCEL_DIRECTORY_NAME/dist & sleep $PARCEL_BUILD_SLEEP_TIME && pkill -f "node"
   # using just "npx parcel ..." because "npx parcel build ..." option doesn't provide the neccessary output (output with everything neccesary compiled into a single file)
    # "... & sleep ..." used to wait for Parcel to finish building (variable can be edited)
    # "... && pkill ..." used to kill the NodeJs process (to kill Parcel)
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
    echo -e "1. Prepare and package the extension into a VSIX file"
    echo -e "2. Just build the drawing library (needed for the VSC extension running locally)"
    echo -e "3. Run the drawing library locally"
    echo -e "4. Build and run the drawlib Docker image"
    echo -e "5. Just run the drawlib Docker image (in case the image is already built)"
    read selectedAction
}

#Main function
selectAction
if [ $selectedAction == 1 ]; then
    buildLibrary
    packageExtension
elif [ $selectedAction == 2 ]; then
    buildLibrary
elif [ $selectedAction == 3 ]; then
    runParcelLocally    
elif [ $selectedAction == 4 ]; then
    buildDockerImage
    runDockerImage
elif [ $selectedAction == 5 ]; then
    runDockerImage
else 
    echo "$SCRIPT_HEADER Invalid input. Please try again"
    selectAction
fi
