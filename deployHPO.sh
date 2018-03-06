#!/bin/bash
# Usage:
# ./deployHPO.sh <warname> <username> <target-env> <buildwar if something is here> 
if [ "$#" -ne 4 ]; then  
	echo "Building war.. $1"
	./gradlew clean war -DwarName=$1
	echo "Finished building war.. $1"
fi
if [ "$3" = "dev" ]; then
	echo "Copying War to /tmp/ on Development Server.."
	scp build/libs/$1 $2@hpo-dev01:/tmp/
	echo "Finished."
elif [ "$3" = "test" ]; then
	echo "Copying war to /tmp/ on Test Server.."
	scp build/libs/$1 $2@hpo-test01:/tmp/
	echo "Finshed."
elif [ "$3" = "prod" ]; then
	echo "Copying war to /tmp/ on Prod Server.."
	scp build/libs/$1 $2@hpo-pro01:/tmp/
	echo "Finished."
fi

