import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello/:message')
  getHello(@Param('message') message: string): string {
    return this.appService.getHello(message);
  }
}
