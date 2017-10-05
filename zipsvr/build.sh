#!/usr/bin/env bash
set -e
echo "building linux executable"
GOOS=linux go build
docker build -t fredhw/testserver .
docker push fredhw/testserver
go clean