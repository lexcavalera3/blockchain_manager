const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const rewire = require('rewire');
const configDb = require('config/config').db;
const db = rewire('db/db');
const {genesisBlock, secondBlock} = require('../constants');

const TEST_DB_NAME = 'test_blockchain';
const ORIGINAL_DB_NAME = configDb.name;
const DB_URL = db.__get__('dbUrl');

/**
 * Delete all documents from collection.
 * This is used to prepare db for testing and cleanup after that.
 * @param {string} collectionName - collection, that should be cleared.
 */
async function clearCollection(collectionName) {
  const client = await MongoClient.connect(DB_URL, {useNewUrlParser: true});
  const dbObject = client.db(configDb.name);
  await dbObject.collection(collectionName).deleteMany();
  await client.close();
}


describe('Test db module', async () => {
  let blocks;

  before(async () => {
    configDb.name = TEST_DB_NAME;
    await clearCollection(configDb.collectionName);
    await Promise.all([db.writeBlock(genesisBlock), db.writeBlock(secondBlock)]);
    blocks = await db.readBlocks();
  });

  after(async () => {
    await clearCollection(configDb.collectionName);
    configDb.name = ORIGINAL_DB_NAME;
  });

  it('There should be the same amount of blocks in the db as written.', async () => {
    assert.strictEqual(blocks.length, 2);
  });

  it('Block should not change after writing and reading.', async () => {
    assert.deepEqual(blocks.lastBlock, secondBlock);
  });
});
