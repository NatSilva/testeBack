import { Controller, Get, Param, Header, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':latitude/:longitude')
  @Header('Access-Control-Allow-Origin', '*')
  async getTemperatureByCoordinates(@Param('latitude') latitude: number, @Param('longitude') longitude: number): Promise<any> {
    return this.weatherService.getWeatherInfoByCoordinates(latitude, longitude);
  }

  @Get('city-or-cep')
  @Header('Access-Control-Allow-Origin', '*')
  async getTemperatureByCityOrCep(@Query('query') query: string): Promise<any> {
    return this.weatherService.getWeatherInfoByCityOrCep(query);
  }

  @Get('forecast/:latitude/:longitude')
  @Header('Access-Control-Allow-Origin', '*')
  async getWeatherForecastByCoordinates(@Param('latitude') latitude: number, @Param('longitude') longitude: number): Promise<any> {
    return this.weatherService.getWeatherForecastByCoordinates(latitude, longitude);
  }
}
