# src

- Account: 계정 관련 기능을 담당합니다.

- Common: 공통으로 사용되는 기능을 담당합니다.

- Source-code: 데이터 정의를 담당합니다.

# Node Build

### Build 간 메모리 부족 시

```sh
# 스왑 파일 생성
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 부팅 시 자동으로 스왑 파일을 활성화하도록 /etc/fstab에 추가
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### package.json 스크립트 수정

"build": "node --max-old-space-size=4096 ./node_modules/.bin/nest build",

# Actions runner

### Workflow 종료 후에도 백그라운드 프로세스 유지

run: RUNNER_TRACKING_ID="" && nohup npm run start:prod &
