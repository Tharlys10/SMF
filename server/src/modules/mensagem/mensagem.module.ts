import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensagem } from 'src/shared/entities/mensagem.entity';
import { AnexoModule } from '../anexo/anexo.module';
import { ConversaModule } from '../conversa/conversa.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { MensagemController } from './mensagem.controller';
import { MensagemService } from './mensagem.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mensagem]),
    forwardRef(() => ConversaModule),
    forwardRef(() => UsuarioModule),
    forwardRef(() => AnexoModule)
  ],
  controllers: [MensagemController],
  providers: [MensagemService],
  exports: [MensagemService]
})
export class MensagemModule {}
