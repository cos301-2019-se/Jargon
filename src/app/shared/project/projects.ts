import { Timestamp } from 'rxjs/internal/operators/timestamp';

export class Projects {
    project_name: string;
    whiteList: string[];
    blacklist: string[];
    source: string;
    startTime: Timestamp<BigInteger>;
    trackTime: Timestamp<BigInteger>;
}
