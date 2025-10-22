const normalizePath = (value: string | null | undefined) => {
  if (!value) {
    return "/"
  }

  const withoutQuery = value.split("?")[0]?.split("#")[0] ?? "/"
  if (withoutQuery === "/") {
    return "/"
  }

  return withoutQuery.replace(/\/+$/, "") || "/"
}

export const isActiveRoute = (pathname: string | null | undefined, href: string) => {
  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (target === "/") {
    return current === "/"
  }

  return current === target || current.startsWith(`${target}/`)
}

export { normalizePath }
