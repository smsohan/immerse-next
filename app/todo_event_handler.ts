const { BigQuery } = require('@google-cloud/bigquery');
import { Message } from "./publish";


export default class TodoEventHandler {
    static async process(message: Message): Promise<void> {
        console.log("got message: " + JSON.stringify(message));
        const options: any = {
            projectId: process.env.PROJECT_ID
        };

        if( process.env.BQ_API_ENDPOINT && process.env.BQ_API_ENDPOINT.length > 0){
            options.apiEndpoint = process.env.BQ_API_ENDPOINT;
        }

        const bigquery = new BigQuery(options);

        await bigquery.dataset(process.env.BQ_DATASET_ID).
            table(process.env.BQ_TABLE_ID).
            insert([message]);
    }
}