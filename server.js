const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/crud';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB database connected'))
  .catch(err => console.error(err));

// Define your Mongoose model (replace with your data structure)
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
});

const Item = mongoose.model('Item', ItemSchema);

// CRUD API endpoints

// Create
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Read
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));