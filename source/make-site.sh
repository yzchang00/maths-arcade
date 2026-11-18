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
  echo '<style>[hidden]{display:none!important}
.aboutpanel{position:fixed;inset:0;z-index:90;background:#0b0f1acc;display:grid;place-items:center;padding:16px}.aboutpanel[hidden]{display:none!important} .aboutcard{background:var(--surface);color:var(--ink);border:3px solid var(--ink);border-radius:18px;box-shadow:0 6px 0 var(--ink);width:min(640px,100%);max-height:min(86vh,720px);overflow:auto;padding:14px 18px 18px} .abouthead{display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:-14px;background:var(--surface);padding:4px 0}.abouthead h2{font:700 1.3rem var(--display);margin:0} .aboutbody{font:500 15px/1.55 var(--body)}.aboutbody h3{font:700 1.05rem var(--display);margin:12px 0 4px}.aboutbody ul{margin:0;padding-left:20px;display:grid;gap:4px}.aboutbody p{margin:6px 0 0}</style></head><body>'
  sed -n '/<\/style>/,$p' $H | sed '1d'
  echo '<script>'
  cat $(sed -n "s/.*cat \(2-kit.js[^;]*\);.*/\1/p" $A/build.sh | sed "s#\([^ ]*\.js\)#$A/\1#g")
  echo '</script>'
  echo '<script type="module" src="backend.js?v=7"></script>'
  echo '<script src="immersive.js?v=1"></script>'
  echo '</body></html>'
} > $S/index.html
node -e "
const fs=require('fs');const s=fs.readFileSync('arc.js','utf8');const m={};
for(const x of s.matchAll(/addGame\('([^']+)',\{level:'([^']+)'[^}]*?title:'([^']+)'/g))m[x[1]]=[x[3],x[2]];
fs.writeFileSync('$S/dashboard.html',fs.readFileSync('dashboard.src.html','utf8').replace('/*TITLES*/{}',JSON.stringify(m)));"
cp $A/manifest.json $A/icon-192.png $A/icon-512.png $S/
mkdir -p $S/source && cp $A/*.js $A/1-head.html $A/build.sh $S/source/ && cp make-site.sh dashboard.src.html $S/source/
echo SITE-OK
