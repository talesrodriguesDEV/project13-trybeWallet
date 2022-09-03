import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveEmail } from '../redux/actions';

class Login extends React.Component {
  constructor() {
    super();

    this.doLogin = this.doLogin.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.verifyInputs = this.verifyInputs.bind(this);

    this.state = {
      email: '',
      password: '',
      disabled: true,
    };
  }

  handleInput({ target }) {
    this.setState({
      [target.name]: target.value,
    }, () => this.verifyInputs());
  }

  verifyInputs() {
    const { email, password } = this.state;
    const minLength = 6;
    if (email.includes('@') && email.includes('.com') && password.length >= minLength) {
      this.setState({ disabled: false });
    } else this.setState({ disabled: true });
  }

  doLogin() {
    const { history, setEmail } = this.props;
    const { email } = this.state;
    setEmail(email);
    localStorage.setItem('email', email);
    history.push('/carteira');
  }

  render() {
    const { disabled } = this.state;
    return (
      <div className="login-container">
        <input
          className="form-control"
          placeholder="Email"
          name="email"
          data-testid="email-input"
          onChange={ this.handleInput }
        />
        <input
          className="form-control"
          placeholder="Password"
          name="password"
          data-testid="password-input"
          onChange={ this.handleInput }
        />
        <button
          className="btn btn-dark"
          type="button"
          onClick={ this.doLogin }
          disabled={ disabled }
        >
          Entrar
        </button>
      </div>);
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    action: PropTypes.string,
    block: PropTypes.func,
    createHref: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    length: PropTypes.number,
    listen: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.string),
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
  setEmail: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setEmail: (email) => dispatch(saveEmail(email)),
});

export default connect(null, mapDispatchToProps)(Login);
