import React from 'react';
import './helpers/renderWith';
import './helpers/mockData';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import { renderWithRouterAndRedux, renderWithRedux } from './helpers/renderWith';
import userEvent from '@testing-library/user-event';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';
import Table from '../components/Table';

describe('Route Tests', () => {
  it('should render the Initial page', () => {
    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const button = screen.getByText('Entrar');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should login properly', async () => {
    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const button = screen.getByText('Entrar');

    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '123456');
    userEvent.click(button);

    const emailField = await screen.findByTestId('email-field');
    const BRL = await screen.findByText('BRL');

    expect(emailField).toBeInTheDocument();
    expect(emailField.innerHTML).toBe('test@test.com');
    expect(BRL).toBeInTheDocument();
  });
});

describe('Wallet Tests', () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(mockData),
  }));

  it('should add an expense properly', async () => {
    renderWithRedux(<Wallet />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all'));

    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    const addButton = screen.getByText('Adicionar despesa');

    userEvent.type(valueInput, '1000');
    userEvent.type(descriptionInput, 'Pão com ovo');
    userEvent.selectOptions(currencyInput, 'BTC');
    userEvent.selectOptions(methodInput, 'Cartão de débito');
    userEvent.selectOptions(tagInput, 'Trabalho');
    userEvent.click(addButton);

    const descriptionCell = await screen.findByRole('cell', { name: 'Pão com ovo' });
    const tagCell = await screen.findByRole('cell', { name: 'Trabalho' });
    const methodCell = await screen.findByRole('cell', { name: 'Cartão de débito' });
    const priceCell = await screen.findByRole('cell', { name: '1000.00' });
    const coinCell = await screen.findByRole('cell', { name: mockData['BTC'].name });
    const askCell = await screen.findByRole('cell', { name: Number(mockData['BTC'].ask).toFixed(2) });
    const brPriceCell = await screen.findByRole('cell', { name: '147235.00' });
    const brCoin = await screen.findByRole('cell', { name: 'Real' });
    const editButton = await screen.findByRole('button', { name: 'Editar' });
    const deleteButton = await screen.findByRole('button', { name: 'Excluir' });

    expect(descriptionCell).toBeInTheDocument();
    expect(tagCell).toBeInTheDocument();
    expect(methodCell).toBeInTheDocument();
    expect(priceCell).toBeInTheDocument();
    expect(coinCell).toBeInTheDocument();
    expect(askCell).toBeInTheDocument();
    expect(brPriceCell).toBeInTheDocument();
    expect(brCoin).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should remove an expense properly', async () => {
    renderWithRedux(<Wallet />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all'));

    const descriptionInput = screen.getByTestId('description-input');
    const addButton = screen.getByText('Adicionar despesa');

    userEvent.type(descriptionInput, 'Pão com ovo');
    userEvent.click(addButton);

    const descriptionCell = await screen.findByRole('cell', { name: 'Pão com ovo' });
    expect(descriptionCell).toBeInTheDocument();

    const deleteButton = await screen.findByRole('button', { name: 'Excluir' });
    userEvent.click(deleteButton);
    await expect(descriptionCell).not.toBeInTheDocument();
  });

  it('should edit an expense properly', async () => {
    renderWithRedux(<Wallet />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all'));

    const descriptionInput = screen.getByTestId('description-input');
    const addButton = screen.getByText('Adicionar despesa');

    userEvent.type(descriptionInput, 'Pão com ovo');
    userEvent.click(addButton);

    const descriptionCell = await screen.findByRole('cell', { name: 'Pão com ovo' });
    expect(descriptionCell).toBeInTheDocument();

    const editButton = await screen.findByRole('button', { name: 'Editar' });
    userEvent.click(editButton);
    await expect(descriptionCell).not.toBeInTheDocument();

    const descriptionEditInput = screen.getByPlaceholderText('Pão com ovo');
    expect(descriptionEditInput).toBeInTheDocument();
    userEvent.type(descriptionEditInput, 'Lasanha');
    const finishEditButton = screen.getByRole('button', { name: 'Editar despesa' });
    userEvent.click(finishEditButton);
    const newDescriptionCell = await screen.findByRole('cell', { name: 'Lasanha' });
    expect(newDescriptionCell).toBeInTheDocument();
  });

  it('should render expenses by Id order', async () => {
    renderWithRedux(<Wallet />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://economia.awesomeapi.com.br/json/all'));

    const descriptionInput = screen.getByTestId('description-input');
    const addButton = screen.getByText('Adicionar despesa');

    userEvent.type(descriptionInput, 'Pão com ovo');
    userEvent.click(addButton);
    const descriptionCell = await screen.findByRole('cell', { name: 'Pão com ovo' });
    userEvent.type(descriptionInput, 'Lasanha');
    userEvent.click(addButton);

    const editButtons = await screen.findAllByRole('button', { name: 'Editar' });
    userEvent.click(editButtons[0]);
    await expect(descriptionCell).not.toBeInTheDocument();

    const descriptionEditInput = screen.getByPlaceholderText('Pão com ovo');
    userEvent.type(descriptionEditInput, 'Arroz');
    const finishEditButton = screen.getByRole('button', { name: 'Editar despesa' });
    userEvent.click(finishEditButton);

    const descriptionCells = await screen.findAllByTestId('description-cell');
    expect(descriptionCells[0].innerHTML).toBe('Arroz');
  });
});