// example rampage
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Kubernetes } from 'k6/x/kubernetes';

// const manifest = `
// apiVersion: batch/v1
// kind: Job
// metadata:
//   name: testk6
//   namespace: performance
// spec:
//   template:
//     spec:
//       containers:
//       - name: testk6
//         image: grafana/k6
//         command: ["k6", "run"]
//       restartPolicy: Never
// `

const podSpec = {
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "testk6",
    namespace: "performance"
  },
  spec: {
    replicas: 2,
    containers: [
      {
        name: "testk6",
        image: "grafana/k6",
        command: ["sh", "-c", "sleep 30"]
      }
    ]
  }
}

export const options = {
  stages: [
    { duration: '5m', target: 10 },
  ],
};

export function setup() {
  // const kubernetes = new Kubernetes();
  // kubernetes.apply(manifest)

  // const jobs = kubernetes.list("Job", "testk6");

  // console.log(`${jobs.length} Jobs found:`);
  // pods.map(function (job) {
  //   console.log(`${job.metadata.name}`)
  // });

  const kubernetes = new Kubernetes();

  kubernetes.create(podSpec)

  const pods = kubernetes.list("Pod", "performance");

  console.log(`${pods.length} Pods found:`);
  pods.map(function(pod) {
    console.log(`  ${pod.metadata.name}`)
  });
}

export default function () {
  // const jobs = kubernetes.list("Job", "performance-test");
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
