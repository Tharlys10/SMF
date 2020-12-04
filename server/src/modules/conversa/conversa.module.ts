import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversa } from 'src/shared/entities/conversa.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { ConversaController } from './conversa.controller';
import { ConversaService } from './conversa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversa]),
    forwardRef(() => UsuarioModule)
  ],
  controllers: [ConversaController],
  providers: [ConversaService],
  exports: [ConversaService]
})
export class ConversaModule {}
