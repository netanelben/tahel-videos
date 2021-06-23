import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './pages';

import './common.css'
import './fonts/style.css'
import './range.scss'
import './icons/home/style.scss'
import './icons/lang/style.scss'
import './icons/timeline/style.scss'
import './icons/info/style.scss'

const isIpadView = window.location.pathname.includes('ipad');

ReactDOM.render(
  <React.StrictMode>
    <MainPage isIpadView={isIpadView}/>
  </React.StrictMode>,
  document.getElementById('root')
);
