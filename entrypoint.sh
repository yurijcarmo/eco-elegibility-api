#!/bin/sh

chmod 777 dynamodb_local_data

export ENVIRONMENT="${ENVIRONMENT}"

echo "Building the project..."
npm run build

if [ "$IS_SERVERLESS" = false ]; then
    echo "Starting the NestJS..."
    npm start
else
    echo "Starting Serverless Offline..."
    sls offline start --host 0.0.0.0 2>&1 | sed 's/0\.0\.0\.0/localhost/g'
fi