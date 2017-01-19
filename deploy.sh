#!/bin/bash
inliner -i http://localhost:8080 > ./dist/index.html
surge dist -d gimmeadog.khoanguyen.me
