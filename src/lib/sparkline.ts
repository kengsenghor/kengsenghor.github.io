const fmt = (n: number) => String(Math.round(n * 10) / 10);

/** SVG polyline points for a small trend line; the first value sits on the left edge and the last on the right. */
export function sparklinePoints(values: number[], width: number, height: number, pad = 2): string {
  const v = values.filter((n) => Number.isFinite(n));
  if (v.length === 0) return '';
  const min = Math.min(...v);
  const max = Math.max(...v);
  return v
    .map((n, i) => {
      const x = v.length === 1 ? 0 : (i / (v.length - 1)) * width;
      const y = max === min ? height / 2 : height - pad - ((n - min) / (max - min)) * (height - 2 * pad);
      return `${fmt(x)},${fmt(y)}`;
    })
    .join(' ');
}

export function describeSeries(values: number[], unit = ''): string {
  const v = values.filter((n) => Number.isFinite(n));
  if (v.length === 0) return 'No data.';
  const first = v[0];
  const last = v[v.length - 1];
  const trend = last > first ? 'Rising.' : last < first ? 'Falling.' : 'Flat.';
  return `${v.map((n) => `${n}${unit}`).join(', ')}. ${trend}`;
}
