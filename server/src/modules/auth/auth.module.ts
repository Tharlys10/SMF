import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from "@nestjs/jwt";
import { constants } from "./auth.constants";
import { UsuarioModule } from "../usuario/usuario.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: constants.secret,
      signOptions: {
        expiresIn: '4h',
        algorithm: 'HS512',
      },
      verifyOptions: {
        algorithms: ['HS512'],
      }
    }),
    UsuarioModule,
  ],
  controllers: [
    AuthController
  ],
  providers: [
    JwtStrategy
  ],
})
export class AuthModule {}