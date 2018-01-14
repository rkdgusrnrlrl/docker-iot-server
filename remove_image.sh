#!/bin/bash

echo "Docker 이미지를 삭제 합니다."

PROJECT_NAME="docker-pm2-sample"

IMG_NAME="${PROJECT_NAME}-img"
IMG_VER="0.01"

CONT_NAME="${PROJECT_NAME}-cont"

DIR=$(pwd)

#all version docker images remove
docker images | grep $IMG_NAME | awk '{print $2}'| xargs -i docker rmi ${IMG_NAME}:{}
