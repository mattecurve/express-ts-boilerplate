# The Base Image
FROM node:14.15.4

# Hello!
LABEL maintainer="Onkar <onkar@mattecurve.com>"

# Create the application directory
RUN mkdir -p /home/app

# Copy over package.json
COPY ["./package.json", "./package-lock.json", "/home/app/"]

# Here we go
WORKDIR /home/app

# Install Node Dependencies
RUN npm install

# Copy over application
COPY ./dist /home/app

# Lift off!
CMD ["node", "index.js"]
