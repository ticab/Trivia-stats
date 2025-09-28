import { useMemo, useState } from 'react';
import './../styles/FilterCategories.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import he from 'he';

function FilterCategories({ questions = [] }) {
    const [showingSubcategories, setShowingSubcategories] = useState(false);
    const [sub, setSub] = useState(null);
    const [q, setQ] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubcategory, setActiveSubcategory] = useState(null);

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

    const showSubcategories = (category) => {
        if(activeCategory === category){
            setShowingSubcategories(false);
            setActiveCategory(null);
            setActiveSubcategory(null);
            setQ([]);
            return;
        }

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
            if(activeSubcategory === category){
                setActiveSubcategory(null);
                setQ([]);
                return;
            }
            setActiveSubcategory(category);
            setQ(subcategories[activeCategory][category] || []);
        }
    }   
    
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
        <div>
            <div>
                <h3 style={{ marginBottom: "10px" }}>Categories</h3>
                <div className="categories-list">
                {Object.entries(categories).map(([name]) => (
                    <div key={`cell-${name}`} className={`category ${activeCategory === name ? "active" : ""}`} onClick={() => showSubcategories(name)}>
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
                        <div key={`cell-${name}`} className={`category ${activeSubcategory === name ? "active" : ""}`} onClick={() => showQuestions(name, false)}>
                        <strong>{name}</strong>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            {q.length > 0 && (
            <div>
                <h3 style={{ marginBottom: "10px" }}>Questions</h3>
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Question </th>
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