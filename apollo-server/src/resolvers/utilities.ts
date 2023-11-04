import { v4 as uuidv4 } from 'uuid';

export function genRef(prefix: string = ""): string {

    return prefix + uuidv4();
}