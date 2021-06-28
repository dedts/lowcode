#!/bin/bash
chmod 755 ossutil64
npm run build-test
./ossutil64 rm oss://{sangon-backend}/ -r --config-file ./.ossutilconfig
./ossutil64 cp -r dist/ oss://{sangon-backend}/  --config-file ./.ossutilconfig
