#!/usr/bin/env bash
# Copies the client-safe part of the web app's lib/ into src/lib/ verbatim, so both apps share one
# definition of every DTO type, validator, price calculation and config value.
#
#   npm run sync:shared   copy files (overwrites src/lib copies)
#   npm run sync:check    fail if the copies differ from the web app (use in CI / before committing)
#
# Edit these files in ../shop/lib, never in src/lib. Mobile-only code lives elsewhere.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_LIB="${WEB_LIB:-$ROOT/../shop/lib}"
OUT="$ROOT/src/lib"
CHECK=0
[[ "${1:-}" == "--check" ]] && CHECK=1

FILES=(
  types/action-result.ts types/address.ts types/cart.ts types/catalog.ts types/order.ts types/user.ts
  config/shop.ts config/site.ts config/nigeria.ts
  validators/address.ts validators/cart.ts validators/checkout.ts validators/contact.ts validators/search.ts
  pricing/calculate-totals.ts
  utils/safe-redirect.ts
  cart/merge.ts
  # Tests travel with the code so the copies are proven faithful here too.
  validators/address.test.ts validators/checkout.test.ts
  pricing/calculate-totals.test.ts utils/safe-redirect.test.ts cart/merge.test.ts
)

[[ -d "$WEB_LIB" ]] || { echo "Web lib not found at $WEB_LIB" >&2; exit 1; }

render() { # $1 = relative path → stdout
  local src="$WEB_LIB/$1"
  echo "// Synced from shop/lib/$1. Edit it there, then run \`npm run sync:shared\`."
  # Web tests use vitest; here they run on jest (same API for what we use).
  sed 's#from "vitest"#from "@jest/globals"#' "$src"
}

status=0
for f in "${FILES[@]}"; do
  dest="$OUT/$f"
  if [[ $CHECK -eq 1 ]]; then
    if ! diff -q <(render "$f") "$dest" >/dev/null 2>&1; then
      echo "OUT OF SYNC: src/lib/$f"; status=1
    fi
  else
    mkdir -p "$(dirname "$dest")"
    render "$f" > "$dest"
  fi
done

if [[ $CHECK -eq 1 ]]; then
  [[ $status -eq 0 ]] && echo "src/lib is in sync with the web app." || { echo "Run: npm run sync:shared"; exit 1; }
else
  echo "Synced ${#FILES[@]} files from $WEB_LIB"
fi
