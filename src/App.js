import { useEffect, useState } from 'react';
import './App.css';
import CategoryChart from "./components/CategoryChart";
import axios from 'axios';
import DifficultyChart from './components/DifficultyChart';
import FilterCategories from './components/FilterCategories';

function App() {
  //https://opentdb.com/api.php?amount=50&category=17&difficulty=easy&type=multiple
  const [questions, setQuestions] = useState([])
  const baseUrl = 'https://opentdb.com/api.php?amount=50' 

  useEffect(() => {
    axios.get(baseUrl).then((res) => 
      setQuestions(res.data.results))
    }, [])

  return (
    <div className="App">
      <h1>Trivia Visualizer</h1>
      
      <div className="categories">
        <FilterCategories questions={questions} />
      </div>
      

      <div className="charts-container">
        <DifficultyChart questions={questions} />
        <CategoryChart questions={questions} />
      </div>
    </div>
  );
}

export default App;
