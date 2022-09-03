import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import { fetchAPI } from '../redux/actions';
import Table from '../components/Table';

class Wallet extends React.Component {
  constructor() {
    super();

    this.state = {
      currency: 'BRL',
    };
  }

  componentDidMount() {
    const { getCurrencies } = this.props;
    getCurrencies();
  }

  render() {
    const { currency } = this.state;
    const { totalCost } = this.props;
    const displayEmail = localStorage.getItem('email');
    return (
      <div className="wallet-container">
        <Header
          email={ displayEmail }
          totalCost={ Number(totalCost).toFixed(2) }
          currency={ currency }
        />
        <WalletForm />
        <Table />
      </div>);
  }
}

Wallet.propTypes = {
  getCurrencies: PropTypes.func.isRequired,
  totalCost: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  totalCost: state.wallet.totalCost,
});

const mapDispatchToProps = (dispatch) => ({ getCurrencies: () => dispatch(fetchAPI()) });

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
