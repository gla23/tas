fetch("verseCounts.csv")
  .then(response => response.text())
  .then(val => extract(val));

const extract = text => {
  let ans = [];
  let lines = text.split("\r\n");
  lines = lines.map(line => line.split(","));
  lines.forEach((arr, index) => {
    let book = arr[0] - 1;
    let chapter = arr[1] - 1;
    ans[book] = ans[book] || [];
    ans[book][chapter] = arr[2];
  });

  console.log(JSON.stringify(ans.slice(0, 39)));
  console.log(JSON.stringify(ans.slice(39)));
};
