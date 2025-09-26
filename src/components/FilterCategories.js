import { useState } from 'react';
import './../styles/FilterCategories.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import he from 'he';

function FilterCategories({ questions = [] }) {
    const [showingSubcategories, setShowingSubcategories] = useState(false);
    const [sub, setSub] = useState(null);
    const [q, setQ] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const categories = questions.reduce((map, q) => {
        const cat = he.decode(q.category).split(":")[0];
        if (!map[cat]) map[cat] = [];
        map[cat].push({...q, question: he.decode(q.question)});
        return map;
    }, {});

    const subcategories = questions.reduce((map, q) => {
        const [main, sub] = decodeHtml(q.category).split(":").map(s => s.trim());
        if(sub){
            if(!map[main]) map[main] = {};
            if (!map[main][sub]) map[main][sub] = [];
            map[main][sub].push({...q, question: he.decode(q.question)});
        }
        return map;
    }, {});

    const showSubcategories = (category) => {
        setActiveCategory(category);
        if(!subcategories[category]){
            setShowingSubcategories(null);
            showQuestions(category, true);
            return;
        }
        setShowingSubcategories(true);
        setSub(subcategories[category]);
        setQ([]);
    }

    const showQuestions = (category, isMain) => {
        if(isMain){
            setQ(categories[category] || []);
        }
        else{
            console.log(activeCategory, category);
            console.log(subcategories[activeCategory][category] )
            setQ(subcategories[activeCategory][category] || []);
        }
    }   
    
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
        <div>
            <div>
                <h3 style={{ marginBottom: "10px" }}>Categories</h3>
                <div className="categories-list">
                {Object.entries(categories).map(([name, questions], index) => (
                    <div key={`cell-${name}`} className="category" onClick={() => showSubcategories(name)}>
                    <strong>{name}</strong>
                    </div>
                ))}
                </div>
            </div>
            {showingSubcategories && (
                <div>
                    <h3 style={{ marginBottom: "10px" }}>Subcategories</h3>
                    <div className="categories-list">
                    {Object.entries(sub).map(([name]) => (
                        <div key={`cell-${name}`} className="category" onClick={() => showQuestions(name, false)}>
                        <strong>{name}</strong>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            {q.length > 0 && (
            <div>
                <h3 style={{ marginBottom: "10px" }}>Questions</h3>
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Question</th>
                            <th scope="col">Difficulty</th>
                            <th scope="col">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {q.map((q, index) => (
                        <tr key={index}>
                            <th scope="row">{index}</th>
                            <td className="text-start">{q.question}</td>
                            <td>{q.difficulty}</td>
                            <td>{q.type}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>)}
        </div>
        </div>
    )
}

export default FilterCategories;