import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as cors from 'cors';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nat:nat123@teste.8ci0pko.mongodb.net/?retryWrites=true&w=majority'),
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };
    
    consumer.apply(cors(corsOptions)).forRoutes('*');
  }
}
