;(function (window) {
  window.createClient = createClient;

  function createClient(namespace) {
    namespace = namespace || 'chatx';

    const url = `http://185.5.54.166:${port}/${namespace}`;
    const socket = io(url, {
      query: 'token=abc'
    });

    const listenersByActionType = {};

    const actionHandler = actionHandlerFactory(namespace, listenersByActionType);

    socket.connect();

    socket.on('action', actionHandler);

    socket.once('error', action => {
      socket.off('action', actionHandler);
      socket.destroy();
      console.log(`${namespace}/error`, action);
    });

    return {
      socket: socket,
      send: sendFactory(socket),
      on: subscribeAction(listenersByActionType)
    }
  }

  function subscribeAction(listenersByActionType) {
    return function subscribe(actionType, callback) {
      const listeners = listenersByActionType[actionType] || [];

      listenersByActionType[actionType] = listeners;
      listeners.push(callback);

      return () => {
        const index = listeners.indexOf(callback);

        listeners.splice(index, 1);
      }
    };
  }

  function actionHandlerFactory(namespace, listenersByActionType) {
    return function actionHandler(action) {
      const listeners = listenersByActionType[action.type];

      if (Array.isArray(listeners)) {
        listeners.forEach(listener => listener(action.payload));
      }

      console.log(`${namespace}/S2C ACTION`, action);
    }
  }

  function sendFactory(socket) {
    return function send(actionType, payload) {
      socket.emit('action', {
        type: actionType,
        payload: payload
      })
    }
  }
})(window);