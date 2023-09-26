import dbClient from '../db.js'
import { ITAS, ITASSubject } from './types.js'
async function readAllTAS(): Promise<ITAS[] | null> {
    let tas = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('tas'); // Replace with your collection name

        const docs = await collection.find({}).toArray();
        console.log('Found documents:', docs);
        tas = docs;
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return tas;
}
async function readTAS(year: string, department: string, qualificationCode: string): Promise<ITAS | null> {
    let tas = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('tas'); // Replace with your collection name
        const query = { "year": year, "department": department, "qualification.code": qualificationCode };
        console.log('Query:', query);
        const docs = await collection.find(query).collation({ locale: 'en', strength: 2 }).toArray();
        console.log('Found documents:', docs);
        if (docs.length > 0) {
            tas = docs[0];
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return tas;
}

async function readTASSubject(
    year: string, department: string, qualificationCode: string, subjectCode: string
): Promise<ITAS | null> {
    const tas: ITAS = await readTAS(year, department, qualificationCode);
    if (!tas) {
        return null;
    }
    const subject = tas.subjects.find((subject: ITASSubject) =>
        subject.code.toLowerCase() === subjectCode.toLowerCase());
    if (!subject) {
        return null;
    }
    tas.subjects = [subject];
    return tas;
}

const TASQuery = {
    Query: {
        tases: async () => { return await readAllTAS() },
        tas: (parent, args, context, info) => {
            const { year, department, qualificationCode } = args;
            return readTAS(year, department, qualificationCode);
        },
        tasSubject: (parent, args, context, info) => {
            const { year, department, qualificationCode, subjectCode } = args;
            return readTASSubject(year, department, qualificationCode, subjectCode);
        }
    },
    Children: {

    }

}
const TASCRUD = {
    readAllTAS,
    readTAS,
}
export { TASQuery, TASCRUD };
