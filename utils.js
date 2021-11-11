export function format(n) {
  let res = "";
  if (n >= 60) {
    res += Math.floor(n / 60) + ":";
    n = n % 60;
    if (n < 10) {
      res += "0";
    }
  }
  res += n;
  return res;
}

export function parseUnit(str) {
  if (str.endsWith("s")) {
    return 1000;
  }
  if (str.endsWith("m")) {
    return 60000;
  }
  return 1000;
}

export function parseValue(str) {
  if (str.endsWith("s")) {
    return +str.slice(0, -1);
  }
  if (str.endsWith("m")) {
    return +str.slice(0, -1);
  }
  return +str;
}
