const assert = require('assert');
const dbConfig = require('config/config').db;
const db = require('blockchain/db/db');
const {genesisBlock, secondBlock, testDbName, originalDbName} = require('../../constants');
const clearCollection = require('../../utils').clearCollection;


describe('Test db module', async () => {
  let blocks;

  /**
   * Write blocks to test db, read from it and cleanup
   */
  async function prepareBlocks() {
    dbConfig.name = testDbName;
    await clearCollection(dbConfig.collectionName);
    await Promise.all([db.writeBlock(genesisBlock), db.writeBlock(secondBlock)]);
    blocks = await db.readBlocks();
    dbConfig.name = originalDbName;
  }

  it('There should be the same amount of blocks in the db as written.', async () => {
    await prepareBlocks();
    assert.strictEqual(blocks.length, 2);
  });

  it('Block should not change after writing and reading.', async () => {
    await prepareBlocks();
    assert.deepEqual(blocks.lastBlock, secondBlock);
  });
});
