import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import Cache from 'cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('/test1')
  async teset1() {
    const result = await this.cacheManager.set('test1', 'hello');
    console.log('@@', result);
    return result;
  }

  @Get('/test2')
  async test2() {
    const result = await this.cacheManager.get('test1');
    console.log('@@', result);
    return result;
  }
}
