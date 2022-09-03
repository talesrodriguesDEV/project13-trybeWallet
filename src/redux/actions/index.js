export const saveEmail = (email) => ({ type: 'SAVE_EMAIL', email });

export const getCurrencies = (payload) => ({ type: 'GET_CURRENCIES', payload });

export function fetchAPI() {
  return async (dispatch) => {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const data = await response.json();
    dispatch(getCurrencies(data));
  };
}

export const saveExpenseInfo = (expense) => ({ type: 'SAVE_EXPENSE', expense });

export const removeExpense = (expense, ask) => ({ type: 'REMOVE_EXPENSE', expense, ask });

export const editExpense = (expense, ask) => ({ type: 'SET_EDIT_EXPENSE', expense, ask });

export const finishEdit = () => ({ type: 'FINISH_EDIT' });
