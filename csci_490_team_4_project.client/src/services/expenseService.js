import apiService from './apiService';

const expenseService = {
  getAll: async () => {
    try {
      const result = await apiService.get('expense');
      return result || [];
    } catch (error) {
      console.error('Get all expenses error:', error);
      return [];
    }
  },

  getExpense: async (id) => {
    try {
      return await apiService.get('expense', id);
    } catch (error) {
      console.error('Get expense error:', error);
      return null;
    }
  },

  addExpense: async (expense) => {
    try {
      const formattedExpense = {
        year: parseInt(expense.year),
        month: parseInt(expense.month),
        day: parseInt(expense.day),
        catId: parseInt(expense.catId),
        userDesc: expense.userDesc,
        amount: parseFloat(expense.amount)
      };
      return await apiService.post('expense', formattedExpense);
    } catch (error) {
      console.error('Error in addExpense:', error);
      throw error;
    }
  },

  updateExpense: async (id, expense) => {
    try {
      return await apiService.put('expense', id, expense);
    } catch (error) {
      console.error('Update expense error:', error);
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      return await apiService.delete('expense', id);
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }
};

export default expenseService;