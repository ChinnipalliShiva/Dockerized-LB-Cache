let a = [10, 3, 1, 0, 2, 3, 2];
let l = a.length;
let b = new Array(l).fill(1);
let c = 0;
if(a[0]>a[1]){
    c++;
    b[0] = c + 1;
}
for (let i = 1; i < b.length - 1; i++) {
  if (a[i] > a[i+1] || a[i]>a[i-1]) {
    c++;
    b[i] = c + 1;
  } else {
    c = 0;
    b[i] = b[i];
  }
}
console.log("final", b);
// [1, 2, 3, 1, 10, 12, 2][(1, 2, 3, 1, 2, 3, 1)];
