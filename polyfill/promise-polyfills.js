Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then(
  console.log
);
/* Preserve result order.
Resolve only when all promises complete.
Reject immediately if any promise fails. */

function promiseAllPolyfill(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve([]);
      return;
    }

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          results[i] = value; // to preserve order
          completed++;

          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

promiseAllPolyfill([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
  .then((results) => {
    console.log("Polyfill results:", results);
  })
  .catch((error) => {
    console.error("Polyfill error:", error);
  });

  Promise.allSettled([Promise.resolve("Success"), Promise.reject("Error")]).then((results) => {
    console.log("All Settled Results:", results);
  });
/* Waits for all promises to settle (either fulfilled or rejected).
Returns an array of objects describing the outcome of each promise. 

Never rejects.

Returns status of every promise. */

