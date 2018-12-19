const assert = require('assert');
const BlockChain = require('blockchain/blockchain');


describe('Test BlockChain class', function() {
  it('Test LastBlock method', function() {
    const firstBlock = 'First Block';
    const secondBlock = 'Second Block';
    const chain = new BlockChain();
    chain.addBlock(firstBlock);
    chain.addBlock(secondBlock);
    assert.strictEqual(chain.lastBlock, secondBlock,
        'Second block should be the last.');
  });
});
