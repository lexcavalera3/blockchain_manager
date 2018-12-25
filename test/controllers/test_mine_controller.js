const assert = require('assert');
const TransactionsController = require('blockchain/controllers/transactions_controller');
const Transaction = require('blockchain/models/transaction');
const MineController = require('blockchain/controllers/mine_controller');
const {minerAddress, amountOfWork} = require('config/config').blockchain;

const dummyProofOfWork = 1;

/**
 * Mock blockChain controller
 */
class MockBlockChainController {
  /**
   * Initialize lastProof.
   */
  constructor() {
    this.lastProof = dummyProofOfWork;
  }

  /**
   * Just return given argument
   * @param {object} data - any object
   * @return {object} - data passed
   */
  createNextBlock(data) {
    return data;
  }
}


describe('Test mine controller', () => {
  describe('Test proofOfWork method', () => {
    const previousProofOfWork = 123;
    const newProofOfWork = MineController.proofOfWork(previousProofOfWork);

    it('New proof of work should be greater than previous.', () => {
      assert.ok(newProofOfWork > previousProofOfWork);
    });

    it('New proof of work should be divisible by previous.', () => {
      assert.strictEqual(newProofOfWork % previousProofOfWork, 0);
    });

    it('New proof of work should be divisible by amount of work.', () => {
      assert.strictEqual(newProofOfWork % amountOfWork, 0);
    });
  });

  describe('Test mine method', async () => {
    const transactionsController = new TransactionsController();
    const mockBlockChainController = new MockBlockChainController();
    const mineController = new MineController(mockBlockChainController, transactionsController, minerAddress);
    const proofOfWork = MineController.proofOfWork(dummyProofOfWork);
    const mineTransaction = Transaction.createMineTransaction(minerAddress);
    const expectedData = {
      proofOfWork,
      transactions: [mineTransaction]
    };
    let actualData = null;

    before(async () => {
      actualData = await mineController.mine();
    });

    it('Mine method should return data from createNextBlock method', () => {
      assert.deepEqual(expectedData, actualData);
    });

    it('Mine method should clear transactions', () => {
      assert.deepEqual(transactionsController.transactions, []);
    });
  });
});
