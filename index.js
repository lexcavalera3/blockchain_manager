const express = require('express');

const BlockChainController = require('blockchain/controllers/blockchain_controller');
const TransactionsController = require('blockchain/controllers/transactions_controller');
const MineController = require('blockchain/controllers/mine_controller');
const {minerAddress, applicationPort} = require('config/config').blockchain;

const app = express();

const blockChainController = new BlockChainController();
const transactionsController = new TransactionsController();
const mineController = new MineController(blockChainController, transactionsController, minerAddress);

/**
 * Initialize controllers before using them.
 */
async function initControllers() {
  await blockChainController.initBlockchain();
}

/**
 * Gather transactions stored in blocks and active transactions into one array.
 * @return {array} - all transactions.
 */
function gatherTransactions() {
  const storedTransactions = blockChainController.transactions;
  const activeTransactions = transactionsController.transactions;
  return storedTransactions.concat(activeTransactions);
}


app.get('/blockChain', (request, response) => {
  response.send(blockChainController.blockChain);
});


app.get('/mine', async (request, response) => {
  const minedBlock = await mineController.mine();
  response.send(minedBlock);
});


app.get('/transactions', (request, response) => {
  response.send(gatherTransactions());
});


app.get('/balance/:address', (request, response) => {
  const allTransactions = gatherTransactions();
  const balance = TransactionsController.getBalance(allTransactions, request.params.address);
  response.send({address: request.params.address, balance: balance});
});


app.post('/newTransaction', (request, response) => {
  const {from, to, amount} = request.query;
  const newTransaction = transactionsController.createTransaction(from, to, amount);
  response.send(newTransaction);
});


app.listen(applicationPort, async () => {
  await initControllers();
});
