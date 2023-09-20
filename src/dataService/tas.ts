import TAS from '../jsonDb/tas';
import { sleep } from "./utils";

export interface ITASSubject {
    code: string;
    title: string;
    units: {
        code: string;
        title: string;
    }[];
}
export interface ITASQualification {
    code: string;
    title: string;
}
export interface ITAS {
    year: string;
    department: string;
    qualification: ITASQualification;
    subjects: ITASSubject[];
}
export interface ITASSubjectExtended extends ITASSubject {
    year: string;
    department: string;
    qualification: ITASQualification;
}
/**
 * Get all subjects from TAS data source by qualification code
 * @param {string} qualificationCode
 * @returns {Promise<Subject[] | undefined>}
 */
const getAllSubjectsByYearAndQualificationCode = async (year: string, qualificationCode: string): Promise<ITASSubject[] | undefined> => {
    await sleep(1e3); // For demo purposes.
    const tas: ITAS = TAS.find((tas: ITAS) =>
        tas.qualification.code.toLowerCase() === qualificationCode.toLowerCase() && tas.year === year);
    if (!tas) {
        return undefined;
    }
    return tas.subjects;
}

/**
 * Get all qualifications from TAS data source by year
 * @param {string} year
 * @param {string} department
 * @returns {Promise<Qualification[] | undefined>}
 */
const getAllQualificationsByYearAndDepartment = async (year: string, department: string): Promise<ITASQualification[] | undefined> => {
    await sleep(1e3); // For demo purposes.
    const tas: ITAS[] = TAS.filter((tas: ITAS) =>
        tas.year === year && tas.department.toLowerCase() === department.toLowerCase());
    if (tas.length === 0) {
        return undefined;
    }
    return tas.map((tas: ITAS) => tas.qualification);
}

const getOneSubjectExtended = async (
    year: string,
    qualificationCode: string,
    subjectCode: string
): Promise<ITASSubjectExtended | undefined> => {
    await sleep(1e3); // For demo purposes.
    const tas: ITAS = TAS.find((tas: ITAS) =>
        tas.qualification.code.toLowerCase() === qualificationCode.toLowerCase() && tas.year === year);
    if (!tas) {
        return undefined;
    }
    const subject: ITASSubject | undefined = tas.subjects.find((subject: ITASSubject) =>
        subject.code.toLowerCase() === subjectCode.toLowerCase());
    if (!subject) {
        return undefined;
    }
    return {
        ...subject,
        year: tas.year,
        department: tas.department,
        qualification: tas.qualification
    };
}
export default {
    getAllSubjectsByYearAndQualificationCode,
    getAllQualificationsByYearAndDepartment,
    getOneSubjectExtended
}

