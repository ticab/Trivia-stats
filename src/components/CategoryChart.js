import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts";
import './../styles/CategoryChart.css';

const COLORS = { main: "#a9132e", sub: "#640b1b", leaf: "#640b1b" };

function CategoryChart({categories = {}, activeCategory = null, activeSubcategory = null, subcategories = {}}) {
    const categoryCounts = useMemo(() => {
        if(activeCategory){
            if(!activeSubcategory){
                return subcategories[activeCategory] || {[activeCategory]: categories[activeCategory]}
            }
            else{
                return {[activeSubcategory]:  subcategories[activeCategory][activeSubcategory]}
            }
        }
        else return categories;
    }, [categories, subcategories, activeCategory, activeSubcategory]);
    
    const chartData = useMemo(() => { 
        return Object.keys(categoryCounts).map(key => {
        const items = categoryCounts[key];
        const hasSubcategories = subcategories[key] && Object.keys(subcategories[key]).length > 0;

        return {
            name: key,
            count: items.length,
            fill: hasSubcategories ? COLORS.main : COLORS.leaf
            };
        }).sort((a, b) => b.count - a.count);
    }, [categoryCounts, subcategories]);

    
    const maxLabelLength = useMemo(() => {
        return Math.max(...chartData.map(item => item.name.length), 0);
    }, [chartData]);

    return (
        <div className="chart-column">
            <div>
                <h4>Categories Chart</h4>
                <div className="chart-wrapper">
                    <BarChart layout="vertical" width={400} height={(chartData.length + 1) * 35} data={chartData}>
                        <CartesianGrid strokeDasharray="3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={maxLabelLength * 10} />
                        <Tooltip />
                        <Bar dataKey="count">
                        { chartData.map((item, idx) => (
                            <Cell key={idx} fill={item.fill} />
                        ))}
                        </Bar>
                    </BarChart>
                </div>
            </div>
        </div>
    );
}

export default CategoryChart;