const AMOUNT_OF_WORK = 8;

/**
 * Generates next proof of work, that is divisible
 * by basic amount of work and previous proof.
 * @param {number} previousProof - Previous proof of work.
 * @return {number} Next proof of work.
 */
function proofOfWork(previousProof) {
  let proof = previousProof + 1;

  while (proof % AMOUNT_OF_WORK !== 0 || proof % previousProof !== 0) {
    proof += 1;
  }

  return proof;
}

/**
 * Creates new mine (create one coin) transaction.
 * @param {string} minerAddress - Address of the miner node.
 * @return {object} New mine transaction.
 */
function generateMineTransaction(minerAddress) {
  return {
    from: 'network',
    to: minerAddress,
    amount: 1
  };
}

/**
 * Creates new block and adds it to the blockchain.
 * Also flushes unsaved transactions into the new block.
 * @param {BlockChain} blockChain - Blockchain. ntw block should be added to.
 * @param {TransactionsContainer} transactions - Container of unsaved transactions.
 * @param {string} minerAddress - Address of the miner node.
 */
function mine(blockChain, transactions, minerAddress) {
  const lastBlock = blockChain.lastBlock;
  const lastProof = lastBlock.proofOfWork;
  const proof = proofOfWork(lastProof);

  transactions.addTransaction(generateMineTransaction(minerAddress));

  const newBlockData = {
    'proof-of-work': proof,
    transactions: transactions.transactions
  };

  const minedBlock = lastBlock.generateNextBlock(newBlockData);
  blockChain.addBlock(minedBlock);

  transactions.clearTransactions();
}


module.exports = mine;
