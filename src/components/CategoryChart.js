import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";


function CategoryChart({ questions  = [] }) {
    const [showingSubchart, setShowingSubchart] = useState(false);
    const [subChartData, setSubChartData] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    const categoryCounts = questions.reduce((map, q) => {
        const mainCategory = decodeHtml(q.category).split(":")[0];
        map[mainCategory] = (map[mainCategory] || 0) + 1;
        return map;
    }, {});

    const subcategoryCounts = questions.reduce((map, q) => {
        const [main, sub] = decodeHtml(q.category).split(":").map(s => s.trim());
        if(sub){
            if(!map[main]) map[main] = {};
            map[main][sub] = (map[main][sub] || 0) + 1;
        }
        return map;
    }, {});

    const showSubchart = (data) => {
        if(subcategoryCounts[data]){
            setShowingSubchart(true);
            setSubChartData(Object.entries(subcategoryCounts[data]).map(([key, value]) => ({
                name: `${key}`, 
                count: value 
            })));
            setActiveCategory(data);
        }
        else {
            setShowingSubchart(false);
        }
    }

    const chartData = Object.entries(categoryCounts).map(([key, value]) => ({
        name: `${key}`, 
        count: value 
    }));

    const maxCount = Math.max(...chartData.map(item => item.count));
    const maxLabelLength = Math.max(...chartData.map(item => item.name.length));
    
    return (
        <div>
            {!showingSubchart && (
                <div>
                    <h3>Categories</h3>  
                    <BarChart
                        layout="vertical"
                        width={maxCount * 20}
                        height={Math.max(400, (chartData.length+1) * 35)}
                        data={chartData}
                        isAnimationActive={true}
                    >
                        <CartesianGrid strokeDasharray="3"/>
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={maxLabelLength * 10} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4313A9ff" 
                        onClick={(data) => { showSubchart(data.name); }}/>
                    </BarChart>
                </div>
            )}
            {showingSubchart && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h3>{activeCategory} Subcategories</h3> 
                        <button onClick={() => setShowingSubchart(false)}>Back</button>
                    </div>
                    <BarChart
                        layout="vertical"
                        width={maxCount * 20}
                        height={Math.max(400, (subChartData.length+1) * 35)}
                        data={subChartData}
                        isAnimationActive={false}
                    >
                        <CartesianGrid strokeDasharray="3"/>
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={maxLabelLength * 10} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#A9132Eff" /> 
                    </BarChart>
                </div>
            )}
        
        </div>
    )
}

export default CategoryChart;