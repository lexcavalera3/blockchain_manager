const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const rewire = require('rewire');
const configDb = require('config/config').db;
const db = rewire('db/db');
const Block = require('blockchain/block');

const TEST_DB_NAME = 'test_blockchain';
const ORIGINAL_DB_NAME = configDb.name;
const DB_URL = db.__get__('dbUrl');

/**
 * Delete all documents from collection.
 * This is used to prepare db for testing and cleanup after that.
 * @param {string} collectionName - collection, that should be cleared.
 * @return {Promise} - promise for clearing collection.
 */
function clearCollection(collectionName) {
  return new Promise(function(resolve) {
    MongoClient.connect(
        DB_URL, {useNewUrlParser: true}, function(err, dataBase) {
          const dbObject = dataBase.db(configDb.name);
          dbObject.collection(collectionName).deleteMany({}, function() {
            dataBase.close();
            resolve();
          });
        });
  });
}


describe('Test db module', function() {
  before(async function() {
    configDb.name = TEST_DB_NAME;
    await clearCollection(configDb.collectionName).then();
  });

  after(function() {
    configDb.name = ORIGINAL_DB_NAME;
  });

  afterEach(async function() {
    await clearCollection(configDb.collectionName).then();
  });

  it('Test writeBlock and readBlock functions', async function() {
    const firstBlock = Block.createGenesisBlock();
    const secondBlock = firstBlock.generateNextBlock('Mock Data');
    await Promise.all([
      db.writeBlock(firstBlock), db.writeBlock(secondBlock)]).then();
    await db.readBlocks().then(function(blocks) {
      assert.strictEqual(blocks.length, 2,
          'There should be exactly 2 blocks in the db.');
      assert.deepEqual(blocks.lastBlock, secondBlock,
          'Block should not change after writing and reading.');
    });
  });
});
