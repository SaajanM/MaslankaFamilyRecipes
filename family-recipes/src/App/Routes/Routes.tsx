import React, { lazy } from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import { CircularProgress } from '@material-ui/core';

const MainPage = lazy(() => import('../Pages/MainPage'));
const RecipePage = lazy(() => import('../Pages/RecipePage'));
const SearchPage = lazy(() => import('../Pages/SearchPage'));

export default class Content extends React.Component {
  render() {
    return (
      <HashRouter>
        {this.props.children}
        <React.Suspense fallback={
          <div style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"center"}}>
            <CircularProgress color="secondary" />
          </div>
        }>
          <Switch>
            <Route exact path='/' component={MainPage} />
            <Route path='/recipes' component={SearchPage} />
            <Route path="/recipe" component={RecipePage}>
            </Route>
          </Switch>
        </React.Suspense>

      </HashRouter>
      //random comment
    );
  }
}