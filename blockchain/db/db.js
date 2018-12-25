/**
 * Contains methods for working with database.
 */
const {MongoClient} = require('mongodb');
const BlockChain = require('blockchain/models/blockchain');
const dbConfig = require('config/config').db;
const dbUrl = `${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

/**
 * Read blockChain from database.
 * @return {BlockChain} blockChain of all blocks from the database.
 */
async function readBlocks() {
  const client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
  const database = client.db(dbConfig.name);
  const collection = database.collection(dbConfig.collectionName);
  const blocks = await collection.find().toArray();
  await client.close();
  return BlockChain.restoreFromBlocks(blocks);
}

/**
 * Write Block into database.
 * @param {Block} block - Block to be written.
 */
async function writeBlock(block) {
  const client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
  const database = client.db(dbConfig.name);
  const collection = database.collection(dbConfig.collectionName);
  await collection.insertOne(block.serialize());
  await client.close();
}


module.exports = {writeBlock, readBlocks};
