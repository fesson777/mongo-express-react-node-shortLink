const express = require("express");
const app = express();
//парсим пароль в body, node парсит как стрим? нужен middleware ... была ошибка в useHttp..
app.use(express.json({ extended: true }));
// для хостинга
const path = require('path')

//==============================
// const { createProxyMiddleware } = require("http-proxy-middleware");

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://localhost:5000",
//     changeOrigin: true,
//   })
// );

//======================================

const mongoose = require("mongoose");

const config = require("config");
const PORT = config.get("port") || 5000;

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"))

//для выдачи фронтенда на хостинг вместе с запуском сервера
if(process.env.NODE_ENV = "production") {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`App has been started on ${PORT}`));
  } catch (e) {
    console.log("Server ", e.message);
    process.exit(1);
  }
}

start();
