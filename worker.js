/**
 * Filename: worker.js
 * 
 * Worker process that handles network expensive requests
 * in the background, while the server itself is allowed
 * to listen for new, incoming requests. 
 * 
 * This is so that we won't stall the web process (server) itself 
 * when processing a network expensive request. 
 * 
 * A request is added to a FCFS scheduler (see definition in `controllers/proj2/textController.js`),
 * and all information within that job is cached using Redis.
 */

/* Modules */
const throng = require("throng");
const Queue = require("bull");
const { MongoClient } = require("mongodb");

/* Setup MongoDB instance */
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = 'datasets';

/* Connect to Heroku provided URL for Redis */
const REDIS_URL = process.env.REDIS_URL;

/* Create multiple processes to handle jobs */
let workers = process.env.WEB_CONCURRENCY;

/* Maximum number of jobs a worker should process */
const maxJobsPerWorker = 50;

function start() {
    /* Connect to named work queue. 
       We can have each controller define its specific work queue,
       and have the specific work queue's name globally passed to `worker.js` */
    let workQueue = new Queue("work", REDIS_URL);

    /* Process queued jobs */
    workQueue.process(maxJobsPerWorker, async (job) => {
        /* Connect to MongoDB instance */
        try {
            await client.connect();
        } catch (err) {
            console.log(err);
        }
        /* DB information */
        const db = client.db(dbName);
        const collection = db.collection(job.data.collection);

        /* Get cached request data from job information */
        let data = job.data.content;

        if (data instanceof Array) { // Case for multiple documents being uploaded
            console.log("Received the following documents: ", data);
            await collection.insertMany(data);
        } else { // Case for single document being uploaded
            console.log("Received the following document: ", data);
            await collection.insertOne(data);
        }
        /* Signal that we've resolved the promise */
        return Promise.resolve(); 
    });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });