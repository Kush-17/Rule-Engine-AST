import axios from 'axios';

const API_URL = 'http://localhost:5001/api/rules';

export const createRule = async (ruleData) => {
    try {
        const response = await axios.post(API_URL, ruleData);
        return response.data;
    } catch (error) {
        console.error('Error creating rule:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to create rule');
    }
};

export const evaluateRules = async (evaluationData) => {
    try {
        const response = await axios.post(`${API_URL}/evaluate`, evaluationData);
        return response.data;
    } catch (error) {
        console.error('Error evaluating rules:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to evaluate rules');
    }
};

export const getRules = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching rules:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch rules');
    }
};

export const deleteRule = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting rule:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete rule');
    }
};
