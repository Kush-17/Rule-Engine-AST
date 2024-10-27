import React, { useState, useEffect } from 'react';
import { createRule, getRules, deleteRule, evaluateRules } from '../services/ruleService';
import '../styles/RuleForm.css';

const RuleForm = () => {
    const [ruleName, setRuleName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [rules, setRules] = useState([]);
    const [userAttributes, setUserAttributes] = useState({
        age: '',
        salary: '',
        department: '',
        experience: '',
    });
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const data = await getRules();
                setRules(data.rules);
            } catch (error) {
                alert(error.message);
            }
        };
        fetchRules();
    }, []);

    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            const response = await createRule({ ruleName, ruleString });
            alert('Rule created successfully!');
            setRules([...rules, { id: response.id, ruleName, ruleString }]);
            setRuleName('');
            setRuleString('');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEvaluateRules = async () => {
        try {
            const response = await evaluateRules({ ruleIds: rules.map(r => r.id), userData: userAttributes });
            setResults(response.results);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteRule = async (id) => {
        if (window.confirm('Are you sure you want to delete this rule?')) {
            try {
                await deleteRule(id);
                setRules(rules.filter(rule => rule.id !== id));
                alert('Rule deleted successfully!');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleAttributeChange = (e) => {
        const { name, value } = e.target;
        setUserAttributes((prevAttributes) => ({
            ...prevAttributes,
            [name]: value,
        }));
    };

    return (
        <div className="rule-form">
            <div className="main-content">
                <div className="rule-creation">
                    <h2>Create Rule</h2>
                    <form onSubmit={handleCreateRule}>
                        <input type="text" placeholder="Rule Name" value={ruleName} onChange={(e) => setRuleName(e.target.value)} required />
                        <textarea type="text" placeholder="Rule String" value={ruleString} onChange={(e) => setRuleString(e.target.value)} required />
                        <button type="submit">Create Rule</button>
                    </form>

                    <h2>Current Rules</h2>
                    <div className="rule-list">
                        {rules.map(rule => (
                            <div key={rule.id} className="rule-item">
                                <p><strong>{rule.ruleName}</strong></p>
                                <p>{rule.ruleString}</p>
                                <button onClick={() => handleDeleteRule(rule.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rule-evaluation">
                    <h2>Evaluate Rules</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleEvaluateRules(); }}>
                        <input type="number" name="age" placeholder="Age" value={userAttributes.age} onChange={handleAttributeChange} required />
                        <input type="number" name="salary" placeholder="Salary" value={userAttributes.salary} onChange={handleAttributeChange} required />
                        <input type="text" name="department" placeholder="Department" value={userAttributes.department} onChange={handleAttributeChange} required />
                        <input type="number" name="experience" placeholder="Experience" value={userAttributes.experience} onChange={handleAttributeChange} required />
                        <button type="submit">Evaluate</button>
                    </form>
                </div>
            </div>

            <div className="evaluation-results">
                <h2>Evaluation Results</h2>
                {results.map((result, index) => (
                    <div key={index} className={`result-item ${result.eligible ? 'eligible' : 'not-eligible'}`}>
                        <h4>{result.ruleName}</h4>
                        <p>{result.eligible ? 'Eligible' : 'Not Eligible'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RuleForm;
