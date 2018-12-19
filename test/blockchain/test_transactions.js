const assert = require('assert');
const TransactionsContainer = require('blockchain/transactions_container');


describe('Test Transactions class', function() {
  it('Test clearTransactions method', function() {
    const firstTransaction = 'First Element';
    const secondTransaction = 'Second Transaction';
    const testContainer = new TransactionsContainer();
    testContainer.addTransaction(firstTransaction);
    testContainer.addTransaction(secondTransaction);
    testContainer.clearTransactions();
    assert.deepEqual(testContainer.transactions, [],
        'Transactions data should be an empty array after clearing.');
  });
});
