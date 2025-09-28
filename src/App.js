import { useEffect, useMemo, useState } from 'react';
import './App.css';
import CategoryChart from "./components/CategoryChart";
import axios from 'axios';
import DifficultyChart from './components/DifficultyChart';
import CategoriesList from './components/CategoriesList';
import QuestionsList from './components/QuestionsList';
import he from 'he';

function App() {
  const [questions, setQuestions] = useState([])
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const baseUrl = 'https://opentdb.com/api.php?amount=50' 

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get(baseUrl);
      setQuestions(res.data.results);
    };
    fetchQuestions();
  }, []);
  
  const categories = useMemo(() => {
      return questions.reduce((map, q) => {
          const cat = he.decode(q.category).split(":")[0];
          if (!map[cat]) map[cat] = [];
          map[cat].push({...q, question: he.decode(q.question)});
          return map;
      }, {});
  }, [questions]);

  const subcategories = useMemo(() => { 
      return questions.reduce((map, q) => {
          const [main, sub] = he.decode(q.category).split(":").map(s => s.trim());
          if(sub){
              if(!map[main]) map[main] = {};
              if (!map[main][sub]) map[main][sub] = [];
              map[main][sub].push({...q, question: he.decode(q.question)});
          }
          return map;
      }, {});
  }, [questions]);

  const activeQuestions = useMemo(() => {
    if(activeSubcategory){
        return subcategories[activeCategory][activeSubcategory] || [];
    }
    if(activeCategory && !subcategories[activeCategory]){
        return categories[activeCategory] || [];
    }
    return [];
  }, [categories, subcategories, activeCategory, activeSubcategory]);

  return (
    <div className="App">
      <h2 className='app-header'>Trivia Visualizer</h2>

      <div className="categories">
        <CategoriesList categories={categories} subcategories={subcategories} setCategory={setActiveCategory} setSubcategory={setActiveSubcategory} activeCategory={activeCategory} activeSubcategory={activeSubcategory} />
      </div>
      
      <div className={activeQuestions.length>0 ? 'hidden' : ''}>
        <div className='charts-container-row' >
          <CategoryChart categories={categories} subcategories={subcategories} activeCategory={activeCategory} activeSubcategory={activeSubcategory}/>
          <DifficultyChart categories={categories} subcategories={subcategories} activeCategory={activeCategory} activeSubcategory={activeSubcategory}/>
        </div>
      </div>

      <div className='questions-list'>
        <QuestionsList questions={activeQuestions}/>
      </div>
    </div>
  );
}

export default App;
