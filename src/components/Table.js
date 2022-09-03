import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editExpense, removeExpense } from '../redux/actions';

const minusOne = -1;

class Table extends Component {
  renderEditButton(edit, expense, ask) {
    return (
      <button
        className="btn btn-warning"
        type="button"
        data-testid="edit-btn"
        onClick={ () => {
          edit(expense, ask);
        } }
      >
        Editar
      </button>
    );
  }

  renderDeleteButton(deleteExpense, expense, ask) {
    return (
      <button
        className="btn btn-danger"
        type="button"
        data-testid="delete-btn"
        onClick={ () => {
          deleteExpense(expense, ask);
        } }
      >
        Excluir
      </button>
    );
  }

  render() {
    const { expenses, deleteExpense, edit } = this.props;
    return (
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr className="table-success">
            <th scope="col">Descrição</th>
            <th scope="col">Tag</th>
            <th scope="col">Método de pagamento</th>
            <th scope="col">Valor</th>
            <th scope="col">Moeda</th>
            <th scope="col">Câmbio utilizado</th>
            <th scope="col">Valor convertido</th>
            <th scope="col">Moeda de conversão</th>
            <th scope="col">Editar/Excluir</th>
          </tr>
        </thead>
        <tbody>
          {expenses.sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return minusOne;
            }
            return 0;
          }).map((expense) => {
            const coinInfo = Object.values(expense.exchangeRates)
              .find((object) => object.code === expense.currency);
            return (
              <tr key={ expense.description }>
                <td data-testid="description-cell">{expense.description}</td>
                <td>{expense.tag}</td>
                <td>{expense.method}</td>
                <td>{Number(expense.value).toFixed(2)}</td>
                <td>{coinInfo.name}</td>
                <td>{Number(coinInfo.ask).toFixed(2)}</td>
                <td>{Number(Number(expense.value) * Number(coinInfo.ask)).toFixed(2)}</td>
                <td>Real</td>
                <td>
                  {this.renderEditButton(edit, expense, coinInfo.ask)}
                  {this.renderDeleteButton(deleteExpense, expense, coinInfo.ask)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteExpense: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  deleteExpense: (expense, ask) => dispatch(removeExpense(expense, ask)),
  edit: (expense, ask) => dispatch(editExpense(expense, ask)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);
