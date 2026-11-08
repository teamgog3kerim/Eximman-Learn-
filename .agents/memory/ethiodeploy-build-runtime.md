---
name: EthioDeploy build runtime
description: Deployment-specific Node.js and optional native package constraints seen with EthioDeploy's Nixpacks builds.
---

When troubleshooting EthioDeploy builds, use the Node version shown in Nixpacks logs rather than assuming the platform's Node major is current. The observed Nixpacks image selected Node 22.11.0, while Vite 8 / Rolldown required Node 22.12.0 or newer and `npm ci` failed to provide its optional Linux native binding.

**Why:** A local build can pass with existing `node_modules` and a supported Node version even when the remote clean install fails under Nixpacks' older patch release.

**How to apply:** Before raising Vite or its React plugin major version, check the target's exact Node runtime and validate with a fresh Linux install. Prefer tool versions compatible with the actual runtime when the provider cannot select a newer patch.

In a later deployment attempt, `npm ci` still exited with npm's generic “Exit handler never called” message after about 74 seconds, even after install-time audit/funding calls were disabled. A clean install, lint, and build passed locally under Node 22.11.0/npm 9.9.4.

**Why:** Repeated remote failures that cannot be reproduced with the same runtime and lockfile are not evidence for another dependency edit; the npm debug log or build-worker diagnostics are needed.

**How to apply:** If this pattern recurs, stop changing the dependency tree and obtain the build container's npm debug log or provider-side timeout/resource information.
