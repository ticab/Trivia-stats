import { Cell, LabelList, Pie, PieChart} from "recharts";
import './../styles/CategoryChart.css';
import { useCallback, useMemo } from "react";

const COLORS = ['#4313A9ff', '#13a98eff', '#A9132Eff'];

function DifficultyChart({categories = {}, subcategories = {}, activeCategory = null, activeSubcategory = null}) {
    const categoryCounts = useMemo(() => {
        let filteredQuestions = activeSubcategory ? subcategories[activeCategory][activeSubcategory]
            : activeCategory ? categories[activeCategory] : Object.values(categories).flat();

        return filteredQuestions.reduce((map, q) => {
            const difficulty = q.difficulty;
            map[difficulty] = (map[difficulty] || 0) + 1;
            return map;
        }, {});
    }, [categories, subcategories, activeCategory, activeSubcategory]);

    const chartData =  useMemo(() => {
        return Object.keys(categoryCounts).map(key => ({
            name: `${key}`, 
            count: categoryCounts[key] 
        })).sort((a, b) => b.count - a.count);
    }, [categoryCounts]);

    const total = useMemo(() => {
        return chartData.reduce((sum, entry) => sum + entry.count, 0);
    }, [chartData]);

    const toPercent = useCallback((data) => {
        return ((data.count / total)*100).toFixed(1) + "%";
    }, [total]);
    
    return (
        <div className="chart-column">
            <div>
                <h4>Difficulties Chart</h4>  
                <div className="chart-wrapper">
                    <PieChart width={350} height={220}>
                        <Pie
                            dataKey="count"
                            isAnimationActive={false}
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            fill="#8884d8"
                            label={({ name }) => name}
                            nameKey="name"
                        >
                        <LabelList dy={-2} dx={2} fill="white" dataKey={toPercent} />
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                        </Pie>
                    </PieChart>
                </div>
            </div>
        </div>
    )
}

export default DifficultyChart;