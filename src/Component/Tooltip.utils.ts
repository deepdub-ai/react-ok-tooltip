export function createCssVarsForStyleProp(cssVars: {
  [name: string]: string | number;
}) {
  return cssVars as any;
}

export function cx(...args: (string | null | undefined)[]) {
  return args.filter(Boolean).join(' ');
}
