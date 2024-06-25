const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

async function getDbCollection(dbAddress, dbfood, dbCollectionfood){
	const client = new MongoClient(dbAddress);
	await client.connect();
	const db = client.db(dbfood);
	return db.collection(dbCollectionfood);
}

app.get('/books', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'mylibraryapp', 'books');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/books/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'mylibraryapp', 'books');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/books', async function(req, res){
	const meal = {...req.body, done:false};
	const collection = await getDbCollection('mongodb://127.0.0.1', 'mylibraryapp', 'books');
	await collection.insertOne(meal);
	res.send(meal);
});

app.patch('/books/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1', 'mylibraryapp', 'books');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set': req.body});
	res.send(data);
});
 
app.delete('/books/:id', async function(req, res){
	console.log(req.params.id);
	const collection = await getDbCollection('mongodb://127.0.0.1', 'mylibraryapp', 'books');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
});

app.listen(port, function() {
	console.log('Server is started!');
});