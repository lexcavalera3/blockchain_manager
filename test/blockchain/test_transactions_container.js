const assert = require('assert');
const TransactionsContainer = require('blockchain/transactions_container');
const {dummyTransaction, anotherTransaction} = require('../constants');


describe('Test TransactionsContainer class', () => {
  describe('Test general logic', () => {
    const container = new TransactionsContainer([dummyTransaction]);
    container.addTransaction(anotherTransaction);

    it('Length of transactions container should be equal to count of transactions added to it.', () => {
      assert.strictEqual(container.length, 2);
    });

    it('Transactions returned by transactions getter should be an array of all transactions inserted.', () => {
      assert.deepEqual(container.transactions, [dummyTransaction, anotherTransaction]);
    });
  });

  describe('Test clearTransactions method', () => {
    const container = new TransactionsContainer([dummyTransaction, anotherTransaction]);
    container.clearTransactions();

    it('Transactions returned by getter should be an empty array after transaction clearing.', () => {
      assert.deepEqual(container.transactions, [], 'Transactions data should be an empty array after clearing.');
    });
  });

  describe('Test serialization/deserialization', () => {
    const container = new TransactionsContainer();
    container.addTransaction(dummyTransaction);
    container.addTransaction(anotherTransaction);

    const serializedContainer = container.serialize();
    const deserializedContainer = TransactionsContainer.deserialize(serializedContainer);

    it('Serialized container should contain the same amount of transactions.', () => {
      assert.strictEqual(serializedContainer.length, 2);
    });

    it('Serialized container should contain serialized transactions.', () => {
      assert.deepEqual(serializedContainer, [dummyTransaction.serialize(), anotherTransaction.serialize()]);
    });

    it('Serialization/deserialization should not change the container.', () => {
      assert.deepEqual(container, deserializedContainer);
    });
  });
});
