FROM alpine:latest

RUN apk update &&\
    apk upgrade &&\
    apk add bash &&\
    apk add nodejs npm
#Bash for debugging

# Changing the working directory
WORKDIR /usr/app

# Copy app dependency files
COPY package*.json /usr/app/

# Installng the dependencies
RUN npm install
RUN npm install parcel

# Exposing necessary ports
EXPOSE 80
EXPOSE 1234

# Running the ParcelJS server
CMD [ "npx", "parcel", "src/index.html" ]
