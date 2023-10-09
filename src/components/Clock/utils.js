const isFunction = (value) => typeof value === 'function';
const unwrap = (maybeValue) => (isFunction(maybeValue) ? maybeValue() : maybeValue);

export const createScheduler = ({ loop, callback, cancel, schedule }) => {
  let tickId;
  const work = () => {
    if (unwrap(loop)) tick();
    unwrap(callback);
  };

  const tick = () => {
    tickId = schedule(work);
  };

  const dispose = () => {
    cancel(tickId);
  };

  tick();
  return dispose;
};

export const createAnimationLoop = (callback) =>
  createScheduler({
    callback,
    loop: true,
    cancel: cancelAnimationFrame,
    schedule: requestAnimationFrame,
  });


