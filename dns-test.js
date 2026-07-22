const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.cluster0.m2a8fwd.mongodb.net", (err, records) => {
  console.log("ERROR:", err);
  console.log("RECORDS:", records);
});