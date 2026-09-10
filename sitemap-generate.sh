#!/usr/bin/env bash
# Regenerate sitemap.xml from the HTML pages in this directory.
#
#   ./sitemap-generate.sh
#
# Each page's <lastmod> is its last git commit date, so the value stays
# truthful instead of being hand-edited and drifting. Pages carrying a
# meta robots noindex are skipped. index.html is emitted as the bare "/"
# to match its canonical.

set -euo pipefail

HOST="https://www.bharatinfrassociate.com"
OUT="sitemap.xml"

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  for f in index.html $(ls *.html | grep -v '^index\.html$'); do
    if grep -oiE '<meta[^>]+name="robots"[^>]*>' "$f" | grep -qi noindex; then
      echo "skip (noindex): $f" >&2
      continue
    fi

    lastmod=$(git log -1 --format=%cs -- "$f")
    [ -n "$lastmod" ] || lastmod=$(date -u +%F)

    [ "$f" = "index.html" ] && path="/" || path="/$f"

    printf '  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' \
      "$HOST" "$path" "$lastmod"
  done

  echo '</urlset>'
} > "$OUT"

echo "Wrote $OUT ($(grep -c '<loc>' "$OUT") URLs)."
