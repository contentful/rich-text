import { readdir } from 'fs';
import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

/**
 * This is a generalized onComplete callback for each of the Benchmark objects.
 * `event.target` returns the complete Benchmark object itself, while in its
 * stringified form, we get a nice outputtable summary of the benchmark's
 * perf data (appx ops/sec, # runs sampled).
 */
const onComplete = (event: { target: object }): void => {
  console.log(event.target.toString());
};

readdir(__dirname, (err, files) => {
  if (err) {
    throw err;
  }

  const benchmarks: Array<[string, Function]> = Object.entries(
    files
      .filter((name) => name !== 'index.ts')
      .map((name): { [key: string]: Function } => require(`./${name}`))
      .reduce((allBenchmarks, fileBenchmarks) => Object.assign(
        allBenchmarks,
        fileBenchmarks
      ), {})
  );

  for (const [name, benchmark] of benchmarks) {
    suite.add(name, benchmark, { onComplete });
  }

  suite
    .on('complete', () => console.log('\n✅ Completed all benchmarks'))
    .run({ async: true });
});
