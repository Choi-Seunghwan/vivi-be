import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import Cache from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: any) {
    const result = await this.cacheManager.set(key, value);
    return result;
  }

  async get(key: string) {
    const result = await this.cacheManager.get(key);
    return result;
  }
}
