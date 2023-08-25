import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfig } from '@nestjs/config';

// 有问题参考这里 https://github.com/CatsMiaow/nestjs-project-structure/blob/master/src/common/providers/config.service.ts
@Injectable()
export class ConfigService extends NestConfig {}
