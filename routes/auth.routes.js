const { Router } = require("express");
//поключаем Роуты отвечающие за авторизацию

const router = Router();

// Нужно проверять данные email и пароль
// потому install express-validator
const { check, validationResult } = require("express-validator");

//библиотека для шифрования пароля
const bcrypt = require("bcrypt");

//шифрование запросов на сервер
const jwt = require("jsonwebtoken");

//импорт для получения секретного слова
const config = require("config");

const User = require("../models/User");

// /api/auth/register     ЗАПРОС НА РЕГИСТРАЦИЮ ===============================
router.post(
  //маршрут
  "/register",
  //сама валидация, по сути: check и проверки
  [
    check("email", "Некорректный email").isEmail(),
    check(
      "password",
      "Введите нормальный пароль, минимум 6 символов"
    ).isLength({ min: 6 }),
  ],
  //запрос
  async (req, res) => {
    try {
      //проверки по введённому паролю, ошибка body, не парсит в json,
      //добавить middleware в app.js (express.json({extended: true})) и
      // проблема с req.body в своем хуке и обработкой его сервером..
      // console.log("req", req.body); ===================
      //вот так express валидирует входящие поля
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({
          error: error.array(),
          message: "Некорректные данные при регистрации",
        });
      }
      //получаем данные
      const { email, password } = req.body;

      //проверка на совпадения email при регистрации
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({
          message: "Упс, такой пользователь уже существует..",
        });
      }
      //шифруем пароль
      const hashedPassword = await bcrypt.hash(password, 12);
      //новый user с зашифрованным паролем
      const user = new User({ email, password: hashedPassword });

      //сохраняем нового пользователя
      await user.save();
      //ответ от сервера на действие выше..
      res.status(201).json({ message: "Новый пользователь создан!" });
    } catch (e) {
      res.status(500).json({
        message: "Что-то неладное творится, лучше снова попробуйте..",
      });
    }
  }
);

// /api/auth/login   ЗАПРОС НА SING IN =============================================логика почти та же
router.post(
  "/login",
  //валидаторы
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Неверный пароль, попробуйте еще раз..").exists(),
  ],
  async (req, res) => {  
    try {
      //вот так express валидирует входящие поля
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({
          error: error.array(),
          message: "Некорректные данные при входе в систему",
        });
      }
      //достаем данные
      const { email, password } = req.body;
      
      //ищем совпадение email
      const user = await User.findOne({ email: email });
      
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      //проверяем совпадение пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(500)
          .json({ message: "Неверный пароль, попробуйте снова" });
      }
      //JWT TOKEN дальше ставим и настраиваем
      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });
      // ответ от сервера в случае если все прошло успешно
      res.json({ token, userId: user.id });
    } catch (e) {
      console.log("e", e)
      res.status(500).json({
        message: "Что-то неладное творится, лучше снова попробуйте..",
      });
    }
  }
);
module.exports = router;
