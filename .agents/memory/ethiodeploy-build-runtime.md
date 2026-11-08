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

The repository's valid `nixpacks.toml` install override was present in the exact commit cloned by EthioDeploy, but Nixpacks 1.41 still generated `npm ci`. The remote builder therefore ignored or superseded the file configuration.

**Why:** Local configuration alone did not change the remote build plan, so another commit with the same TOML would not address the failure.

**How to apply:** Set the build-time `NIXPACKS_INSTALL_CMD` override (or the provider's equivalent) to `npm install --no-audit --no-fund --package-lock=true`, then verify the generated plan says `npm install` before retrying. Keep security auditing as a separate check.

EthioDeploy's explicit install-command setting successfully changed the plan to `npm install`, but both `npm ci` and `npm install` have then exited after roughly 72 seconds with only npm's generic “Exit handler never called” output. The logs also warn that npm's production setting is enabled.

**Why:** Changing install subcommands alone did not resolve the remote failure, and production-mode omission would also exclude Vite/esbuild needed by the build.

**How to apply:** Include `--include=dev` in the install command so the build tools are installed. If the generic exit repeats, use `--verbose` to capture the last npm actions and obtain the remote debug log; do not infer a package-specific failure from the generic message.
