// TODO: Define a City class with name and id properties
import fs from 'fs';
import path from 'node:path';


class City {
  constructor(public name: string, public id: string) {}
}


class HistoryService {
  private filePath = path.join(__dirname, 'searchHistory.json'); 

  
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return []; 
    }
  }

  
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  }

  
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities; 
  }

  
  async addCity(cityName: string): Promise<void> {
    const cities = await this.getCities();
    const cityId = Date.now().toString(); 
    const newCity = new City(cityName, cityId);
    cities.push(newCity);
    await this.write(cities);
  }

  
  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city) => city.id !== id);
    await this.write(updatedCities);
  }
}


// TODO: Complete the HistoryService class

  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}


export default new HistoryService();
