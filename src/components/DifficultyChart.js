import { Cell, LabelList, Pie, PieChart} from "recharts";

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
        <div style={{ display: "flex" ,gap: "20px", alignItems: "flex-start"}}> 
            <div>
                <h3>Difficulties</h3>  
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="count"
                        isAnimationActive={false}
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
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