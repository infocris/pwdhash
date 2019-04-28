#!/bin/bash

cd "$(dirname "$0")"

. settings.conf
[ ! -e "./buildnum" ] && echo 0 > ./buildnum

BUILDNUM=$(echo $(cat ./buildnum))

cd src/

cat manifest.json \
 | sed '2 s/.*/  "name": "'"$APPNAME"'",/' \
 | sed '3 s/.*/  "version": "0.4.3.'$BUILDNUM'",/' \
> .manifest.json
mv .manifest.json manifest.json

ZIPFILE="../dist/chrome-pwdhash-$(git rev-parse --abbrev-ref HEAD).zip"
[ -e "$ZIPFILE" ] && rm "$ZIPFILE"
zip -q -r "$ZIPFILE" .

git checkout HEAD manifest.json

cd ../

(( BUILDNUM++ ))
echo $BUILDNUM > ./buildnum

