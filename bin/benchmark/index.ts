import Benchmark from 'benchmark';
import { readdir } from 'fs';
import { resolve } from 'path';

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

const packageNameArg = process.argv[2];
if (!packageNameArg) {
  console.log('❌ Expected a package name as an argument\n');
  process.exit(1);
}

/**
 * A leading @contentful/ is allowed as an ergonomic courtesy, since this
 * matches the Lerna --scope expectations for similar commands (which refer
 * to the npm package name). But we need to strip this before passing it to
 * `path.resolve`.
 */
const packageName = packageNameArg.replace(/^@contentful\//, '');

const paths = [__dirname, '../../packages', packageName, 'bin/benchmark'];

const benchmarkPath = resolve(...paths);

readdir(benchmarkPath, (err, files) => {
  if (err) {
    if (err.code !== 'ENOENT') {
      /**
       * Most likely the ENOENT error will arise from
       * 1) a typo
       * 2) a package without benchmarks
       * In an edge case, we should just throw whatever we get instead.
       */
      throw err;
    }
    console.log(`❌ Couldn't find benchmarks for "${packageNameArg}"\n`);
    process.exit(1);
  }

  const benchmarks: Array<[string, () => void]> = Object.entries(
    files
      .map((name): { [key: string]: () => void } => require(resolve(...paths, name)))
      .reduce((allBenchmarks, fileBenchmarks) => Object.assign(allBenchmarks, fileBenchmarks), {}),
  );

  for (const [name, benchmark] of benchmarks) {
    suite.add(name, benchmark, { onComplete });
  }

  suite
    .on('complete', () => {
      console.log('\n✅ Completed all benchmarks');
      process.exit(0);
    })
    .run({ async: true });
});
