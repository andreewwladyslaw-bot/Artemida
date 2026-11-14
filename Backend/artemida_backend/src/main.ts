import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { APP_MODE } from './types/app.types.js';
import { createClient } from 'redis';
import session from 'express-session'
import {RedisStore} from 'connect-redis';
import { isDev } from './common/helpers/helpers.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const mode: string | undefined = process.env.NODE_ENV

  if(!mode) throw new Error("mode not defined")

  const appHostName = mode === APP_MODE.development ? process.env.APP_HOST_NAME_DEV : process.env.APP_HOST_NAME_PROD
  if(!appHostName) throw new Error("host name not defined")
  
  const appPort = process.env.APP_PORT
  if(!appPort) throw new Error("port not defined")

  const redisHost = mode === APP_MODE.development ? process.env.REDIS_HOST_NAME_DEV : process.env.REDIS_HOST_NAME_PROD
  const redisPort = Number(process.env.REDIS_PORT)
  if(!redisHost || !redisPort) throw new Error("redis host/port not defined")
  const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect()

  const sessionSecret = process.env.SESSION_SECRET
  if(!sessionSecret) throw new Error("session secret not defined")


  app.use(
    session({
      store: new RedisStore({client: redisClient}),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie:{
        httpOnly: true,
        secure: !isDev(),
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
      }
    })
  )

  app.enableCors({
    // origin: 'http://localhost:5173',
    credentials: true,  
  });

  const options = new DocumentBuilder()
    .setTitle('Artemida API documentation')
    .setDescription('The Artemida core backend documentation example')
    .setVersion('0.1')
    .addTag('backend')
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`API /DEV ENDPOINT http://${appHostName}:${appPort} \n DOCUMENTATION IN http://${appHostName}:${appPort}/api`)
}
await bootstrap();
