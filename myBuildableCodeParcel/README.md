## Launching commands:
### **(building the library)**
*(after installing all the dependencies required)*
**Necessary for the usage in the VS Code extension**

`npx parcel src/myDrawlib.ts` - also added to the "mainScript.sh"

### **(local - debug)**
*(after installing all the dependencies required)*

`npx parcel src/index.html` - also added to the "mainScript.sh"

### **(Docker)**
Due to the (slight) complexity of the Docker launch commands, it is easier to use the provided script. It contains the neccessary commands to build and run the drawing library (in Docker).

`chmod +x ./mainScript.sh`

`./mainScript.sh`

(The site can be then found at http://localhost:1234)
