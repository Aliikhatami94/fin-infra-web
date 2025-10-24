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

interface IsActiveRouteOptions {
  exact?: boolean
}

export const isActiveRoute = (
  pathname: string | null | undefined,
  href: string,
  options?: IsActiveRouteOptions,
) => {
  const current = normalizePath(pathname)
  const target = normalizePath(href)

  if (options?.exact) {
    return current === target
  }

  if (target === "/") {
    return current === "/"
  }

  return current === target || current.startsWith(`${target}/`)
}

export { normalizePath }
