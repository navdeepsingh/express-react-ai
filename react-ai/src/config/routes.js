import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from '../utils/AuthService'
import App from '../App'

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={App} auth={auth}>
      <IndexRedirect to="/" />
    </Route>
  )
}

export default makeMainRoutes
