function QuestionsList({ questions = [] }) {

    return (
        <div>
            {questions.length > 0 && (
                <div>
                    <h4>Questions</h4>
                    <table className="table table-hover" style={{width: "1000px"}}>
                        <thead className="table-dark">
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Question </th>
                                <th scope="col">Difficulty</th>
                                <th scope="col">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q, index) => (
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td className="text-start">{q.question}</td>
                                <td>{q.difficulty}</td>
                                <td>{q.type}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)}
        </div>
    )
}

export default QuestionsList;