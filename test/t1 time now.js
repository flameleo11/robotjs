const start = Date.now();

console.log('starting timer...');
// expected output: starting timer...

setTimeout(() => {
  const ms = Date.now() - start;

  console.log(`seconds elapsed = ${Math.floor(ms)}`);
  // expected output: seconds elapsed = 2
}, 500);