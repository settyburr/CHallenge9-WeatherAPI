import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

interface Coordinates {
  latitude: number;
  longitude: number;
}

class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public humidity: number,
    public windSpeed: number
  ) {}
}

class WeatherService {
  private readonly baseURL = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey = process.env.OPENWEATHER_API_KEY as string;
  private cityName: string;

  constructor(cityName: string = '') {
    this.cityName = cityName;
  }

  private async fetchCityWeatherData(cityName: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/weather`, {
      params: {
        q: cityName,
        appid: this.apiKey,
      },
    });
    return response.data;
  }

  private extractCoordinates(data: any): Coordinates {
    return {
      latitude: data.coord.lat,
      longitude: data.coord.lon,
    };
  }

  private buildOneCallAPIUrl({ latitude, longitude }: Coordinates): string {
    return `${this.baseURL}/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${this.apiKey}&units=metric`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildOneCallAPIUrl(coordinates);
    const response = await axios.get(url);
    return response.data;
  }

  private parseCurrentWeather(data: any): Weather {
    return new Weather(
      data.current.temp,
      data.current.weather[0].description,
      data.current.humidity,
      data.current.wind_speed
    );
  }

  private buildForecastArray(dailyData: any[]): Weather[] {
    return dailyData.map((day) => new Weather(day.temp.day, day.weather[0].description, day.humidity, day.wind_speed));
  }

  async getWeatherForCity(cityName: string): Promise<Weather> {
    const locationData = await this.fetchCityWeatherData(cityName);
    const coordinates = this.extractCoordinates(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
