/*global module, require, process*/

const rp = require('request-promise');

const API_KEY = process.env.OPENWEATHER_KEY;

const _fetch = uri => {
	return rp({ uri, json: true }); 
};

const _fetchWeatherCondition = async city => {
	return _fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=es`);
};

const _fetchWeatherForecast = async city => {
	return _fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=es`);
};

module.exports = {
	fetchWeatherCondition: _fetchWeatherCondition,
	fetchWeatherForecast: _fetchWeatherForecast,
};
