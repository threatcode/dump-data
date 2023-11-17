var connections = [];

self.addEventListener('connect', function onConnect(e) {
    var port = e.ports[0];
    connections.push(port);

    port.addEventListener('message', function onMessage(event) {
        connections.forEach(function aConnectionHandler(conn) {
            conn.postMessage(event.data);
        });
    }, false);

    port.start();
}, false);
