import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WeatherData extends Document {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  temperature: number;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  region: string;

}

export const WeatherDataSchema = SchemaFactory.createForClass(WeatherData);
