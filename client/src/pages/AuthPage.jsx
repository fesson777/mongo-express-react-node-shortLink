import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";


export const AuthPage = () => {
  //для получения и хранения token, userIdб реализация методов  login, logout 
  const auth = useContext(AuthContext)

  //созданный собственный хук useMessage для отображения ошибок
  const message = useMessage();

  // созданный собственный хук useHttp для обработки запросов
  const { loading, request, error, clearError } = useHttp();

  const [form, setForm] = useState({ email: "", password: "" });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    // отображение ошибок: materialize, метод toast
    //в свой хук передаем текст ошибки
    message(error);
    clearError();
  }, [error, message, clearError]); //react-hooks/exhaustive-de

  useEffect(()=>{
    window.M.updateTextFields()
  }, [])

  const registerHandler = async () => {
    try {
      //путь реализован на backend в auth.routes     
      const data = await request("/api/auth/register", "POST", { ...form });
      //1я ошибка что backend :5000, а frontend на :3000, лечится в package.json => proxy: localhost 5000
      message(data.message)
      console.log("registerHandler -> data", data);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      //путь реализован на backend в auth.routes     
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId)  
    } catch (e) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сократи ссылку</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  value={form.email}
                  className="yellowInput"
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  className="validate"
                  onChange={changeHandler}
                />
                <label htmlFor="password">Пароль</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              style={{ marginRight: "10px" }}
              disabled={loading}
              onClick={loginHandler}
            >
              Войти
            </button>
            <button
              className="btn grey lighten-1 black-text"
              onClick={registerHandler}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
