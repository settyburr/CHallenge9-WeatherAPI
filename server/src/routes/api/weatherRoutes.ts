import { Router } from 'express';
const router = Router();

// Import your services (uncomment these when ready to use)
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { city } = req.body;

    
    if (!city) {
      return res.status(400).json({ error: 'City name is required.' });
    }

    // TODO: GET weather data from WeatherService
    const weatherData = await WeatherService.getWeatherByCity(city);

    // TODO: Save city to search history using HistoryService
    await HistoryService.saveCityToHistory(city);

    
    res.status(200).json({ message: 'Weather data retrieved', /* data: weatherData */ });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (req, res) => {
  try {
    // TODO: Fetch search history from HistoryService
    const history = await HistoryService.getSearchHistory();

    res.status(200).json({ message: 'Search history retrieved', /* data: history */ });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history (BONUS)
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Delete city from history using HistoryService
    await HistoryService.deleteCityFromHistory(id);

    res.status(200).json({ message: `City with ID ${id} deleted from history.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;

