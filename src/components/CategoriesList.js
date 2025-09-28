import { useCallback, useState } from 'react';
import './../styles/CategoriesList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoriesList({ categories = {}, subcategories = {}, setCategory = () => {}, setSubcategory = () => {}, activeCategory = null, activeSubcategory = null }) {
    const [showingSubcategories, setShowingSubcategories] = useState(false);
    const [sub, setSub] = useState(null);

    const showSubcategories = useCallback((category) => {
        if(activeCategory === category){
            setShowingSubcategories(false);
            setCategory(null);
            setSubcategory(null);
            return;
        }

        setCategory(category);
        setSubcategory(null);
        if(!subcategories[category]){
            setShowingSubcategories(null);
            return;
        }
        setShowingSubcategories(true);
        setSub(subcategories[category]);
    }, [activeCategory, setCategory, setSubcategory, subcategories]);

    const subcatergoryClicked = useCallback((subcategory) => {
        if(subcategory === activeSubcategory){
            setSubcategory(null)
        }
        else setSubcategory(subcategory)
    }, [setSubcategory, activeSubcategory])
    
    return (
        <div> 
            <div>
                <h4>Categories</h4>
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
                    <h4 style={{marginBottom: "10px"}}>{activeCategory} subcategories:</h4>
                    <div className="categories-list">
                    {Object.entries(sub).map(([name]) => (
                        <div key={`cell-${name}`} className={`category ${activeSubcategory === name ? "active" : ""}`}
                            onClick={() => subcatergoryClicked(name)}>
                        <strong>{name}</strong>
                        </div>
                    ))}
                    </div>
                </div>
                
            )}
            
        </div>
    )
}

export default CategoriesList;