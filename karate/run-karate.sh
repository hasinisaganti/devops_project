#!/bin/sh
JAR=karate/karate.jar

if [ ! -f "$JAR" ]; then
  curl -L -o "$JAR" https://github.com/karatelabs/karate/releases/download/v1.4.1/karate-1.4.1.jar
fi

PORT=3001 node src/server.js &
SERVER_PID=$!
sleep 3

java -jar "$JAR" karate/student.feature
RESULT=$?

kill $SERVER_PID
exit $RESULT
