const mysql = require('mysql2');
const { generateUniqueUserNames, generateUniquePasswords } = require('../../../utils');
const { values } = require('lodash');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'test',
    password: '123456',
    database: 'test',
})
const batchSize = 100000;
const totalSize = 1000000;

const usernames = generateUniqueUserNames(totalSize);
const passwords = generateUniquePasswords(totalSize);
let currentId = 0;
console.log(`-----TIMER-----`);
const insertBatch = async () => {
    const values = [];
    for(let i = 0; i < batchSize && currentId < totalSize ; i++){
        values.push([usernames[currentId],[passwords[currentId]]]);
        currentId++;
    }
    if(!values.length){
        pool.end( err => {
            console.timeEnd(`-----TIMER-----`)
            if(err) console.log(`error occurred while creating ${err.message}`)
            else console.log (`Connection pool closed successfully`)
        })
        return;
    }
    const sql = `INSERT INTO users (username,password) VALUES ?`
    pool.query(sql,[values], async function(err, result){
        if(err) throw err
        console.log(`Insert ${result.affectedRows} records`)
        await insertBatch()
    })
}
insertBatch().catch(console.error)



