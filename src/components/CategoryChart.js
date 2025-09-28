import { useCallback, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Cell } from "recharts";
import './../styles/CategoryChart.css';
import he from 'he';

const COLORS = { main: "#a9132e", sub: "#640b1b", leaf: "#640b1b" };

function CategoryChart({ questions  = [], onCategoryClick = () => {} }) {
    const [showingSubchart, setShowingSubchart] = useState(false);
    const [subChartData, setSubChartData] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const counts = useMemo(() => {
        return questions.reduce((map, q) => {
            const [main, sub] = he.decode(q.category).split(":").map(s => s.trim());

            if (!map[main]) map[main] = { count: 0, subs: {} };
            map[main].count += 1;

            if (sub) map[main].subs[sub] = (map[main].subs[sub] || 0) + 1;
            return map;
        }, {});
    }, [questions]);

    const chartData = useMemo(() => { 
        return Object.entries(counts).map(([key, value]) => ({
            name: key,
            count: value.count,
            fill: Object.keys(value.subs || {}).length > 0 ? COLORS.main : COLORS.leaf
        })).sort((a, b) => b.count - a.count);
    }, [counts]);

    const getSubChartData = useCallback((main) =>
        Object.entries(counts[main]?.subs || {}).map(([key, value]) => ({
        name: key,
        count: value,
        fill: COLORS.sub
    })), [counts]);

    const showSubchart = useCallback((main) => {
        const subchart = getSubChartData(main);
        console.log('Main Category Clicked:', main);
        onCategoryClick(main);
        if(subchart.length > 0){
            setShowingSubchart(true);
            setSubChartData(subchart);
            setActiveCategory(main);
        }
        else {
            setShowingSubchart(false);
        }
    }, [getSubChartData, onCategoryClick]);

    const Chart = ({ data, onClickBar }) => {
        const maxLabelLength = Math.max(...data.map(item => item.name.length), 0);

        return (
            <BarChart layout="vertical" width={400} height={(data.length + 1) * 35} data={data}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={Math.min(maxLabelLength * 10, 300)} />
            <Tooltip />
            <Bar dataKey="count" onClick={(entry) => onClickBar?.(entry.name)}
                background={{ fill: "transparent" }} cursor="pointer">
            { data.map((item, idx) => (
                <Cell key={idx} fill={item.fill} />
            ))}
            </Bar>
        </BarChart>
        );
    };

    return (
        <div className="chart-column">
            {!showingSubchart ? (
                <div>
                    <h3>Categories Chart</h3>
                    <div className="chart-wrapper">
                        <Chart data={chartData} onClickBar={showSubchart} />
                    </div>
                    <p style={{ fontSize: "12px", color: "#666" }}> Click a bar to see subcategories (if available) </p>
                </div>
            ) : (
                <div>
                    <div className="subchart-header">
                        <h3>{activeCategory} Subcategories</h3>
                        <button onClick={() => {setShowingSubchart(false); onCategoryClick(null);}} >Back</button>
                    </div>
                    <div className="chart-wrapper">
                        <Chart data={subChartData} onClickBar={() => {}}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryChart;