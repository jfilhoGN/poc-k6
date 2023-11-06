// example rampage
//https://k6.io/docs/using-k6/execution-context-variables/#__vu-and-__iter-discouraged
//https://k6.io/docs/examples/data-parameterization/#retrieving-unique-data
import http from 'k6/http';
import { check, sleep } from 'k6';
import { exec, scenario } from 'k6/execution';
import { SharedArray } from "k6/data";

import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

export function randomItem(arrayOfItems) {
  return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
}

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '30m', target: 100 }
  ],
};

function sequencyItem(arrayOfItems, iteration) {
  return arrayOfItems[iteration]
}

const skus = new SharedArray("skus", function () {
  return papaparse.parse(open("./skus.csv"), {
    header: true,
  }).data;
});

export default function () {

  const array = []
  let skuss = sequencyItem(skus, scenario.iterationInTest)
  console.info(skuss.IdSku)
  sleep(1);
}
