require('rooty')();
const assert = require('assert');
const blockChain = require('^/blockchain/blockchain');


describe('Test BasicContainer class', function() {
  it('Test getLastBlock method', function() {
    const firstElement = 'First Element';
    const secondElement = 'Second Element';
    const chain = new blockChain.BlockChain();
    chain.append(firstElement);
    chain.append(secondElement);
    assert.strictEqual(chain.getLastBlock(), secondElement,
        'Second element should be the last.');
  });
});
