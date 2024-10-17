let a = { n: { a: "" } };

let start = performance.now();
for (let index = 0; index < 100000; index++) {
  a = { ...a, n: { a: `${a.n}${index}`.slice(0, 100) } };
}
let end = performance.now();
let duration = end - start;
console.log(`Operation took ${duration.toFixed(2)} ms`);

// ---

a = { n: { a: crypto.randomUUID() } };

start = performance.now();
for (let index = 0; index < 100000; index++) {
  a.n = { a: `${a.n}${index}`.slice(0, 100) };
}
end = performance.now();
duration = end - start;
console.log(`Operation took ${duration.toFixed(2)} ms`);
