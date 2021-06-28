#!/bin/bash
chmod 755 ossutilmac64
npm run build-test
./ossutilmac64 rm oss://{sangon-backend}/ -r --config-file ./.ossutilconfig
./ossutilmac64 cp -r dist/ oss://{sangon-backend}/  --config-file ./.ossutilconfig
