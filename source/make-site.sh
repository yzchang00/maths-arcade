#!/bin/bash
# Builds the GitHub Pages version into site/ from the arcade/ part files.
set -e
A=arcade; S=site
cd "$(dirname "$0")"
bash $A/build.sh >/dev/null
H=$A/1-head.html
{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  sed -n '1,/<\/style>/p' $H
  echo '<style>[hidden]{display:none!important}</style></head><body>'
  sed -n '/<\/style>/,$p' $H | sed '1d'
  echo '<script>'
  cat $(sed -n "s/.*cat \(2-kit.js.*5-hub.js\).*/\1/p" $A/build.sh | sed "s#\([^ ]*\.js\)#$A/\1#g")
  echo '</script>'
  echo '<script type="module" src="backend.js?v=2"></script>'
  echo '</body></html>'
} > $S/index.html
node -e "
const fs=require('fs');const s=fs.readFileSync('arc.js','utf8');const m={};
for(const x of s.matchAll(/addGame\('([^']+)',\{level:'([^']+)'[^}]*?title:'([^']+)'/g))m[x[1]]=[x[3],x[2]];
fs.writeFileSync('$S/dashboard.html',fs.readFileSync('dashboard.src.html','utf8').replace('/*TITLES*/{}',JSON.stringify(m)));"
cp $A/manifest.json $A/icon-192.png $A/icon-512.png $S/
mkdir -p $S/source && cp $A/*.js $A/1-head.html $A/build.sh $S/source/ && cp make-site.sh dashboard.src.html $S/source/
echo SITE-OK
