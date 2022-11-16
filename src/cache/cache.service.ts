import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(namespace: string, key: string, value: any) {
    const keyStr = `${namespace}:${key}`;
    const result = await this.cacheManager.set(keyStr, value);

    return result;
  }

  async get(namespace: string, key: string) {
    const keyStr = `${namespace}:${key}`;
    const result = await this.cacheManager.get(keyStr);

    return result;
  }

  async clear(namespace: string) {
    const result = await this.cacheManager;
  }
}
