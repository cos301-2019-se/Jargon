import { Timestamp } from "rxjs";

export class Projects {
    projectName: string;
    whiteList : string[];
    blacklist: string[];
    source: string;
    startTime: Timestamp<BigInteger>;
    trackTime: Timestamp<BigInteger>;
}
