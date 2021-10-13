"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaveraParsingCommonService = void 0;
/**
 * This service is responsible for converting the result produced by the (XER -> arrays) parsing process
 * into raw/tabular-friendly and graph-friendly formats and emitting it to the corresponding services.
 */
class PrimaveraParsingCommonService {
    /**
     * Creates an instance of PrimaveraParsingCommonService.
     *
     * @memberof PrimaveraParsingCommonService
     */
    constructor(_rawData) {
        this._rawData = _rawData;
    }
    /**
     * Each row is processed in sequence and the tables/headers/rows are extracted. For examples of a primavera files see
     * [here](https://drive.google.com/drive/folders/1-hNWs8TBskLEMLuJiplfyF7cBJ3iEEHc). For details on the primavera export
     * schema see [here](https://docs.oracle.com/cd/E38975_01/English/Mapping_and_Schema/Data_Mapping_Docs/OdsFieldMapTable.html).
     * @param results The results returned from parsing the primavera file into an array of arrays.
     */
    parseResults(results) {
        try {
            let index = -1;
            let headers = [];
            this._rawData.startRawDataIngestion();
            let foundDataRow = false;
            results.data.forEach(row => {
                const rowType = row[0];
                if (rowType === '%T') {
                    // Table row
                    this.processTableRow(++index, row);
                }
                else if (rowType === '%F') {
                    // Headers row
                    headers = this.processHeaderRow(row, index);
                }
                else if (rowType === '%R') {
                    // Data row
                    this.processDataRow(headers, row, index);
                    foundDataRow = true;
                }
            });
            if (!foundDataRow)
                throw new Error('No project data present in the XER');
            this._rawData.finishRawDataIngestion();
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Processes a new data row.
     * @param headers The headers row is used to get the keys for the row object to be produced.
     * @param row The row data is used to get the values for the row object to be produced.
     * @param index The index of the table this row belongs to.
     */
    processDataRow(headers, row, index) {
        const newRow = {};
        for (let i = 0; i < headers.length; i++) {
            newRow[headers[i]] = row[i + 1];
        }
        this._rawData.addRow(index, newRow);
    }
    /**
     * Processes the header row for the table at the given index.
     * @param row The row containing the headers as an array of strings.
     * @param index The index of the table these are the headers of.
     */
    processHeaderRow(row, index) {
        const headers = row.slice(1);
        this._rawData.addHeaders(index, headers);
        return headers;
    }
    /**
     * Processes the row corresponding to the start of a table having the given index.
     * @param index The index of the table.
     * @param row The row corresponding to the table. This is where the table title is stored as the entry at index 1.
     */
    processTableRow(index, row) {
        const title = row[1];
        this._rawData.addTable(index, title);
    }
}
exports.PrimaveraParsingCommonService = PrimaveraParsingCommonService;
//# sourceMappingURL=primavera-parsing-common.service.js.map