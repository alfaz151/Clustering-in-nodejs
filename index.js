const cluster = require("node:cluster");
const os = require("os");
const express = require("express");

const numberOfCPUCores = os.cpus();

if(cluster.isMaster) {
    console.log(`Information about cores: \n ${JSON.stringify(numberOfCPUCores)}`);
    console.log(`Master process ${process.pid} is running`);
    for(let core of numberOfCPUCores) {
        console.log(`Starting worker process using fork()`)
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    })
} else {
    const app = express();

    app.get("/", async (req, res) => {
        console.log("Oops! Endpoint hitted.")
        // return res.json("Success");
        return res.json(await new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve("Success");
            }, 10000);
        }));
    })

    app.listen(3000, () => {
        console.log(`Worker process ${process.pid} is listening on port 3000`);
    })
}