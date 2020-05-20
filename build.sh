current=`pwd`
echo $current

cd client && yarn build --aot --prod

cd $current
# rm -rf electron/src/dist/*
rm -rf electron/src/app.asar
asar pack client/build app.asar
mv app.asar electron/src
# cp -R client/build/* electron/src/dist
cd server && env CGO_ENABLED=1 go build -o bin/server main.go && env GOOS=windows CGO_ENABLED=1 GOARCH=386 CC=i686-w64-mingw32-gcc go build -o bin/server.exe main.go

cd $current
cp server/bin/server electron/src/mac-server
cp server/bin/server.exe electron/src/windows-server

cd electron && yarn build-mac && yarn build-win

