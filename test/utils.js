const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('config/config').db;

const DB_URL = `${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

/**
 * Delete all documents from collection.
 * This is used to prepare db for testing and cleanup after that.
 * @param {string} collectionName - collection, that should be cleared.
 */
async function clearCollection(collectionName) {
  const client = await MongoClient.connect(DB_URL, {useNewUrlParser: true});
  const dbObject = client.db(dbConfig.name);
  await dbObject.collection(collectionName).deleteMany();
  await client.close();
}

/**
 * Get timestamp independent fields from serialized block.
 * @param {object} block - block, which properties we extract.
 * @return {object} - timestamp independent block fields.
 */
function getConstantBlockProperties(block) {
  return {
    index: block.index,
    data: block.data,
    previousHash: block.previousHash
  };
}

/**
 * Compare timestamp independent fields of two blocks.
 * @param {object} firstBlock - first block to compare.
 * @param {object} secondBlock - second block to compare.
 */
function assertSingleBlocksEqual(firstBlock, secondBlock) {
  assert.deepEqual(
      getConstantBlockProperties(firstBlock),
      getConstantBlockProperties(secondBlock)
  );
}


/**
 * Compare timestamp independent fields of two blocks/arrays of blocks.
 * @param {object/array} firstBlock - first block/blocks array to compare.
 * @param {object/array} secondBlock - second block/blocks array to compare.
 */
function assertBlocksEqual(firstBlock, secondBlock) {
  assert.strictEqual(typeof firstBlock, typeof secondBlock);
  if (firstBlock instanceof Array) {
    assert.deepEqual(
        firstBlock.map(getConstantBlockProperties),
        secondBlock.map(getConstantBlockProperties)
    );
  } else {
    assertSingleBlocksEqual(firstBlock, secondBlock);
  }
}

module.exports = {clearCollection, assertBlocksEqual};
