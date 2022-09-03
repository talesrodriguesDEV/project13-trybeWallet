const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  expenseIndex: 0,
  editor: false,
  totalCost: 0,
  exchangeRates: {},
  currentExpense: {
    id: -1,
    value: '',
    description: '',
    currency: '',
    method: '',
    tag: '',
    exchangeRates: {},
  },
};

function wallet(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'GET_CURRENCIES':
    return {
      ...state,
      currencies: Object.keys(action.payload)
        .filter((currency) => currency !== 'USDT'),
      currenciesInfo: Object.values(action.payload),
      exchangeRates: action.payload,
    };
  case 'SAVE_EXPENSE':
    return {
      ...state,
      expenses: [...state.expenses, action.expense],
      expenseIndex: state.expenseIndex + 1,
      totalCost: state.totalCost + Number(action.expense.value)
      * Number(state.currenciesInfo
        .find((cur) => cur.code === action.expense.currency).ask),
    };
  case 'REMOVE_EXPENSE':
    return {
      ...state,
      totalCost: state.totalCost - action.expense.value * action.ask,
      expenses: state.expenses
        .filter((exp) => exp !== action.expense),
      expenseIndex: state.expenseIndex - 1,
    };
  case 'SET_EDIT_EXPENSE':
    return {
      ...state,
      editor: true,
      currentExpense: action.expense,
      expenses: state.expenses.filter((exp) => exp !== action.expense),
      totalCost: state.totalCost - action.expense.value * action.ask,
    };
  case 'FINISH_EDIT':
    return {
      ...state,
      editor: false,
    };
  default:
    return state;
  }
}

export default wallet;
