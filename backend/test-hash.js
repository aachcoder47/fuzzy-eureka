import crypto from 'crypto';

// Test PayU hash generation
const merchantKey = 'M5DU7Y';
const salt = 'LrXuo7cBIiXad4zx5wIOubxCpx4tRGIj';

const testData = {
    key: merchantKey,
    txnid: 'TXN1736486400000test123',
    amount: '2',
    productinfo: '7-Day Trial Setup Fee',
    firstname: 'testuser',
    email: 'test@example.com',
    udf1: 'plan_trial_2inr'
};

// Generate hash with udf1
const hashString =
    `${testData.key}|${testData.txnid}|${testData.amount}|${testData.productinfo}|` +
    `${testData.firstname}|${testData.email}|${testData.udf1}|||||||||${salt}`;

console.log('=== PayU Hash Test ===\n');
console.log('Test Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('\nHash String:');
console.log(hashString);
console.log('\nHash String Length:', hashString.length);
console.log('Number of pipes:', (hashString.match(/\|/g) || []).length);

const hash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

console.log('\nGenerated Hash:');
console.log(hash);
console.log('\nHash Length:', hash.length);

// Test without udf1 (old incorrect way)
const oldHashString =
    `${testData.key}|${testData.txnid}|${testData.amount}|${testData.productinfo}|` +
    `${testData.firstname}|${testData.email}|||||||||||${salt}`;

const oldHash = crypto
    .createHash('sha512')
    .update(oldHashString)
    .digest('hex');

console.log('\n=== OLD (Incorrect) Hash ===');
console.log('Old Hash String:');
console.log(oldHashString);
console.log('\nOld Generated Hash:');
console.log(oldHash);

console.log('\n=== Comparison ===');
console.log('Hashes match?', hash === oldHash ? 'YES (PROBLEM!)' : 'NO (Correct - they should be different)');
