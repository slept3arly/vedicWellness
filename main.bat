taskkill /F /IM node.exe
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
