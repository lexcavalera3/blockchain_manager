const sha256 = require('js-sha256').sha256;

/**
 * Block - the core of blockchain.
 * Stores data along with index, creation timestamp and information
 * about previous block.
 */
class Block {
  /**
   * @param {number} index - The index of the block.
   * @param {string} data - Information, that should be stored.
   * @param {string} previousHash - Previous blocks' hash.
   */
  constructor(index, data, previousHash) {
    this.index = index;
    this.timestamp = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this._hashBlock();
  }

  /**
   * Generates unique hash for this block, that depends on all its' fields.
   * @return {string} New hash.
   */
  _hashBlock() {
    return sha256(
        this.index.toString()
        + this.timestamp.toString()
        + this.data.toString()
        + this.previousHash.toString());
  }
}

/**
 * Generates first block of the blockchain.
 * @return {object} First block.
 */
function createGenesisBlock() {
  return new Block(0, 'Genesis Block', '0');
}

/**
 * Generates next block of the blockchain
 * @param {object} lastBlock - The last block of blockchain.
 * @return {object} Next block.
 */
function nextBlock(lastBlock) {
  const index = lastBlock.index + 1;
  const data = 'Hey! I\'m block ' + index.toString();
  const lastHash = lastBlock.hash;
  return new Block(index, data, lastHash);
}


let previousBlock = createGenesisBlock();
let blockToAdd = null;
const blockchain = [previousBlock];
const blocksToAdd = 10;

for (let i = 1; i < blocksToAdd; i++) {
  blockToAdd = nextBlock(previousBlock);
  blockchain.push(blockToAdd);
  previousBlock = blockToAdd;
  console.log(`Block ${blockToAdd.index} has been added to the blockchain!`);
  console.log(`Hash: ${blockToAdd.hash}\n`);
}
