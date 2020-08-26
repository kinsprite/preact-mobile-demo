export default function distRootArg() {
  let distRoot = '';

  process.argv.forEach((arg) => {
    const found = arg.match(/^-distRoot=["']?(.*)["']?$/);

    if (found) {
      [, distRoot] = found;

      // remove last ' or "
      if (distRoot) {
        const lastChar = distRoot.charAt(distRoot.length - 1);

        if (lastChar === '"' || lastChar === "'") {
          distRoot = distRoot.slice(0, distRoot.length - 1);
        }
      }
    }
  });

  return distRoot;
}
