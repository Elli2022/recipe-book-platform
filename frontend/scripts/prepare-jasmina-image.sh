#!/bin/bash
# Använd din egna foto (inte AI-genererad).
# 1. Spara chat-bilden som: public/images/jasminas-halloumisallad-original.jpg
# 2. Kör: npm run prepare:jasmina-image

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/images/jasminas-halloumisallad-original.jpg"
OUT="$ROOT/public/images/jasminas-halloumisallad.jpg"

if [[ ! -f "$SRC" ]]; then
  echo "Saknar källbild: $SRC"
  echo "Spara bilden från chatten dit (högerklick → Spara bild som…)."
  exit 1
fi

# Beskär ~8% från kanterna (mindre duk/servis), skala till webb, JPEG.
WORK="$(mktemp -t jasmina.XXXXXX.jpg)"
cp "$SRC" "$WORK"

W=$(sips -g pixelWidth "$WORK" | awk '/pixelWidth/{print $2}')
H=$(sips -g pixelHeight "$WORK" | awk '/pixelHeight/{print $2}')
CROP_W=$((W * 84 / 100))
CROP_H=$((H * 84 / 100))
OFF_X=$(((W - CROP_W) / 2))
OFF_Y=$(((H - CROP_H) / 2))

sips -c "$CROP_H" "$CROP_W" --cropOffset "$OFF_Y" "$OFF_X" "$WORK" >/dev/null
sips -Z 1200 -s format jpeg -s formatOptions 82 "$WORK" --out "$OUT" >/dev/null
rm -f "$WORK"

echo "Klar: $OUT ($(du -h "$OUT" | awk '{print $1}'))"
