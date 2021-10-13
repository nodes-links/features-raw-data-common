import { Subject } from 'rxjs';
import { IPrimaveraTask } from '../interfaces/IPrimaveraTask';
/**
 * This class provides access to events related with processing the raw data to extract graph data.
 * By using Subject, it is possible to use this service for both subscribing and triggering these events.
 *
 * @export
 * @class RawDataCommonEvents
 */
export declare class RawDataCommonEvents {
    /**
     * This is triggered when a project task is discovered in the raw data.
     *
     * @type {Subject<IPrimaveraTask[]>}
     * @memberof RawDataCommonEvents
     */
    tasksDiscovered: Subject<{
        versionRef?: any;
        tasks: IPrimaveraTask[];
        current: boolean;
    }>;
    /**
     * This is triggered when an edge (i.e. relationship between two tasks) is discovered in the raw data.
     *
     * @type {Subject<{ sourceId: string; targetId: string; lag: number; type: string }[]>}
     * @memberof RawDataCommonEvents
     */
    edgesDiscovered: Subject<{
        versionRef?: any;
        edges: {
            sourceId: string;
            targetId: string;
            lag: number;
            type: string;
        }[];
        current: boolean;
    }>;
    /**
     * This is triggered by the primavera parsing service right before it starts processing the results.
     *
     * @type {Subject<void>}
     * @memberof RawDataCommonEvents
     */
    initializing: Subject<void>;
    /**
     * This is triggered when processing results completed
     *
     * @type {Subject<void>}
     * @memberof RawDataCommonEvents
     */
    processingResultsCompleted: Subject<{
        versionRef?: any;
        rawData: any;
        processingPerformed: boolean;
    }>;
    /**
     * This is triggered when the current version is changing
     *
     * @type {Subject<void>}
     * @memberof RawDataCommonEvents
     */
    currentVersionChanging: Subject<{
        versionRef?: any;
    }>;
    /**
     * This is triggered when a new version is initialized
     *
     * @type {Subject<void>}
     * @memberof RawDataCommonEvents
     */
    initialized: Subject<{
        versionRef?: any;
        current?: boolean;
    }>;
}
//# sourceMappingURL=raw-data-events.d.ts.map