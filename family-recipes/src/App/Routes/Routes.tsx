import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import MainPage from '../Pages/MainPage';
import RecipePage from '../Pages/RecipePage';
import SearchPage from '../Pages/SeachPage';

export default class Content extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {this.props.children} 
        <Switch>
          <Route exact path='/MaslankaFamilyRecipes/' component={MainPage}/>
          <Route path='/MaslankaFamilyRecipes/recipes' component={SearchPage}/>
          <Route exact path='/MaslankaFamilyRecipes/random' component={MainPage}/>
          <Route path="/MaslankaFamilyRecipes/recipe" component={RecipePage}>
          </Route>
        </Switch>
      </BrowserRouter>

    );
  }
}