import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    options.cors = true;
    const server = super.createIOServer(port, options);

    return server;
  }
}
