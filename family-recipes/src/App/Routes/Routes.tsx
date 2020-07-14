import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import MainPage from '../Pages/MainPage';
import RecipePage from '../Pages/RecipePage';
import SearchPage from '../Pages/SeachPage';

export default class Content extends React.Component {
  render() {
    return (
      <HashRouter>
        {this.props.children}
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route path='/recipes' component={SearchPage} />
          <Route path="/recipe" component={RecipePage}>
          </Route>
        </Switch>
      </HashRouter>

    );
  }
}