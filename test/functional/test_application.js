const assert = require('assert');
const request = require('supertest');
const {clearCollection, assertBlocksEqual} = require('../utils');

const rewire = require('rewire');
const applicationModule = rewire('application');
const dbConfig = require('config/config').db;
const {
  genesisBlock, mineTransaction, testDbName, originalDbName, toAddress,
  fromAddress, amount
} = require('../constants');

describe('Test application', () => {
  let app;
  let server;

  before(async () => {
    dbConfig.name = testDbName;
    await clearCollection(dbConfig.collectionName);
    const appAndServer = await applicationModule.__get__('startApplication')();
    app = appAndServer.app;
    server = appAndServer.server;
  });

  after(async () => {
    await server.close();
    await clearCollection(dbConfig.collectionName);
    dbConfig.name = originalDbName;
  });

  describe('test blockChain endpoint', async () => {
    it('First block in the response should be genesis', async () => {
      const response = await request(app).get('/blockChain');
      const actualBlockChain = response.body;
      const actualBlock = actualBlockChain[0];
      const expectedBlock = genesisBlock.serialize();

      assertBlocksEqual(expectedBlock, actualBlock);
    });
  });

  describe('test mine endpoint', async () => {
    let firstBlockChain;
    let mineBlock;
    let secondBlockChain;
    let lastBlock;
    let preLastBlock;

    before(async () => {
      const firstResponse = await request(app).get('/blockChain');
      firstBlockChain = firstResponse.body;
      const mineResponse = await request(app).get('/mine');
      mineBlock = mineResponse.body;
      const secondResponse = await request(app).get('/blockChain');
      secondBlockChain = secondResponse.body;
      lastBlock = secondBlockChain[secondBlockChain.length - 1];
      preLastBlock = firstBlockChain[firstBlockChain.length - 1];
    });

    it('Second blockChain should be 1 block longer than first', () => {
      assert.strictEqual(firstBlockChain.length + 1, secondBlockChain.length);
    });

    it('Last block should be equal to mine response', () => {
      assert.deepEqual(lastBlock, mineBlock);
    });

    it('Mine block should have index 1 more than previous', () => {
      assert.strictEqual(lastBlock.index, preLastBlock.index + 1);
    });

    it('Mine block should have previousHash equal to previous blocks hash', () => {
      assert.strictEqual(lastBlock.previousHash, preLastBlock.hash);
    });

    it('Mine block should have timestamp greater or equal to previous blocks', () => {
      assert.ok(lastBlock.timestamp >= preLastBlock.timestamp);
    });

    it('Mine blocks last transaction should be mine transaction', () => {
      const lastTransaction = lastBlock.data.transactions[lastBlock.data.transactions.length - 1];
      const expectedTransaction = mineTransaction.serialize();
      assert.deepEqual(lastTransaction, expectedTransaction);
    });
  });

  describe('test transactions, newTransaction and balance endpoints', async () => {
    let initialTransactions;
    const newTransactionParams = {
      from: fromAddress,
      to: toAddress,
      amount: amount
    };
    let newTransaction;
    let finalTransactions;
    let lastTransaction;
    let initialBalance;
    let finalBalance;

    before(async () => {
      const firstTransactionsResponse = await request(app).get('/transactions');
      initialTransactions = firstTransactionsResponse.body;
      const firstBalanceResponse = await request(app).get(`/balance/${toAddress}`);
      initialBalance = firstBalanceResponse.body.balance;
      const newTransactionResponse = await request(app).post('/newTransaction').query(newTransactionParams);
      newTransaction = newTransactionResponse.body;
      const finalTransactionsResponse = await request(app).get('/transactions');
      finalTransactions = finalTransactionsResponse.body;
      lastTransaction = finalTransactions[finalTransactions.length - 1];
      const finalBalanceResponse = await request(app).get(`/balance/${toAddress}`);
      finalBalance = finalBalanceResponse.body.balance;
    });

    it('Final transactions should be 1 transaction longer than initial', () => {
      assert.strictEqual(finalTransactions.length, initialTransactions.length + 1);
    });

    it('New transaction should consist of its params', () => {
      assert.deepEqual(newTransaction, newTransactionParams);
    });

    it('Last transaction should be equal to new transaction', () => {
      assert.deepEqual(newTransaction, lastTransaction);
    });

    it('Final balance should be greater by amount than initial', () => {
      assert.deepEqual(initialBalance + amount, finalBalance);
    });
  });

  describe('test 500 error', () => {
    let responseCode;
    let responseText;

    /**
     * Mock mine function
     * @return {Promise} - error promise
     */
    function mockMineFunction() {
      return new Promise(() => {
        throw new Error('error');
      });
    }

    before(async () => {
      const originalMineController = applicationModule.__get__('mineController');
      const mockMineController = {mine: mockMineFunction};
      applicationModule.__set__('mineController', mockMineController);
      const mineResponse = await request(app).get('/mine');
      applicationModule.__set__('mineController', originalMineController);
      responseCode = mineResponse.statusCode;
      responseText = mineResponse.error.text;
    });

    it('Response status code should be 500', async () => {
      assert.strictEqual(responseCode, 500);
    });

    it('Response error text should contain `Internal Server Error`', async () => {
      assert.ok(responseText.indexOf('Internal Server Error') !== -1);
    });
  });

  describe('test 400 error', () => {
    let responseCode;
    let responseText;

    /**
     * Post newTransaction with given query parameters
     * @param {object} queryParameters - query parameters to post
     */
    async function postNewTransaction(queryParameters) {
      const newTransactionResponse = await request(app).post('/newTransaction').query(queryParameters);
      responseCode = newTransactionResponse.statusCode;
      responseText = newTransactionResponse.error.text;
    }

    it('Response status code should be 400', async () => {
      await postNewTransaction({});
      assert.strictEqual(responseCode, 400);
    });

    it('Response error text should contain `Bad Request`', async () => {
      await postNewTransaction({});
      assert.ok(responseText.indexOf('Bad Request') !== -1);
    });

    it('Response error text should contain `not a valid number`', async () => {
      await postNewTransaction({amount: 'Not a number'});
      assert.ok(responseText.indexOf('not a valid number') !== -1);
    });
  });
});
