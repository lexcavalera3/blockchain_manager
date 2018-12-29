const assert = require('assert');
const Transaction = require('blockchain/models/transaction');
const TransactionsController = require('blockchain/controllers/transactions_controller');
const {fromAddress, toAddress, amount} = require('../../constants');


describe('Test transactions controller', () => {
  let transactionsController;
  let transaction;
  let mineTransaction;

  beforeEach(() => {
    transactionsController = new TransactionsController();
    transaction = transactionsController.createTransaction(fromAddress, toAddress, amount);
    mineTransaction = transactionsController.createMineTransaction(toAddress);
  });

  describe('Test transactions getter', () => {
    it('Transactions returned by getter should be array of created transactions.', () => {
      const expectedTransactions = [transaction, mineTransaction];
      const actualTransactions = transactionsController.transactions;

      assert.deepEqual(expectedTransactions, actualTransactions);
    });
  });

  describe('Test clearTransactions method', () => {
    it('Transactions controller should have 0 transactions after clearing.', () => {
      transactionsController.clearTransactions();
      const actualTransactions = transactionsController.transactions;

      assert.deepEqual([], actualTransactions);
    });
  });

  describe('Test createTransaction method', () => {
    let expectedTransaction;

    before(() => {
      expectedTransaction = new Transaction(fromAddress, toAddress, amount).serialize();
    });

    it('Transaction returned by createTransaction method should be equal to new serialized transaction.', () => {
      assert.deepEqual(expectedTransaction, transaction);
    });

    it('Transaction should be stored in controller after adding.', () => {
      const actualTransaction = transactionsController.transactions[0];
      assert.deepEqual(expectedTransaction, actualTransaction);
    });
  });

  describe('Test createMineTransaction method', () => {
    let expectedTransaction;
    let actualTransaction;

    before(() => {
      expectedTransaction = Transaction.createMineTransaction(toAddress).serialize();
      actualTransaction = transactionsController.transactions[1];
    });

    it('Transaction returned by createMineTransaction method should be equal to serialized mine transaction.', () => {
      assert.deepEqual(expectedTransaction, mineTransaction);
    });

    it('Mine transaction should be stored in controller after adding.', () => {
      assert.deepEqual(expectedTransaction, actualTransaction);
    });
  });

  describe('Test getBalance method', () => {
    let expectedFromBalance;
    let expectedToBalance;
    let actualFromBalance;
    let actualToBalance;

    before(() => {
      const sentAmount = 5;
      transactionsController.createTransaction(toAddress, fromAddress, sentAmount);
      expectedToBalance = amount + 1 - sentAmount;
      expectedFromBalance = sentAmount - amount;
      const transactions = transactionsController.transactions;
      actualToBalance = TransactionsController.getBalance(transactions, toAddress);
      actualFromBalance = TransactionsController.getBalance(transactions, fromAddress);
    });

    it('From balance should be equal to expected.', () => {
      assert.deepEqual(expectedFromBalance, actualFromBalance);
    });

    it('To balance should be equal to expected.', () => {
      assert.deepEqual(expectedToBalance, actualToBalance);
    });
  });
});
