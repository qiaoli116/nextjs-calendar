import { IRoom } from './types.js'
import {
    dbClient,
    dbCollections,
    readAllDocuments,
    readOneDocumentById,
    readOneDocumentByIndex,
    deleteOneDocumentByIndex,
    insertOneDocument,
    udpateOneDocument
} from '../db.js'
const collectionName = dbCollections.rooms.name;

async function readAllRooms(): Promise<IRoom[] | null> {
    return await readAllDocuments<IRoom>(collectionName);
}

async function readRoomByRoomNumber(roomNumber: string): Promise<IRoom | null> {
    return await readOneDocumentByIndex(collectionName, { roomNumber: roomNumber });;
}


async function createRoom(room: IRoom): Promise<IRoom | null> {
    return await insertOneDocument<IRoom>(collectionName, room);
}

async function updateRoomByRoomNumber(roomNumber: string, updates: {}): Promise<IRoom | null> {
    const updateObj = { "$set": updates }
    return await udpateOneDocument<IRoom>(collectionName, { roomNumber: roomNumber }, updateObj);
}

async function deleteRoomByRoomNumber(roomNumber: string): Promise<boolean> {
    return await deleteOneDocumentByIndex(collectionName, { roomNumber: roomNumber });
}

const RoomsQuery = {
    Query: {
        rooms: async () => { return await readAllRooms() },
        room: async (parent, args, context, info) => {
            const { roomNumber } = args;
            return await readRoomByRoomNumber(roomNumber);
        }
    },
    Mutation: {
        roomCreate: (parent, args, context, info) => {
            console.log("addRoom", args);
            const room: IRoom = {
                roomNumber: args.roomNumber,
                type: args.type,
            };
            return createRoom(room);
        },
        roomUpdate: (parent, args, context, info) => {
            console.log("updateRoom", args);
            const { roomNumber } = args;
            const updates: any = {
                type: args.type,
            };
            return updateRoomByRoomNumber(roomNumber, updates);
        },
        roomDelete: (parent, args, context, info) => {
            console.log("deleteRoom", args);
            const { roomNumber } = args;
            return deleteRoomByRoomNumber(roomNumber);
        }
    },
    Children: {

    }

}
const RoomsCRUD = {
    readAllRooms,
    readRoomByRoomNumber,
    createRoom,
    updateRoomByRoomNumber,
    deleteRoomByRoomNumber
}
export { RoomsQuery, RoomsCRUD };
