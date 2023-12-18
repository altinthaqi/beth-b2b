export interface SetType {
  headers: Record<string, string> & {
    "Set-Cookie"?: string | string[];
  };
  status?: number;
  redirect?: string;
}

export function redirect(
  {
    set,
    headers,
  }: {
    headers: Record<string, string | null>;
    set: SetType;
  },
  href: string,
) {
  if (headers["hx-request"] === "true") {
    set.headers["HX-Location"] = href;
  } else {
    set.redirect = href;
  }
}
