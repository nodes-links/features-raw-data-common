import { RawDataCommonService } from './raw-data-common.service';
import { TableConfigCommonService } from './table-config-common.service';
/**
 *
 * @export
 * @class ZipCommonService
 */
export declare class ZipCommonService {
    private rawDataService;
    private tableConfig?;
    /**
     * Creates an instance of ZipCommonService.
     *
     * @param {RawDataCommonService} rawDataService
     * @param {TableConfigCommonService} [tableConfig]
     * @memberof ZipCommonService
     */
    constructor(rawDataService: RawDataCommonService, tableConfig?: TableConfigCommonService);
    /**
     * Generates a zip
     *
     * @param {boolean} removeNames
     * @param {boolean} [useNlSuffix=false]
     * @param {string} [resultType='blob']
     * @param {boolean} current whether to get current version and ignore versionRef
     * @returns {Promise<Blob>}
     * @memberof ZipCommonService
     */
    generateZip(versionRef: any, removeNames: boolean, useNlSuffix?: boolean, resultType?: string): Promise<any>;
}
//# sourceMappingURL=zip-common.service.d.ts.map