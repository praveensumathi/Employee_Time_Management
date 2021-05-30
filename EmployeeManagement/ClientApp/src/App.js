import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import EmployeeEntry from "./components/EntryComponent/EmploeeEntry";
import Dashboard from "./components/Dashboard/Dashboard";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";

import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/dashboard" component={Dashboard} />
        <AuthorizeRoute exact path="/" component={EmployeeEntry} />
        <Route
          path={ApplicationPaths.ApiAuthorizationPrefix}
          component={ApiAuthorizationRoutes}
        />
      </Layout>
    );
  }
}
