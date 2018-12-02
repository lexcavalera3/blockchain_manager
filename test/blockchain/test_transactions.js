require('rooty')();
const assert = require('assert');
const transactions = require('^/blockchain/transactions');


describe('Test Transactions class', function() {
  it('Test clearData method', function() {
    const firstElement = 'First Element';
    const secondElement = 'Second Element';
    const testTransactions = new transactions.Transactions();
    testTransactions.append(firstElement);
    testTransactions.append(secondElement);
    testTransactions.clearData();
    assert.deepEqual(testTransactions.getData(), [],
        'Transactions data should be an empty array after clearing.');
  });
});
