import { Module, Global, Provider } from '@nestjs/common';

import * as providers from './providers';
const services: Provider[] = Object.values(providers);

@Global()
@Module({
  providers: services,
  exports: services,
})
export class CommonModule {}
