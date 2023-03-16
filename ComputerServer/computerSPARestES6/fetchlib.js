"use strict";

const http = require("http");

const fetch = (uri, fetchOptions) =>
  new Promise((resolve, reject) => {
    const url = new URL(uri);

    const { hostname, port, pathname } = url;

    const options = {
      hostname,
      port,
      path: pathname,
    };
    console.log(fetchOptions);
    console.log(options);
    Object.assign(options, fetchOptions);
    console.log(options);

    http
      .request(options, (res) => {
        const databuffer = [];

        res.on("data", (datachunk) => databuffer.push(datachunk));

        res.on("end", () =>
          resolve({
            json: () => JSON.parse(Buffer.concat(databuffer).toString()),
          })
        );
      })
      .on("error", () => reject("error"))
      .end(options.body);
  });

// fetch("http://localhost:4000/api/computers", {
//   method: "POST",
//   port: 2000,
//   headers: { "Content-Type": "application/json" },
// });

module.exports = fetch;
