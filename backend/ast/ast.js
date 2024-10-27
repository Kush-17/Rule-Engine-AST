class RuleParser {
    constructor(rule) {
        this.rule = rule.replace(/\s+/g, ''); // Remove whitespace
        this.currentIndex = 0;
    }

    parse() {
        const expression = this.parseOrExpression();
        if (this.currentIndex < this.rule.length) {
            throw new Error('Unexpected character at index: ' + this.currentIndex);
        }
        return expression;
    }

    parseOrExpression() {
        const left = this.parseAndExpression();
        if (!left) return null;

        let orExpression = left;

        while (this.currentIndex < this.rule.length && this.rule[this.currentIndex] === 'O') {
            if (this.rule.slice(this.currentIndex, this.currentIndex + 2) === 'OR') {
                this.currentIndex += 2; // Move past "OR"
                const right = this.parseAndExpression();
                if (!right) throw new Error('Invalid OR expression at index: ' + this.currentIndex);
                orExpression = {
                    type: 'OR',
                    left: orExpression,
                    right: right
                };
            }
        }
        return orExpression;
    }

    parseAndExpression() {
        const left = this.parseNotExpression();
        if (!left) return null;

        let andExpression = left;

        while (this.currentIndex < this.rule.length && this.rule[this.currentIndex] === 'A') {
            if (this.rule.slice(this.currentIndex, this.currentIndex + 3) === 'AND') {
                this.currentIndex += 3; // Move past "AND"
                const right = this.parseNotExpression();
                if (!right) throw new Error('Invalid AND expression at index: ' + this.currentIndex);
                andExpression = {
                    type: 'AND',
                    left: andExpression,
                    right: right
                };
            }
        }
        return andExpression;
    }

    parseNotExpression() {
        if (this.rule[this.currentIndex] === 'N') {
            if (this.rule.slice(this.currentIndex, this.currentIndex + 3) === 'NOT') {
                this.currentIndex += 3; // Move past "NOT"
                const expression = this.parseNotExpression();
                return {
                    type: 'NOT',
                    expression
                };
            }
        }
        return this.parseCondition();
    }

    parseCondition() {
        if (this.rule[this.currentIndex] === '(') {
            this.currentIndex++; // Move past '('
            const expression = this.parseOrExpression();
            if (this.rule[this.currentIndex] !== ')') {
                throw new Error('Expected ")" at index: ' + this.currentIndex);
            }
            this.currentIndex++; // Move past ')'
            return expression;
        }

        const condition = this.parseAtomicCondition();
        if (condition) {
            return condition;
        }
        return null;
    }

    parseAtomicCondition() {
        const match = this.rule.slice(this.currentIndex).match(/^([a-zA-Z]+)([<>!=]=?)(\d+|'[^']*')/);
        if (match) {
            const [, field, operator, value] = match;
            this.currentIndex += match[0].length;

            const cleanedValue = value.startsWith("'") && value.endsWith("'")
                ? value.slice(1, -1)
                : isNaN(value) ? value : Number(value);

            return {
                type: 'CONDITION',
                field,
                operator,
                value: cleanedValue
            };
        }
        return null;
    }
}

function evaluateAST(ast, userAttributes) {
    if (!ast) return false;

    switch (ast.type) {
        case 'OR':
            return evaluateAST(ast.left, userAttributes) || evaluateAST(ast.right, userAttributes);
        case 'AND':
            return evaluateAST(ast.left, userAttributes) && evaluateAST(ast.right, userAttributes);
        case 'NOT':
            return !evaluateAST(ast.expression, userAttributes);
        case 'CONDITION':
            const { field, operator, value } = ast;
            const userValue = userAttributes[field];
            let conditionResult;

            switch (operator) {
                case '>':
                    conditionResult = userValue > value;
                    break;
                case '<':
                    conditionResult = userValue < value;
                    break;
                case '>=':
                    conditionResult = userValue >= value;
                    break;
                case '<=':
                    conditionResult = userValue <= value;
                    break;
                case '=':
                    conditionResult = userValue === value;
                    break;
                case '!=':
                    conditionResult = userValue !== value;
                    break;
                default:
                    throw new Error('Invalid operator: ' + operator);
            }

            return conditionResult;
        default:
            return false;
    }
}

function createRule(ruleString) {
    const parser = new RuleParser(ruleString);
    return parser.parse();
}

function evaluateEligibility(ruleString, userAttributes) {
    const ast = createRule(ruleString);
    return evaluateAST(ast, userAttributes);
}

module.exports = { createRule, evaluateEligibility };
