const sha256 = require("js-sha256").sha256;


class Block {

    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.hashBlock();
    }

    hashBlock() {
        return sha256(
            this.index.toString()
            + this.timestamp.toString()
            + this.data.toString()
            + this.previousHash.toString());
    }
}


function createGenesisBlock() {
    return new Block(0, new Date(), "Genesis Block", "0");
}


function nextBlock(lastBlock) {
    let index = lastBlock.index + 1;
    let timestamp = new Date();
    let data = "Hey! I'm block " + index.toString();
    let lastHash = lastBlock.hash;
    return new Block(index, timestamp, data, lastHash);
}


let previousBlock = createGenesisBlock();
let blockToAdd = null;
let blockchain = [previousBlock];
const blocksToAdd = 10;

for (var i = 1; i < blocksToAdd; i++) {
    blockToAdd = nextBlock(previousBlock);
    blockchain.push(blockToAdd);
    previousBlock = blockToAdd;
    console.log(`Block ${blockToAdd.index} has been added to the blockchain!`);
    console.log(`Hash: ${blockToAdd.hash}\n`);
}
