"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipCommonService = void 0;
const tslib_1 = require("tslib");
const Papa = require("papaparse");
const _ = require("lodash");
const operators_1 = require("rxjs/operators");
const JSZip = require('jszip');
/**
 *
 * @export
 * @class ZipCommonService
 */
class ZipCommonService {
    /**
     * Creates an instance of ZipCommonService.
     *
     * @param {RawDataCommonService} rawDataService
     * @param {TableConfigCommonService} [tableConfig]
     * @memberof ZipCommonService
     */
    constructor(rawDataService, tableConfig) {
        this.rawDataService = rawDataService;
        this.tableConfig = tableConfig;
    }
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
    generateZip(versionRef, removeNames, useNlSuffix = false, resultType = 'blob') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    const tables = yield this.tableConfig.tables;
                    const zip = new JSZip();
                    this.rawDataService
                        .for(versionRef)
                        .pipe(operators_1.first())
                        .subscribe(({ raw }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        for (let i = 0; i < raw.length; i++) {
                            const table = raw[i];
                            const tableConfig = _.find(tables, (t) => t.key === table.title);
                            let tableAsString = '';
                            if (!removeNames || !tableConfig || _.every(tableConfig.columns, col => !col.isName))
                                tableAsString = Papa.unparse(table.settings.data);
                            else {
                                const masked = [];
                                const mask = {};
                                _.filter(tableConfig.columns, col => col.isName).forEach(col => {
                                    mask[col.key] = '';
                                });
                                for (let j = 0; j < table.settings.data.length; j++) {
                                    const el = table.settings.data[j];
                                    masked.push(_.assign({}, el, mask));
                                }
                                tableAsString = Papa.unparse(masked);
                            }
                            zip.file(`${raw[i].title}${tableConfig && useNlSuffix ? '_NL' : ''}.csv`, tableAsString);
                        }
                        const content = yield zip.generateAsync({ type: resultType });
                        resolve(content);
                    }));
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
}
exports.ZipCommonService = ZipCommonService;
//# sourceMappingURL=zip-common.service.js.map