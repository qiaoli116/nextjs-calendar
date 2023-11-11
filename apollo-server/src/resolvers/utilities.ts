import { v4 as uuidv4 } from 'uuid';
import { refPrefix } from './types.js';

export function genRef(prefix: string = ""): string {
    return prefix + uuidv4();
}

export function genSessionRef(): string {
    return genRef(refPrefix.session);
}