#!/bin/bash
echo "Docker 컨테이너를 삭제합니다."

PROJECT_NAME="docker-pm2-sample"
IMG_NAME="${PROJECT_NAME}-img"
IMG_VER="0.01"
CONT_NAME="${PROJECT_NAME}-cont"

DIR=$(pwd)

# check docker container exist if exist will be remove 
if [[ "$(docker ps -a | grep $CONT_NAME 2> /dev/null)" != "" ]]; then
  docker rm -f $CONT_NAME
  echo "삭제 됨"
fi
