/*globals require, process*/

/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/
// This loads the environment variables from the .env file
require('dotenv-extended').load();
const restify = require('restify');
const builder = require('botbuilder');
const log4js = require('log4js');
const logger = log4js.getLogger('APP:MAIN');
logger.level = 'debug';

// Intent handlers
const Weather = require('./intents/weather');
const Smalltalk = require('./intents/smalltalk');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	logger.info('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
	appId: process.env.MicrosoftAppId,
	appPassword: process.env.MicrosoftAppPassword,
	openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot.
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
// * ---------------------------------------------------------------------------------------- */
// Table storage
// const tableName = process.env.AZURE_STORAGE_TABLE; // You define
// const storageName = process.env.AZURE_STORAGE_ACCOUNT; // Obtain from Azure Portal
// const storageKey = process.env.AZURE_STORAGE_ACCESS_KEY; // Obtain from Azure Portal
// const azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
// const tableStorage = new azure.AzureBotStorage({ gzipData: false }, azureTableClient);
const inMemoryStorage = new builder.MemoryBotStorage();

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
const bot = new builder.UniversalBot(connector, session => {
	session.send('Lo siento, pero no te entiendo. Prueba con otra cosa.');
}).set('storage', inMemoryStorage);

// Make sure you add code to validate these fields
const luisAppId = process.env.LuisAppId;
const luisAPIKey = process.env.LuisAPIKey;
const luisStage = process.env.LuisStage || false;
const luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey + `&staging=${luisStage}&verbose=true&timezoneOffset=0`;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);

// Apply intent scoring threshold
// recognizer.onFilter((context, result, callback) => {
// 	if (result.score >= 0.6) {
// 		callback(null, result);
// 	} else {
// 		// Block
// 		callback(null, { score: 0.0, intent: null });
// 	}
// });

// Register recognizer
bot.recognizer(recognizer);

// Smalltalk intents
bot.dialog('GreetingDialog', Smalltalk.greetingController).triggerAction({ matches: 'Smalltalk.Greeting' });
bot.dialog('HelpDialog', Smalltalk.helpController).triggerAction({ matches: 'Smalltalk.Help' });
bot.dialog('CancelDialog', Smalltalk.cancelController).triggerAction({ matches: 'Smalltalk.Cancel' });
bot.dialog('ThanksDialog', Smalltalk.thanksController).triggerAction({ matches: 'Smalltalk.Thanks' });

// Weather Intents
bot.dialog('WeatherConditionDialog', Weather.getConditionDialog).triggerAction({ matches: 'Weather.getCondition' });
bot.dialog('WeatherForecastDialog', Weather.getForecastDialog).triggerAction({ matches: 'Weather.getForecast' });
