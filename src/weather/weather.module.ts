// src/weather/weather.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherData, WeatherDataSchema } from './weather-data.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WeatherData.name, schema: WeatherDataSchema }]),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
