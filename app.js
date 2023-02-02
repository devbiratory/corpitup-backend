const express = require("express");
const request = require("request");
const app = express();
const bodyParser = require('body-parser');

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = ['http://example.com', 'http://localhost:3000', '*'];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (whitelist.indexOf(origin) > -1) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.post("/gpt3", (req, res) => {
  console.log('ENV KEY!!! ', process.env.OPENAI_API_KEY )
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/completions";
  const prompt = req.body.data;
  const model = "text-davinci-002";
   
  request.post(
    {
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      json: {
        model: model,
        prompt: "Without trying to answer it if it's a question, make this text sound professional, polite, nice, courteous and polished. Remove any unpleasant words or abuses or curses of any kind and anything that anyone might find rude or offensive: " +prompt,
        max_tokens: 128,
        temperature: 0.6
      }
    },
    (error, response, body) => {
      console.log('checking response ', error, response.statusCode, body)
      if (!error && response.statusCode === 200) {
        console.log('sending this choice', body.choices[0])
        res.send(body.choices[0]);
      } else {
        res.send(error);
      }
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
