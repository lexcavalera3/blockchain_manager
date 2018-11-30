require('rooty')();
const assert = require('assert');
const block = require('^/blockchain/block');


describe('Test Block class', function() {
  it('Test general logic', function() {
    const firstBlock = block.createGenesisBlock();
    const secondBlock = block.nextBlock(firstBlock);
    assert.strictEqual(
        firstBlock.index + 1, secondBlock.index,
        'Index of the next block should be greater by 1.');
    assert.strictEqual(
        firstBlock.hash, secondBlock.previousHash,
        'Hash of the previous block should be equal to the previousHash.');
    assert.ok(firstBlock.timestamp <= secondBlock.timestamp,
        'Next block should have bigger or equal timestamp.');
  });
});
