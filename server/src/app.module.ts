import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      port: Number(process.env.DB_PORT || 5432),
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USER || 'developer',
      password: process.env.DB_PASS || 'dv1010aa',
      database: process.env.DB_NAME || 'mensagem',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: ['error', 'warn']
    }),
    AuthModule,
    UsuarioModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
