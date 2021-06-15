import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './pages';

import './common.css'
import './fonts/style.css'
import './range.scss'
import './icons/home/style.scss'
import './icons/lang/style.scss'
import './icons/timeline/style.scss'

ReactDOM.render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
  document.getElementById('root')
);
