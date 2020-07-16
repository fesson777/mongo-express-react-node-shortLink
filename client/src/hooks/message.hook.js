import { useCallback } from "react";

export const useMessage = () => {
  //useCallback чтобы не входить в рекурсию
  return useCallback((text) => {
    //window.M  M обьект materialize после его подключения
    if (window.M && text) {
      window.M.toast({ html: text });
    }
  }, []);
};
