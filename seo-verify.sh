#!/usr/bin/env bash
# Verify indexability signals for every URL in sitemap.xml against the live site.
#
#   ./seo-verify.sh              # check every <loc> in sitemap.xml
#   ./seo-verify.sh /civil-works.html /projects-bihar.html
#
# Reports, per URL: final URL, HTTP status, redirect count, meta robots,
# X-Robots-Tag, canonical, whether the canonical is self-referencing, og:url
# and a pass/fail indexability verdict. Exits non-zero if any URL fails.

set -uo pipefail

HOST="https://www.bharatinfrassociate.com"
UA="Mozilla/5.0 (compatible; seo-verify/1.0)"
fail=0

urls=()
if [ "$#" -gt 0 ]; then
  for p in "$@"; do urls+=("${HOST%/}${p}"); done
else
  urls=($(grep -oE '<loc>[^<]+</loc>' sitemap.xml | sed -e 's|<loc>||' -e 's|</loc>||'))
fi

check() {
  local url="$1" body headers
  body=$(mktemp); headers=$(mktemp)

  read -r status final redirects < <(curl -sSL -A "$UA" -m 30 \
      -o "$body" -D "$headers" \
      -w '%{http_code} %{url_effective} %{num_redirects}\n' "$url" 2>/dev/null) \
    || { echo "FAIL  $url  (request error)"; rm -f "$body" "$headers"; return 1; }

  local xrobots meta canonical ogurl self verdict
  xrobots=$(grep -i '^x-robots-tag:' "$headers" | tail -1 | cut -d: -f2- | tr -d '\r' | xargs)
  meta=$(grep -oiE '<meta[^>]+name="robots"[^>]*>' "$body" \
         | grep -oiE 'content="[^"]*"' | head -1 | cut -d'"' -f2)
  canonical=$(grep -oiE '<link[^>]+rel="canonical"[^>]*>' "$body" \
         | grep -oiE 'href="[^"]*"' | head -1 | cut -d'"' -f2)
  ogurl=$(grep -oiE '<meta[^>]+property="og:url"[^>]*>' "$body" \
         | grep -oiE 'content="[^"]*"' | head -1 | cut -d'"' -f2)

  [ "$canonical" = "$final" ] && self=yes || self=no

  verdict=PASS
  [ "$status" = "200" ]                        || verdict=FAIL
  echo "${meta}${xrobots}" | grep -qi noindex  && verdict=FAIL
  [ "$self" = "yes" ]                          || verdict=FAIL
  [ "$verdict" = FAIL ] && fail=1

  printf '%s\n' "$verdict  $url"
  printf '  final=%s status=%s redirects=%s\n' "$final" "$status" "$redirects"
  printf '  robots=%s x-robots-tag=%s\n' "${meta:-<none>}" "${xrobots:-<none>}"
  printf '  canonical=%s self=%s og:url=%s\n\n' "${canonical:-<none>}" "$self" "${ogurl:-<none>}"

  rm -f "$body" "$headers"
}

echo "== robots.txt / sitemap.xml =="
for f in robots.txt sitemap.xml; do
  printf '  %s -> HTTP %s\n' "$f" \
    "$(curl -sSL -A "$UA" -m 30 -o /dev/null -w '%{http_code}' "$HOST/$f")"
done
echo

echo "== ${#urls[@]} URL(s) =="
for u in "${urls[@]}"; do check "$u"; done

[ "$fail" -eq 0 ] && echo "All URLs passed." || echo "One or more URLs failed."
exit "$fail"
