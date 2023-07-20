#!/bin/bash

# variables
secret_file=/run/secrets/deco.json
# secret_file=/app/deco.json

# process deco file
deco validate $secret_file || exit 1
deco run $secret_file

#Start the App
npm run start:prod
