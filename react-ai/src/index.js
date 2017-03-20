import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/AppRoutes';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/styles.css';
import './assets/css/animate.css';
import './assets/css/toastr.min.css';

ReactDOM.render(
  <AppRoutes />,
  document.getElementById('root')
);
