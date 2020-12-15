import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.enableCors()

  const dev_state = process.env.DEV_STATE
  
  if (dev_state) {
    if (dev_state === '1' || dev_state === '2') {
      app.setGlobalPrefix(process.env.GLOBAL_PREFIX || '/mensagens/server')
    }
  }

  await app.listen(process.env.APP_PORT || 3369)
}
bootstrap()
