require('rooty')();
const assert = require('assert');
const basicContainer = require('^/blockchain/basicContainer');


describe('Test BasicContainer class', function() {
  it('Test general logic', function() {
    const newElement = 'New Element';
    const container = new basicContainer.BasicContainer();
    assert.deepEqual(container.getData(), [],
        'Data of the new basic container should be an empty array.');
    container.append(newElement);
    assert.strictEqual(container.getLength(), 1,
        'There should be exactly 1 element in the container.');
    assert.strictEqual(container.getData()[0], newElement,
        'The element in the container should be equal to the one added.');
  });
});
