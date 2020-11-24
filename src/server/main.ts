require('dotenv').config()
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NextFunction, Request, Response } from 'express'
import { NestExpressApplication } from '@nestjs/platform-express'


async function bootstrap () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // app.setGlobalPrefix('api');
  // app.setBaseViewsDir(join(__dirname, 'views'));
  // app.set('view engine', 'js');
  // app.engine('js', require('express-react-views').createEngine());

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('x-powered-by', 'JQ NestJs Server')
    next()
  })

  await app.listen(3000)
}

bootstrap()
