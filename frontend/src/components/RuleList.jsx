import React from 'react';

const RuleList = ({ rules, onDelete }) => {
    return (
        <div>
            {rules.map(rule => (
                <div key={rule.id}>
                    <h3>{rule.ruleName}</h3>
                    <p>{rule.ruleString}</p>
                    <button onClick={() => onDelete(rule.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default RuleList;
