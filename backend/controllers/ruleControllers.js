const db = require('../config/firebase');
const { createRule, evaluateEligibility } = require('../ast/ast');

// Create a new rule
exports.createRule = async (req, res) => {
    const { ruleName, ruleString } = req.body;

    if (!ruleName || !ruleString) {
        return res.status(400).json({ success: false, message: "Rule name and rule string are required." });
    }

    try {
        const ast = createRule(ruleString); 
        const ruleRef = await db.collection('rules').add({
            ruleName,
            ruleString,
            ast: JSON.stringify(ast)
        });
        console.log(`Rule created successfully: ${ruleRef.id}`);
        res.status(201).json({ success: true, id: ruleRef.id });
    } catch (error) {
        console.error('Error creating rule:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Evaluate multiple rules based on user input
exports.evaluateRules = async (req, res) => {
    const { ruleIds, userData } = req.body;

    try {
        const results = [];
        let allEligible = true;

        for (const ruleId of ruleIds) {
            const ruleSnapshot = await db.collection('rules').doc(ruleId).get();

            if (!ruleSnapshot.exists) {
                results.push({ ruleId, eligible: false, message: 'Rule not found' });
                allEligible = false;
                continue;
            }

            const rule = ruleSnapshot.data();
            const result = evaluateEligibility(rule.ruleString, userData);
            results.push({ ruleId, ruleName: rule.ruleName, eligible: result });

            if (!result) {
                allEligible = false;
            }
        }

        console.log('Evaluation results:', results);
        res.status(200).json({
            success: true,
            allEligible,
            results
        });
    } catch (error) {
        console.error('Error evaluating rules:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Fetch all the rules from Firebase
exports.getRules = async (req, res) => {
    try {
        const rulesSnapshot = await db.collection('rules').get();
        const rules = [];

        rulesSnapshot.forEach(doc => {
            rules.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Fetched ${rules.length} rules from the database.`);
        res.status(200).json({ success: true, rules });
    } catch (error) {
        console.error('Error fetching rules:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a rule from Firebase
exports.deleteRule = async (req, res) => {
    const { id } = req.params; 
    console.log(`Attempting to delete rule with ID: ${id}`);

    try {
        const ruleRef = db.collection('rules').doc(id);
        const ruleSnapshot = await ruleRef.get();

        if (!ruleSnapshot.exists) {
            console.log('Rule not found');
            return res.status(404).json({ success: false, message: 'Rule not found' });
        }

        await ruleRef.delete(); 
        console.log(`Rule deleted successfully: ${id}`);
        res.status(200).json({ success: true, message: 'Rule deleted successfully' });
    } catch (error) {
        console.error('Error deleting rule:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
