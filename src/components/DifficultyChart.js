import { Cell, LabelList, Pie, PieChart} from "recharts";
import './../styles/CategoryChart.css';

function DifficultyChart({ questions }) {

    const categoryCounts = questions.reduce((map, q) => {
        const difficulty = q.difficulty;
        map[difficulty] = (map[difficulty] || 0) + 1;
        return map;
    }, {});

    const chartData = Object.keys(categoryCounts).map(key => ({
        name: `${key}`, 
        count: categoryCounts[key] 
    }));
    const COLORS = ['#4313A9ff', '#13a98eff', '#A9132Eff'];

    const total = chartData.reduce((sum, entry) => sum + entry.count, 0);

    const toPercent = (data) => {
        return ((data.count / total)*100).toFixed(1) + "%";
    }
    
    return (
        <div className="chart-column">
            <h3>Difficulties Chart</h3>  
            <div className="chart-wrapper">
                <PieChart width={300} height={250}>
                    <Pie
                        dataKey="count"
                        isAnimationActive={false}
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#8884d8"
                        label={({ name }) => name}
                        nameKey="name"
                    >
                    <LabelList dy={-2} fill="white" dataKey={toPercent} />
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                    </Pie>
                </PieChart>
            </div>
        </div>
    )
}

export default DifficultyChart;