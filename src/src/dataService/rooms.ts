import Rooms from "../jsonDb/rooms"
import { sleep } from "./utils";

export interface IRoom {
    roomNum: string;
    type: string;
}

const getAllRooms = async (): Promise<IRoom[]> => {
    await sleep(1e3); // For demo purposes.
    return Rooms;
}

const getOneRoomByRoomNum = async (roomNum: string): Promise<IRoom | undefined> => {
    return Rooms.find((room) => room.roomNum === roomNum);
}

export default {
    getAllRooms,
    getOneRoomByRoomNum
}