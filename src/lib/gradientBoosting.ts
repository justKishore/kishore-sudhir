// Ported as-is from the mockup's buildGB()/gbPath()/drawGB().
// Target: sum of two sines on 97 points. Model: 7 rounds of depth-3 regression trees, learning rate .55.

export type GB = { xs: number[]; ys: number[]; preds: number[][]; mses: number[] };

export const GB_ROUNDS = 7;

export function buildGB(): GB {
  const n = 97;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    xs.push(x);
    ys.push(0.55 * Math.sin(2 * Math.PI * 1.25 * x + 0.3) + 0.22 * Math.sin(2 * Math.PI * 3.1 * x + 1.2));
  }
  const fit = (res: number[], lo: number, hi: number, depth: number, out: number[]) => {
    let sum = 0;
    for (let i = lo; i < hi; i++) sum += res[i];
    let best = -1;
    let bestGain = -Infinity;
    let l = 0;
    if (depth > 0 && hi - lo > 1)
      for (let s = lo + 1; s < hi; s++) {
        l += res[s - 1];
        const g = (l * l) / (s - lo) + ((sum - l) * (sum - l)) / (hi - s);
        if (g > bestGain) {
          bestGain = g;
          best = s;
        }
      }
    if (best < 0) {
      const m = sum / (hi - lo);
      for (let i = lo; i < hi; i++) out[i] = m;
      return;
    }
    fit(res, lo, best, depth - 1, out);
    fit(res, best, hi, depth - 1, out);
  };
  const mse = (P: number[]) => P.reduce((a, p, i) => a + (ys[i] - p) * (ys[i] - p), 0) / n;
  const mean = ys.reduce((a, b) => a + b, 0) / n;
  let F = ys.map(() => mean);
  const preds = [F.slice()];
  const mses = [mse(F)];
  for (let r = 0; r < GB_ROUNDS; r++) {
    const res = ys.map((y, i) => y - F[i]);
    const tree = new Array<number>(n);
    fit(res, 0, n, 3, tree);
    F = F.map((f, i) => f + 0.55 * tree[i]);
    preds.push(F.slice());
    mses.push(mse(F));
  }
  return { xs, ys, preds, mses };
}

/** SVG path in the 600x300 viewBox. */
export function gbPath(gb: GB, vals: number[]) {
  return "M" + vals.map((v, i) => (20 + 560 * gb.xs[i]).toFixed(1) + " " + (150 - 150 * v).toFixed(1)).join("L");
}

/** Model curve at scroll progress p (0..1), interpolated between rounds. */
export function gbModelAt(gb: GB, p: number) {
  const pos = Math.max(0, Math.min(GB_ROUNDS, p * GB_ROUNDS));
  const k = Math.min(GB_ROUNDS - 1, Math.floor(pos));
  const f = pos - k;
  const a = gb.preds[k];
  const b = gb.preds[k + 1];
  return a.map((v, i) => v + (b[i] - v) * f);
}
