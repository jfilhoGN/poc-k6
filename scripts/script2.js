// example rampage
//https://k6.io/docs/using-k6/execution-context-variables/#__vu-and-__iter-discouraged
//https://k6.io/docs/examples/data-parameterization/#retrieving-unique-data
import http from 'k6/http';
import { check, sleep } from 'k6';
import {exec, scenario} from 'k6/execution';

export function randomItem(arrayOfItems) {
  return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
}

export const options = {
  stages: [
    { duration: '1m', target: 3 }
  ],
};

function getItem(arrayOfItems, iteration) {
  return arrayOfItems[iteration]
}

export default function () {
  const array = []
  const size = 2000
  for (let i = 0; i < size; i++) {
    array.push(i)
  }
  let id = getItem(array, `${scenario.iterationInTest}`)
  console.log(id)
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
