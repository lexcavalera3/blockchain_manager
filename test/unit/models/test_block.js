const assert = require('assert');
const Block = require('blockchain/models/block');
const {
  genesisBlock, secondBlock, dummyProofOfWork,
  secondBlocksData, dummyTransactionsContainer
} = require('../../constants');


describe('Test Block class.', () => {
  describe('Test genesis block fields.', () => {
    it('Genesis block should have index equal to 0.', () => {
      assert.strictEqual(genesisBlock.index, 0);
    });

    it('Genesis block should have proof of work equal to 1.', () => {
      assert.strictEqual(genesisBlock.proofOfWork, 1);
    });

    it('Genesis block should have empty transactions list.', () => {
      assert.deepEqual(genesisBlock.transactions, []);
    });

    it('Genesis block should have previous hash equal to 0.', () => {
      assert.strictEqual(genesisBlock.previousHash, '0');
    });
  });

  describe('Test general logic.', () => {
    it('Index of the next block should be greater by 1.', () => {
      assert.strictEqual(genesisBlock.index + 1, secondBlock.index);
    });

    it('Hash of the previous block should be equal to the previousHash.', () => {
      assert.strictEqual(genesisBlock.hash, secondBlock.previousHash);
    });

    it('Next block should have bigger or equal timestamp.', () => {
      assert.ok(genesisBlock.timestamp <= secondBlock.timestamp);
    });

    it('Proof of work should match one passed inside `data` object.', () => {
      assert.strictEqual(secondBlock.proofOfWork, dummyProofOfWork);
    });

    it('Transactions should match transactions passed inside `data` object.', () => {
      assert.deepEqual(secondBlock.transactions, dummyTransactionsContainer.serialize());
    });

    it('Data of the block should be equal to one passed to constructor.', () => {
      assert.deepEqual(secondBlock.data, secondBlocksData);
    });
  });

  describe('Test serialization/deserialization.', () => {
    const serializedBlock = secondBlock.serialize();
    const deserializedBlock = Block.deserialize(serializedBlock);

    it('Serialized block should contain correct index.', () => {
      assert.strictEqual(serializedBlock.index, secondBlock.index);
    });

    it('Serialized block should contain correct timestamp.', () => {
      assert.strictEqual(serializedBlock.timestamp, secondBlock.timestamp);
    });

    it('Serialized block should contain correct proof of work.', () => {
      assert.strictEqual(serializedBlock.data.proofOfWork, secondBlock.proofOfWork);
    });

    it('Serialized block should contain correct serialized transactions.', () => {
      assert.deepEqual(serializedBlock.data.transactions, secondBlock.transactions);
    });

    it('Serialized block should contain correct previous hash.', () => {
      assert.strictEqual(serializedBlock.previousHash, secondBlock.previousHash);
    });

    it('Serialization/deserialization should not change the block.', () => {
      assert.deepEqual(secondBlock, deserializedBlock);
    });
  });
});
