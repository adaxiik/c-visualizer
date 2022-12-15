FROM alpine:latest

RUN apk update &&\
    apk upgrade &&\
    apk add nodejs npm

# Changing the working directory
WORKDIR /usr/app

# Copy app dependency files
COPY package*.json /usr/app/
# Copy ParcelJS source files
COPY src /usr/app/src/  

# Installng the dependencies
RUN npm install

# Exposing necessary ports
EXPOSE 80
EXPOSE 1234

# Running the ParcelJS server
CMD [ "npx", "parcel", "src/index.html" ]