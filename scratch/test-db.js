const mongoose = require('mongoose');
const uri = 'mongodb+srv://jishnu:jishnu123@cluster9000.tkakb0j.mongodb.net/modern-bee?retryWrites=true&w=majority&appName=Cluster9000';

console.log('Connecting to MongoDB Atlas...');
const start = Date.now();

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('✅ Success! Connected in', Date.now() - start, 'ms');
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed in', Date.now() - start, 'ms');
  console.error(err);
  process.exit(1);
});
