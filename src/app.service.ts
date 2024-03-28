import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '배포 완료입니다!!! + DB도 연결됨!';
  }
}
