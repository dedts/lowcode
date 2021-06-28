#!/bin/bash
chmod 755 ossutil64
npm run build-test
./ossutil64 rm oss://{bucket-designer}/ -r --config-file ./.ossutilconfig
./ossutil64 cp -r dist/ oss://{bucket-designer}/  --config-file ./.ossutilconfig
