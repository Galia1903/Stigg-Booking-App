import { useState, useEffect } from 'react';
import TopWidgets from './TopWidgets';
import SearchBar from './SearchBar';
import LeaderBoard from './LeaderBoard';

import logo from './logo.svg';
import './App.css';



function App() {

  return (
    (<div>
        <TopWidgets />
        <LeaderBoard />
    </div>)
  );
}

export default App;
