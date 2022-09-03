import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {
  render() {
    const { email, totalCost, currency } = this.props;
    return (
      <div className="header-container">
        <p data-testid="email-field">
          Seu email:
          {' '}
          <span>{email}</span>
        </p>
        <p data-testid="total-field">
          Custo total:
          {' '}
          <span>{Math.abs(Number(totalCost)).toFixed(2)}</span>
        </p>
        <p data-testid="header-currency-field">
          Moeda:
          {' '}
          <span>{currency}</span>
        </p>
      </div>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
  totalCost: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
};
