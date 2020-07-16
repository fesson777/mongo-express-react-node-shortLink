import { useState, useCallback } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      try {
        // чтобы правильно отправлять данные при запросах.. доработка..проверять в network =>headers и тд
        if (body) {
          body = JSON.stringify(body);
          //снова ошибка, добавляем строку headers, что сервер правильно видел отправляемые данные
          headers["Content-Type"] = "application/json";
        }
        const response = await fetch(url, {
          method,
          body,
          headers
        });
        // console.log("useHttp -> response", response);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "что то пошло не так");
        }
        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );
  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, clearError };
};
