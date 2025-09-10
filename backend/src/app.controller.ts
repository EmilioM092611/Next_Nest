import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('saludo')
  getSaludo(): string {
    return '✅ Conexión con Nest hecha';
  }
}
