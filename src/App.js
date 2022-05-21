import { useState, useEffect } from 'react';
import TopWidgets from './TopWidgets';
import SearchBar from './SearchBar';
import LeaderBoard from './LeaderBoard';

import './App.css';


function App() {

  return (
    (<div>
        <TopWidgets />
        <LeaderBoard />
        <div id="search-list"></div>
    </div>)
  );
}

export default App;
