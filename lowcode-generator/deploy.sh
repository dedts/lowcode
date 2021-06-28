#!/bin/bash
chmod 755 ossutilmac64
npm run build-test
./ossutilmac64 rm oss://{bucket-generator}/ -r --config-file ./.ossutilconfig
./ossutilmac64 cp -r dist/ oss://{bucket-generator}/  --config-file ./.ossutilconfig
