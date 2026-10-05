// Shared by highlighting and reading-time generation so visible included code agrees.
export function collectCodeInclude(includes: Map<string, string>, key: string, source: string) {
  const lines: string[] = [];
  for (const line of source.split("\n")) {
    const section = line.trim().match(/^\/\/ - (\S+)/)?.[1];
    if (section) includes.set(`${key}-${section}`, lines.join("\n"));
    else lines.push(line);
  }
  includes.set(key, lines.join("\n"));
}

export function expandCodeIncludes(code: string, includes: Map<string, string>) {
  return code.replace(/\/\/\s*@include:\s*(\S+)/g, (_, key: string) => includes.get(key) ?? "");
}
