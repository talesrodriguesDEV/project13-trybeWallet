import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveExpenseInfo, fetchAPI, finishEdit } from '../redux/actions';

const food = 'Alimentação';
const credit = 'Cartão de crédito';
const debit = 'Cartão de débito';

class WalletForm extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.addExpense = this.addExpense.bind(this);
    this.editExpense = this.editExpense.bind(this);

    this.state = {
      value: '0',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: food,
    };
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
    });
  }

  addExpense({ target }) {
    const { value, description, currency, method, tag } = this.state;
    const { setExpense, expenseIndex, exchangeRates, getCurrencies } = this.props;
    getCurrencies();
    setExpense({
      id: expenseIndex,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates,
    });
    target.parentElement.firstChild.value = '';
    target.parentElement.firstChild.nextSibling.value = '';
  }

  editExpense(currentExpense, { target }) {
    const { value, description, currency, method, tag } = this.state;
    const { setExpense, stopEdit } = this.props;
    setExpense({
      id: currentExpense.id,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: currentExpense.exchangeRates,
    });
    stopEdit();
    target.parentElement.firstChild.value = '';
    target.parentElement.firstChild.nextSibling.value = '';
  }

  renderNormalFormal(currencies) {
    return (
      <div className="wallet-form">
        <input
          className="form-control"
          name="value"
          onChange={ this.handleChange }
        />
        <input
          className="form-control"
          name="description"
          onChange={ this.handleChange }
        />
        <select
          className="form-select"
          name="currency"
          onChange={ this.handleChange }
        >
          {currencies.map((currency) => (
            <option key={ currency } value={ currency }>{currency}</option>
          ))}
        </select>
        <select
          className="form-select"
          name="method"
          onChange={ this.handleChange }
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value={ credit }>{credit}</option>
          <option value={ debit }>{debit}</option>
        </select>
        <select
          className="form-select"
          name="tag"
          onChange={ this.handleChange }
        >
          <option value={ food }>{food}</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
        <button
          className="btn btn-dark"
          type="button"
          onClick={ this.addExpense }
        >
          Adicionar despesa

        </button>
      </div>
    );
  }

  renderEditForm(currencies, currentExpense) {
    return (
      <div className="wallet-form">
        <input
          className="form-control"
          name="value"
          onChange={ this.handleChange }
          placeholder={ currentExpense.value }
        />
        <input
          className="form-control"
          name="description"
          onChange={ this.handleChange }
          placeholder={ currentExpense.description }
        />
        <select className="form-select" name="currency" onChange={ this.handleChange }>
          {currencies.map((currency) => (
            <option
              selected={ currency === currentExpense.currency }
              key={ currency }
              value={ currency }
            >
              {currency}
            </option>
          ))}
        </select>
        <select className="form-select" name="method" onChange={ this.handleChange }>
          <option selected={ currentExpense.method === 'Dinheiro"' } value="Dinheiro">
            Dinheiro
          </option>
          <option selected={ currentExpense.method === credit } value={ credit }>
            {credit}
          </option>
          <option selected={ currentExpense.method === debit } value={ debit }>
            {debit}
          </option>
        </select>
        <select className="form-select" name="tag" onChange={ this.handleChange }>
          <option selected={ currentExpense.tag === food } value={ food }>{food}</option>
          <option selected={ currentExpense.tag === 'Lazer' } value="Lazer">Lazer</option>
          <option selected={ currentExpense.tag === 'Trabalho' } value="Trabalho">
            Trabalho
          </option>
          <option selected={ currentExpense.tag === 'Transporte' } value="Transporte">
            Transporte
          </option>
          <option selected={ currentExpense.tag === 'Saúde' } value="Saúde">Saúde</option>
        </select>
        <button
          className="btn btn-dark"
          type="button"
          onClick={ (event) => this.editExpense(currentExpense, event) }
        >
          Editar despesa
        </button>
      </div>
    );
  }

  render() {
    const { currencies, currentExpense, editing } = this.props;
    return (
      <div>
        {editing ? this.renderEditForm(currencies, currentExpense)
          : this.renderNormalFormal(currencies) }
      </div>);
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  getCurrencies: PropTypes.func.isRequired,
  setExpense: PropTypes.func.isRequired,
  expenseIndex: PropTypes.number.isRequired,
  exchangeRates: PropTypes.objectOf(PropTypes.object).isRequired,
  currentExpense: PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.string,
    description: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    tag: PropTypes.string,
    exchangeRates: PropTypes.objectOf(PropTypes.object),
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  stopEdit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  expenseIndex: state.wallet.expenseIndex,
  exchangeRates: state.wallet.exchangeRates,
  currentExpense: state.wallet.currentExpense,
  editing: state.wallet.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setExpense: (expense) => dispatch(saveExpenseInfo(expense)),
  getCurrencies: () => dispatch(fetchAPI()),
  stopEdit: () => dispatch(finishEdit()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
