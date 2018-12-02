require('rooty')();
const assert = require('assert');
const block = require('^/blockchain/block');


describe('Test Block class', function() {
  it('Test general logic', function() {
    const dummyProofOfWork = 123;
    const dummyTransactions = [];
    const dummyData = {
      'proof-of-work': dummyProofOfWork,
      'transactions': dummyTransactions,
    };
    const firstBlock = block.createGenesisBlock();
    const secondBlock = block.generateNextBlock(firstBlock, dummyData);
    assert.strictEqual(
        firstBlock.index + 1, secondBlock.index,
        'Index of the next block should be greater by 1.');
    assert.strictEqual(
        firstBlock.hash, secondBlock.previousHash,
        'Hash of the previous block should be equal to the previousHash.');
    assert.ok(firstBlock.timestamp <= secondBlock.timestamp,
        'Next block should have bigger or equal timestamp.');
    assert.strictEqual(secondBlock.getProofOfWork(), dummyProofOfWork,
        'Proof of work should match one passed inside `data` object.');
    assert.deepEqual(secondBlock.getTransactions(), dummyTransactions,
        'Transactions should match transactions passed inside `data` object.');
    assert.deepEqual(secondBlock.data, dummyData,
        'Data of the block should be equal to one passed to constructor.');
  });
});
