const { openai_api_key } = require("./config.json");
const { default: OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: openai_api_key
});

module.exports = openai;