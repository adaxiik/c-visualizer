## Launching commands:
### **(building the library)**
*(after installing all the dependencies required)*
**Necessary for the usage in the VS Code extension**
`npx parcel build`

### **(local - debug)**
*(after installing all the dependencies required)*

`npx parcel src/index.html`

### **(Docker)**

`chmod +x ./dockerFullScript.sh`

`./dockerFullScript.sh`

(The site can be then found at http://localhost:1234)

___
**Notes:**
- after changing any of the source files, the Docker image has to be rebuilt (due to the files being passed / copied to the image in the build process)