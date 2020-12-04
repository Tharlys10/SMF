import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { constants } from "./auth.constants";
import { Usuario } from "../../shared/entities";
import { UsuarioService } from "../usuario/usuario.service";
import { decrypt } from "src/shared/functions";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private service: UsuarioService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.secret
    })
  }

  async validate(payload: any): Promise<Usuario> {
    const { id } = payload
    const idDecrypted = decrypt(id)

    const user = await this.service.indexByIDWithPassword(idDecrypted)
    if (!user) {
      throw new UnauthorizedException('Usuário inexistente.')
    }

    return user
  }
}