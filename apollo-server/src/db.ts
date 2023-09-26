import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbClient = new MongoClient(url);
export default dbClient;