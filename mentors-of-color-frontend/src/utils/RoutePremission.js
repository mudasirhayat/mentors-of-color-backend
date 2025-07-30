const commonPaths = ["/chat", "/sessions", "/profile"]

const routePermissions = {
  "account_user": ["/users", "/programs", "/profile"],
  "mentor": commonPaths,
  "mentee": commonPaths,
  "moderator": commonPaths
}

export default routePermissions