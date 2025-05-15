const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://migueljpi:${password}@cluster0.7cysi8j.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Entry = mongoose.model('Entry', entrySchema);

if (process.argv.length === 3) {
  Entry.find({}).then((entries) => {
    console.log('phonebook:');
    entries.forEach((entry) => {
      console.log(entry.name, entry.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const entry = new Entry({
    name: name,
    number: number,
  });

  entry.save().then((result) => {
    console.log('added', result.name, 'number', result.number, 'to phonebook');
    mongoose.connection.close();
  });
} else {
  console.log('wrong number of arguments. Remember to write the name within "" in case of spaces. Try again.');
  mongoose.connection.close();
}
