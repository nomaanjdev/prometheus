import express from "express";
import moment from "moment";
import { collectDefaultMetrics, register } from "prom-client";

const port = 3001;
const app = express();
const authToken = "mysecrettoken";

collectDefaultMetrics({
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

const authorize = (req) => {
  return req.get("Authorization") === authToken;
};

app.get("/metrics", async (req, res) => {
  if (!authorize(req)) {
    res.status(403).end();
  }
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.get("/time", (req, res) => {
  try {
    if (!authorize(req)) {
      throw "Unauthorized";
    }
    const epoch = moment().valueOf();
    res.json({ epoch });
  } catch (ex) {
    res.status(403).end(ex);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
