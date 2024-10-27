import React from 'react';

const EvaluationResults = ({ results }) => {
    return (
        <div>
            {results.map((result, index) => (
                <div key={index}>
                    <h4>{result.ruleName}</h4>
                    <p>Eligible: {result.eligible ? 'Yes' : 'No'}</p>
                </div>
            ))}
        </div>
    );
};

export default EvaluationResults;
