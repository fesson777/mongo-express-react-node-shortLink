import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LinksPage } from "./LinksPage";
import { CreatePage } from "./CreatePage";
import { AuthPage } from "./AuthPage";
import { DetailPage } from "./DetailPage";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links" exact>
          <LinksPage />
        </Route>
        <Route path="/create" exact>
          <CreatePage />
        </Route>
        <Route path="/detail/:id" exact>
          <DetailPage />
        </Route>
        <Redirect to="/create" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route to="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
