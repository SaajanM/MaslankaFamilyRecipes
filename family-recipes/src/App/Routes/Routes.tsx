import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import MainPage from '../Pages/MainPage';

export default class Content extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {this.props.children} 
        <Switch>
          <Route exact path='/' component={MainPage}/>
          <Route path='/recipes' component={MainPage}/>
          <Route exact path='/random' component={MainPage}/>
        </Switch>
      </BrowserRouter>

    );
  }
}