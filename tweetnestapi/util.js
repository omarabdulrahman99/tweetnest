const promiseTogether = async (promisesarray) => {
  await Promise.all(promisesarray.map((promise) => promise()));
};

const promiseBatchWithTime = async (
  promisesarray,
  options = {
    perBatch: 2,
    time: 550
  }
) => {
  while (promisesarray.length) {
    await promiseTogether([
      ...promisesarray.splice(0, options.perBatch),
      () => new Promise((resolve) => setTimeout(resolve, options.time))
    ]);
  }
};

module.exports = { promiseBatchWithTime, promiseTogether }