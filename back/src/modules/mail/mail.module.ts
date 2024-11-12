import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],  // Exporta el servicio para ser usado en otros módulos
})
export class MailModule {}
