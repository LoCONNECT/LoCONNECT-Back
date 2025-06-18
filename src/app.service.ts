import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('Database 연결 성공!');
    } catch (error) {
      console.error('Database 연결 실패:', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}

// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }
