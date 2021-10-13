"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3JsonPromise = void 0;
const AWS = require('aws-sdk');
const _ = require("lodash");
const filters = {
    TASK: row => _.pick(row, [
        'task_id',
        'task_code',
        'task_name',
        'task_type',
        'wbs_id',
        'target_start_date',
        'target_end_date',
        'act_start_date',
        'act_end_date',
        'reend_date'
    ]),
    TASKPRED: row => _.pick(row, ['task_pred_id', 'pred_type', 'pred_task_id', 'task_id', 'lag_hr_cnt']),
    PROJECT: row => row,
    PROJWBS: row => _.pick(row, ['wbs_id', 'wbs_short_name', 'wbs_name', 'parent_wbs_id', 'seq_num'])
};
const getS3JsonPromise = (filename, filteredData, bucketRegion, bucket, folder, tags) => {
    if (filters[filename] && filteredData.length) {
        const s3Client = new AWS.S3({ region: bucketRegion });
        const jsonContent = { mappers: {}, data: [] };
        const filteredFirstElement = filters[filename](filteredData[0]);
        _.each(Object.keys(filteredFirstElement), (key, idx) => {
            jsonContent.mappers[key] = idx;
        });
        _.each(filteredData, dp => {
            jsonContent.data.push(Object.keys(filteredFirstElement).map(key => dp[key]));
        });
        const jsonString = JSON.stringify(jsonContent);
        const key = `${folder}/${filename}.json`;
        const param = {
            Bucket: bucket,
            Key: key,
            Body: jsonString,
            ContentType: 'application/json',
            Tagging: tags
        };
        return s3Client.upload(param).promise();
    }
    return Promise.resolve();
};
exports.getS3JsonPromise = getS3JsonPromise;
//# sourceMappingURL=data-to-s3-json-filtered.js.map