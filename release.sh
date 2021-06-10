PACKAGE_VERSION=$(cat src/main/client/package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g'\
  | tr -d '[[:space:]]')
BUILD_DIR="./build/libs"
./gradlew clean war -DwarName="hpo-web-$PACKAGE_VERSION.war_" || { echo 'BUILDING WAR FILE FOR HPO-WEB' ; exit 1; }
echo "HPO-WEB Database Dump"
mysqldump -u root -p --opt hpo_web  > $BUILD_DIR/hpo_web.$PACKAGE_VERSION.sql || { echo 'Failed to dump database' ; exit 1; }
echo "Copying to test sever..."
scp $BUILD_DIR/hpo-web-$PACKAGE_VERSION.war_ $BUILD_DIR/hpo_web.$PACKAGE_VERSION.sql cthpo02lt:/tmp
