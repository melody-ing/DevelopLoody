const { Configuration, OpenAI } = require("openai");
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
