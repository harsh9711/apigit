const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios"); 

const token = "6406819571:AAHQYM4GFYXha4QusWOvGJ46SRVe2tStKa0";
const bot = new TelegramBot(token, { polling: true });

function getCustomerStatus(chatId) {
  // Replace this with your logic to get customer status from your data source
  // For example, querying a database
  // This is just a placeholder
  return "ACTIVE"; // Replace with the actual status
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;
  const customerStatus = getCustomerStatus(chatId);

  // Log the customer status
  console.log("Customer Status:", customerStatus);
  console.log(chatId);
  console.log(userInput);

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=049098873d6c48b04c84bd92026f8116`
    );

    const data = response.data;

    if (data.weather && data.weather.length > 0) {
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15;
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = data.wind.speed;

      const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

      try {
        bot.sendMessage(chatId, message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      bot.sendMessage(chatId, "City doesn't exist.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    bot.sendMessage(chatId, "Error fetching weather data.");
  }
});

module.exports = {
  bot,
  getCustomerStatus,
};