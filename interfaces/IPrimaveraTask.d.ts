import { Moment } from 'moment';
export interface IPrimaveraTask {
    id: string;
    name: string;
    code: string;
    startDate: Moment;
    endDate: Moment;
    actualStartDate: Moment;
    actualEndDate: Moment;
    reEndDate: Moment;
    type: 'task' | 'milestone';
    rawType: string;
    wbsId: string;
    wbsName: string;
    rawTargetStartDate: Date;
    rawTargetEndDate: Date;
    rawActualStartDate: Date;
    rawActualEndDate: Date;
    rawReEndDate: Date;
}
//# sourceMappingURL=IPrimaveraTask.d.ts.map