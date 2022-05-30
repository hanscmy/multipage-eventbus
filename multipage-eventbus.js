(function (win) {
  var options = {
    globalTopic: 'multi-page-event-bus-global-topic'
  }

  var eventListenerMap = {}

  function emit(event, data) {
    var msg = {
      topic: options.globalTopic,
      event: event,
      data: data
    }
    top.postMessage(msg, '*')
  }

  function on(event, callback) {
    var listeners = eventListenerMap[event]
    if (listeners) {
      listeners.push(callback)
    } else {
      listeners = []
      listeners.push(callback)
      eventListenerMap[event] = listeners
    }
  }

  function init() {
    window.addEventListener('message', function (messageEvent) {
      var data = messageEvent.data
      var topic = data.topic
      var event = data.event
      var innerData = data.data
      if (options.globalTopic === topic) {
        // 事件分发给当前页面的iframe
        var iframes = document.querySelectorAll('iframe')
        if (iframes && iframes.length > 0) {
          for (let i = 0; i < iframes.length; i++) {
            iframes[i].contentWindow.postMessage(data, '*')
          }
        }

        // 查询事件监听并调用
        var listeners = eventListenerMap[event]
        if (listeners && listeners.length > 0) {
          for (let i = 0; i < listeners.length; i++) {
            listeners[i](innerData)
          }
        }
      }
    })
  }

  init();

  win.MultiPageEventBus = {
    emit: emit,
    on: on
  }
})(window)
