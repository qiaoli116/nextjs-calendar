import { exit } from 'process';
import { dbName, dbClient, dbCollections } from '../db.js'
import teachers from './teachers.js';
import subjects from './subjects.js';
import rooms from './rooms.js';
import tas from './tas.js';
import sessions from './sessions.js';

await dbClient.connect();
console.log('Connected to MongoDB');
const db = dbClient.db(dbName);

async function initCollection(collectionName: string, index: {}, documents: any[]) {
    const collection = db.collection(collectionName);
    await collection.drop();
    await db.createCollection(collectionName);
    await collection.createIndex(index, { collation: { locale: 'en', strength: 2 } });
    await collection.insertMany(documents);
}

await initCollection(dbCollections.teachers.name, dbCollections.teachers.index, teachers);
await initCollection(dbCollections.subjects.name, dbCollections.subjects.index, subjects);
await initCollection(dbCollections.rooms.name, dbCollections.rooms.index, rooms);
await initCollection(dbCollections.tas.name, dbCollections.tas.index, tas);
await initCollection(dbCollections.sessions.name, dbCollections.sessions.index, sessions);

await dbClient.close();


exit(0);