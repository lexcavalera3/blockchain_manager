const express = require('express');

const BlockChainController = require('blockchain/controllers/blockchain_controller');
const TransactionsController = require('blockchain/controllers/transactions_controller');
const MineController = require('blockchain/controllers/mine_controller');
const {minerAddress, applicationPort} = require('config/config').blockchain;

let app;

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

/**
 * Create response with 500 error
 * @param {object} response - express response object.
 * @param {object} error - error, that will be added to response.
 */
function send500Error(response, error) {
  response.status(500);
  response.send(`Internal Server Error\n${error}`);
}

/**
 * Create response with 400 error
 * @param {object} response - express response object.
 * @param {object} error - error, that will be added to response.
 */
function send400Error(response, error) {
  response.status(400);
  response.send(`Bad Request\n${error}`);
}

/**
 * Create response with 400 error
 * @param {object} request - express request object.
 * @return {object} error - error, that will be added to response.
 */
function parseTransactionQuery(request) {
  const errors = [];
  const {from, to, amount} = request.query;
  if (typeof from === 'undefined') {
    errors.push('`from` parameter should be set');
  }
  if (typeof to === 'undefined') {
    errors.push('`to` parameter should be set');
  }
  if (typeof amount === 'undefined') {
    errors.push('`amount` parameter should be set');
  }
  const parsedAmount = Number(amount);
  if (amount && isNaN(parsedAmount)) {
    errors.push('`amount` parameter is not a valid number');
  }
  if (errors.length > 0) {
    throw errors.join('\n');
  }
  return {from, to, amount: parsedAmount};
}

/**
 * Create express application and run it
 */
async function startApplication() {
  app = express();

  app.get('/blockChain', (request, response) => {
    response.send(blockChainController.blockChain);
  });

  app.get('/mine', async (request, response) => {
    const minedBlock = await mineController.mine().catch(error => {
      send500Error(response, error);
    });
    if (minedBlock) {
      response.send(minedBlock);
    }
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
    let parsedQuery;
    try {
      parsedQuery = parseTransactionQuery(request);
    } catch (error) {
      send400Error(response, error);
      return;
    }
    const {from, to, amount} = parsedQuery;
    const newTransaction = transactionsController.createTransaction(from, to, amount);
    response.send(newTransaction);
  });

  await initControllers();

  const server = app.listen(applicationPort, async () => {
    console.log(`Server is running on port ${applicationPort}`);
  });

  return {app, server};
}

/* istanbul ignore if */
if (process.argv && process.argv[2] === 'run') {
  startApplication();
}


module.exports = startApplication;
