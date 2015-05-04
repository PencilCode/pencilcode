#!/bin/bash

cd ${0%/*}
PASSFILE=$(mktemp --suffix .json)

{ \
  echo "{";
  ls -1 /mnt/datadisk/data/*/.key/* \
    | sed -e 's/^.*\/\([^/]*\)\/\.key\/k\(.*\)$/"\1": "\2",/' \
    | sed -e '$s/,$//'; \
  echo "}"; \
} > $PASSFILE

SERVERS=web1,web2

if [ `hostname -s` = 'loadtest1' ]; then
  PASSFILE=$PASSFILE SERVERS=$SERVERS locust -f simpleloadtest.py --host=http://web --master &
fi

PASSFILE=$PASSFILE SERVERS=$SERVERS locust -f simpleloadtest.py --host=http://web --slave --master-host=loadtest1

