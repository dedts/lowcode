#!/bin/bash
chmod 755 ossutilmac64
npm run build-test
./ossutilmac64 rm oss://{bucket-designer}/ -r --config-file ./.ossutilconfig
./ossutilmac64 cp -r dist/ oss://{bucket-designer}/  --config-file ./.ossutilconfig
