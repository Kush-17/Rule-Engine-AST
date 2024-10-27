const express = require('express');
const {
    createRule,
    evaluateRules,
    getRules,
    deleteRule
} = require('../controllers/ruleControllers');

const router = express.Router();

router.post('/rules', createRule); 
router.post('/rules/evaluate', evaluateRules); 
router.get('/rules', getRules); 
router.delete('/rules/:id', deleteRule); 

module.exports = router;
