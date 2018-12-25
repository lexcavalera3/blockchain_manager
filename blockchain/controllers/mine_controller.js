const {amountOfWork} = require('config/config').blockchain;

/**
 * Responsible for mining operation.
 */
class MineController {
  /**
   * @param {BlockChainController} blockChainController
   * @param {TransactionsController} transactionsController
   * @param {string} minerAddress - address of the miner.
   */
  constructor(blockChainController, transactionsController, minerAddress) {
    this._blockChainController = blockChainController;
    this._transactionsController = transactionsController;
    this._minerAddress = minerAddress;
  }

  /**
  * Generates next proof of work, that is divisible
  * by basic amount of work and previous proof.
  * @param {number} previousProof - Previous proof of work.
  * @return {number} Next proof of work.
  */
  static proofOfWork(previousProof) {
    let proof = previousProof + 1;

    while (proof % amountOfWork !== 0 || proof % previousProof !== 0) {
      proof += 1;
    }

    return proof;
  }

  /**
   * Creates new block and adds it to the blockChain.
   * Also flushes unsaved transactions into the new block.
   */
  async mine() {
    const lastProof = this._blockChainController.lastProof;
    const proof = MineController.proofOfWork(lastProof);
    this._transactionsController.createMineTransaction(this._minerAddress);

    const newBlockData = {
      proofOfWork: proof,
      transactions: this._transactionsController.transactions
    };

    const minedBlock = await this._blockChainController.createNextBlock(newBlockData);

    this._transactionsController.clearTransactions();

    return minedBlock;
  }
}


module.exports = MineController;
