const MAX_TIMECOST = 500;
const TIME_COST_INTERVAL = 20;
const ITERATIONS = 10;
const TEST_PASS = 'this is an almost decent password';

const argon2 = require('argon2');

const results = {};

let currentTimeCost = 0;
let currentIteration = 0;


function measure(prev)
{
    if (prev)
    {
        const diff = process.hrtime(prev);
        return diff[0] + (diff[1] / 1e9);
    }
    return process.hrtime();
}

function nextTimeCost()
{
    currentTimeCost += TIME_COST_INTERVAL;
    currentIteration = 0;

    if (currentTimeCost > MAX_TIMECOST)
    {
        summarize();
        return;
    }

    results[currentTimeCost] = [];

    console.log(`testing time cost ${currentTimeCost}`);
    nextIteration();
}

function nextIteration()
{
    currentIteration += 1;
    if (currentIteration > ITERATIONS)
    {
        nextTimeCost();
        return;
    }

    const start = measure();

    argon2.hash(TEST_PASS, {timeCost: currentTimeCost, type: argon2.argon2id})
        .then(hash =>
        {
            const delta = measure(start);
            // console.log(`    iteration ${currentIteration}: ${delta}s`);
            results[currentTimeCost].push(delta);
            nextIteration();
        })
        .catch(err =>
        {
            console.log('there was an error', err);
            console.log('aborting...');
            process.exit(1);
        })
    ;

}

function summarize()
{
    const summaries = Object.keys(results).map((timeFactor) =>
    {
        const values = results[timeFactor].reduce(([min, max, total, count], delta) =>
        {
            min = Math.min(min, delta);
            max = Math.max(max, delta);
            total = total + delta;
            count += 1;

            return [min, max, total, count];
        }, [Infinity, -Infinity, 0, 0]);

        return [timeFactor].concat(values);
    });
    console.log('\nsummary:');
    summaries.forEach((summary) =>
    {
        console.log(`  ${summary[0]}: min=${summary[1]}, max=${summary[2]}, mean=${summary[3]/summary[4]}`);
    });
}

console.log(`running work factor test with max time cost of ${MAX_TIMECOST} and ${ITERATIONS} iterations`);

nextTimeCost();
