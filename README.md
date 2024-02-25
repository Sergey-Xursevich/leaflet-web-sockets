# leaflet-web-sockets

Работа с технологией Web Sockets. Освоение Web Sockets API через выполнение практических задач.

### Критерии приемки:

1. Создать небольшой WebSocket Server на Node.js (Либо на https://www.npmjs.com/package/ws либо с использованием https://www.npmjs.com/package/socket.io). `Примечание: Socket.io отличается наличием fallbacks на случай если Web Sockets не работают на данном устройстве`.
2. На FE создать `index.html` c основным скриптом и подключить к Web Socket Server. 
3. Используя карту `Leaflet`, https://leafletjs.com/, отобразите местонахождение пользователя 
4. Поменяйте местонахождение пару-тройку раз. Изменения отправляйте на `Web Socket Server` и сохраните в `DB` (вместо DB можно использовать `geojson файл`) с интервалом в 1 мин или чуть более. 
5. После этого убедитесь что web sockets server правильно записало данные в файл. Создайте тропинку маршрута на карте.