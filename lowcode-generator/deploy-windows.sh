#!/bin/bash
chmod 755 ossutil64
npm run build-test
./ossutil64 rm oss://{bucket-generator}/ -r --config-file ./.ossutilconfig
./ossutil64 cp -r dist/ oss://{bucket-generator}/  --config-file ./.ossutilconfig
