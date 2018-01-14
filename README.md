# docker-pm2-sample

- Docker 로 Node App 을 만들다 보면 Dockerfile 과 실행 스크립트가 규격화 되는 것 같아 샘플로 만듬
- 실행 방법은 `./docker_run_shell.sh` 를 실행 시키면 됨
- 초기에는 docker 컨테이너는 바로 띄우는게 좋음 
- 사용하다보면 nginx 컨테이너를 앞에 두고 app 컨테이너는 docker network 로 묶어주는 것이 좋음
- `npm i` 을 Dockerfile 에 넣었는데, 자주 배포 하게 되면, `npm i` host(밖)에서 해주는 것이 좋음
- `npm i` 을 Dockerfile 에 넣은 이유는 host(밖)에는 Node 가 없어도 되기 때문
- 프로젝트 명이 스크립트 마나 나눠져 있음 (package.js, docker_run_shell.sh, pm2.json)
- docker_run_shell.sh 에서 버전을 쓰는 이유는 버전을 변경하면 Docker 이미지를 새로 빌드함
 