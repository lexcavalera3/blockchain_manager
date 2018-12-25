const assert = require('assert');

const Transaction = require('blockchain/models/transaction');


describe('Test Transaction class.', () => {
  const from = 'From address';
  const to = 'To address';
  const minerAddress = 'Miner address';
  const amount = 100;
  const dummyTransaction = new Transaction(from, to, amount);

  describe('Test constructor.', () => {
    it('From field should match one passed to constructor', () => {
      assert.strictEqual(dummyTransaction.from, from);
    });

    it('To field should match one passed to constructor', () => {
      assert.strictEqual(dummyTransaction.to, to);
    });

    it('Amount field should match one passed to constructor', () => {
      assert.strictEqual(dummyTransaction.amount, amount);
    });
  });

  describe('Test serialization/deserialization.', () => {
    const serializedTransaction = dummyTransaction.serialize();
    const deserializedTransaction = Transaction.deserialize(serializedTransaction);

    it('Serialized transaction should contain correct from address.', () => {
      assert.strictEqual(serializedTransaction.from, from);
    });

    it('Serialized transaction should contain correct to address.', () => {
      assert.strictEqual(serializedTransaction.to, to);
    });

    it('Serialized transaction should contain correct from address.', () => {
      assert.strictEqual(serializedTransaction.amount, amount);
    });

    it('Serialization/deserialization should not change the transaction', () => {
      assert.deepEqual(dummyTransaction, deserializedTransaction);
    });
  });

  describe('Test createMineTransaction method.', () => {
    const mineTransaction = Transaction.createMineTransaction(minerAddress);

    it('Mine transaction should have Network from address.', () => {
      assert.strictEqual(mineTransaction.from, 'Network');
    });

    it('Mine transaction should have to address equal to minerAddress.', () => {
      assert.strictEqual(mineTransaction.to, minerAddress);
    });

    it('Mine transaction should have amount equal to 1.', () => {
      assert.strictEqual(mineTransaction.amount, 1);
    });
  });
});
