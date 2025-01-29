export function foysTransform(solde: number) {
  let a = solde
    .toFixed(3)
    .split(",")
    .map((e) => parseInt(e));

  return Math.sign(solde) * (a[0] + a[1]);
}
