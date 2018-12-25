const {readBlocks, writeBlock} = require('blockchain/db/db');
const Block = require('blockchain/models/block');

/**
 * Responsible for operations with blockChain
 */
class BlockChainController {
  /**
   * Just creates _blockChain field. Initialization should be done later.
   */
  constructor() {
    this._blockChain = null;
  }

  /**
   * Initializes blockchain. Try to read it from db.
   * If it's first run - create genesis block and add it to blockChain.
   */
  async initBlockchain() {
    this._blockChain = await readBlocks();

    // First run - need to create genesis block
    if (this._blockChain.length === 0) {
      const genesisBlock = Block.createGenesisBlock();
      await this.addAndSaveBlock(genesisBlock);
    }
  }

  /**
   * Add block to blockChain and save it to db.
   * @param {Block} block - block to add and save.
   */
  async addAndSaveBlock(block) {
    this._blockChain.addBlock(block);
    await writeBlock(block);
  }

  /**
   * Get serialized blockChain - array of blocks.
   * @return {array} - serialized blockChain.
   */
  get blockChain() {
    return this._blockChain.serialize();
  }

  /**
   * Get proof of work from the last block in blockChain.
   * @return {number} - last blocks' proof of work.
   */
  get lastProof() {
    return this._blockChain.lastBlock.proofOfWork;
  }

  /**
   * Create next block, add it to blockChain and save to db.
   * @param {object} nextBlockData - proof of work and transactions of the next block.
   * @return {object} - serialized new block.
   */
  async createNextBlock(nextBlockData) {
    const lastBlock = this._blockChain.lastBlock;
    const newBlock = lastBlock.generateNextBlock(nextBlockData);
    await this.addAndSaveBlock(newBlock);
    return newBlock.serialize();
  }

  /**
   * Get serialized transactions of the blockChain.
   * @return {array} - serialized transactions.
   */
  get transactions() {
    return this._blockChain.transactions;
  }
}


module.exports = BlockChainController;
