import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherData } from './weather-data.model';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(WeatherData.name) private weatherDataModel: Model<WeatherData>) {}

  async getCityStateByCoordinates(latitude: number, longitude: number): Promise<{ city: string; state: string; country: string; region: string }> {
    try {
      const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);

      const { address } = nominatimResponse.data;
      const city = address.city || address.village || address.municipality || 'Unknown City';
      const state = address.state || 'Unknown State';
      const country = address.country || 'Unknown Country';
      const region = address.region || 'Unknown Region';

      return { city, state, country, region };
    } catch (error) {
      console.error('Erro ao obter informações de cidade e estado:', error.message);
      throw new Error('Não foi possível obter informações de cidade e estado');
    }
  }

  async getWeatherInfoByCoordinates(latitude: number, longitude: number): Promise<any> {
    try {
      const existingData = await this.weatherDataModel.findOne({ latitude, longitude });
  
      if (existingData) {
        return {
          temperature: existingData.temperature,
          city: existingData.city,
          state: existingData.state,
          country: existingData.country,
          region: existingData.region,
        };
      }
  
      const { city, state, country, region } = await this.getCityStateByCoordinates(latitude, longitude);
  
      const newWeatherData = new this.weatherDataModel({
        latitude,
        longitude,
        temperature: null,
        city,
        state,
        country,
        region,
      });
      await newWeatherData.save();
  
      const apiKey = 'b768afba9352e8067fcf92b8deb502b6';
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const weatherApiResponse = await axios.get(weatherApiUrl);
      
      const temperatureKelvin = weatherApiResponse.data.main.temp;
      const temperatureCelsius = Number((temperatureKelvin - 273.15).toFixed(2));

      newWeatherData.temperature = temperatureCelsius;

      await newWeatherData.save();
      return {
        temperatureCelsius,
        city,
        state,
        country,
        region,
      };
    } catch (error) {
      console.error('Erro ao obter informações do clima:', error.message);
      throw new Error('Não foi possível obter informações do clima');
    }
  }

  async getWeatherInfoByCityOrCep(query: string): Promise<any> {
    try {
      // Use a API de geocodificação para obter as coordenadas a partir da cidade ou CEP
      const geocodingResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const { lat, lon } = geocodingResponse.data[0];
      
      // Chame o método existente para obter as informações do clima usando as coordenadas
      return this.getWeatherInfoByCoordinates(lat, lon);
    } catch (error) {
      console.error('Erro ao obter informações do clima por cidade ou CEP:', error.message);
      throw new Error('Não foi possível obter informações do clima por cidade ou CEP');
    }
  }

  async getWeatherForecastByCoordinates(latitude: number, longitude: number): Promise<any> {
    try {
      const apiKey = 'b768afba9352e8067fcf92b8deb502b6';
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const forecastApiResponse = await axios.get(forecastApiUrl);

      // Processar a resposta para obter os dados relevantes da previsão do tempo para os próximos 5 dias
      const forecastData = forecastApiResponse.data.list
        .filter((item) => item.dt_txt.includes('12:00:00')) // Pegar apenas dados do meio-dia para simplificar
        .map((item) => {
          return {
            date: item.dt_txt,
            temperature: Number((item.main.temp - 273.15).toFixed(2)),
            // Adicione outros dados relevantes da previsão, se necessário
          };
        });

      return forecastData;
    } catch (error) {
      console.error('Erro ao obter previsão do tempo:', error.message);
      throw new Error('Não foi possível obter a previsão do tempo');
    }
  }
}
