import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import './../styles/CategoryChart.css';
import he from 'he';


function CategoryChart({ questions  = [] }) {
    const [showingSubchart, setShowingSubchart] = useState(false);
    const [subChartData, setSubChartData] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const counts = questions.reduce((map, q) => {
        const [main, sub] = he.decode(q.category).split(":").map(s => s.trim());
        
        if (!map[main]) {
            map[main] = { count: 0, subs: {} };
        }
        map[main].count += 1;

        if (sub) {
            map[main].subs[sub] = (map[main].subs[sub] || 0) + 1;
        }

        return map;
    }, {});

    const chartData = Object.entries(counts).map(([key, value]) => ({
        name: key,
        count: value.count
    }));

    const getSubChartData = (main) => {
        return Object.entries(counts[main].subs).map(([key, value]) => ({
            name: key,
            count: value
        }));
    }

    const showSubchart = (data) => {
        const subchart = getSubChartData(data)
        if(subchart.length > 0){
            setShowingSubchart(true);
            setSubChartData(subchart);
            setActiveCategory(data);
        }
        else {
            setShowingSubchart(false);
        }
    }

    const COLORS = { main: "#4313A9ff", sub: "#A9132Eff" };

    const Chart = ({ data, onClickBar, color }) => {
        const maxLabelLength = Math.max(...data.map(item => item.name.length), 0);

        return (
            <BarChart layout="vertical" width={400} height={(data.length + 1) * 35} data={data}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={maxLabelLength * 10} />
            <Tooltip />
            <Bar dataKey="count" fill={color} onClick={onClickBar} />
            </BarChart>
        );
    }

    return (
        <div className="chart-column">
            {!showingSubchart && (
                <div>
                    <h3>Categories Chart</h3>  
                    <div className="chart-wrapper">
                        <Chart  data={chartData} color={COLORS.main} onClickBar={(data) => { showSubchart(data.name); }} />
                    </div>
                </div>
            )}
            {showingSubchart && (
                <div>
                    <div className='subchart-header'>
                    <h3>{activeCategory} Subcategories</h3> 
                    <button onClick={() => setShowingSubchart(false)}>Back</button>
                    </div>
                    
                    <div className="chart-wrapper">
                        <Chart data={subChartData} color={COLORS.sub} />
                    </div>
                </div>
            )}
        
        </div>
    )
}

export default CategoryChart;