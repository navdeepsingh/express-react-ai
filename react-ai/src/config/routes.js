import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from '../App'
import NotFound from '../components/NotFound'
import AfterAuth from '../components/AfterAuth'

const routes = (
  <Route path="/">
    <IndexRoute component={App}/>
    <Route path="after-auth" component={AfterAuth}/>
    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;
