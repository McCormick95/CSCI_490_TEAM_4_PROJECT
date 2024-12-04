import apiService from './apiService';

const budgetService = {
  getBudget: async (id) => {
    try {
      return await apiService.get('budget', id);
    } catch (error) {
      console.error('Get budget error:', error);
      return null;
    }
  },

  getAllBudgets: async () => {
    try {
      const result = await apiService.get('budget');
      return result || [];
    } catch (error) {
      console.error('Get all budgets error:', error);
      return [];
    }
  },

  addBudget: async (budget) => {
    try {
      const formattedBudget = {
        year: parseInt(budget.year),
        month: parseInt(budget.month),
        monthIncome: parseFloat(budget.monthIncome)
      };
      return await apiService.post('budget', formattedBudget);
    } catch (error) {
      console.error('Budget service error:', error);
      throw error;
    }
  },

  updateBudget: async (id, budget) => {
    try {
      return await apiService.put('budget', id, budget);
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  },

  deleteBudget: async (id) => {
    try {
      return await apiService.delete('budget', id);
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  }
};

export default budgetService;