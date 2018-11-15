/*globals require, module*/

// Libs
const Utils = require('./../lib/utilities');
const Weatherservice = require('../lib/weather.service');

module.exports = {
	getConditionDialog: async (session) => {
		await Utils.writeWithDelay(session, 'Un momento por favor...');
		let condition = await Weatherservice.fetchWeatherCondition('Arteixo,es');
		const city = condition['name'];
		const description = condition['weather'][0]['description'];
		await Utils.writeWithDelay(session, `Ahora mismo tenemos ${description} en ${city}`);
		session.endDialog();
	},
	getForecastDialog: async (session) => {
		await Utils.writeWithDelay(session, 'Espera un segundo...');
		const forecast = await Weatherservice.fetchWeatherForecast('Arteixo,es');
		const description = forecast['list'][0]['weather'][0]['description'];
		const city = forecast['city']['name'];
		await Utils.writeWithDelay(session, `Mañana tendremos ${description} en ${city}`);
		session.endDialog();
	}
};
