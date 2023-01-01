(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: self.console,
        WebSocket: self.WebSocket
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => new Date().getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${protocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              return this.subscriptions.notify(identifier, "connected");
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s2) => s2 !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s2) => s2 !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s2) => s2.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a2 = document.createElement("a");
      a2.href = url;
      a2.href = a2.href;
      a2.protocol = a2.protocol.replace("http", "ws");
      return a2.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
      };
    }
  });

  // node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@hotwired/turbo-rails/node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/alpinejs/dist/alpine.js
  var require_alpine = __commonJS({
    "node_modules/alpinejs/dist/alpine.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.Alpine = factory());
      })(exports, function() {
        "use strict";
        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value,
              enumerable: true,
              configurable: true,
              writable: true
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }
        function ownKeys(object, enumerableOnly) {
          var keys = Object.keys(object);
          if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly)
              symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
              });
            keys.push.apply(keys, symbols);
          }
          return keys;
        }
        function _objectSpread2(target) {
          for (var i2 = 1; i2 < arguments.length; i2++) {
            var source = arguments[i2] != null ? arguments[i2] : {};
            if (i2 % 2) {
              ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
              });
            } else if (Object.getOwnPropertyDescriptors) {
              Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
            } else {
              ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
              });
            }
          }
          return target;
        }
        function domReady2() {
          return new Promise((resolve) => {
            if (document.readyState == "loading") {
              document.addEventListener("DOMContentLoaded", resolve);
            } else {
              resolve();
            }
          });
        }
        function arrayUnique(array) {
          return Array.from(new Set(array));
        }
        function isTesting() {
          return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
        }
        function checkedAttrLooseCompare(valueA, valueB) {
          return valueA == valueB;
        }
        function warnIfMalformedTemplate(el, directive) {
          if (el.tagName.toLowerCase() !== "template") {
            console.warn(`Alpine: [${directive}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${directive}`);
          } else if (el.content.childElementCount !== 1) {
            console.warn(`Alpine: <template> tag with [${directive}] encountered with an unexpected number of root elements. Make sure <template> has a single root element. `);
          }
        }
        function kebabCase(subject) {
          return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
        }
        function camelCase(subject) {
          return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
        }
        function walk2(el, callback) {
          if (callback(el) === false)
            return;
          let node = el.firstElementChild;
          while (node) {
            walk2(node, callback);
            node = node.nextElementSibling;
          }
        }
        function debounce(func, wait) {
          var timeout;
          return function() {
            var context = this, args = arguments;
            var later = function later2() {
              timeout = null;
              func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }
        const handleError = (el, expression, error2) => {
          console.warn(`Alpine Error: "${error2}"

Expression: "${expression}"
Element:`, el);
          if (!isTesting()) {
            Object.assign(error2, {
              el,
              expression
            });
            throw error2;
          }
        };
        function tryCatch(cb, {
          el,
          expression
        }) {
          try {
            const value = cb();
            return value instanceof Promise ? value.catch((e2) => handleError(el, expression, e2)) : value;
          } catch (e2) {
            handleError(el, expression, e2);
          }
        }
        function saferEval(el, expression, dataContext, additionalHelperVariables = {}) {
          return tryCatch(() => {
            if (typeof expression === "function") {
              return expression.call(dataContext);
            }
            return new Function(["$data", ...Object.keys(additionalHelperVariables)], `var __alpine_result; with($data) { __alpine_result = ${expression} }; return __alpine_result`)(dataContext, ...Object.values(additionalHelperVariables));
          }, {
            el,
            expression
          });
        }
        function saferEvalNoReturn(el, expression, dataContext, additionalHelperVariables = {}) {
          return tryCatch(() => {
            if (typeof expression === "function") {
              return Promise.resolve(expression.call(dataContext, additionalHelperVariables["$event"]));
            }
            let AsyncFunction = Function;
            AsyncFunction = Object.getPrototypeOf(async function() {
            }).constructor;
            if (Object.keys(dataContext).includes(expression)) {
              let methodReference = new Function(["dataContext", ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables));
              if (typeof methodReference === "function") {
                return Promise.resolve(methodReference.call(dataContext, additionalHelperVariables["$event"]));
              } else {
                return Promise.resolve();
              }
            }
            return Promise.resolve(new AsyncFunction(["dataContext", ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables)));
          }, {
            el,
            expression
          });
        }
        const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/;
        function isXAttr(attr) {
          const name = replaceAtAndColonWithStandardSyntax(attr.name);
          return xAttrRE.test(name);
        }
        function getXAttrs(el, component, type) {
          let directives = Array.from(el.attributes).filter(isXAttr).map(parseHtmlAttribute);
          let spreadDirective = directives.filter((directive) => directive.type === "spread")[0];
          if (spreadDirective) {
            let spreadObject = saferEval(el, spreadDirective.expression, component.$data);
            directives = directives.concat(Object.entries(spreadObject).map(([name, value]) => parseHtmlAttribute({
              name,
              value
            })));
          }
          if (type)
            return directives.filter((i2) => i2.type === type);
          return sortDirectives(directives);
        }
        function sortDirectives(directives) {
          let directiveOrder = ["bind", "model", "show", "catch-all"];
          return directives.sort((a2, b2) => {
            let typeA = directiveOrder.indexOf(a2.type) === -1 ? "catch-all" : a2.type;
            let typeB = directiveOrder.indexOf(b2.type) === -1 ? "catch-all" : b2.type;
            return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
          });
        }
        function parseHtmlAttribute({
          name,
          value
        }) {
          const normalizedName = replaceAtAndColonWithStandardSyntax(name);
          const typeMatch = normalizedName.match(xAttrRE);
          const valueMatch = normalizedName.match(/:([a-zA-Z0-9\-:]+)/);
          const modifiers = normalizedName.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
          return {
            type: typeMatch ? typeMatch[1] : null,
            value: valueMatch ? valueMatch[1] : null,
            modifiers: modifiers.map((i2) => i2.replace(".", "")),
            expression: value
          };
        }
        function isBooleanAttr(attrName) {
          const booleanAttributes = ["disabled", "checked", "required", "readonly", "hidden", "open", "selected", "autofocus", "itemscope", "multiple", "novalidate", "allowfullscreen", "allowpaymentrequest", "formnovalidate", "autoplay", "controls", "loop", "muted", "playsinline", "default", "ismap", "reversed", "async", "defer", "nomodule"];
          return booleanAttributes.includes(attrName);
        }
        function replaceAtAndColonWithStandardSyntax(name) {
          if (name.startsWith("@")) {
            return name.replace("@", "x-on:");
          } else if (name.startsWith(":")) {
            return name.replace(":", "x-bind:");
          }
          return name;
        }
        function convertClassStringToArray(classList, filterFn = Boolean) {
          return classList.split(" ").filter(filterFn);
        }
        const TRANSITION_TYPE_IN = "in";
        const TRANSITION_TYPE_OUT = "out";
        const TRANSITION_CANCELLED = "cancelled";
        function transitionIn(el, show, reject, component, forceSkip = false) {
          if (forceSkip)
            return show();
          if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_IN) {
            return;
          }
          const attrs = getXAttrs(el, component, "transition");
          const showAttr = getXAttrs(el, component, "show")[0];
          if (showAttr && showAttr.modifiers.includes("transition")) {
            let modifiers = showAttr.modifiers;
            if (modifiers.includes("out") && !modifiers.includes("in"))
              return show();
            const settingBothSidesOfTransition = modifiers.includes("in") && modifiers.includes("out");
            modifiers = settingBothSidesOfTransition ? modifiers.filter((i2, index2) => index2 < modifiers.indexOf("out")) : modifiers;
            transitionHelperIn(el, modifiers, show, reject);
          } else if (attrs.some((attr) => ["enter", "enter-start", "enter-end"].includes(attr.value))) {
            transitionClassesIn(el, component, attrs, show, reject);
          } else {
            show();
          }
        }
        function transitionOut(el, hide, reject, component, forceSkip = false) {
          if (forceSkip)
            return hide();
          if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_OUT) {
            return;
          }
          const attrs = getXAttrs(el, component, "transition");
          const showAttr = getXAttrs(el, component, "show")[0];
          if (showAttr && showAttr.modifiers.includes("transition")) {
            let modifiers = showAttr.modifiers;
            if (modifiers.includes("in") && !modifiers.includes("out"))
              return hide();
            const settingBothSidesOfTransition = modifiers.includes("in") && modifiers.includes("out");
            modifiers = settingBothSidesOfTransition ? modifiers.filter((i2, index2) => index2 > modifiers.indexOf("out")) : modifiers;
            transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide, reject);
          } else if (attrs.some((attr) => ["leave", "leave-start", "leave-end"].includes(attr.value))) {
            transitionClassesOut(el, component, attrs, hide, reject);
          } else {
            hide();
          }
        }
        function transitionHelperIn(el, modifiers, showCallback, reject) {
          const styleValues = {
            duration: modifierValue(modifiers, "duration", 150),
            origin: modifierValue(modifiers, "origin", "center"),
            first: {
              opacity: 0,
              scale: modifierValue(modifiers, "scale", 95)
            },
            second: {
              opacity: 1,
              scale: 100
            }
          };
          transitionHelper(el, modifiers, showCallback, () => {
          }, reject, styleValues, TRANSITION_TYPE_IN);
        }
        function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback, reject) {
          const duration = settingBothSidesOfTransition ? modifierValue(modifiers, "duration", 150) : modifierValue(modifiers, "duration", 150) / 2;
          const styleValues = {
            duration,
            origin: modifierValue(modifiers, "origin", "center"),
            first: {
              opacity: 1,
              scale: 100
            },
            second: {
              opacity: 0,
              scale: modifierValue(modifiers, "scale", 95)
            }
          };
          transitionHelper(el, modifiers, () => {
          }, hideCallback, reject, styleValues, TRANSITION_TYPE_OUT);
        }
        function modifierValue(modifiers, key, fallback) {
          if (modifiers.indexOf(key) === -1)
            return fallback;
          const rawValue = modifiers[modifiers.indexOf(key) + 1];
          if (!rawValue)
            return fallback;
          if (key === "scale") {
            if (!isNumeric(rawValue))
              return fallback;
          }
          if (key === "duration") {
            let match = rawValue.match(/([0-9]+)ms/);
            if (match)
              return match[1];
          }
          if (key === "origin") {
            if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
              return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
            }
          }
          return rawValue;
        }
        function transitionHelper(el, modifiers, hook1, hook2, reject, styleValues, type) {
          if (el.__x_transition) {
            el.__x_transition.cancel && el.__x_transition.cancel();
          }
          const opacityCache = el.style.opacity;
          const transformCache = el.style.transform;
          const transformOriginCache = el.style.transformOrigin;
          const noModifiers = !modifiers.includes("opacity") && !modifiers.includes("scale");
          const transitionOpacity = noModifiers || modifiers.includes("opacity");
          const transitionScale = noModifiers || modifiers.includes("scale");
          const stages = {
            start() {
              if (transitionOpacity)
                el.style.opacity = styleValues.first.opacity;
              if (transitionScale)
                el.style.transform = `scale(${styleValues.first.scale / 100})`;
            },
            during() {
              if (transitionScale)
                el.style.transformOrigin = styleValues.origin;
              el.style.transitionProperty = [transitionOpacity ? `opacity` : ``, transitionScale ? `transform` : ``].join(" ").trim();
              el.style.transitionDuration = `${styleValues.duration / 1e3}s`;
              el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
            },
            show() {
              hook1();
            },
            end() {
              if (transitionOpacity)
                el.style.opacity = styleValues.second.opacity;
              if (transitionScale)
                el.style.transform = `scale(${styleValues.second.scale / 100})`;
            },
            hide() {
              hook2();
            },
            cleanup() {
              if (transitionOpacity)
                el.style.opacity = opacityCache;
              if (transitionScale)
                el.style.transform = transformCache;
              if (transitionScale)
                el.style.transformOrigin = transformOriginCache;
              el.style.transitionProperty = null;
              el.style.transitionDuration = null;
              el.style.transitionTimingFunction = null;
            }
          };
          transition(el, stages, type, reject);
        }
        const ensureStringExpression = (expression, el, component) => {
          return typeof expression === "function" ? component.evaluateReturnExpression(el, expression) : expression;
        };
        function transitionClassesIn(el, component, directives, showCallback, reject) {
          const enter = convertClassStringToArray(ensureStringExpression((directives.find((i2) => i2.value === "enter") || {
            expression: ""
          }).expression, el, component));
          const enterStart = convertClassStringToArray(ensureStringExpression((directives.find((i2) => i2.value === "enter-start") || {
            expression: ""
          }).expression, el, component));
          const enterEnd = convertClassStringToArray(ensureStringExpression((directives.find((i2) => i2.value === "enter-end") || {
            expression: ""
          }).expression, el, component));
          transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {
          }, TRANSITION_TYPE_IN, reject);
        }
        function transitionClassesOut(el, component, directives, hideCallback, reject) {
          const leave = convertClassStringToArray(ensureStringExpression((directives.find((i2) => i2.value === "leave") || {
            expression: ""
          }).expression, el, component));
          const leaveStart = convertClassStringToArray(ensureStringExpression((directives.find((i2) => i2.value === "leave-start") || {
            expression: ""
          }).expression, el, component));
          const leaveEnd = convertClassStringToArray(ensureStringExpression((directives.find((i2) => i2.value === "leave-end") || {
            expression: ""
          }).expression, el, component));
          transitionClasses(el, leave, leaveStart, leaveEnd, () => {
          }, hideCallback, TRANSITION_TYPE_OUT, reject);
        }
        function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2, type, reject) {
          if (el.__x_transition) {
            el.__x_transition.cancel && el.__x_transition.cancel();
          }
          const originalClasses = el.__x_original_classes || [];
          const stages = {
            start() {
              el.classList.add(...classesStart);
            },
            during() {
              el.classList.add(...classesDuring);
            },
            show() {
              hook1();
            },
            end() {
              el.classList.remove(...classesStart.filter((i2) => !originalClasses.includes(i2)));
              el.classList.add(...classesEnd);
            },
            hide() {
              hook2();
            },
            cleanup() {
              el.classList.remove(...classesDuring.filter((i2) => !originalClasses.includes(i2)));
              el.classList.remove(...classesEnd.filter((i2) => !originalClasses.includes(i2)));
            }
          };
          transition(el, stages, type, reject);
        }
        function transition(el, stages, type, reject) {
          const finish = once(() => {
            stages.hide();
            if (el.isConnected) {
              stages.cleanup();
            }
            delete el.__x_transition;
          });
          el.__x_transition = {
            type,
            cancel: once(() => {
              reject(TRANSITION_CANCELLED);
              finish();
            }),
            finish,
            nextFrame: null
          };
          stages.start();
          stages.during();
          el.__x_transition.nextFrame = requestAnimationFrame(() => {
            let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
            if (duration === 0) {
              duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
            }
            stages.show();
            el.__x_transition.nextFrame = requestAnimationFrame(() => {
              stages.end();
              setTimeout(el.__x_transition.finish, duration);
            });
          });
        }
        function isNumeric(subject) {
          return !Array.isArray(subject) && !isNaN(subject);
        }
        function once(callback) {
          let called = false;
          return function() {
            if (!called) {
              called = true;
              callback.apply(this, arguments);
            }
          };
        }
        function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
          warnIfMalformedTemplate(templateEl, "x-for");
          let iteratorNames = typeof expression === "function" ? parseForExpression(component.evaluateReturnExpression(templateEl, expression)) : parseForExpression(expression);
          let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars);
          let currentEl = templateEl;
          items.forEach((item, index2) => {
            let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index2, items, extraVars());
            let currentKey = generateKeyForIteration(component, templateEl, index2, iterationScopeVariables);
            let nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(currentEl.nextElementSibling, currentKey);
            if (!nextEl) {
              nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl);
              transitionIn(nextEl, () => {
              }, () => {
              }, component, initialUpdate);
              nextEl.__x_for = iterationScopeVariables;
              component.initializeElements(nextEl, () => nextEl.__x_for);
            } else {
              delete nextEl.__x_for_key;
              nextEl.__x_for = iterationScopeVariables;
              component.updateElements(nextEl, () => nextEl.__x_for);
            }
            currentEl = nextEl;
            currentEl.__x_for_key = currentKey;
          });
          removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component);
        }
        function parseForExpression(expression) {
          let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
          let stripParensRE = /^\(|\)$/g;
          let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
          let inMatch = String(expression).match(forAliasRE);
          if (!inMatch)
            return;
          let res = {};
          res.items = inMatch[2].trim();
          let item = inMatch[1].trim().replace(stripParensRE, "");
          let iteratorMatch = item.match(forIteratorRE);
          if (iteratorMatch) {
            res.item = item.replace(forIteratorRE, "").trim();
            res.index = iteratorMatch[1].trim();
            if (iteratorMatch[2]) {
              res.collection = iteratorMatch[2].trim();
            }
          } else {
            res.item = item;
          }
          return res;
        }
        function getIterationScopeVariables(iteratorNames, item, index2, items, extraVars) {
          let scopeVariables = extraVars ? _objectSpread2({}, extraVars) : {};
          scopeVariables[iteratorNames.item] = item;
          if (iteratorNames.index)
            scopeVariables[iteratorNames.index] = index2;
          if (iteratorNames.collection)
            scopeVariables[iteratorNames.collection] = items;
          return scopeVariables;
        }
        function generateKeyForIteration(component, el, index2, iterationScopeVariables) {
          let bindKeyAttribute = getXAttrs(el, component, "bind").filter((attr) => attr.value === "key")[0];
          if (!bindKeyAttribute)
            return index2;
          return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables);
        }
        function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
          let ifAttribute = getXAttrs(el, component, "if")[0];
          if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
            return [];
          }
          let items = component.evaluateReturnExpression(el, iteratorNames.items, extraVars);
          if (isNumeric(items) && items >= 0) {
            items = Array.from(Array(items).keys(), (i2) => i2 + 1);
          }
          return items;
        }
        function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
          let clone = document.importNode(templateEl.content, true);
          currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
          return currentEl.nextElementSibling;
        }
        function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
          if (!nextEl)
            return;
          if (nextEl.__x_for_key === void 0)
            return;
          if (nextEl.__x_for_key === currentKey)
            return nextEl;
          let tmpNextEl = nextEl;
          while (tmpNextEl) {
            if (tmpNextEl.__x_for_key === currentKey) {
              return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
            }
            tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== void 0 ? tmpNextEl.nextElementSibling : false;
          }
        }
        function removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component) {
          var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== void 0 ? currentEl.nextElementSibling : false;
          while (nextElementFromOldLoop) {
            let nextElementFromOldLoopImmutable = nextElementFromOldLoop;
            let nextSibling = nextElementFromOldLoop.nextElementSibling;
            transitionOut(nextElementFromOldLoop, () => {
              nextElementFromOldLoopImmutable.remove();
            }, () => {
            }, component);
            nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== void 0 ? nextSibling : false;
          }
        }
        function handleAttributeBindingDirective(component, el, attrName, expression, extraVars, attrType, modifiers) {
          var value = component.evaluateReturnExpression(el, expression, extraVars);
          if (attrName === "value") {
            if (Alpine.ignoreFocusedForValueBinding && document.activeElement.isSameNode(el))
              return;
            if (value === void 0 && String(expression).match(/\./)) {
              value = "";
            }
            if (el.type === "radio") {
              if (el.attributes.value === void 0 && attrType === "bind") {
                el.value = value;
              } else if (attrType !== "bind") {
                el.checked = checkedAttrLooseCompare(el.value, value);
              }
            } else if (el.type === "checkbox") {
              if (typeof value !== "boolean" && ![null, void 0].includes(value) && attrType === "bind") {
                el.value = String(value);
              } else if (attrType !== "bind") {
                if (Array.isArray(value)) {
                  el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
                } else {
                  el.checked = !!value;
                }
              }
            } else if (el.tagName === "SELECT") {
              updateSelect(el, value);
            } else {
              if (el.value === value)
                return;
              el.value = value;
            }
          } else if (attrName === "class") {
            if (Array.isArray(value)) {
              const originalClasses = el.__x_original_classes || [];
              el.setAttribute("class", arrayUnique(originalClasses.concat(value)).join(" "));
            } else if (typeof value === "object") {
              const keysSortedByBooleanValue = Object.keys(value).sort((a2, b2) => value[a2] - value[b2]);
              keysSortedByBooleanValue.forEach((classNames) => {
                if (value[classNames]) {
                  convertClassStringToArray(classNames).forEach((className) => el.classList.add(className));
                } else {
                  convertClassStringToArray(classNames).forEach((className) => el.classList.remove(className));
                }
              });
            } else {
              const originalClasses = el.__x_original_classes || [];
              const newClasses = value ? convertClassStringToArray(value) : [];
              el.setAttribute("class", arrayUnique(originalClasses.concat(newClasses)).join(" "));
            }
          } else {
            attrName = modifiers.includes("camel") ? camelCase(attrName) : attrName;
            if ([null, void 0, false].includes(value)) {
              el.removeAttribute(attrName);
            } else {
              isBooleanAttr(attrName) ? setIfChanged(el, attrName, attrName) : setIfChanged(el, attrName, value);
            }
          }
        }
        function setIfChanged(el, attrName, value) {
          if (el.getAttribute(attrName) != value) {
            el.setAttribute(attrName, value);
          }
        }
        function updateSelect(el, value) {
          const arrayWrappedValue = [].concat(value).map((value2) => {
            return value2 + "";
          });
          Array.from(el.options).forEach((option) => {
            option.selected = arrayWrappedValue.includes(option.value || option.text);
          });
        }
        function handleTextDirective(el, output, expression) {
          if (output === void 0 && String(expression).match(/\./)) {
            output = "";
          }
          el.textContent = output;
        }
        function handleHtmlDirective(component, el, expression, extraVars) {
          el.innerHTML = component.evaluateReturnExpression(el, expression, extraVars);
        }
        function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
          const hide = () => {
            el.style.display = "none";
            el.__x_is_shown = false;
          };
          const show = () => {
            if (el.style.length === 1 && el.style.display === "none") {
              el.removeAttribute("style");
            } else {
              el.style.removeProperty("display");
            }
            el.__x_is_shown = true;
          };
          if (initialUpdate === true) {
            if (value) {
              show();
            } else {
              hide();
            }
            return;
          }
          const handle = (resolve, reject) => {
            if (value) {
              if (el.style.display === "none" || el.__x_transition) {
                transitionIn(el, () => {
                  show();
                }, reject, component);
              }
              resolve(() => {
              });
            } else {
              if (el.style.display !== "none") {
                transitionOut(el, () => {
                  resolve(() => {
                    hide();
                  });
                }, reject, component);
              } else {
                resolve(() => {
                });
              }
            }
          };
          if (modifiers.includes("immediate")) {
            handle((finish) => finish(), () => {
            });
            return;
          }
          if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
            component.executeAndClearRemainingShowDirectiveStack();
          }
          component.showDirectiveStack.push(handle);
          component.showDirectiveLastElement = el;
        }
        function handleIfDirective(component, el, expressionResult, initialUpdate, extraVars) {
          warnIfMalformedTemplate(el, "x-if");
          const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;
          if (expressionResult && (!elementHasAlreadyBeenAdded || el.__x_transition)) {
            const clone = document.importNode(el.content, true);
            el.parentElement.insertBefore(clone, el.nextElementSibling);
            transitionIn(el.nextElementSibling, () => {
            }, () => {
            }, component, initialUpdate);
            component.initializeElements(el.nextElementSibling, extraVars);
            el.nextElementSibling.__x_inserted_me = true;
          } else if (!expressionResult && elementHasAlreadyBeenAdded) {
            transitionOut(el.nextElementSibling, () => {
              el.nextElementSibling.remove();
            }, () => {
            }, component, initialUpdate);
          }
        }
        function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
          const options = {
            passive: modifiers.includes("passive")
          };
          if (modifiers.includes("camel")) {
            event = camelCase(event);
          }
          let handler, listenerTarget;
          if (modifiers.includes("away")) {
            listenerTarget = document;
            handler = (e2) => {
              if (el.contains(e2.target))
                return;
              if (el.offsetWidth < 1 && el.offsetHeight < 1)
                return;
              runListenerHandler(component, expression, e2, extraVars);
              if (modifiers.includes("once")) {
                document.removeEventListener(event, handler, options);
              }
            };
          } else {
            listenerTarget = modifiers.includes("window") ? window : modifiers.includes("document") ? document : el;
            handler = (e2) => {
              if (listenerTarget === window || listenerTarget === document) {
                if (!document.body.contains(el)) {
                  listenerTarget.removeEventListener(event, handler, options);
                  return;
                }
              }
              if (isKeyEvent(event)) {
                if (isListeningForASpecificKeyThatHasntBeenPressed(e2, modifiers)) {
                  return;
                }
              }
              if (modifiers.includes("prevent"))
                e2.preventDefault();
              if (modifiers.includes("stop"))
                e2.stopPropagation();
              if (!modifiers.includes("self") || e2.target === el) {
                const returnValue = runListenerHandler(component, expression, e2, extraVars);
                returnValue.then((value) => {
                  if (value === false) {
                    e2.preventDefault();
                  } else {
                    if (modifiers.includes("once")) {
                      listenerTarget.removeEventListener(event, handler, options);
                    }
                  }
                });
              }
            };
          }
          if (modifiers.includes("debounce")) {
            let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
            let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
            handler = debounce(handler, wait);
          }
          listenerTarget.addEventListener(event, handler, options);
        }
        function runListenerHandler(component, expression, e2, extraVars) {
          return component.evaluateCommandExpression(e2.target, expression, () => {
            return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
              "$event": e2
            });
          });
        }
        function isKeyEvent(event) {
          return ["keydown", "keyup"].includes(event);
        }
        function isListeningForASpecificKeyThatHasntBeenPressed(e2, modifiers) {
          let keyModifiers = modifiers.filter((i2) => {
            return !["window", "document", "prevent", "stop"].includes(i2);
          });
          if (keyModifiers.includes("debounce")) {
            let debounceIndex = keyModifiers.indexOf("debounce");
            keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
          }
          if (keyModifiers.length === 0)
            return false;
          if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e2.key))
            return false;
          const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
          const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
          keyModifiers = keyModifiers.filter((i2) => !selectedSystemKeyModifiers.includes(i2));
          if (selectedSystemKeyModifiers.length > 0) {
            const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
              if (modifier === "cmd" || modifier === "super")
                modifier = "meta";
              return e2[`${modifier}Key`];
            });
            if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
              if (keyModifiers[0] === keyToModifier(e2.key))
                return false;
            }
          }
          return true;
        }
        function keyToModifier(key) {
          switch (key) {
            case "/":
              return "slash";
            case " ":
            case "Spacebar":
              return "space";
            default:
              return key && kebabCase(key);
          }
        }
        function registerModelListener(component, el, modifiers, expression, extraVars) {
          var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
          const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
          registerListener(component, el, event, modifiers, listenerExpression, () => {
            return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
              rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
            });
          });
        }
        function generateModelAssignmentFunction(el, modifiers, expression) {
          if (el.type === "radio") {
            if (!el.hasAttribute("name"))
              el.setAttribute("name", expression);
          }
          return (event, currentValue) => {
            if (event instanceof CustomEvent && event.detail) {
              return event.detail;
            } else if (el.type === "checkbox") {
              if (Array.isArray(currentValue)) {
                const newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
                return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare(el2, newValue));
              } else {
                return event.target.checked;
              }
            } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
              return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
                const rawValue = option.value || option.text;
                return safeParseNumber(rawValue);
              }) : Array.from(event.target.selectedOptions).map((option) => {
                return option.value || option.text;
              });
            } else {
              const rawValue = event.target.value;
              return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
            }
          };
        }
        function safeParseNumber(rawValue) {
          const number = rawValue ? parseFloat(rawValue) : null;
          return isNumeric(number) ? number : rawValue;
        }
        const { isArray } = Array;
        const { getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty } = Object;
        const { push: ArrayPush, concat: ArrayConcat, map: ArrayMap } = Array.prototype;
        function isUndefined(obj) {
          return obj === void 0;
        }
        function isFunction(obj) {
          return typeof obj === "function";
        }
        function isObject(obj) {
          return typeof obj === "object";
        }
        const proxyToValueMap = /* @__PURE__ */ new WeakMap();
        function registerProxy(proxy, value) {
          proxyToValueMap.set(proxy, value);
        }
        const unwrap = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;
        function wrapValue(membrane, value) {
          return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
        }
        function unwrapDescriptor(descriptor) {
          if (hasOwnProperty.call(descriptor, "value")) {
            descriptor.value = unwrap(descriptor.value);
          }
          return descriptor;
        }
        function lockShadowTarget(membrane, shadowTarget, originalTarget) {
          const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
          targetKeys.forEach((key) => {
            let descriptor = getOwnPropertyDescriptor(originalTarget, key);
            if (!descriptor.configurable) {
              descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
            }
            ObjectDefineProperty(shadowTarget, key, descriptor);
          });
          preventExtensions(shadowTarget);
        }
        class ReactiveProxyHandler {
          constructor(membrane, value) {
            this.originalTarget = value;
            this.membrane = membrane;
          }
          get(shadowTarget, key) {
            const { originalTarget, membrane } = this;
            const value = originalTarget[key];
            const { valueObserved } = membrane;
            valueObserved(originalTarget, key);
            return membrane.getProxy(value);
          }
          set(shadowTarget, key, value) {
            const { originalTarget, membrane: { valueMutated } } = this;
            const oldValue = originalTarget[key];
            if (oldValue !== value) {
              originalTarget[key] = value;
              valueMutated(originalTarget, key);
            } else if (key === "length" && isArray(originalTarget)) {
              valueMutated(originalTarget, key);
            }
            return true;
          }
          deleteProperty(shadowTarget, key) {
            const { originalTarget, membrane: { valueMutated } } = this;
            delete originalTarget[key];
            valueMutated(originalTarget, key);
            return true;
          }
          apply(shadowTarget, thisArg, argArray) {
          }
          construct(target, argArray, newTarget) {
          }
          has(shadowTarget, key) {
            const { originalTarget, membrane: { valueObserved } } = this;
            valueObserved(originalTarget, key);
            return key in originalTarget;
          }
          ownKeys(shadowTarget) {
            const { originalTarget } = this;
            return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
          }
          isExtensible(shadowTarget) {
            const shadowIsExtensible = isExtensible(shadowTarget);
            if (!shadowIsExtensible) {
              return shadowIsExtensible;
            }
            const { originalTarget, membrane } = this;
            const targetIsExtensible = isExtensible(originalTarget);
            if (!targetIsExtensible) {
              lockShadowTarget(membrane, shadowTarget, originalTarget);
            }
            return targetIsExtensible;
          }
          setPrototypeOf(shadowTarget, prototype) {
          }
          getPrototypeOf(shadowTarget) {
            const { originalTarget } = this;
            return getPrototypeOf(originalTarget);
          }
          getOwnPropertyDescriptor(shadowTarget, key) {
            const { originalTarget, membrane } = this;
            const { valueObserved } = this.membrane;
            valueObserved(originalTarget, key);
            let desc = getOwnPropertyDescriptor(originalTarget, key);
            if (isUndefined(desc)) {
              return desc;
            }
            const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
            if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
            }
            desc = wrapDescriptor(membrane, desc, wrapValue);
            if (!desc.configurable) {
              ObjectDefineProperty(shadowTarget, key, desc);
            }
            return desc;
          }
          preventExtensions(shadowTarget) {
            const { originalTarget, membrane } = this;
            lockShadowTarget(membrane, shadowTarget, originalTarget);
            preventExtensions(originalTarget);
            return true;
          }
          defineProperty(shadowTarget, key, descriptor) {
            const { originalTarget, membrane } = this;
            const { valueMutated } = membrane;
            const { configurable } = descriptor;
            if (hasOwnProperty.call(descriptor, "writable") && !hasOwnProperty.call(descriptor, "value")) {
              const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
              descriptor.value = originalDescriptor.value;
            }
            ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
            if (configurable === false) {
              ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
            }
            valueMutated(originalTarget, key);
            return true;
          }
        }
        function wrapReadOnlyValue(membrane, value) {
          return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
        }
        class ReadOnlyHandler {
          constructor(membrane, value) {
            this.originalTarget = value;
            this.membrane = membrane;
          }
          get(shadowTarget, key) {
            const { membrane, originalTarget } = this;
            const value = originalTarget[key];
            const { valueObserved } = membrane;
            valueObserved(originalTarget, key);
            return membrane.getReadOnlyProxy(value);
          }
          set(shadowTarget, key, value) {
            return false;
          }
          deleteProperty(shadowTarget, key) {
            return false;
          }
          apply(shadowTarget, thisArg, argArray) {
          }
          construct(target, argArray, newTarget) {
          }
          has(shadowTarget, key) {
            const { originalTarget, membrane: { valueObserved } } = this;
            valueObserved(originalTarget, key);
            return key in originalTarget;
          }
          ownKeys(shadowTarget) {
            const { originalTarget } = this;
            return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
          }
          setPrototypeOf(shadowTarget, prototype) {
          }
          getOwnPropertyDescriptor(shadowTarget, key) {
            const { originalTarget, membrane } = this;
            const { valueObserved } = membrane;
            valueObserved(originalTarget, key);
            let desc = getOwnPropertyDescriptor(originalTarget, key);
            if (isUndefined(desc)) {
              return desc;
            }
            const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
            if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
            }
            desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);
            if (hasOwnProperty.call(desc, "set")) {
              desc.set = void 0;
            }
            if (!desc.configurable) {
              ObjectDefineProperty(shadowTarget, key, desc);
            }
            return desc;
          }
          preventExtensions(shadowTarget) {
            return false;
          }
          defineProperty(shadowTarget, key, descriptor) {
            return false;
          }
        }
        function createShadowTarget(value) {
          let shadowTarget = void 0;
          if (isArray(value)) {
            shadowTarget = [];
          } else if (isObject(value)) {
            shadowTarget = {};
          }
          return shadowTarget;
        }
        const ObjectDotPrototype = Object.prototype;
        function defaultValueIsObservable(value) {
          if (value === null) {
            return false;
          }
          if (typeof value !== "object") {
            return false;
          }
          if (isArray(value)) {
            return true;
          }
          const proto = getPrototypeOf(value);
          return proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null;
        }
        const defaultValueObserved = (obj, key) => {
        };
        const defaultValueMutated = (obj, key) => {
        };
        const defaultValueDistortion = (value) => value;
        function wrapDescriptor(membrane, descriptor, getValue) {
          const { set, get } = descriptor;
          if (hasOwnProperty.call(descriptor, "value")) {
            descriptor.value = getValue(membrane, descriptor.value);
          } else {
            if (!isUndefined(get)) {
              descriptor.get = function() {
                return getValue(membrane, get.call(unwrap(this)));
              };
            }
            if (!isUndefined(set)) {
              descriptor.set = function(value) {
                set.call(unwrap(this), membrane.unwrapProxy(value));
              };
            }
          }
          return descriptor;
        }
        class ReactiveMembrane {
          constructor(options) {
            this.valueDistortion = defaultValueDistortion;
            this.valueMutated = defaultValueMutated;
            this.valueObserved = defaultValueObserved;
            this.valueIsObservable = defaultValueIsObservable;
            this.objectGraph = /* @__PURE__ */ new WeakMap();
            if (!isUndefined(options)) {
              const { valueDistortion, valueMutated, valueObserved, valueIsObservable } = options;
              this.valueDistortion = isFunction(valueDistortion) ? valueDistortion : defaultValueDistortion;
              this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
              this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
              this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
            }
          }
          getProxy(value) {
            const unwrappedValue = unwrap(value);
            const distorted = this.valueDistortion(unwrappedValue);
            if (this.valueIsObservable(distorted)) {
              const o2 = this.getReactiveState(unwrappedValue, distorted);
              return o2.readOnly === value ? value : o2.reactive;
            }
            return distorted;
          }
          getReadOnlyProxy(value) {
            value = unwrap(value);
            const distorted = this.valueDistortion(value);
            if (this.valueIsObservable(distorted)) {
              return this.getReactiveState(value, distorted).readOnly;
            }
            return distorted;
          }
          unwrapProxy(p2) {
            return unwrap(p2);
          }
          getReactiveState(value, distortedValue) {
            const { objectGraph } = this;
            let reactiveState = objectGraph.get(distortedValue);
            if (reactiveState) {
              return reactiveState;
            }
            const membrane = this;
            reactiveState = {
              get reactive() {
                const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue);
                const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
                registerProxy(proxy, value);
                ObjectDefineProperty(this, "reactive", { value: proxy });
                return proxy;
              },
              get readOnly() {
                const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue);
                const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
                registerProxy(proxy, value);
                ObjectDefineProperty(this, "readOnly", { value: proxy });
                return proxy;
              }
            };
            objectGraph.set(distortedValue, reactiveState);
            return reactiveState;
          }
        }
        function wrap(data, mutationCallback) {
          let membrane = new ReactiveMembrane({
            valueMutated(target, key) {
              mutationCallback(target, key);
            }
          });
          return {
            data: membrane.getProxy(data),
            membrane
          };
        }
        function unwrap$1(membrane, observable) {
          let unwrappedData = membrane.unwrapProxy(observable);
          let copy = {};
          Object.keys(unwrappedData).forEach((key) => {
            if (["$el", "$refs", "$nextTick", "$watch"].includes(key))
              return;
            copy[key] = unwrappedData[key];
          });
          return copy;
        }
        class Component {
          constructor(el, componentForClone = null) {
            this.$el = el;
            const dataAttr = this.$el.getAttribute("x-data");
            const dataExpression = dataAttr === "" ? "{}" : dataAttr;
            const initExpression = this.$el.getAttribute("x-init");
            let dataExtras = {
              $el: this.$el
            };
            let canonicalComponentElementReference = componentForClone ? componentForClone.$el : this.$el;
            Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
              Object.defineProperty(dataExtras, `$${name}`, {
                get: function get() {
                  return callback(canonicalComponentElementReference);
                }
              });
            });
            this.unobservedData = componentForClone ? componentForClone.getUnobservedData() : saferEval(el, dataExpression, dataExtras);
            let {
              membrane,
              data
            } = this.wrapDataInObservable(this.unobservedData);
            this.$data = data;
            this.membrane = membrane;
            this.unobservedData.$el = this.$el;
            this.unobservedData.$refs = this.getRefsProxy();
            this.nextTickStack = [];
            this.unobservedData.$nextTick = (callback) => {
              this.nextTickStack.push(callback);
            };
            this.watchers = {};
            this.unobservedData.$watch = (property, callback) => {
              if (!this.watchers[property])
                this.watchers[property] = [];
              this.watchers[property].push(callback);
            };
            Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
              Object.defineProperty(this.unobservedData, `$${name}`, {
                get: function get() {
                  return callback(canonicalComponentElementReference, this.$el);
                }
              });
            });
            this.showDirectiveStack = [];
            this.showDirectiveLastElement;
            componentForClone || Alpine.onBeforeComponentInitializeds.forEach((callback) => callback(this));
            var initReturnedCallback;
            if (initExpression && !componentForClone) {
              this.pauseReactivity = true;
              initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression);
              this.pauseReactivity = false;
            }
            this.initializeElements(this.$el, () => {
            }, componentForClone);
            this.listenForNewElementsToInitialize();
            if (typeof initReturnedCallback === "function") {
              initReturnedCallback.call(this.$data);
            }
            componentForClone || setTimeout(() => {
              Alpine.onComponentInitializeds.forEach((callback) => callback(this));
            }, 0);
          }
          getUnobservedData() {
            return unwrap$1(this.membrane, this.$data);
          }
          wrapDataInObservable(data) {
            var self2 = this;
            let updateDom = debounce(function() {
              self2.updateElements(self2.$el);
            }, 0);
            return wrap(data, (target, key) => {
              if (self2.watchers[key]) {
                self2.watchers[key].forEach((callback) => callback(target[key]));
              } else if (Array.isArray(target)) {
                Object.keys(self2.watchers).forEach((fullDotNotationKey) => {
                  let dotNotationParts = fullDotNotationKey.split(".");
                  if (key === "length")
                    return;
                  dotNotationParts.reduce((comparisonData, part) => {
                    if (Object.is(target, comparisonData[part])) {
                      self2.watchers[fullDotNotationKey].forEach((callback) => callback(target));
                    }
                    return comparisonData[part];
                  }, self2.unobservedData);
                });
              } else {
                Object.keys(self2.watchers).filter((i2) => i2.includes(".")).forEach((fullDotNotationKey) => {
                  let dotNotationParts = fullDotNotationKey.split(".");
                  if (key !== dotNotationParts[dotNotationParts.length - 1])
                    return;
                  dotNotationParts.reduce((comparisonData, part) => {
                    if (Object.is(target, comparisonData)) {
                      self2.watchers[fullDotNotationKey].forEach((callback) => callback(target[key]));
                    }
                    return comparisonData[part];
                  }, self2.unobservedData);
                });
              }
              if (self2.pauseReactivity)
                return;
              updateDom();
            });
          }
          walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {
          }) {
            walk2(el, (el2) => {
              if (el2.hasAttribute("x-data")) {
                if (!el2.isSameNode(this.$el)) {
                  if (!el2.__x)
                    initializeComponentCallback(el2);
                  return false;
                }
              }
              return callback(el2);
            });
          }
          initializeElements(rootEl, extraVars = () => {
          }, componentForClone = false) {
            this.walkAndSkipNestedComponents(rootEl, (el) => {
              if (el.__x_for_key !== void 0)
                return false;
              if (el.__x_inserted_me !== void 0)
                return false;
              this.initializeElement(el, extraVars, componentForClone ? false : true);
            }, (el) => {
              if (!componentForClone)
                el.__x = new Component(el);
            });
            this.executeAndClearRemainingShowDirectiveStack();
            this.executeAndClearNextTickStack(rootEl);
          }
          initializeElement(el, extraVars, shouldRegisterListeners = true) {
            if (el.hasAttribute("class") && getXAttrs(el, this).length > 0) {
              el.__x_original_classes = convertClassStringToArray(el.getAttribute("class"));
            }
            shouldRegisterListeners && this.registerListeners(el, extraVars);
            this.resolveBoundAttributes(el, true, extraVars);
          }
          updateElements(rootEl, extraVars = () => {
          }) {
            this.walkAndSkipNestedComponents(rootEl, (el) => {
              if (el.__x_for_key !== void 0 && !el.isSameNode(this.$el))
                return false;
              this.updateElement(el, extraVars);
            }, (el) => {
              el.__x = new Component(el);
            });
            this.executeAndClearRemainingShowDirectiveStack();
            this.executeAndClearNextTickStack(rootEl);
          }
          executeAndClearNextTickStack(el) {
            if (el === this.$el && this.nextTickStack.length > 0) {
              requestAnimationFrame(() => {
                while (this.nextTickStack.length > 0) {
                  this.nextTickStack.shift()();
                }
              });
            }
          }
          executeAndClearRemainingShowDirectiveStack() {
            this.showDirectiveStack.reverse().map((handler) => {
              return new Promise((resolve, reject) => {
                handler(resolve, reject);
              });
            }).reduce((promiseChain, promise) => {
              return promiseChain.then(() => {
                return promise.then((finishElement) => {
                  finishElement();
                });
              });
            }, Promise.resolve(() => {
            })).catch((e2) => {
              if (e2 !== TRANSITION_CANCELLED)
                throw e2;
            });
            this.showDirectiveStack = [];
            this.showDirectiveLastElement = void 0;
          }
          updateElement(el, extraVars) {
            this.resolveBoundAttributes(el, false, extraVars);
          }
          registerListeners(el, extraVars) {
            getXAttrs(el, this).forEach(({
              type,
              value,
              modifiers,
              expression
            }) => {
              switch (type) {
                case "on":
                  registerListener(this, el, value, modifiers, expression, extraVars);
                  break;
                case "model":
                  registerModelListener(this, el, modifiers, expression, extraVars);
                  break;
              }
            });
          }
          resolveBoundAttributes(el, initialUpdate = false, extraVars) {
            let attrs = getXAttrs(el, this);
            attrs.forEach(({
              type,
              value,
              modifiers,
              expression
            }) => {
              switch (type) {
                case "model":
                  handleAttributeBindingDirective(this, el, "value", expression, extraVars, type, modifiers);
                  break;
                case "bind":
                  if (el.tagName.toLowerCase() === "template" && value === "key")
                    return;
                  handleAttributeBindingDirective(this, el, value, expression, extraVars, type, modifiers);
                  break;
                case "text":
                  var output = this.evaluateReturnExpression(el, expression, extraVars);
                  handleTextDirective(el, output, expression);
                  break;
                case "html":
                  handleHtmlDirective(this, el, expression, extraVars);
                  break;
                case "show":
                  var output = this.evaluateReturnExpression(el, expression, extraVars);
                  handleShowDirective(this, el, output, modifiers, initialUpdate);
                  break;
                case "if":
                  if (attrs.some((i2) => i2.type === "for"))
                    return;
                  var output = this.evaluateReturnExpression(el, expression, extraVars);
                  handleIfDirective(this, el, output, initialUpdate, extraVars);
                  break;
                case "for":
                  handleForDirective(this, el, expression, initialUpdate, extraVars);
                  break;
                case "cloak":
                  el.removeAttribute("x-cloak");
                  break;
              }
            });
          }
          evaluateReturnExpression(el, expression, extraVars = () => {
          }) {
            return saferEval(el, expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
              $dispatch: this.getDispatchFunction(el)
            }));
          }
          evaluateCommandExpression(el, expression, extraVars = () => {
          }) {
            return saferEvalNoReturn(el, expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
              $dispatch: this.getDispatchFunction(el)
            }));
          }
          getDispatchFunction(el) {
            return (event, detail = {}) => {
              el.dispatchEvent(new CustomEvent(event, {
                detail,
                bubbles: true
              }));
            };
          }
          listenForNewElementsToInitialize() {
            const targetNode = this.$el;
            const observerOptions = {
              childList: true,
              attributes: true,
              subtree: true
            };
            const observer = new MutationObserver((mutations) => {
              for (let i2 = 0; i2 < mutations.length; i2++) {
                const closestParentComponent = mutations[i2].target.closest("[x-data]");
                if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el)))
                  continue;
                if (mutations[i2].type === "attributes" && mutations[i2].attributeName === "x-data") {
                  const xAttr = mutations[i2].target.getAttribute("x-data") || "{}";
                  const rawData = saferEval(this.$el, xAttr, {
                    $el: this.$el
                  });
                  Object.keys(rawData).forEach((key) => {
                    if (this.$data[key] !== rawData[key]) {
                      this.$data[key] = rawData[key];
                    }
                  });
                }
                if (mutations[i2].addedNodes.length > 0) {
                  mutations[i2].addedNodes.forEach((node) => {
                    if (node.nodeType !== 1 || node.__x_inserted_me)
                      return;
                    if (node.matches("[x-data]") && !node.__x) {
                      node.__x = new Component(node);
                      return;
                    }
                    this.initializeElements(node);
                  });
                }
              }
            });
            observer.observe(targetNode, observerOptions);
          }
          getRefsProxy() {
            var self2 = this;
            var refObj = {};
            return new Proxy(refObj, {
              get(object, property) {
                if (property === "$isAlpineProxy")
                  return true;
                var ref;
                self2.walkAndSkipNestedComponents(self2.$el, (el) => {
                  if (el.hasAttribute("x-ref") && el.getAttribute("x-ref") === property) {
                    ref = el;
                  }
                });
                return ref;
              }
            });
          }
        }
        const Alpine = {
          version: "2.8.2",
          pauseMutationObserver: false,
          magicProperties: {},
          onComponentInitializeds: [],
          onBeforeComponentInitializeds: [],
          ignoreFocusedForValueBinding: false,
          start: async function start2() {
            if (!isTesting()) {
              await domReady2();
            }
            this.discoverComponents((el) => {
              this.initializeComponent(el);
            });
            document.addEventListener("turbolinks:load", () => {
              this.discoverUninitializedComponents((el) => {
                this.initializeComponent(el);
              });
            });
            this.listenForNewUninitializedComponentsAtRunTime();
          },
          discoverComponents: function discoverComponents(callback) {
            const rootEls = document.querySelectorAll("[x-data]");
            rootEls.forEach((rootEl) => {
              callback(rootEl);
            });
          },
          discoverUninitializedComponents: function discoverUninitializedComponents(callback, el = null) {
            const rootEls = (el || document).querySelectorAll("[x-data]");
            Array.from(rootEls).filter((el2) => el2.__x === void 0).forEach((rootEl) => {
              callback(rootEl);
            });
          },
          listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime() {
            const targetNode = document.querySelector("body");
            const observerOptions = {
              childList: true,
              attributes: true,
              subtree: true
            };
            const observer = new MutationObserver((mutations) => {
              if (this.pauseMutationObserver)
                return;
              for (let i2 = 0; i2 < mutations.length; i2++) {
                if (mutations[i2].addedNodes.length > 0) {
                  mutations[i2].addedNodes.forEach((node) => {
                    if (node.nodeType !== 1)
                      return;
                    if (node.parentElement && node.parentElement.closest("[x-data]"))
                      return;
                    this.discoverUninitializedComponents((el) => {
                      this.initializeComponent(el);
                    }, node.parentElement);
                  });
                }
              }
            });
            observer.observe(targetNode, observerOptions);
          },
          initializeComponent: function initializeComponent(el) {
            if (!el.__x) {
              try {
                el.__x = new Component(el);
              } catch (error2) {
                setTimeout(() => {
                  throw error2;
                }, 0);
              }
            }
          },
          clone: function clone(component, newEl) {
            if (!newEl.__x) {
              newEl.__x = new Component(newEl, component);
            }
          },
          addMagicProperty: function addMagicProperty(name, callback) {
            this.magicProperties[name] = callback;
          },
          onComponentInitialized: function onComponentInitialized(callback) {
            this.onComponentInitializeds.push(callback);
          },
          onBeforeComponentInitialized: function onBeforeComponentInitialized(callback) {
            this.onBeforeComponentInitializeds.push(callback);
          }
        };
        if (!isTesting()) {
          window.Alpine = Alpine;
          if (window.deferLoadingAlpine) {
            window.deferLoadingAlpine(function() {
              window.Alpine.start();
            });
          } else {
            window.Alpine.start();
          }
        }
        return Alpine;
      });
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  (function() {
    if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.polyfillWrapFlushCallback) {
      return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
      HTMLElement: function HTMLElement2() {
        return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
      }
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
  })();
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function")
      return;
    prototype.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
      prototype = window.SubmitEvent.prototype;
    } else if ("SubmitEvent" in window) {
      return;
    } else {
      prototype = window.Event.prototype;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle;
  (function(FrameLoadingStyle2) {
    FrameLoadingStyle2["eager"] = "eager";
    FrameLoadingStyle2["lazy"] = "lazy";
  })(FrameLoadingStyle || (FrameLoadingStyle = {}));
  var FrameElement = class extends HTMLElement {
    constructor() {
      super();
      this.loaded = Promise.resolve();
      this.delegate = new FrameElement.delegateConstructor(this);
    }
    static get observedAttributes() {
      return ["disabled", "complete", "loading", "src"];
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "complete") {
        this.delegate.completeChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    get complete() {
      return !this.delegate.isLoading;
    }
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
      var _a, _b;
      return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getMetaContent("csp-nonce");
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i2) => {
      const value = values[i2] == void 0 ? "" : values[i2];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_2, i2) => {
      if (i2 == 8 || i2 == 13 || i2 == 18 || i2 == 23) {
        return "-";
      } else if (i2 == 14) {
        return "4";
      } else if (i2 == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
      if (typeof value == "string")
        return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  var FetchMethod;
  (function(FetchMethod2) {
    FetchMethod2[FetchMethod2["get"] = 0] = "get";
    FetchMethod2[FetchMethod2["post"] = 1] = "post";
    FetchMethod2[FetchMethod2["put"] = 2] = "put";
    FetchMethod2[FetchMethod2["patch"] = 3] = "patch";
    FetchMethod2[FetchMethod2["delete"] = 4] = "delete";
  })(FetchMethod || (FetchMethod = {}));
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchRequest = class {
    constructor(delegate, method, location2, body = new URLSearchParams(), target = null) {
      this.abortController = new AbortController();
      this.resolveRequestPromise = (_value) => {
      };
      this.delegate = delegate;
      this.method = method;
      this.headers = this.defaultHeaders;
      this.body = body;
      this.url = location2;
      this.target = target;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      var _a, _b;
      const { fetchOptions } = this;
      (_b = (_a = this.delegate).prepareHeadersForRequest) === null || _b === void 0 ? void 0 : _b.call(_a, this.headers, this);
      await this.allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetch(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          if (this.willDelegateErrorHandling(error2)) {
            this.delegate.requestErrored(this, error2);
          }
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get fetchOptions() {
      var _a;
      return {
        method: FetchMethod[this.method].toUpperCase(),
        credentials: "same-origin",
        headers: this.headers,
        redirect: "follow",
        body: this.isIdempotent ? null : this.body,
        signal: this.abortSignal,
        referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href
      };
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isIdempotent() {
      return this.method == FetchMethod.get;
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.resolveRequestPromise
        },
        target: this.target
      });
      if (event.defaultPrevented)
        await requestInterception;
    }
    willDelegateErrorHandling(error2) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error: error2 }
      });
      return !event.defaultPrevented;
    }
  };
  var AppearanceObserver = class {
    constructor(delegate, element) {
      this.started = false;
      this.intersect = (entries) => {
        const lastEntry = entries.slice(-1)[0];
        if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
          this.delegate.elementAppearedInViewport(this.element);
        }
      };
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
  };
  var StreamMessage = class {
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
  };
  StreamMessage.contentType = "text/vnd.turbo-stream.html";
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var FormSubmissionState;
  (function(FormSubmissionState2) {
    FormSubmissionState2[FormSubmissionState2["initialized"] = 0] = "initialized";
    FormSubmissionState2[FormSubmissionState2["requesting"] = 1] = "requesting";
    FormSubmissionState2[FormSubmissionState2["waiting"] = 2] = "waiting";
    FormSubmissionState2[FormSubmissionState2["receiving"] = 3] = "receiving";
    FormSubmissionState2[FormSubmissionState2["stopping"] = 4] = "stopping";
    FormSubmissionState2[FormSubmissionState2["stopped"] = 5] = "stopped";
  })(FormSubmissionState || (FormSubmissionState = {}));
  var FormEnctype;
  (function(FormEnctype2) {
    FormEnctype2["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype2["multipart"] = "multipart/form-data";
    FormEnctype2["plain"] = "text/plain";
  })(FormEnctype || (FormEnctype = {}));
  function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FormEnctype.multipart:
        return FormEnctype.multipart;
      case FormEnctype.plain:
        return FormEnctype.plain;
      default:
        return FormEnctype.urlEncoded;
    }
  }
  var FormSubmission = class {
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      this.state = FormSubmissionState.initialized;
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.formData = buildFormData(formElement, submitter);
      this.location = expandURL(this.action);
      if (this.method == FetchMethod.get) {
        mergeFormDataEntries(this.location, [...this.body.entries()]);
      }
      this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
      this.mustRedirect = mustRedirect;
    }
    static confirmMethod(message, _element, _submitter) {
      return Promise.resolve(confirm(message));
    }
    get method() {
      var _a;
      const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
      return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
      var _a;
      const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
      if ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.hasAttribute("formaction")) {
        return this.submitter.getAttribute("formaction") || "";
      } else {
        return this.formElement.getAttribute("action") || formElementAction || "";
      }
    }
    get body() {
      if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
        return new URLSearchParams(this.stringFormData);
      } else {
        return this.formData;
      }
    }
    get enctype() {
      var _a;
      return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isIdempotent() {
      return this.fetchRequest.isIdempotent;
    }
    get stringFormData() {
      return [...this.formData].reduce((entries, [name, value]) => {
        return entries.concat(typeof value == "string" ? [[name, value]] : []);
      }, []);
    }
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const answer = await FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    prepareHeadersForRequest(headers, request) {
      if (!request.isIdempotent) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      var _a;
      this.state = FormSubmissionState.waiting;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(_request) {
      var _a;
      this.state = FormSubmissionState.stopped;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: Object.assign({ formSubmission: this }, this.result)
      });
      this.delegate.formSubmissionFinished(this);
    }
    requestMustRedirect(request) {
      return !request.isIdempotent && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isIdempotent || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
      if (value instanceof File)
        continue;
      searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
      for (const element of this.element.querySelectorAll("[autofocus]")) {
        if (element.closest(inertDisabledOrHidden) == null)
          return element;
        else
          continue;
      }
      return null;
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
      return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    constructor(delegate, eventTarget) {
      this.started = false;
      this.submitCaptured = () => {
        this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
        this.eventTarget.addEventListener("submit", this.submitBubbled, false);
      };
      this.submitBubbled = (event) => {
        if (!event.defaultPrevented) {
          const form = event.target instanceof HTMLFormElement ? event.target : void 0;
          const submitter = event.submitter || void 0;
          if (form && submissionDoesNotDismissDialog(form, submitter) && submissionDoesNotTargetIFrame(form, submitter) && this.delegate.willSubmitForm(form, submitter)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.delegate.formSubmitted(form, submitter);
          }
        }
      };
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
  };
  function submissionDoesNotDismissDialog(form, submitter) {
    const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter) {
    const target = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formtarget")) || form.target;
    for (const element of document.getElementsByName(target)) {
      if (element instanceof HTMLIFrameElement)
        return false;
    }
    return true;
  }
  var View = class {
    constructor(delegate, element) {
      this.resolveRenderPromise = (_value) => {
      };
      this.resolveInterceptionPromise = (_value) => {
      };
      this.delegate = delegate;
      this.element = element;
    }
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y: y2 }) {
      this.scrollRoot.scrollTo(x, y2);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.resolveInterceptionPromise = resolve);
          const options = { resume: this.resolveInterceptionPromise, render: this.renderer.renderElement };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    invalidate() {
      this.element.innerHTML = "";
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.clickBubbled = (event) => {
        if (this.respondsToEventTarget(event.target)) {
          this.clickEvent = event;
        } else {
          delete this.clickEvent;
        }
      };
      this.linkClicked = (event) => {
        if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
          if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
            this.clickEvent.preventDefault();
            event.preventDefault();
            this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
          }
        }
        delete this.clickEvent;
      };
      this.willVisit = (_event) => {
        delete this.clickEvent;
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    constructor(delegate, eventTarget) {
      this.started = false;
      this.clickCaptured = () => {
        this.eventTarget.removeEventListener("click", this.clickBubbled, false);
        this.eventTarget.addEventListener("click", this.clickBubbled, false);
      };
      this.clickBubbled = (event) => {
        if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
          const target = event.composedPath && event.composedPath()[0] || event.target;
          const link = this.findLinkFromClickTarget(target);
          if (link && doesNotTargetIFrame(link)) {
            const location2 = this.getLocationForLink(link);
            if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
              event.preventDefault();
              this.delegate.followedLinkToLocation(link, location2);
            }
          }
        }
      };
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      if (target instanceof Element) {
        return target.closest("a[href]:not([target^=_]):not([download])");
      }
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function doesNotTargetIFrame(anchor) {
    for (const element of document.getElementsByName(anchor.target)) {
      if (element instanceof HTMLIFrameElement)
        return false;
    }
    return true;
  }
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && link.hasAttribute("data-turbo-method");
    }
    followedLinkToLocation(link, location2) {
      const action = location2.href;
      const form = document.createElement("form");
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method)
        form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame)
        form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = link.getAttribute("data-turbo-action");
      if (turboAction)
        form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm)
        form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream)
        form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    static preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      callback();
      bardo.leave();
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      this.activeElement = null;
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    preservingPermanentElements(callback) {
      Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
    enteringBardo(currentPermanentElement) {
      if (this.activeElement)
        return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.activeElement) && this.activeElement instanceof HTMLElement) {
        this.activeElement.focus();
        this.activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
  };
  function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
  }
  var FrameRenderer = class extends Renderer {
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    static renderElement(currentElement, newElement) {
      var _a;
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextAnimationFrame();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextAnimationFrame();
      this.focusFirstAutofocusableElement();
      await nextAnimationFrame();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class {
    constructor() {
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = ProgressBar.defaultCSS;
      if (this.cspNonce) {
        element.nonce = this.cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
    get cspNonce() {
      return getMetaContent("csp-nonce");
    }
  };
  ProgressBar.animationDuration = 300;
  var HeadSnapshot = class extends Snapshot {
    constructor() {
      super(...arguments);
      this.detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
        const { outerHTML } = element;
        const details = outerHTML in result ? result[outerHTML] : {
          type: elementType(element),
          tracked: elementIsTracked(element),
          elements: []
        };
        return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
      }, {});
    }
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { elements: [element] } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class extends Snapshot {
    constructor(element, headSnapshot) {
      super(element);
      this.headSnapshot = headSnapshot;
    }
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
      return new this(body, new HeadSnapshot(head));
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index2, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index2];
        for (const option of clone.selectedOptions)
          option.selected = false;
        for (const option of source.selectedOptions)
          clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      return new PageSnapshot(clonedElement, this.headSnapshot);
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      var _a;
      const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var TimingMetric;
  (function(TimingMetric2) {
    TimingMetric2["visitStart"] = "visitStart";
    TimingMetric2["requestStart"] = "requestStart";
    TimingMetric2["requestEnd"] = "requestEnd";
    TimingMetric2["visitEnd"] = "visitEnd";
  })(TimingMetric || (TimingMetric = {}));
  var VisitState;
  (function(VisitState2) {
    VisitState2["initialized"] = "initialized";
    VisitState2["started"] = "started";
    VisitState2["canceled"] = "canceled";
    VisitState2["failed"] = "failed";
    VisitState2["completed"] = "completed";
  })(VisitState || (VisitState = {}));
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false
  };
  var SystemStatusCode;
  (function(SystemStatusCode2) {
    SystemStatusCode2[SystemStatusCode2["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode2[SystemStatusCode2["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode2[SystemStatusCode2["contentTypeMismatch"] = -2] = "contentTypeMismatch";
  })(SystemStatusCode || (SystemStatusCode = {}));
  var Visit = class {
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.identifier = uuid();
      this.timingMetrics = {};
      this.followedRedirect = false;
      this.historyChanged = false;
      this.scrolled = false;
      this.shouldCacheSnapshot = true;
      this.acceptsStreamResponse = false;
      this.snapshotCached = false;
      this.state = VisitState.initialized;
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const { action, historyChanged, referrer, snapshot, snapshotHTML, response, visitCachedSnapshot, willRender, updateHistory, shouldCacheSnapshot, acceptsStreamResponse } = Object.assign(Object.assign({}, defaultOptions), options);
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.adapter.visitCompleted(this);
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
    changeHistory() {
      var _a;
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot)
            this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender, this);
            this.performScroll();
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.view.renderPage(snapshot, isPreview, this.willRender, this);
            this.performScroll();
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      var _a;
      if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.performScroll();
          this.changeHistory();
          this.adapter.visitRendered(this);
        });
      }
    }
    prepareHeadersForRequest(headers, request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    constructor(session2) {
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show();
      };
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      this.navigator.startVisit(location2, (options === null || options === void 0 ? void 0 : options.restorationIdentifier) || uuid(), options);
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitCompleted(_visit) {
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
    }
    visitRendered(_visit) {
    }
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    reload(reason) {
      var _a;
      dispatch("turbo:reload", { detail: reason });
      window.location.href = ((_a = this.location) === null || _a === void 0 ? void 0 : _a.toString()) || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    constructor() {
      this.started = false;
      this.removeStaleElements = (_event) => {
        const staleElements = [...document.querySelectorAll('[data-turbo-cache="false"]')];
        for (const element of staleElements) {
          element.remove();
        }
      };
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    shouldInterceptLinkClick(element, _location, _event) {
      return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == null && this.shouldSubmit(element, submitter) && this.shouldRedirect(element, submitter);
    }
    formSubmitted(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter);
      }
    }
    shouldSubmit(form, submitter) {
      var _a;
      const action = getAction(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
      return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.findFrameElement(element, submitter);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    findFrameElement(element, submitter) {
      const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    constructor(delegate) {
      this.restorationIdentifier = uuid();
      this.restorationData = {};
      this.started = false;
      this.pageLoaded = false;
      this.onPopState = (event) => {
        if (this.shouldHandlePopState()) {
          const { turbo } = event.state || {};
          if (turbo) {
            this.location = new URL(window.location.href);
            const { restorationIdentifier } = turbo;
            this.restorationIdentifier = restorationIdentifier;
            this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
          }
        }
      };
      this.onPageLoad = async (_event) => {
        await nextMicrotask();
        this.pageLoaded = true;
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      const state = { turbo: { restorationIdentifier } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
      var _a;
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        if (locationIsVisitable(location2, this.view.snapshot.rootLocation)) {
          this.delegate.visitProposedToLocation(location2, options);
        } else {
          window.location.href = location2.toString();
        }
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.method == FetchMethod.get;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.getActionForFormSubmission(formSubmission);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        this.view.scrollToTop();
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    getActionForFormSubmission(formSubmission) {
      const { formElement, submitter } = formSubmission;
      const action = getAttribute("data-turbo-action", submitter, formElement);
      return isAction(action) ? action : "advance";
    }
  };
  var PageStage;
  (function(PageStage2) {
    PageStage2[PageStage2["initial"] = 0] = "initial";
    PageStage2[PageStage2["loading"] = 1] = "loading";
    PageStage2[PageStage2["interactive"] = 2] = "interactive";
    PageStage2[PageStage2["complete"] = 3] = "complete";
  })(PageStage || (PageStage = {}));
  var PageObserver = class {
    constructor(delegate) {
      this.stage = PageStage.initial;
      this.started = false;
      this.interpretReadyState = () => {
        const { readyState } = this;
        if (readyState == "interactive") {
          this.pageIsInteractive();
        } else if (readyState == "complete") {
          this.pageIsComplete();
        }
      };
      this.pageWillUnload = () => {
        this.delegate.pageWillUnload();
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    constructor(delegate) {
      this.started = false;
      this.onScroll = () => {
        this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => document.documentElement.appendChild(fragment));
    }
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
        if (elementInStream) {
          permanentElementMap[id] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  var StreamObserver = class {
    constructor(delegate) {
      this.sources = /* @__PURE__ */ new Set();
      this.started = false;
      this.inspectFetchResponse = (event) => {
        const response = fetchResponseFromEvent(event);
        if (response && fetchResponseIsStream(response)) {
          event.preventDefault();
          this.receiveMessageResponse(response);
        }
      };
      this.receiveMessageEvent = (event) => {
        if (this.started && typeof event.data == "string") {
          this.receiveMessageHTML(event.data);
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    async mergeHead() {
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      this.removeCurrentHeadProvisionalElements();
      this.copyNewHeadProvisionalElements();
      await newStylesheetElements;
    }
    replaceBody() {
      this.preservingPermanentElements(() => {
        this.activateNewBody();
        this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    assignNewBody() {
      this.renderElement(this.currentElement, this.newElement);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    constructor(size) {
      this.keys = [];
      this.snapshots = {};
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index2 = this.keys.indexOf(key);
      if (index2 > -1)
        this.keys.splice(index2, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    constructor() {
      super(...arguments);
      this.snapshotCache = new SnapshotCache(10);
      this.lastRenderedLocation = new URL(location.href);
      this.forceReloaded = false;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const renderer = new PageRenderer(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2 === null || visit2 === void 0 ? void 0 : visit2.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2 === null || visit2 === void 0 ? void 0 : visit2.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    constructor(delegate) {
      this.selector = "a[data-turbo-preload]";
      this.delegate = delegate;
    }
    get snapshotCache() {
      return this.delegate.navigator.view.snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        return document.addEventListener("DOMContentLoaded", () => {
          this.preloadOnLoadLinksForView(document.body);
        });
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        this.preloadURL(link);
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      try {
        const response = await fetch(location2.toString(), { headers: { "VND.PREFETCH": "true", Accept: "text/html" } });
        const responseText = await response.text();
        const snapshot = PageSnapshot.fromHTMLString(responseText);
        this.snapshotCache.put(location2, snapshot);
      } catch (_2) {
      }
    }
  };
  var Session = class {
    constructor() {
      this.navigator = new Navigator(this);
      this.history = new History(this);
      this.preloader = new Preloader(this);
      this.view = new PageView(this, document.documentElement);
      this.adapter = new BrowserAdapter(this);
      this.pageObserver = new PageObserver(this);
      this.cacheObserver = new CacheObserver();
      this.linkClickObserver = new LinkClickObserver(this, window);
      this.formSubmitObserver = new FormSubmitObserver(this, document);
      this.scrollObserver = new ScrollObserver(this);
      this.streamObserver = new StreamObserver(this);
      this.formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
      this.frameRedirector = new FrameRedirector(this, document.documentElement);
      this.streamMessageRenderer = new StreamMessageRenderer();
      this.drive = true;
      this.enabled = true;
      this.progressBarDelay = 500;
      this.started = false;
      this.formMode = "on";
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        frameElement.src = location2.toString();
        frameElement.loaded;
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    setFormMode(mode) {
      this.formMode = mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location2, restorationIdentifier) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
      const action = getAction(form, submitter);
      return this.submissionIsNavigatable(form, submitter) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
      var _a;
      if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, options) {
      const event = this.notifyApplicationBeforeRender(element, options);
      const { defaultPrevented, detail: { render } } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender();
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
      return dispatch("turbo:before-render", {
        detail: Object.assign({ newBody }, options),
        cancelable: true
      });
    }
    notifyApplicationAfterRender() {
      return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(new HashChangeEvent("hashchange", {
        oldURL: oldURL.toString(),
        newURL: newURL.toString()
      }));
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    submissionIsNavigatable(form, submitter) {
      if (this.formMode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
        if (this.formMode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = element.closest("[data-turbo]");
      const withinFrame = element.closest("turbo-frame");
      if (this.drive || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    getActionForLink(link) {
      const action = link.getAttribute("data-turbo-action");
      return isAction(action) ? action : "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.setCacheControl("");
    }
    exemptPageFromCache() {
      this.setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.setCacheControl("no-preview");
    }
    setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var StreamActions = {
    after() {
      this.targetElements.forEach((e2) => {
        var _a;
        return (_a = e2.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e2.nextSibling);
      });
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e2) => e2.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e2) => {
        var _a;
        return (_a = e2.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e2);
      });
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e2) => e2.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e2) => e2.remove());
    },
    replace() {
      this.targetElements.forEach((e2) => e2.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((e2) => e2.replaceChildren(this.templateContent));
    }
  };
  var session = new Session();
  var cache = new Cache(session);
  var { navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    console.warn("Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`");
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  function setFormMode(mode) {
    session.setFormMode(mode);
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    cache,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode,
    StreamActions
  });
  var FrameController = class {
    constructor(element) {
      this.fetchResponseLoaded = (_fetchResponse) => {
      };
      this.currentFetchRequest = null;
      this.resolveVisitPromise = () => {
      };
      this.connected = false;
      this.hasBeenLoaded = false;
      this.ignoredAttributes = /* @__PURE__ */ new Set();
      this.action = null;
      this.visitCachedSnapshot = ({ element: element2 }) => {
        const frame = element2.querySelector("#" + this.element.id);
        if (frame && this.previousFrameElement) {
          frame.replaceChildren(...this.previousFrameElement.children);
        }
        delete this.previousFrameElement;
      };
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    connect() {
      if (!this.connected) {
        this.connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.connected) {
        this.connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.isIgnoringChangesTo("src"))
        return;
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
        this.loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { src } = this.element;
      this.ignoringChangesToAttribute("complete", () => {
        this.element.removeAttribute("complete");
      });
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    completeChanged() {
      if (this.isIgnoringChangesTo("complete"))
        return;
      this.loadSourceURL();
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.loadSourceURL();
      }
    }
    async loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const { body } = parseHTMLDocument(html);
          const newFrameElement = await this.extractForeignFrameElement(body);
          if (newFrameElement) {
            const snapshot = new Snapshot(newFrameElement);
            const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
            if (this.view.renderPromise)
              await this.view.renderPromise;
            this.changeHistory();
            await this.view.render(renderer);
            this.complete = true;
            session.frameRendered(fetchResponse, this.element);
            session.frameLoaded(this.element);
            this.fetchResponseLoaded(fetchResponse);
          } else if (this.willHandleFrameMissingFromResponse(fetchResponse)) {
            console.warn(`A matching frame for #${this.element.id} was missing from the response, transforming into full-page Visit.`);
            this.visitResponse(fetchResponse.response);
          }
        }
      } catch (error2) {
        console.error(error2);
        this.view.invalidate();
      } finally {
        this.fetchResponseLoaded = () => {
        };
      }
    }
    elementAppearedInViewport(_element) {
      this.loadSourceURL();
    }
    willSubmitFormLinkToLocation(link) {
      return this.shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.findFrameElement(link);
      if (frame)
        form.setAttribute("data-turbo-frame", frame.id);
    }
    shouldInterceptLinkClick(element, _location, _event) {
      return this.shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.navigateFrame(element, location2);
    }
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == this.element && this.shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareHeadersForRequest(fetchRequest.headers, fetchRequest);
      this.formSubmission.start();
    }
    prepareHeadersForRequest(headers, request) {
      var _a;
      headers["Turbo-Frame"] = this.id;
      if ((_a = this.currentNavigationElement) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      console.error(response);
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender({ element: newFrame }, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: Object.assign({ newFrame }, options),
        cancelable: true
      });
      const { defaultPrevented, detail: { render } } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    async visit(url) {
      var _a;
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
      this.currentFetchRequest = request;
      return new Promise((resolve) => {
        this.resolveVisitPromise = () => {
          this.resolveVisitPromise = () => {
          };
          this.currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    navigateFrame(element, url, submitter) {
      const frame = this.findFrameElement(element, submitter);
      this.pageSnapshot = PageSnapshot.fromElement(frame).clone();
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, element, submitter);
      this.withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
      this.action = getVisitAction(submitter, element, frame);
      if (isAction(this.action)) {
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = frame.ownerDocument.documentElement.outerHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: this.pageSnapshot
            };
            if (this.action)
              options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options = {}) => {
        if (url instanceof Response) {
          this.visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    async visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    findFrameElement(element, submitter) {
      var _a;
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error2) {
        console.error(error2);
        return new FrameElement();
      }
      return null;
    }
    formActionIsVisitable(form, submitter) {
      const action = getAction(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter && !session.elementIsNavigatable(submitter)) {
        return false;
      }
      return true;
    }
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      this.ignoringChangesToAttribute("complete", () => {
        if (value) {
          this.element.setAttribute("complete", "");
        } else {
          this.element.removeAttribute("complete");
        }
      });
    }
    get isActive() {
      return this.element.isActive && this.connected;
    }
    get rootLocation() {
      var _a;
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    isIgnoringChangesTo(attributeName) {
      return this.ignoredAttributes.has(attributeName);
    }
    ignoringChangesToAttribute(attributeName, callback) {
      this.ignoredAttributes.add(attributeName);
      callback();
      this.ignoredAttributes.delete(attributeName);
    }
    withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
  };
  function getFrameElementById(id) {
    if (id != null) {
      const element = document.getElementById(id);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamElement = class extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      var _a;
      return (_a = this.renderPromise) !== null && _a !== void 0 ? _a : this.renderPromise = (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextAnimationFrame();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch (_a) {
      }
    }
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c2) => c2.remove());
    }
    get duplicateChildren() {
      var _a;
      const existingChildren = this.targetElements.flatMap((e2) => [...e2.children]).filter((c2) => !!c2.id);
      const newChildrenIds = [...((_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children) || []].filter((c2) => !!c2.id).map((c2) => c2.id);
      return existingChildren.filter((c2) => newChildrenIds.includes(c2.id));
    }
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.raise("unknown action");
      }
      this.raise("action attribute is missing");
    }
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.raise("target or targets attribute is missing");
      }
    }
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.raise("first child element must be a <template> element");
    }
    get action() {
      return this.getAttribute("action");
    }
    get target() {
      return this.getAttribute("target");
    }
    get targets() {
      return this.getAttribute("targets");
    }
    raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      var _a, _b;
      return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      var _a;
      const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      var _a;
      const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this.streamSource = null;
    }
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    element = element.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = Turbo;
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object")
      return obj;
    if (obj instanceof Date || obj instanceof RegExp)
      return obj;
    if (Array.isArray(obj))
      return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m2, x) {
        return "_" + x.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, { received: this.dispatchMessageEvent.bind(this) });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription)
        this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter } } }) => {
        const method = submitter && submitter.formMethod || fetchOptions.body && fetchOptions.body.get("_method") || form.getAttribute("method");
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            fetchOptions.body.delete("_method");
          } else {
            fetchOptions.body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners)
        this.clearEventListenersForBinding(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
      const eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
    removeMappedEventListenerFor(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap.delete(cacheKey);
      if (eventListenerMap.size == 0)
        this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var defaultActionDescriptorFilters = {
    stop({ event, value }) {
      if (value)
        event.stopPropagation();
      return true;
    },
    prevent({ event, value }) {
      if (value)
        event.preventDefault();
      return true;
    },
    self({ event, value, element }) {
      if (value) {
        return element === event.target;
      } else {
        return true;
      }
    }
  };
  var descriptorPattern = /^(?:(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    let eventName = matches[1];
    let keyFilter = matches[2];
    if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
      eventName += `.${keyFilter}`;
      keyFilter = "";
    }
    return {
      eventTarget: parseEventTarget(matches[3]),
      eventName,
      eventOptions: matches[6] ? parseEventOptions(matches[6]) : {},
      identifier: matches[4],
      methodName: matches[5],
      keyFilter
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_2, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_2, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  var Action = class {
    constructor(element, index2, descriptor, schema) {
      this.element = element;
      this.index = index2;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
      this.keyFilter = descriptor.keyFilter || "";
      this.schema = schema;
    }
    static forToken(token, schema) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
    }
    toString() {
      const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
      const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    isFilterTarget(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filteres = this.keyFilter.split("+");
      const modifiers = ["meta", "ctrl", "alt", "shift"];
      const [meta, ctrl, alt, shift] = modifiers.map((modifier) => filteres.includes(modifier));
      if (event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift) {
        return true;
      }
      const standardFilter = filteres.filter((key) => !modifiers.includes(key))[0];
      if (!standardFilter) {
        return false;
      }
      if (!Object.prototype.hasOwnProperty.call(this.keyMappings, standardFilter)) {
        error(`contains unknown key filter: ${this.keyFilter}`);
      }
      return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    get params() {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
      for (const { name, value } of Array.from(this.element.attributes)) {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          params[camelize(key)] = typecast(value);
        }
      }
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
      return this.schema.keyMappings;
    }
  };
  var defaultEventNames = {
    a: () => "click",
    button: () => "click",
    form: () => "submit",
    details: () => "toggle",
    input: (e2) => e2.getAttribute("type") == "submit" ? "click" : "input",
    select: () => "change",
    textarea: () => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(event)) {
        this.invokeWithEvent(event);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
      const { element } = this.action;
      const { actionDescriptorFilters } = this.context.application;
      let passes = true;
      for (const [name, value] of Object.entries(this.eventOptions)) {
        if (name in actionDescriptorFilters) {
          const filter = actionDescriptorFilters[name];
          passes = passes && filter({ name, value, event, element });
        } else {
          continue;
        }
      }
      return passes;
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        const { params } = this.action;
        const actionEvent = Object.assign(event, { params });
        this.method.call(this.controller, actionEvent);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index: index2 } = this;
        const detail = { identifier, controller, element, index: index2, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (event instanceof KeyboardEvent && this.action.isFilterTarget(event)) {
        return false;
      }
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(node, attributeName) {
      const element = node;
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  function add(map, key, value) {
    fetch2(map, key).add(value);
  }
  function del(map, key, value) {
    fetch2(map, key).delete(value);
    prune(map, key);
  }
  function fetch2(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
    }
  };
  var SelectorObserver = class {
    constructor(element, selector, delegate, details = {}) {
      this.selector = selector;
      this.details = details;
      this.elementObserver = new ElementObserver(element, this);
      this.delegate = delegate;
      this.matchesByElement = new Multimap();
    }
    get started() {
      return this.elementObserver.started;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get element() {
      return this.elementObserver.element;
    }
    matchElement(element) {
      const matches = element.matches(this.selector);
      if (this.delegate.selectorMatchElement) {
        return matches && this.delegate.selectorMatchElement(element, this.details);
      }
      return matches;
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector)).filter((match2) => this.matchElement(match2));
      return match.concat(matches);
    }
    elementMatched(element) {
      this.selectorMatched(element);
    }
    elementUnmatched(element) {
      this.selectorUnmatched(element);
    }
    elementAttributeChanged(element, _attributeName) {
      const matches = this.matchElement(element);
      const matchedBefore = this.matchesByElement.has(this.selector, element);
      if (!matches && matchedBefore) {
        this.selectorUnmatched(element);
      }
    }
    selectorMatched(element) {
      if (this.delegate.selectorMatched) {
        this.delegate.selectorMatched(element, this.selector, this.details);
        this.matchesByElement.add(this.selector, element);
      }
    }
    selectorUnmatched(element) {
      this.delegate.selectorUnmatched(element, this.selector, this.details);
      this.matchesByElement.delete(this.selector, element);
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index2) => ({ element, attributeName, content, index: index2 }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_2, index2) => [left[index2], right[index2]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token, this.schema);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
      this.stringMapObserver.start();
      this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        try {
          const value = descriptor.reader(rawValue);
          let oldValue = rawOldValue;
          if (rawOldValue) {
            oldValue = descriptor.reader(rawOldValue);
          }
          changedMethod.call(this.receiver, value, oldValue);
        } catch (error2) {
          if (error2 instanceof TypeError) {
            error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
          }
          throw error2;
        }
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var OutletObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.outletsByName = new Multimap();
      this.outletElementsByName = new Multimap();
      this.selectorObserverMap = /* @__PURE__ */ new Map();
    }
    start() {
      if (this.selectorObserverMap.size === 0) {
        this.outletDefinitions.forEach((outletName) => {
          const selector = this.selector(outletName);
          const details = { outletName };
          if (selector) {
            this.selectorObserverMap.set(outletName, new SelectorObserver(document.body, selector, this, details));
          }
        });
        this.selectorObserverMap.forEach((observer) => observer.start());
      }
      this.dependentContexts.forEach((context) => context.refresh());
    }
    stop() {
      if (this.selectorObserverMap.size > 0) {
        this.disconnectAllOutlets();
        this.selectorObserverMap.forEach((observer) => observer.stop());
        this.selectorObserverMap.clear();
      }
    }
    refresh() {
      this.selectorObserverMap.forEach((observer) => observer.refresh());
    }
    selectorMatched(element, _selector, { outletName }) {
      const outlet = this.getOutlet(element, outletName);
      if (outlet) {
        this.connectOutlet(outlet, element, outletName);
      }
    }
    selectorUnmatched(element, _selector, { outletName }) {
      const outlet = this.getOutletFromMap(element, outletName);
      if (outlet) {
        this.disconnectOutlet(outlet, element, outletName);
      }
    }
    selectorMatchElement(element, { outletName }) {
      return this.hasOutlet(element, outletName) && element.matches(`[${this.context.application.schema.controllerAttribute}~=${outletName}]`);
    }
    connectOutlet(outlet, element, outletName) {
      var _a;
      if (!this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.add(outletName, outlet);
        this.outletElementsByName.add(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
      }
    }
    disconnectOutlet(outlet, element, outletName) {
      var _a;
      if (this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.delete(outletName, outlet);
        this.outletElementsByName.delete(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
      }
    }
    disconnectAllOutlets() {
      for (const outletName of this.outletElementsByName.keys) {
        for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
          for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
            this.disconnectOutlet(outlet, element, outletName);
          }
        }
      }
    }
    selector(outletName) {
      return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    get outletDependencies() {
      const dependencies = new Multimap();
      this.router.modules.forEach((module) => {
        const constructor = module.definition.controllerConstructor;
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
      });
      return dependencies;
    }
    get outletDefinitions() {
      return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
      return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
      const identifiers = this.dependentControllerIdentifiers;
      return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
      return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
      return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
      return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
    }
    get scope() {
      return this.context.scope;
    }
    get identifier() {
      return this.context.identifier;
    }
    get application() {
      return this.context.application;
    }
    get router() {
      return this.application.router;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      this.outletObserver = new OutletObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      this.outletObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    refresh() {
      this.outletObserver.refresh();
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.outletObserver.stop();
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a2 = function() {
        this.a.call(this);
      };
      const b2 = extendWithReflect(a2);
      b2.prototype.a = function() {
      };
      return new b2();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var OutletSet = class {
    constructor(scope, controllerElement) {
      this.scope = scope;
      this.controllerElement = controllerElement;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(outletName) {
      return this.find(outletName) != null;
    }
    find(...outletNames) {
      return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
    }
    findAll(...outletNames) {
      return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
    }
    getSelectorForOutletName(outletName) {
      const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
      return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      if (selector)
        return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
      const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
      return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
  };
  var Scope = class {
    constructor(schema, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
      this.outlets = new OutletSet(this.documentScope, element);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
      return this.element === document.documentElement;
    }
    get documentScope() {
      return this.isDocumentScope ? this : new Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
      const afterLoad = definition.controllerConstructor.afterLoad;
      if (afterLoad) {
        afterLoad(definition.identifier, this.application);
      }
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c2) => [c2, c2]))), objectFromEntries("0123456789".split("").map((n2) => [n2, n2])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k2, v2]) => Object.assign(Object.assign({}, memo), { [k2]: v2 }), {});
  }
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
      this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
    }
    static start(element, schema) {
      const application2 = new this(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      this.load({ identifier, controllerConstructor });
    }
    registerActionOption(name, filter) {
      this.actionDescriptorFilters[name] = filter;
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => {
        if (definition.controllerConstructor.shouldLoad) {
          this.router.loadDefinition(definition);
        }
      });
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outlet = this.outlets.find(name);
          if (outlet) {
            const outletController = this.application.getControllerForElementAndIdentifier(outlet, name);
            if (outletController) {
              return outletController;
            } else {
              throw new Error(`Missing "data-controller=${name}" attribute on outlet element for "${this.identifier}" controller`);
            }
          }
          throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outlet) => {
              const controller = this.application.getControllerForElementAndIdentifier(outlet, name);
              if (controller) {
                return controller;
              } else {
                console.warn(`The provided outlet element is missing the outlet controller "${name}" for "${this.identifier}"`, outlet);
              }
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outlet = this.outlets.find(name);
          if (outlet) {
            return outlet;
          } else {
            throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const typeFromObject = parseValueTypeConstant(payload.typeObject.type);
    if (!typeFromObject)
      return;
    const defaultValueType = parseValueTypeDefault(payload.typeObject.default);
    if (typeFromObject !== defaultValueType) {
      const propertyPath = payload.controller ? `${payload.controller}.${payload.token}` : payload.token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${payload.typeObject.default}" is of type "${defaultValueType}".`);
    }
    return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const typeFromObject = parseValueTypeObject({
      controller: payload.controller,
      token: payload.token,
      typeObject: payload.typeDefinition
    });
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeDefinition);
    const typeFromConstant = parseValueTypeConstant(payload.typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = payload.controller ? `${payload.controller}.${payload.typeDefinition}` : payload.token;
    throw new Error(`Unknown value type "${propertyPath}" for "${payload.token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const key = `${dasherize(payload.token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(payload.typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(payload.typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.debug = false;
  window.Stimulus = application;

  // app/javascript/controllers/hello_controller.js
  var hello_controller_default = class extends Controller {
    connect() {
      this.element.textContent = "Hello World!";
    }
  };

  // node_modules/timepicker-ui/dist/timepicker-ui.esm.js
  function e(e2, i2, t2, n2) {
    return new (t2 || (t2 = Promise))(function(r2, o2) {
      function s2(e3) {
        try {
          l2(n2.next(e3));
        } catch (e4) {
          o2(e4);
        }
      }
      function a2(e3) {
        try {
          l2(n2.throw(e3));
        } catch (e4) {
          o2(e4);
        }
      }
      function l2(e3) {
        var i3;
        e3.done ? r2(e3.value) : (i3 = e3.value, i3 instanceof t2 ? i3 : new t2(function(e4) {
          e4(i3);
        })).then(s2, a2);
      }
      l2((n2 = n2.apply(e2, i2 || [])).next());
    });
  }
  var i = (e2, i2) => {
    const { touches: t2 } = e2, { clientX: n2, clientY: r2 } = e2;
    if (!i2)
      return;
    const { left: o2, top: s2 } = i2.getBoundingClientRect();
    let a2 = { x: 0, y: 0 };
    if (void 0 === t2)
      a2 = { x: n2 - o2, y: r2 - s2 };
    else if (void 0 !== t2 && t2.length > 0 && Object.keys(t2).length > 0) {
      const { clientX: e3, clientY: i3 } = t2[0];
      a2 = { x: e3 - o2, y: i3 - s2 };
    }
    return 0 !== Object.keys(a2).length || a2.constructor !== Object ? a2 : void 0;
  };
  var t = (e2, i2) => !!e2 && e2.classList.contains(i2);
  var n = (e2, i2, t2) => {
    if (!e2)
      return;
    const n2 = new CustomEvent(i2, { detail: t2 });
    e2.dispatchEvent(n2);
  };
  var r = (e2, i2, t2) => ((e3, i3) => Math.round(e3 / i3) * i3)(e2, i2 * t2);
  var o = (e2, i2) => Array.from({ length: Number(i2) - Number(e2) + 1 }, (i3, t2) => Number(e2) + t2);
  var s = (e2, i2) => Array.from({ length: Number(i2) - Number(e2) + 1 }, (e3, t2) => Number(i2) - t2).reverse();
  var a = (e2) => {
    e2 && "function" == typeof e2 && e2();
  };
  var l = (e2 = "") => {
    const i2 = e2.replace(/(AM|PM|am|pm)/, (e3) => ` ${e3}`), t2 = new Date(`September 20, 2000 ${i2}`);
    return `${t2.getHours().toString().padStart(2, "0")}:${t2.getMinutes().toString().padStart(2, "0")}`;
  };
  var u = (e2, i2, t2, n2) => {
    if (!e2)
      return { hour: "12", minutes: "00", type: "24h" === i2 ? void 0 : "PM" };
    const { value: r2 } = e2;
    if (t2) {
      if ("boolean" == typeof t2 && t2) {
        const [e3, t3] = new Date().toLocaleTimeString().split(":");
        if (/[a-z]/i.test(t3) && "12h" === i2) {
          const [i3, n3] = t3.split(" ");
          return { hour: Number(e3) <= 9 ? `0${Number(e3)}` : e3, minutes: i3, type: n3 };
        }
        return { hour: Number(e3) <= 9 ? `0${Number(e3)}` : e3, minutes: t3, type: void 0 };
      }
      {
        const { time: e3, locales: r3, preventClockType: o3 } = t2;
        let s3 = e3;
        if (e3 || (s3 = new Date()), o3 && n2) {
          const [e4, i3] = new Date(s3).toLocaleTimeString().split(":");
          if (/[a-z]/i.test(i3)) {
            const [t3, n3] = i3.split(" ");
            return { hour: e4, minutes: t3, type: n3 };
          }
          return { hour: Number(e4) <= 9 ? `0${Number(e4)}` : e4, minutes: i3, type: void 0 };
        }
        const [a3, l3] = new Date(s3).toLocaleTimeString(r3, { timeStyle: "short" }).split(":");
        if (/[a-z]/i.test(l3) && "12h" === i2) {
          const [e4, i3] = l3.split(" ");
          return { hour: Number(a3) <= 9 ? `0${Number(a3)}` : a3, minutes: e4, type: i3 };
        }
        if ("12h" === i2) {
          const [e4, i3] = new Date(`1970-01-01T${a3}:${l3}Z`).toLocaleTimeString("en-US", { timeZone: "UTC", hour12: true, hour: "numeric", minute: "numeric" }).split(":"), [t3, n3] = i3.split(" ");
          return { hour: Number(e4) <= 9 ? `0${Number(e4)}` : a3, minutes: t3, type: n3 };
        }
        return { hour: Number(a3) <= 9 ? `0${Number(a3)}` : a3, minutes: l3, type: void 0 };
      }
    }
    if ("" === r2 || !r2)
      return { hour: "12", minutes: "00", type: "24h" === i2 ? void 0 : "PM" };
    const [o2, s2] = r2.split(" "), [a2, l2] = o2.split(":");
    if (/[a-z]/i.test(o2))
      return { error: "The input contains invalid letters or whitespace." };
    if (r2.includes(" ")) {
      if (!s2)
        return { error: `The input contains invalid letters or whitespace.
        Problem is with input length (max 5), currentLength: ${r2.length}.`, currentLength: r2.length };
      if (r2.length > 8 || "AM" !== s2 && "PM" !== s2)
        return { error: `The input contains invalid letters or whitespace.
        Problem is with input length (max 8), currentLength: ${r2.length} or invalid type (PM or AM), currentType: ${s2}.`, currentLength: r2.length, currentType: s2 };
    }
    let u2 = Number(l2);
    const c2 = Number(a2);
    return u2 < 10 ? u2 = `0${u2}` : 0 === u2 && (u2 = "00"), "12h" === i2 ? c2 > 12 || u2 > 59 || u2 < 0 || 0 === c2 || "AM" !== s2 && "PM" !== s2 ? { error: `The input contains invalid letters or numbers. Problem is with hour which should be less than 13 and higher or equal 0, currentHour: ${c2}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(u2)} or invalid type (PM or AM), currentType: ${s2}.`, currentHour: c2, currentMin: u2, currentType: s2 } : { hour: c2 < 10 ? `0${c2}` : c2.toString(), minutes: u2.toString(), type: s2 } : c2 < 0 || c2 > 23 || u2 > 59 ? { error: `The input contains invalid numbers. Problem is with hour which should be less than 24 and higher or equal 0, currentHour: ${c2}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(u2)}`, currentHour: c2, currentMin: u2 } : { hour: c2 < 10 ? `0${c2}` : c2.toString(), minutes: u2.toString() };
  };
  var c = (e2, i2, t2) => {
    const n2 = Number(e2);
    return "hour" === i2 ? "24h" !== t2 ? n2 > 0 && n2 <= 12 : n2 >= 0 && n2 <= 23 : "minutes" === i2 ? n2 >= 0 && n2 <= 59 : void 0;
  };
  var d = (e2, i2, t2, n2) => {
    if (e2) {
      if (Array.isArray(e2) && e2.length > 0) {
        return !e2.map((e3) => c(e3, i2, t2)).some((e3) => false === e3);
      }
      if ("string" == typeof e2 || "number" == typeof e2) {
        const r2 = c(e2, i2, t2), o2 = null == n2 ? void 0 : n2.map(Number).includes(Number(e2));
        return !(!r2 || o2);
      }
    }
  };
  function p(e2, i2) {
    void 0 === i2 && (i2 = {});
    var t2 = i2.insertAt;
    if (e2 && "undefined" != typeof document) {
      var n2 = document.head || document.getElementsByTagName("head")[0], r2 = document.createElement("style");
      r2.type = "text/css", "top" === t2 && n2.firstChild ? n2.insertBefore(r2, n2.firstChild) : n2.appendChild(r2), r2.styleSheet ? r2.styleSheet.cssText = e2 : r2.appendChild(document.createTextNode(e2));
    }
  }
  p(':export {\n  cranepurple800: #5c1349;\n  cranepurple900: #4e0d3a;\n  cranepurple700: #71135c;\n  cranered400: #f7363e;\n  white: #fff;\n  purple: #6200ee;\n  opacity: opacity 0.15s linear;\n}\n\n.timepicker-ui * {\n  box-sizing: border-box !important;\n}\n.timepicker-ui-modal {\n  font-family: "Roboto", sans-serif;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(156, 155, 155, 0.6);\n  z-index: 5000;\n  pointer-events: none;\n}\n.timepicker-ui-modal.show {\n  pointer-events: auto;\n}\n.timepicker-ui-modal.removed {\n  top: auto;\n  bottom: auto;\n  left: auto;\n  right: auto;\n  background-color: transparent;\n}\n.timepicker-ui-measure {\n  position: absolute;\n  top: -9999px;\n  width: 3.125rem;\n  height: 3.125rem;\n  overflow: scroll;\n}\n.timepicker-ui-wrapper, .timepicker-ui-wrapper.mobile {\n  position: fixed;\n  z-index: 5001;\n  width: 328px;\n  height: 500px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  outline: none;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper:not(.timepicker-ui-wrapper + .mobile) {\n    flex-direction: row;\n    height: 360px;\n    width: 584px;\n  }\n}\n@media screen and (max-width: 330px) and (orientation: portrait) {\n  .timepicker-ui-wrapper:not(.timepicker-ui-wrapper + .mobile) {\n    width: 315px;\n  }\n}\n.timepicker-ui-wrapper.mobile {\n  height: 218px;\n}\n@media screen and (max-width: 330px) {\n  .timepicker-ui-wrapper.mobile {\n    width: 315px;\n  }\n}\n.timepicker-ui-header, .timepicker-ui-header.mobile {\n  padding-top: 52px;\n  padding-bottom: 36px;\n  padding-right: 24px;\n  padding-left: 24px;\n  height: 104px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  height: 100%;\n}\n.timepicker-ui-header.mobile {\n  padding-bottom: 0;\n  padding-top: 35px;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-header:not(.timepicker-ui-header + .mobile) {\n    height: auto;\n    flex-direction: column;\n  }\n}\n.timepicker-ui-select-time, .timepicker-ui-select-time.mobile {\n  text-transform: uppercase;\n  position: absolute;\n  top: 16px;\n  left: 24px;\n  font-size: 12px;\n  color: #a9a9a9;\n}\n.timepicker-ui-body {\n  height: 256px;\n  width: 256px;\n  margin: 0 auto;\n  position: relative;\n  border-radius: 100%;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-body {\n    padding-right: 0;\n    padding-left: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-top: 23px;\n  }\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-landspace {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n  }\n}\n.timepicker-ui-footer, .timepicker-ui-footer-mobile {\n  height: 76px;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 4px;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-footer:not(.timepicker-ui-footer + .mobile) {\n    justify-content: flex-end;\n  }\n}\n.timepicker-ui-footer.mobile {\n  align-items: flex-start;\n}\n.timepicker-ui-clock-face {\n  background-color: #e0e0e0;\n  height: 100%;\n  width: 100%;\n  border-radius: 100%;\n  position: relative;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-clock-face {\n    height: 256px;\n    width: 256px;\n    top: 15px;\n  }\n}\n.timepicker-ui-dot {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  user-select: none;\n  touch-action: none;\n  transform: translate(-50%, -50%);\n  background-color: #6200ee;\n  height: 8px;\n  width: 8px;\n  border-radius: 100%;\n}\n.timepicker-ui-tips-wrapper {\n  height: 100%;\n  width: 100%;\n}\n.timepicker-ui-tips-wrapper-24h {\n  position: absolute;\n  height: 160px;\n  width: 160px;\n  z-index: 0;\n  transform: translate(-50%, -50%);\n  left: 50%;\n  top: 50%;\n  border-radius: 50%;\n}\n.timepicker-ui-tips-wrapper-24h-disabled {\n  pointer-events: none;\n  touch-action: none;\n  user-select: none;\n}\n.timepicker-ui-hour-time-12, .timepicker-ui-minutes-time, .timepicker-ui-hour-time-24 {\n  position: absolute;\n  width: 32px;\n  height: 32px;\n  text-align: center;\n  cursor: pointer;\n  font-size: 17.6px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  touch-action: none;\n  user-select: none;\n}\n.timepicker-ui-hour-time-12 span, .timepicker-ui-minutes-time span, .timepicker-ui-hour-time-24 span {\n  touch-action: none;\n  user-select: none;\n}\n.timepicker-ui-hour-time-12 {\n  display: block;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.timepicker-ui-wrapper-time, .timepicker-ui-wrapper-time.mobile {\n  display: flex;\n  margin-right: 10px;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-time:not(.timepicker-ui-wrapper-time + .mobile) {\n    margin-right: 0;\n    height: auto;\n  }\n}\n.timepicker-ui-wrapper-time-24h {\n  margin-right: 0px;\n}\n.timepicker-ui-wrapper-time.mobile {\n  position: relative;\n}\n.timepicker-ui-hour, .timepicker-ui-minutes, .timepicker-ui-hour.mobile, .timepicker-ui-minutes.mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 51.2px;\n  background-color: #e4e4e4;\n  border-radius: 7px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  outline: none;\n  border: 2px solid transparent;\n  padding: 10px;\n  width: 96px;\n  text-align: center;\n}\n.timepicker-ui-hour:focus-visible, .timepicker-ui-minutes:focus-visible, .timepicker-ui-hour.mobile:focus-visible, .timepicker-ui-minutes.mobile:focus-visible {\n  outline: auto;\n}\n.timepicker-ui-hour:hover, .timepicker-ui-hour.active, .timepicker-ui-minutes:hover, .timepicker-ui-minutes.active, .timepicker-ui-hour.mobile:hover, .timepicker-ui-hour.mobile.active, .timepicker-ui-minutes.mobile:hover, .timepicker-ui-minutes.mobile.active {\n  color: #6200ee;\n  background-color: #ece0fd;\n}\n.timepicker-ui-hour::-webkit-outer-spin-button, .timepicker-ui-hour::-webkit-inner-spin-button, .timepicker-ui-minutes::-webkit-outer-spin-button, .timepicker-ui-minutes::-webkit-inner-spin-button, .timepicker-ui-hour.mobile::-webkit-outer-spin-button, .timepicker-ui-hour.mobile::-webkit-inner-spin-button, .timepicker-ui-minutes.mobile::-webkit-outer-spin-button, .timepicker-ui-minutes.mobile::-webkit-inner-spin-button {\n  -webkit-appearance: none !important;\n  margin: 0 !important;\n}\n.timepicker-ui-hour[type=number], .timepicker-ui-minutes[type=number], .timepicker-ui-hour.mobile[type=number], .timepicker-ui-minutes.mobile[type=number] {\n  -moz-appearance: textfield !important;\n}\n.timepicker-ui-hour, .timepicker-ui-minutes {\n  outline: none;\n  border: 2px solid transparent;\n}\n.timepicker-ui-hour[contenteditable=true]:focus, .timepicker-ui-hour[contenteditable=true]:active, .timepicker-ui-minutes[contenteditable=true]:focus, .timepicker-ui-minutes[contenteditable=true]:active {\n  border: 2px solid #6200ee;\n  outline-color: #6200ee;\n  user-select: all;\n}\n.timepicker-ui-hour.mobile, .timepicker-ui-minutes.mobile {\n  height: 70px;\n  outline: none;\n  border: 2px solid transparent;\n}\n.timepicker-ui-hour.mobile[contenteditable=true]:focus, .timepicker-ui-hour.mobile[contenteditable=true]:active, .timepicker-ui-minutes.mobile[contenteditable=true]:focus, .timepicker-ui-minutes.mobile[contenteditable=true]:active {\n  border: 2px solid #6200ee;\n  outline-color: #6200ee;\n  user-select: all;\n}\n.timepicker-ui-dots, .timepicker-ui-dots.mobile {\n  padding-left: 5px;\n  padding-right: 5px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 57.6px;\n  user-select: none;\n  touch-action: none;\n}\n.timepicker-ui-wrapper-type-time, .timepicker-ui-wrapper-type-time.mobile {\n  display: flex;\n  flex-direction: column;\n  height: 80px;\n  justify-content: center;\n  align-items: center;\n  font-size: 16px;\n  font-weight: 500;\n  color: #787878;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-type-time {\n    flex-direction: row;\n    width: 100%;\n  }\n}\n.timepicker-ui-wrapper-type-time.mobile {\n  height: 70px;\n}\n.timepicker-ui-am, .timepicker-ui-pm, .timepicker-ui-am.mobile, .timepicker-ui-pm.mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 2px solid #d6d6d6;\n  transition: all 0.3s ease;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.timepicker-ui-am:hover, .timepicker-ui-am.active, .timepicker-ui-pm:hover, .timepicker-ui-pm.active, .timepicker-ui-am.mobile:hover, .timepicker-ui-am.mobile.active, .timepicker-ui-pm.mobile:hover, .timepicker-ui-pm.mobile.active {\n  color: #6200ee;\n  background-color: #ece0fd;\n}\n.timepicker-ui-am.active, .timepicker-ui-pm.active, .timepicker-ui-am.mobile.active, .timepicker-ui-pm.mobile.active {\n  pointer-events: none;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-am:not(.timepicker-ui-am + .mobile), .timepicker-ui-pm:not(.timepicker-ui-pm + .mobile) {\n    width: 50%;\n    height: 44px;\n  }\n}\n.timepicker-ui-am, .timepicker-ui-am.mobile {\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  border-bottom-width: 0.3752px;\n}\n.timepicker-ui-am.mobile {\n  border-bottom-left-radius: 0;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-am:not(.timepicker-ui-am + .mobile) {\n    border-top-left-radius: 7px;\n    border-bottom-left-radius: 7px;\n    border-top-right-radius: 0;\n    border-top-width: 1.5008px;\n    border-right-width: 0.3752px;\n  }\n}\n.timepicker-ui-pm, .timepicker-ui-pm.mobile {\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px;\n  border-top-width: 0.3752px;\n  width: 54px;\n}\n.timepicker-ui-pm.mobile {\n  border-top-right-radius: 0;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-pm:not(.timepicker-ui-pm + .mobile) {\n    border-bottom-right-radius: 7px;\n    border-top-right-radius: 7px;\n    border-bottom-left-radius: 0;\n    border-bottom-width: 1.5008px;\n    border-left-width: 0.3752px;\n    width: 50%;\n    height: 44px;\n  }\n}\n.timepicker-ui-cancel-btn, .timepicker-ui-ok-btn, .timepicker-ui-cancel-btn.mobile, .timepicker-ui-ok.btn-mobile {\n  color: #6200ee;\n  text-transform: uppercase;\n  border-radius: 7px;\n  background-color: transparent;\n  text-align: center;\n  font-size: 15.2px;\n  padding-top: 9px;\n  padding-bottom: 9px;\n  font-weight: 500;\n  transition: all 0.3s ease;\n  cursor: pointer;\n}\n.timepicker-ui-cancel-btn:hover, .timepicker-ui-ok-btn:hover, .timepicker-ui-cancel-btn.mobile:hover, .timepicker-ui-ok.btn-mobile:hover {\n  background-color: #d6d6d6;\n}\n.timepicker-ui-cancel-btn, .timepicker-ui-cancel-btn.mobile {\n  width: 72px;\n  margin-right: 4px;\n}\n.timepicker-ui-ok-btn, .timepicker-ui-ok-btn.mobile {\n  width: 64px;\n  margin-left: 4px;\n}\n.timepicker-ui-wrapper-btn, .timepicker-ui-keyboard-icon, .timepicker-ui-wrapper-btn-mobile, .timepicker-ui-keyboard-icon-mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper.mobile {\n  width: 44px;\n  height: 44px;\n  position: relative;\n  bottom: -26px;\n  left: 12px;\n  transition: all 0.3s ease;\n}\n.timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile:hover .timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-wrapper.mobile:hover .timepicker-ui-keyboard-icon.mobile {\n  background-color: #d6d6d6;\n  border-radius: 7px;\n}\n.timepicker-ui-keyboard-icon-wrapper.mobile {\n  bottom: -5px;\n}\n.timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon.mobile {\n  padding: 12px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  color: #4e545a;\n  height: 44px;\n  width: 44px;\n}\n.timepicker-ui-keyboard-icon:hover, .timepicker-ui-keyboard-icon.mobile:hover {\n  color: #6200ee;\n}\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper.mobile {\n    position: absolute;\n    bottom: 8px;\n  }\n}\n.timepicker-ui-wrapper-btn, .timepicker-ui-wrapper-btn.mobile {\n  margin-right: 8px;\n  position: relative;\n  bottom: -14px;\n}\n.timepicker-ui-hour-text, .timepicker-ui-minute-text, .timepicker-ui-hour-text.mobile, .timepicker-ui-minute-text.mobile {\n  position: absolute;\n  bottom: 6px;\n  font-size: 12.8px;\n  color: #a9a9a9;\n  left: 0;\n}\n.timepicker-ui-minute-text, .timepicker-ui-minute-text.mobile {\n  left: 120px;\n}\n.timepicker-ui-clock-hand {\n  position: absolute;\n  background-color: #6200ee;\n  bottom: 50%;\n  height: 40%;\n  left: calc(50% - 1px);\n  transform-origin: center bottom 0;\n  width: 2px;\n}\n.timepicker-ui-clock-hand-24h {\n  height: 23%;\n}\n.timepicker-ui-circle-hand {\n  position: absolute;\n  transform: translate(-48%, -50%);\n  width: 4px;\n  height: 4px;\n  border-radius: 100%;\n  transition: all 0.2s ease;\n  height: 46px;\n  width: 46px;\n  box-sizing: border-box !important;\n  background-color: #6200ee;\n}\n.timepicker-ui-circle-hand.small-circle {\n  height: 36px;\n  width: 36px;\n  box-sizing: border-box !important;\n}\n.timepicker-ui-circle-hand-24h {\n  transform: translate(-50%, -50%);\n  height: 32px;\n  width: 32px;\n  top: 4px;\n  left: 1px;\n}\n.timepicker-ui-value-tips, .timepicker-ui-value-tips-24h {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  transition: 0.3s ease color;\n  border-radius: 50%;\n  outline: none;\n}\n.timepicker-ui-value-tips:focus, .timepicker-ui-value-tips-24h:focus {\n  background: rgba(143, 143, 143, 0.315);\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);\n}\n.timepicker-ui-value-tips.active, .timepicker-ui-value-tips-24h.active {\n  color: #fff;\n  transition: none;\n}\n.timepicker-ui-clock-animation {\n  animation: clockanimation 350ms linear;\n}\n.timepicker-ui-open-element.disabled {\n  pointer-events: none;\n  touch-action: none;\n  user-select: none;\n}\n.timepicker-ui-tips-animation {\n  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, height 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\n}\n.timepicker-ui-tips-disabled {\n  color: rgba(156, 155, 155, 0.6);\n  pointer-events: none;\n}\n\n.opacity {\n  transition: opacity 0.15s linear;\n}\n.opacity.show {\n  opacity: 1;\n}\n\n.invalid-value {\n  border-color: #d50000 !important;\n  color: #d50000 !important;\n}\n.invalid-value:hover, .invalid-value:focus, .invalid-value:active {\n  border-color: #d50000 !important;\n  color: #d50000 !important;\n}\n\n@keyframes clockanimation {\n  0% {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n.timepicker-ui-invalid-format {\n  border: 2px solid red;\n  color: red;\n}\n\n.timepicker-ui-invalid-text {\n  color: red;\n}');
  p(":export {\n  cranepurple800: #5c1349;\n  cranepurple900: #4e0d3a;\n  cranepurple700: #71135c;\n  cranered400: #f7363e;\n  white: #fff;\n  purple: #6200ee;\n  opacity: opacity 0.15s linear;\n}\n\n.timepicker-ui-wrapper.crane-straight, .timepicker-ui-wrapper.mobile.crane-straight {\n  border-radius: 0;\n  background-color: #4e0d3a;\n  color: #fff;\n}\n.timepicker-ui-wrapper.crane-straight.radius, .timepicker-ui-wrapper.mobile.crane-straight.radius {\n  border-radius: 1.25rem;\n}\n.timepicker-ui-select-time.crane-straight, .timepicker-ui-select-time.mobile.crane-straight {\n  color: #e5e5e5;\n}\n.timepicker-ui-clock-face.crane-straight, .timepicker-ui-clock-face.mobile.crane-straight {\n  background-color: #71135c;\n}\n.timepicker-ui-dot.crane-straight, .timepicker-ui-dot.mobile.crane-straight {\n  background-color: #f7363e;\n}\n.timepicker-ui-hour.crane-straight, .timepicker-ui-minutes.crane-straight, .timepicker-ui-hour.mobile.crane-straight, .timepicker-ui-minutes.mobile.crane-straight {\n  background-color: #71135c;\n  border-radius: 0;\n  color: #fff;\n}\n.timepicker-ui-hour.crane-straight.radius, .timepicker-ui-minutes.crane-straight.radius, .timepicker-ui-hour.mobile.crane-straight.radius, .timepicker-ui-minutes.mobile.crane-straight.radius {\n  border-radius: 1.25rem;\n}\n.timepicker-ui-hour.crane-straight:hover, .timepicker-ui-hour.crane-straight.active, .timepicker-ui-minutes.crane-straight:hover, .timepicker-ui-minutes.crane-straight.active, .timepicker-ui-hour.mobile.crane-straight:hover, .timepicker-ui-hour.mobile.crane-straight.active, .timepicker-ui-minutes.mobile.crane-straight:hover, .timepicker-ui-minutes.mobile.crane-straight.active {\n  background-color: #f7363e;\n}\n.timepicker-ui-hour.mobile.crane-straight[contenteditable=true]:focus, .timepicker-ui-hour.mobile.crane-straight[contenteditable=true]:active, .timepicker-ui-minutes.mobile.crane-straight[contenteditable=true]:focus, .timepicker-ui-minutes.mobile.crane-straight[contenteditable=true]:active {\n  border-color: #fff;\n  outline-color: #fff;\n}\n.timepicker-ui-dots.crane-straight, .timepicker-ui-dots.mobile.crane-straight {\n  color: #fff;\n}\n.timepicker-ui-wrapper-type-time.crane-straight, .timepicker-ui-wrapper-type-time.mobile.crane-straight {\n  color: #fff;\n}\n.timepicker-ui-am.crane-straight, .timepicker-ui-pm.crane-straight, .timepicker-ui-am.mobile.crane-straight, .timepicker-ui-pm.mobile.crane-straight {\n  border: 0.125rem solid transparent;\n  border-radius: 0;\n  background-color: #71135c;\n}\n.timepicker-ui-am:hover.crane-straight, .timepicker-ui-am.active.crane-straight, .timepicker-ui-pm:hover.crane-straight, .timepicker-ui-pm.active.crane-straight, .timepicker-ui-am.mobile:hover.crane-straight, .timepicker-ui-am.mobile.active.crane-straight, .timepicker-ui-pm.mobile:hover.crane-straight, .timepicker-ui-pm.mobile.active.crane-straight {\n  color: #fff;\n  background-color: #f7363e;\n}\n.timepicker-ui-am.crane-straight.radius {\n  border-top-left-radius: 1.25rem;\n  border-top-right-radius: 1.25rem;\n}\n.timepicker-ui-pm.crane-straight.radius {\n  border-bottom-left-radius: 1.25rem;\n  border-bottom-right-radius: 1.25rem;\n}\n@media screen and (min-width: 320px) and (max-width: 826px) and (orientation: landscape) {\n  .timepicker-ui-am:not(.timepicker-ui-am + .mobile).crane-straight.radius {\n    border-bottom-left-radius: 1.25rem;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n  }\n}\n@media screen and (min-width: 320px) and (max-width: 826px) and (orientation: landscape) {\n  .timepicker-ui-pm:not(.timepicker-ui-pm + .mobile).crane-straight.radius {\n    border-bottom-right-radius: 1.25rem;\n    border-top-right-radius: 1.25rem;\n    border-bottom-left-radius: 0;\n    border-top-left-radius: 0;\n  }\n}\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am.mobile.crane-straight.radius {\n    border-bottom-left-radius: 0rem;\n    border-bottom-right-radius: 0rem;\n  }\n}\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-pm.mobile.crane-straight.radius {\n    border-top-left-radius: 0rem;\n    border-top-right-radius: 0rem;\n  }\n}\n.timepicker-ui-cancel-btn.crane-straight, .timepicker-ui-ok-btn.crane-straight, .timepicker-ui-cancel-btn.mobile.crane-straight, .timepicker-ui-ok-btn.mobile.crane-straight {\n  color: #fff;\n  border-radius: 0rem;\n}\n.timepicker-ui-cancel-btn.crane-straight.radius, .timepicker-ui-ok-btn.crane-straight.radius, .timepicker-ui-cancel-btn.mobile.crane-straight.radius, .timepicker-ui-ok-btn.mobile.crane-straight.radius {\n  border-radius: 0.8125rem;\n}\n.timepicker-ui-cancel-btn:hover.crane-straight, .timepicker-ui-ok-btn:hover.crane-straight, .timepicker-ui-cancel-btn.mobile:hover.crane-straight, .timepicker-ui-ok-btn.mobile:hover.crane-straight {\n  background-color: #f7363e;\n}\n.timepicker-ui-keyboard-icon-wrapper.crane-straight, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight {\n  color: #fff;\n}\n.timepicker-ui-keyboard-icon-wrapper.crane-straight.radius, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius {\n  border-radius: 1.25rem;\n}\n.timepicker-ui-keyboard-icon-wrapper.crane-straight:hover .timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-wrapper.crane-straight:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight:hover .timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight:hover .timepicker-ui-keyboard-icon.mobile {\n  background-color: #f7363e;\n  color: #fff;\n  border-radius: 0;\n}\n.timepicker-ui-keyboard-icon-wrapper.crane-straight.radius:hover .timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-wrapper.crane-straight.radius:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius:hover .timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius:hover .timepicker-ui-keyboard-icon.mobile {\n  border-radius: 0.875rem;\n}\n.timepicker-ui-keyboard-icon.crane-straight:hover, .timepicker-ui-keyboard-icon.mobile.crane-straight:hover {\n  color: #fff;\n}\n.timepicker-ui-keyboard-icon.crane-straight:hover.radius, .timepicker-ui-keyboard-icon.mobile.crane-straight:hover.radius {\n  border-radius: 1.25rem;\n}\n.timepicker-ui-clock-hand.crane-straight {\n  background-color: #f7363e;\n}\n.timepicker-ui-circle-hand.crane-straight {\n  border-color: #f7363e;\n  background-color: #f7363e;\n}\n.timepicker-ui-value-tips.crane-straight {\n  color: #fff;\n}");
  p(":export {\n  cranepurple800: #5c1349;\n  cranepurple900: #4e0d3a;\n  cranepurple700: #71135c;\n  cranered400: #f7363e;\n  white: #fff;\n  purple: #6200ee;\n  opacity: opacity 0.15s linear;\n}\n\n.timepicker-ui-hour-time-12.m3, .timepicker-ui-hour-time-24.m3 {\n  color: #1a1c18;\n}\n.timepicker-ui-wrapper.m3 {\n  border-radius: 35px;\n  background-color: #e5eadc;\n  box-shadow: unset;\n}\n.timepicker-ui-hour.active.m3, .timepicker-ui-minutes.active.m3 {\n  background-color: #b8f397;\n  color: #042100;\n}\n.timepicker-ui-minutes.m3, .timepicker-ui-hour.m3 {\n  background-color: #dfe4d6;\n}\n.timepicker-ui-minutes:hover.m3, .timepicker-ui-hour:hover.m3 {\n  color: #386a20;\n}\n.timepicker-ui-clock-face.m3 {\n  background-color: #dfe4d6;\n}\n.timepicker-ui-clock-hand.m3, .timepicker-ui-dot.m3, .timepicker-ui-circle-hand.m3 {\n  background-color: #386a20 !important;\n}\n.timepicker-ui-cancel-btn.m3, .timepicker-ui-ok-btn.m3 {\n  color: #386a20;\n}\n.timepicker-ui-cancel-btn:hover.m3, .timepicker-ui-ok-btn:hover.m3 {\n  background-color: #dfe4d6;\n}\n.timepicker-ui-wrapper-type-time.m3 {\n  color: #6b7165;\n}\n.timepicker-ui-am.m3, .timepicker-ui-am.m3, .timepicker-ui-pm.m3, .timepicker-ui-pm.m3 {\n  border-color: #74796e;\n  border-width: 1px;\n}\n.timepicker-ui-am.m3, .timepicker-ui-am.m3 {\n  border-bottom-width: 0px;\n}\n.timepicker-ui-am:hover.m3, .timepicker-ui-am.active.m3, .timepicker-ui-pm:hover.m3, .timepicker-ui-pm.active.m3 {\n  background-color: #bbebeb;\n  color: #002021;\n}\n.timepicker-ui-hour.mobile:hover.m3, .timepicker-ui-minutes.mobile:hover.m3 {\n  background-color: #dfe4d6;\n}");
  var m = ":export {\n  cranepurple800: #5c1349;\n  cranepurple900: #4e0d3a;\n  cranepurple700: #71135c;\n  cranered400: #f7363e;\n  white: #fff;\n  purple: #6200ee;\n  opacity: opacity 0.15s linear;\n}";
  p(m);
  var h = { amLabel: "AM", animation: true, appendModalSelector: "", backdrop: true, cancelLabel: "CANCEL", editable: false, enableScrollbar: false, enableSwitchIcon: false, mobileTimeLabel: "Enter Time", focusInputAfterCloseModal: false, hourMobileLabel: "Hour", iconTemplate: '<i class="material-icons timepicker-ui-keyboard-icon">keyboard</i>', iconTemplateMobile: '<i class="material-icons timepicker-ui-keyboard-icon">schedule</i>', incrementHours: 1, incrementMinutes: 1, minuteMobileLabel: "Minute", mobile: false, okLabel: "OK", pmLabel: "PM", timeLabel: "Select Time", switchToMinutesAfterSelectHour: false, theme: "basic", clockType: "12h", disabledTime: void 0, currentTime: void 0, focusTrap: true, delayHandler: 300 };
  var v = "mousedown mouseup mousemove mouseleave mouseover touchstart touchmove touchend";
  var b = ["00", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  var k = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  var g = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
  var y = class {
    constructor(e2) {
      this.clean = () => {
        var e3, i2;
        const t2 = null === (e3 = this.tipsWrapper) || void 0 === e3 ? void 0 : e3.querySelectorAll("span.timepicker-ui-hour-time-12"), n2 = null === (i2 = this.tipsWrapper) || void 0 === i2 ? void 0 : i2.querySelectorAll("span.timepicker-ui-minutes-time");
        this._removeClasses(t2), this._removeClasses(n2);
      }, this.create = () => {
        var e3;
        if (!(this.clockFace && this.array && this.classToAdd && this.tipsWrapper))
          return;
        const i2 = (this.clockFace.offsetWidth - 32) / 2, n2 = (this.clockFace.offsetHeight - 32) / 2, r2 = i2 - 9;
        this.tipsWrapper.innerHTML = "", null === (e3 = this.array) || void 0 === e3 || e3.forEach((e4, o2) => {
          var s2, a2, l2, u2, c2, d2;
          const p2 = o2 * (360 / this.array.length) * (Math.PI / 180);
          const m2 = document.createElement("span"), h2 = document.createElement("span");
          h2.innerHTML = e4, this.disabledTime && (Array.isArray(this.disabledTime) && (null === (s2 = this.disabledTime) || void 0 === s2 ? void 0 : s2.includes(e4)) && (h2.classList.add("timepicker-ui-tips-disabled"), m2.classList.add("timepicker-ui-tips-disabled")), this.hour === this.disabledTime.removedStartedHour && (null === (l2 = null === (a2 = this.disabledTime) || void 0 === a2 ? void 0 : a2.startMinutes) || void 0 === l2 ? void 0 : l2.includes(e4)) && (h2.classList.add("timepicker-ui-tips-disabled"), m2.classList.add("timepicker-ui-tips-disabled"), h2.tabIndex = -1), this.hour === this.disabledTime.removedEndHour && (null === (c2 = null === (u2 = this.disabledTime) || void 0 === u2 ? void 0 : u2.endMinutes) || void 0 === c2 ? void 0 : c2.includes(e4)) && (h2.classList.add("timepicker-ui-tips-disabled"), m2.classList.add("timepicker-ui-tips-disabled"), h2.tabIndex = -1)), "24h" === this.clockType ? (h2.classList.add("timepicker-ui-value-tips-24h"), t(h2, "timepicker-ui-tips-disabled") || (h2.tabIndex = 0)) : (h2.classList.add("timepicker-ui-value-tips"), t(h2, "timepicker-ui-tips-disabled") || (h2.tabIndex = 0)), m2.classList.add(this.classToAdd), "crane-straight" === this.theme && (m2.classList.add("crane-straight"), h2.classList.add("crane-straight")), "m3" === this.theme && (m2.classList.add("m3"), h2.classList.add("m3")), m2.style.left = i2 + Math.sin(p2) * r2 - m2.offsetWidth + "px", m2.style.bottom = n2 + Math.cos(p2) * r2 - m2.offsetHeight + "px", m2.appendChild(h2), null === (d2 = this.tipsWrapper) || void 0 === d2 || d2.appendChild(m2);
        });
      }, this.updateDisable = (e3) => {
        var i2, t2;
        const n2 = null === (i2 = this.tipsWrapper) || void 0 === i2 ? void 0 : i2.querySelectorAll("span.timepicker-ui-hour-time-12"), r2 = null === (t2 = this.tipsWrapper) || void 0 === t2 ? void 0 : t2.querySelectorAll("span.timepicker-ui-minutes-time");
        if (this._removeClasses(n2), this._removeClasses(r2), (null == e3 ? void 0 : e3.hoursToUpdate) && n2 && this._addClassesWithIncludes(n2, e3.hoursToUpdate), (null == e3 ? void 0 : e3.minutesToUpdate) && r2) {
          const { actualHour: i3, removedEndHour: t3, removedStartedHour: n3, startMinutes: o2, endMinutes: s2 } = e3.minutesToUpdate;
          t3 === i3 && s2.length > 0 ? this._addClassesWithIncludes(r2, s2) : Number(i3) > Number(n3) && Number(i3) < Number(t3) && this._addClasses(r2), n3 === i3 && o2.length > 0 ? this._addClassesWithIncludes(r2, o2) : Number(i3) > Number(n3) && Number(i3) < Number(t3) && this._addClasses(r2);
        }
        if (e3) {
          const { amHours: i3, pmHours: t3, activeMode: o2, startMinutes: s2, endMinutes: a2, removedAmHour: l2, removedPmHour: u2, actualHour: c2 } = e3.minutesToUpdate;
          if (!i3 || !t3)
            return;
          n2 && (i3 && "AM" === o2 && this._addClassesWithIncludes(n2, i3), t3 && "PM" === o2 && this._addClassesWithIncludes(n2, t3)), r2 && s2 && a2 && ("AM" === o2 && ("00" === a2[0] && 1 === a2.length && 0 === s2.length && Number(c2) >= Number(i3[0]) && this._addClasses(r2), 0 === s2.length && a2.length > 1 && Number(c2) >= Number(l2) && this._addClasses(r2), s2.length > 0 && a2.length > 1 && "00" === a2[0] && (Number(l2) === Number(c2) ? this._addClassesWithIncludes(r2, s2) : Number(c2) > Number(l2) && this._addClasses(r2)), "00" === a2[0] && 1 === a2.length && s2.length > 0 && (Number(l2) === Number(c2) ? this._addClassesWithIncludes(r2, s2) : Number(c2) > Number(l2) && this._addClasses(r2))), "PM" === o2 && (c2 < Number(u2) && this._addClasses(r2), c2 === u2 && this._addClassesWithIncludes(r2, a2), a2.length > 0 && Number(c2) === u2 - 1 && this._addClassesWithIncludes(r2, a2)));
        }
      }, this._removeClasses = (e3) => {
        null == e3 || e3.forEach(({ classList: e4, children: i2 }) => {
          e4.remove("timepicker-ui-tips-disabled"), i2[0].classList.remove("timepicker-ui-tips-disabled"), i2[0].tabIndex = 0;
        });
      }, this._addClasses = (e3) => {
        null == e3 || e3.forEach(({ classList: e4, children: i2 }) => {
          e4.add("timepicker-ui-tips-disabled"), i2[0].classList.add("timepicker-ui-tips-disabled"), i2[0].tabIndex = -1;
        });
      }, this._addClassesWithIncludes = (e3, i2) => {
        null == e3 || e3.forEach(({ classList: e4, children: t2, textContent: n2 }) => {
          (null == i2 ? void 0 : i2.includes(n2)) && (e4.add("timepicker-ui-tips-disabled"), t2[0].classList.add("timepicker-ui-tips-disabled"), t2[0].tabIndex = -1);
        });
      }, this.array = null == e2 ? void 0 : e2.array, this.classToAdd = null == e2 ? void 0 : e2.classToAdd, this.clockFace = null == e2 ? void 0 : e2.clockFace, this.tipsWrapper = null == e2 ? void 0 : e2.tipsWrapper, this.theme = null == e2 ? void 0 : e2.theme, this.clockType = null == e2 ? void 0 : e2.clockType, this.disabledTime = null == e2 ? void 0 : e2.disabledTime, this.hour = null == e2 ? void 0 : e2.hour;
    }
  };
  var _ = (e2, i2) => {
    let t2;
    return (...n2) => {
      clearTimeout(t2), t2 = setTimeout(() => {
        e2(...n2);
      }, i2);
    };
  };
  var T = class {
    constructor(o2, s2) {
      var p2, T2, f;
      this.create = () => {
        this._updateInputValueWithCurrentTimeOnStart(), this._checkDisabledValuesOnStart(), this._setTimepickerClassToElement(), this._setInputClassToInputElement(), this._setDataOpenToInputIfDosentExistInWrapper(), this._setClassTopOpenElement(), this._handleOpenOnEnterFocus(), this._handleOpenOnClick(), this._getDisableTime();
      }, this.open = (e2) => {
        this.create(), this._eventsBundle(), a(e2);
      }, this.close = () => _((...e2) => {
        var i2;
        if (e2.length > 2 || !this.modalElement)
          return;
        const [t2] = e2.filter((e3) => "boolean" == typeof e3), [n2] = e2.filter((e3) => "function" == typeof e3);
        t2 && (this._handleOkButton(), null === (i2 = this.okButton) || void 0 === i2 || i2.click()), this._isTouchMouseMove = false, v.split(" ").map((e3) => document.removeEventListener(e3, this._mutliEventsMoveHandler, false)), document.removeEventListener("mousedown", this._eventsClickMobileHandler), document.removeEventListener("touchstart", this._eventsClickMobileHandler), document.removeEventListener("keypress", this._handleEscClick), this.wrapper.removeEventListener("keydown", this._focusTrapHandler), this._options.enableSwitchIcon && (this.keyboardClockIcon.removeEventListener("touchstart", this._handlerViewChange()), this.keyboardClockIcon.removeEventListener("mousedown", this._handlerViewChange())), this._removeAnimationToClose(), this.openElement.forEach((e3) => null == e3 ? void 0 : e3.classList.remove("disabled")), setTimeout(() => {
          document.body.style.overflowY = "", document.body.style.paddingRight = "";
        }, 400), this.openElement.forEach((e3) => null == e3 ? void 0 : e3.classList.remove("disabled")), setTimeout(() => {
          var e3;
          this._options.focusInputAfterCloseModal && (null === (e3 = this.input) || void 0 === e3 || e3.focus()), null !== this.modalElement && (this.modalElement.remove(), this._isModalRemove = true);
        }, 300), a(n2);
      }, this._options.delayHandler || 300), this.destroy = (e2) => {
        v.split(" ").map((e3) => document.removeEventListener(e3, this._mutliEventsMoveHandler, false)), document.removeEventListener("mousedown", this._eventsClickMobileHandler), document.removeEventListener("touchstart", this._eventsClickMobileHandler), this._options.enableSwitchIcon && this.keyboardClockIcon && (this.keyboardClockIcon.removeEventListener("touchstart", this._handlerViewChange()), this.keyboardClockIcon.removeEventListener("mousedown", this._handlerViewChange())), this._cloned = this._element.cloneNode(true), this._element.after(this._cloned), this._element.remove(), this._element = null, null === this._element && a(e2), this._element = this._cloned;
      }, this.update = (e2, i2) => {
        this._options = Object.assign(Object.assign({}, this._options), e2.options), this._checkMobileOption(), e2.create && this.create(), a(i2);
      }, this._preventClockTypeByCurrentTime = () => {
        var e2, i2, t2, n2, r2;
        if ("boolean" != typeof (null === (e2 = this._options) || void 0 === e2 ? void 0 : e2.currentTime) && (null === (t2 = null === (i2 = this._options) || void 0 === i2 ? void 0 : i2.currentTime) || void 0 === t2 ? void 0 : t2.preventClockType) || "boolean" == typeof (null === (n2 = this._options) || void 0 === n2 ? void 0 : n2.currentTime) && (null === (r2 = this._options) || void 0 === r2 ? void 0 : r2.currentTime)) {
          const { currentTime: e3, clockType: i3 } = this._options, { type: t3 } = u(this.input, i3, e3, true);
          this._options.clockType = t3 ? "12h" : "24h";
        }
      }, this._updateInputValueWithCurrentTimeOnStart = () => {
        var e2, i2, t2, n2, r2;
        if ("boolean" != typeof (null === (e2 = this._options) || void 0 === e2 ? void 0 : e2.currentTime) && (null === (t2 = null === (i2 = this._options) || void 0 === i2 ? void 0 : i2.currentTime) || void 0 === t2 ? void 0 : t2.updateInput) || "boolean" == typeof (null === (n2 = this._options) || void 0 === n2 ? void 0 : n2.currentTime) && (null === (r2 = this._options) || void 0 === r2 ? void 0 : r2.currentTime)) {
          const { hour: e3, minutes: i3, type: t3 } = u(this.input, this._options.clockType, this._options.currentTime);
          this.input.value = t3 ? `${e3}:${i3} ${t3}` : `${e3}:${i3}`;
        }
      }, this._setTheme = () => {
        var e2, i2;
        const t2 = null === (e2 = this.modalElement) || void 0 === e2 ? void 0 : e2.querySelectorAll("div"), n2 = [...null === (i2 = this.modalElement) || void 0 === i2 ? void 0 : i2.querySelectorAll("input"), ...t2], { theme: r2 } = this._options;
        "crane-straight" === r2 ? n2.forEach((e3) => e3.classList.add("crane-straight")) : "crane-radius" === r2 ? n2.forEach((e3) => e3.classList.add("crane-straight", "radius")) : "m3" === r2 && n2.forEach((e3) => e3.classList.add("m3"));
      }, this._setInputClassToInputElement = () => {
        var e2;
        t(this.input, "timepicker-ui-input") || null === (e2 = this.input) || void 0 === e2 || e2.classList.add("timepicker-ui-input");
      }, this._setDataOpenToInputIfDosentExistInWrapper = () => {
        var e2;
        null === this.openElementData && (null === (e2 = this.input) || void 0 === e2 || e2.setAttribute("data-open", "timepicker-ui-input"));
      }, this._setClassTopOpenElement = () => {
        this.openElement.forEach((e2) => null == e2 ? void 0 : e2.classList.add("timepicker-ui-open-element"));
      }, this._removeBackdrop = () => {
        var e2;
        this._options.backdrop || (null === (e2 = this.modalElement) || void 0 === e2 || e2.classList.add("removed"), this.openElement.forEach((e3) => null == e3 ? void 0 : e3.classList.add("disabled")));
      }, this._setNormalizeClass = () => {
        var e2, i2;
        const t2 = null === (e2 = this.modalElement) || void 0 === e2 ? void 0 : e2.querySelectorAll("div");
        null === (i2 = this.modalElement) || void 0 === i2 || i2.classList.add("timepicker-ui-normalize"), null == t2 || t2.forEach((e3) => e3.classList.add("timepicker-ui-normalize"));
      }, this._setFlexEndToFooterIfNoKeyboardIcon = () => {
        !this._options.enableSwitchIcon && this.footer && (this.footer.style.justifyContent = "flex-end");
      }, this._eventsBundle = () => {
        var e2, i2, t2, n2, r2, o3, s3, a2, l2, u2, c2, d2, p3;
        if (this._isModalRemove) {
          if (this._handleEscClick(), this._setErrorHandler(), this._removeErrorHandler(), this.openElement.forEach((e3) => null == e3 ? void 0 : e3.classList.add("disabled")), null === (e2 = this.input) || void 0 === e2 || e2.blur(), this._setScrollbarOrNot(), this._setModalTemplate(), this._setNormalizeClass(), this._removeBackdrop(), this._setBgColorToCirleWithHourTips(), this._setOnStartCSSClassesIfClockType24h(), this._setClassActiveToHourOnOpen(), null !== this.clockFace) {
            const e3 = new y({ array: k, classToAdd: "timepicker-ui-hour-time-12", clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, theme: this._options.theme, disabledTime: (null === (t2 = null === (i2 = this._disabledTime) || void 0 === i2 ? void 0 : i2.value) || void 0 === t2 ? void 0 : t2.isInterval) ? null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value.rangeArrHour : null === (o3 = null === (r2 = this._disabledTime) || void 0 === r2 ? void 0 : r2.value) || void 0 === o3 ? void 0 : o3.hours, clockType: "12h", hour: this.hour.value });
            if (e3.create(), "24h" === this._options.clockType) {
              new y({ array: b, classToAdd: "timepicker-ui-hour-time-24", clockFace: this.tipsWrapperFor24h, tipsWrapper: this.tipsWrapperFor24h, theme: this._options.theme, clockType: "24h", disabledTime: (null === (a2 = null === (s3 = this._disabledTime) || void 0 === s3 ? void 0 : s3.value) || void 0 === a2 ? void 0 : a2.isInterval) ? null === (l2 = this._disabledTime) || void 0 === l2 ? void 0 : l2.value.rangeArrHour : null === (c2 = null === (u2 = this._disabledTime) || void 0 === u2 ? void 0 : u2.value) || void 0 === c2 ? void 0 : c2.hours, hour: this.hour.value }).create();
            } else
              (null === (d2 = this._disabledTime) || void 0 === d2 ? void 0 : d2.value.startType) === (null === (p3 = this._disabledTime) || void 0 === p3 ? void 0 : p3.value.endType) ? setTimeout(() => {
                var i3, t3, n3, r3, o4, s4, a3, l3;
                (null === (i3 = this._disabledTime) || void 0 === i3 ? void 0 : i3.value.startType) === (null === (t3 = this.activeTypeMode) || void 0 === t3 ? void 0 : t3.textContent) && e3.updateDisable({ hoursToUpdate: null === (r3 = null === (n3 = this._disabledTime) || void 0 === n3 ? void 0 : n3.value) || void 0 === r3 ? void 0 : r3.rangeArrHour, minutesToUpdate: { endMinutes: null === (o4 = this._disabledTime) || void 0 === o4 ? void 0 : o4.value.endMinutes, removedEndHour: null === (s4 = this._disabledTime) || void 0 === s4 ? void 0 : s4.value.removedEndHour, removedStartedHour: null === (a3 = this._disabledTime) || void 0 === a3 ? void 0 : a3.value.removedStartedHour, actualHour: this.hour.value, startMinutes: null === (l3 = this._disabledTime) || void 0 === l3 ? void 0 : l3.value.startMinutes } });
              }, 300) : setTimeout(() => {
                var i3, t3, n3;
                e3.updateDisable({ minutesToUpdate: { actualHour: this.hour.value, pmHours: null === (i3 = this._disabledTime) || void 0 === i3 ? void 0 : i3.value.pmHours, amHours: null === (t3 = this._disabledTime) || void 0 === t3 ? void 0 : t3.value.amHours, activeMode: null === (n3 = this.activeTypeMode) || void 0 === n3 ? void 0 : n3.textContent } });
              }, 300), e3.updateDisable();
          }
          this._setFlexEndToFooterIfNoKeyboardIcon(), setTimeout(() => {
            this._setTheme();
          }, 0), this._setAnimationToOpen(), this._getInputValueOnOpenAndSet(), this._toggleClassActiveToValueTips(this.hour.value), this._isMobileView || (this._setTransformToCircleWithSwitchesHour(this.hour.value), this._handleAnimationClock()), this._handleMinutesEvents(), this._handleHourEvents(), "24h" !== this._options.clockType && (this._handleAmClick(), this._handlePmClick()), this.clockFace && this._handleMoveHand(), this._handleCancelButton(), this._handleOkButton(), this.modalElement && (this._setShowClassToBackdrop(), this._handleBackdropClick()), this._handleIconChangeView(), this._handleClickOnHourMobile(), this._options.focusTrap && this._focusTrapHandler();
        }
      }, this._handleOpenOnClick = () => {
        this.openElement.forEach((e2) => this._clickTouchEvents.forEach((i2) => null == e2 ? void 0 : e2.addEventListener(i2, () => this._eventsBundle())));
      }, this._getInputValueOnOpenAndSet = () => {
        var e2, i2;
        const t2 = u(this.input, this._options.clockType, this._options.currentTime);
        if (void 0 === t2)
          return this.hour.value = "12", this.minutes.value = "00", n(this._element, "show", { hour: this.hour.value, minutes: this.minutes.value, type: null === (e2 = this.activeTypeMode) || void 0 === e2 ? void 0 : e2.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes }), void ("24h" !== this._options.clockType && this.AM.classList.add("active"));
        let [r2, o3, s3] = this.input.value.split(":").join(" ").split(" ");
        0 === this.input.value.length && (r2 = t2.hour, o3 = t2.minutes, s3 = t2.type), this.hour.value = r2, this.minutes.value = o3;
        const a2 = document.querySelector(`[data-type='${s3}']`);
        "24h" !== this._options.clockType && a2 && a2.classList.add("active"), n(this._element, "show", Object.assign(Object.assign({}, t2), { type: null === (i2 = this.activeTypeMode) || void 0 === i2 ? void 0 : i2.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes }));
      }, this._handleCancelButton = () => {
        this._clickTouchEvents.forEach((e2) => {
          this.cancelButton.addEventListener(e2, () => {
            var e3;
            const i2 = u(this.input, this._options.clockType);
            n(this._element, "cancel", Object.assign(Object.assign({}, i2), { hourNotAccepted: this.hour.value, minutesNotAccepted: this.minutes.value, type: null === (e3 = this.activeTypeMode) || void 0 === e3 ? void 0 : e3.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes })), this.close()();
          });
        });
      }, this._handleOkButton = () => {
        this._clickTouchEvents.forEach((e2) => {
          var i2;
          null === (i2 = this.okButton) || void 0 === i2 || i2.addEventListener(e2, () => {
            var e3, i3, t2;
            const { clockType: r2, disabledTime: o3 } = this._options, s3 = c(this.hour.value, "hour", r2), a2 = c(this.minutes.value, "minutes", r2);
            let u2;
            const p3 = d(this.hour.value, "hour", r2, null == o3 ? void 0 : o3.hours), m2 = d(this.minutes.value, "minutes", r2, null == o3 ? void 0 : o3.minutes);
            if ((null == o3 ? void 0 : o3.interval) && (u2 = ((e4, i4, t3, n2) => {
              const r3 = t3 ? l(`${e4}:${i4} ${t3}`.trim()) : `${e4}:${i4}`.trim();
              let o4, s4;
              if (t3) {
                const [e5, i5] = n2.trim().split("-").map((e6) => e6.trim());
                o4 = l(e5), s4 = l(i5);
              } else {
                const [e5, i5] = n2.trim().split("-"), t4 = (e6) => e6.trim().split(":").map((e7) => Number(e7) <= 9 ? `0${Number(e7)}` : e7).join(":");
                o4 = t4(e5), s4 = t4(i5);
              }
              return r3 < o4 || r3 > s4;
            })(this.hour.value, this.minutes.value, null === (e3 = this.activeTypeMode) || void 0 === e3 ? void 0 : e3.textContent, o3.interval)), false === u2 || false === s3 || false === a2 || false === p3 || false === m2)
              return false !== u2 && a2 && m2 || this.minutes.classList.add("invalid-value"), void (false !== u2 && s3 && p3 || this.hour.classList.add("invalid-value"));
            this.input.value = `${this.hour.value}:${this.minutes.value} ${"24h" === this._options.clockType ? "" : null === (i3 = this.activeTypeMode) || void 0 === i3 ? void 0 : i3.dataset.type}`.trimEnd(), n(this._element, "accept", { hour: this.hour.value, minutes: this.minutes.value, type: null === (t2 = this.activeTypeMode) || void 0 === t2 ? void 0 : t2.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes }), this.close()();
          });
        });
      }, this._setShowClassToBackdrop = () => {
        this._options.backdrop && setTimeout(() => {
          this.modalElement.classList.add("show");
        }, 300);
      }, this._handleBackdropClick = () => {
        var e2;
        null === (e2 = this.modalElement) || void 0 === e2 || e2.addEventListener("click", (e3) => {
          var i2;
          const r2 = e3.target;
          if (!t(r2, "timepicker-ui-modal"))
            return;
          const o3 = u(this.input, this._options.clockType);
          n(this._element, "cancel", Object.assign(Object.assign({}, o3), { hourNotAccepted: this.hour.value, minutesNotAccepted: this.minutes.value, type: null === (i2 = this.activeTypeMode) || void 0 === i2 ? void 0 : i2.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes })), this.close()();
        });
      }, this._setBgColorToCirleWithHourTips = () => {
        if (!this._options)
          return;
        const { mobile: e2, theme: i2 } = this._options;
        e2 || null === this.circle || (this.circle.style.backgroundColor = "crane-straight" === i2 || "crane-radius" === i2 ? m.cranered400 : m.purple);
      }, this._setBgColorToCircleWithMinutesTips = () => {
        const { theme: e2 } = this._options;
        this.minutes.value && g.includes(this.minutes.value) && (this.circle.style.backgroundColor = "crane-straight" === e2 || "crane-radius" === e2 ? m.cranered400 : m.purple, this.circle.classList.remove("small-circle"));
      }, this._removeBgColorToCirleWithMinutesTips = () => {
        this.minutes.value && g.includes(this.minutes.value) || (this.circle.style.backgroundColor = "", this.circle.classList.add("small-circle"));
      }, this._setTimepickerClassToElement = () => {
        var e2;
        null === (e2 = this._element) || void 0 === e2 || e2.classList.add("timepicker-ui");
      }, this._setClassActiveToHourOnOpen = () => {
        var e2;
        this._options.mobile || this._isMobileView || null === (e2 = this.hour) || void 0 === e2 || e2.classList.add("active");
      }, this._setMinutesToClock = (e2) => {
        var i2, t2, n2, r2, o3;
        null !== this.clockFace && this._setTransformToCircleWithSwitchesMinutes(e2), this._removeBgColorToCirleWithMinutesTips();
        const s3 = (null === (t2 = null === (i2 = this._disabledTime) || void 0 === i2 ? void 0 : i2.value) || void 0 === t2 ? void 0 : t2.minutes) ? null === (r2 = null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value) || void 0 === r2 ? void 0 : r2.minutes : null === (o3 = this._disabledTime) || void 0 === o3 ? void 0 : o3.value, a2 = new y({ array: g, classToAdd: "timepicker-ui-minutes-time", clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, theme: this._options.theme, disabledTime: s3, hour: this.hour.value, clockType: this._options.clockType });
        a2.create(), "12h" === this._options.clockType && a2.updateDisable(), this._toggleClassActiveToValueTips(e2), "24h" === this._options.clockType && (this.tipsWrapperFor24h.innerHTML = "");
      }, this._setHoursToClock = (e2) => {
        var i2, t2, n2, r2, o3;
        if (null !== this.clockFace) {
          this._setTransformToCircleWithSwitchesHour(e2), this._setBgColorToCirleWithHourTips();
          const s3 = (null === (t2 = null === (i2 = this._disabledTime) || void 0 === i2 ? void 0 : i2.value) || void 0 === t2 ? void 0 : t2.isInterval) ? null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value.rangeArrHour : null === (o3 = null === (r2 = this._disabledTime) || void 0 === r2 ? void 0 : r2.value) || void 0 === o3 ? void 0 : o3.hours, a2 = new y({ array: k, classToAdd: "timepicker-ui-hour-time-12", clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, theme: this._options.theme, disabledTime: s3, clockType: "12h", hour: this.hour.value });
          a2.create(), "24h" === this._options.clockType ? new y({ array: b, classToAdd: "timepicker-ui-hour-time-24", clockFace: this.tipsWrapperFor24h, tipsWrapper: this.tipsWrapperFor24h, theme: this._options.theme, clockType: "24h", disabledTime: s3, hour: this.hour.value }).create() : a2.updateDisable(), this._toggleClassActiveToValueTips(e2);
        }
      }, this._setTransformToCircleWithSwitchesHour = (e2) => {
        const i2 = Number(e2);
        let t2 = i2 > 12 ? 30 * i2 - 360 : 30 * i2;
        360 === t2 && (t2 = 0), t2 > 360 || (this.clockHand.style.transform = `rotateZ(${t2}deg)`);
      }, this._setTransformToCircleWithSwitchesMinutes = (e2) => {
        const i2 = 6 * Number(e2);
        i2 > 360 || (this.clockHand.style.transform = `rotateZ(${i2}deg)`);
      }, this._handleAmClick = () => {
        this._clickTouchEvents.forEach((e2) => {
          this.AM.addEventListener(e2, (e3) => {
            var i2, r2, o3, s3;
            if (e3.target.classList.add("active"), this.PM.classList.remove("active"), "12h" === this._options.clockType && (null === (i2 = this._options.disabledTime) || void 0 === i2 ? void 0 : i2.interval)) {
              const e4 = new y({ clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, array: t(this.hour, "active") ? k : g });
              (null === (r2 = this._disabledTime) || void 0 === r2 ? void 0 : r2.value.startType) === (null === (o3 = this._disabledTime) || void 0 === o3 ? void 0 : o3.value.endType) ? setTimeout(() => {
                var i3, t2, n2, r3;
                (null === (i3 = this._disabledTime) || void 0 === i3 ? void 0 : i3.value.startType) === (null === (t2 = this.activeTypeMode) || void 0 === t2 ? void 0 : t2.textContent) ? e4.updateDisable(Object.assign({ hoursToUpdate: null === (r3 = null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value) || void 0 === r3 ? void 0 : r3.rangeArrHour }, this._getDestructuringObj())) : e4.clean();
              }, 300) : setTimeout(() => {
                e4.updateDisable(Object.assign({}, this._getDestructuringObj(true)));
              }, 300), e4.updateDisable();
            }
            n(this._element, "selectamtypemode", { hour: this.hour.value, minutes: this.minutes.value, type: null === (s3 = this.activeTypeMode) || void 0 === s3 ? void 0 : s3.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes });
          });
        });
      }, this._handlePmClick = () => {
        this._clickTouchEvents.forEach((e2) => {
          this.PM.addEventListener(e2, (e3) => {
            var i2, r2, o3, s3;
            if (e3.target.classList.add("active"), this.AM.classList.remove("active"), "12h" === this._options.clockType && (null === (i2 = this._options.disabledTime) || void 0 === i2 ? void 0 : i2.interval)) {
              const e4 = new y({ clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, array: t(this.hour, "active") ? k : g });
              (null === (r2 = this._disabledTime) || void 0 === r2 ? void 0 : r2.value.startType) === (null === (o3 = this._disabledTime) || void 0 === o3 ? void 0 : o3.value.endType) ? setTimeout(() => {
                var i3, t2, n2, r3;
                (null === (i3 = this._disabledTime) || void 0 === i3 ? void 0 : i3.value.startType) === (null === (t2 = this.activeTypeMode) || void 0 === t2 ? void 0 : t2.textContent) ? e4.updateDisable(Object.assign({ hoursToUpdate: null === (r3 = null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value) || void 0 === r3 ? void 0 : r3.rangeArrHour }, this._getDestructuringObj())) : e4.clean();
              }, 300) : setTimeout(() => {
                e4.updateDisable(Object.assign({}, this._getDestructuringObj(true)));
              }, 300);
            }
            n(this._element, "selectpmtypemode", { hour: this.hour.value, minutes: this.minutes.value, type: null === (s3 = this.activeTypeMode) || void 0 === s3 ? void 0 : s3.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes });
          });
        });
      }, this._handleAnimationClock = () => {
        this._options.animation && setTimeout(() => {
          var e2;
          null === (e2 = this.clockFace) || void 0 === e2 || e2.classList.add("timepicker-ui-clock-animation"), setTimeout(() => {
            var e3;
            null === (e3 = this.clockFace) || void 0 === e3 || e3.classList.remove("timepicker-ui-clock-animation");
          }, 600);
        }, 150);
      }, this._handleAnimationSwitchTipsMode = () => {
        this.clockHand.classList.add("timepicker-ui-tips-animation"), setTimeout(() => {
          var e2;
          null === (e2 = this.clockHand) || void 0 === e2 || e2.classList.remove("timepicker-ui-tips-animation");
        }, 401);
      }, this._handleClasses24h = (e2, i2) => {
        var t2;
        const n2 = e2.target;
        this.hourTips && "24h" === this._options.clockType && (Number(n2.textContent) > 12 || 0 === Number(n2.textContent) ? this._setCircleClockClasses24h() : this._removeCircleClockClasses24h(), this._options.mobile || null === (t2 = this.tipsWrapperFor24h) || void 0 === t2 || t2.classList.remove("timepicker-ui-tips-wrapper-24h-disabled")), n2 && i2 && (i2.value = n2.value.replace(/\D+/g, ""), i2.click());
      }, this._handleHourEvents = () => {
        var e2, i2;
        this._inputEvents.forEach((e3) => {
          var i3;
          null === (i3 = this.hour) || void 0 === i3 || i3.addEventListener(e3, (e4) => {
            var i4, r2, o3, s3, a2;
            const l2 = e4.target;
            if (null !== this.clockFace && this._handleAnimationSwitchTipsMode(), "24h" === this._options.clockType && (Number(l2.value) > 12 || 0 === Number(l2.value) ? this._setCircleClockClasses24h() : this._removeCircleClockClasses24h(), this._options.mobile || null === (i4 = this.tipsWrapperFor24h) || void 0 === i4 || i4.classList.remove("timepicker-ui-tips-wrapper-24h-disabled")), this._setHoursToClock(l2.value), l2.classList.add("active"), this.minutes.classList.remove("active"), "12h" === this._options.clockType && (null === (r2 = this._options.disabledTime) || void 0 === r2 ? void 0 : r2.interval)) {
              const e5 = new y({ clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, array: t(this.hour, "active") ? k : g });
              (null === (o3 = this._disabledTime) || void 0 === o3 ? void 0 : o3.value.startType) === (null === (s3 = this._disabledTime) || void 0 === s3 ? void 0 : s3.value.endType) ? setTimeout(() => {
                var i5, t2, n2, r3;
                (null === (i5 = this._disabledTime) || void 0 === i5 ? void 0 : i5.value.startType) === (null === (t2 = this.activeTypeMode) || void 0 === t2 ? void 0 : t2.textContent) ? e5.updateDisable(Object.assign({ hoursToUpdate: null === (r3 = null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value) || void 0 === r3 ? void 0 : r3.rangeArrHour }, this._getDestructuringObj())) : e5.clean();
              }, 300) : setTimeout(() => {
                e5.updateDisable(Object.assign({}, this._getDestructuringObj(true)));
              }, 300);
            }
            n(this._element, "selecthourmode", { hour: this.hour.value, minutes: this.minutes.value, type: null === (a2 = this.activeTypeMode) || void 0 === a2 ? void 0 : a2.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes }), null !== this.clockFace && this.circle.classList.remove("small-circle");
          });
        }), null === (e2 = this.hour) || void 0 === e2 || e2.addEventListener("blur", (e3) => this._handleClasses24h(e3, this.hour)), null === (i2 = this.hour) || void 0 === i2 || i2.addEventListener("focus", (e3) => this._handleClasses24h(e3, this.hour));
      }, this._handleMinutesEvents = () => {
        var e2, i2;
        this._inputEvents.forEach((e3) => {
          this.minutes.addEventListener(e3, (e4) => {
            var i3, r2, o3, s3, a2, l2;
            const u2 = e4.target;
            if (null !== this.clockFace && (this._handleAnimationSwitchTipsMode(), this._setMinutesToClock(u2.value)), "24h" === this._options.clockType && (this._removeCircleClockClasses24h(), this._options.mobile || null === (i3 = this.tipsWrapperFor24h) || void 0 === i3 || i3.classList.add("timepicker-ui-tips-wrapper-24h-disabled")), u2.classList.add("active"), null === (r2 = this.hour) || void 0 === r2 || r2.classList.remove("active"), "12h" === this._options.clockType && (null === (o3 = this._options.disabledTime) || void 0 === o3 ? void 0 : o3.interval)) {
              const e5 = new y({ clockFace: this.clockFace, tipsWrapper: this.tipsWrapper, array: t(this.hour, "active") ? k : g });
              (null === (s3 = this._disabledTime) || void 0 === s3 ? void 0 : s3.value.startType) === (null === (a2 = this._disabledTime) || void 0 === a2 ? void 0 : a2.value.endType) ? setTimeout(() => {
                var i4, t2, n2;
                (null === (i4 = this._disabledTime) || void 0 === i4 ? void 0 : i4.value.startType) === (null === (t2 = this.activeTypeMode) || void 0 === t2 ? void 0 : t2.textContent) ? e5.updateDisable(Object.assign({ hoursToUpdate: null === (n2 = this._disabledTime) || void 0 === n2 ? void 0 : n2.value.rangeArrHour }, this._getDestructuringObj())) : e5.clean();
              }, 300) : setTimeout(() => {
                e5.updateDisable(Object.assign({}, this._getDestructuringObj(true)));
              }, 300);
            }
            n(this._element, "selectminutemode", { hour: this.hour.value, minutes: this.minutes.value, type: null === (l2 = this.activeTypeMode) || void 0 === l2 ? void 0 : l2.dataset.type, degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes });
          });
        }), null === (e2 = this.minutes) || void 0 === e2 || e2.addEventListener("blur", (e3) => this._handleClasses24h(e3, this.minutes)), null === (i2 = this.minutes) || void 0 === i2 || i2.addEventListener("focus", (e3) => this._handleClasses24h(e3, this.minutes));
      }, this._handleEventToMoveHand = (e2) => {
        var o3, s3, a2, l2, c2, d2, p3, m2, h2, v2, b2, k2, g2, y2, _2, T3, f2, x, w, M, C, E, H, L, S, N, $, A, O, I, W, j, F, P, D, q, B, V, z, U, R, Y, Z, K, X, J, G, Q, ee, ie, te, ne, re, oe, se, ae, le, ue, ce, de, pe, me;
        const { target: he, type: ve, touches: be } = e2, ke = he, { incrementMinutes: ge, incrementHours: ye, switchToMinutesAfterSelectHour: _e } = this._options;
        if (!i(e2, this.clockFace))
          return;
        const Te = i(e2, this.clockFace), fe = this.clockFace.offsetWidth / 2, xe = Te && Math.atan2(Te.y - fe, Te.x - fe);
        if ("mouseup" === ve || "touchend" === ve)
          return this._isTouchMouseMove = false, void (_e && (t(ke, "timepicker-ui-value-tips") || t(ke, "timepicker-ui-value-tips-24h") || t(ke, "timepicker-ui-tips-wrapper")) && this.minutes.click());
        if ("mousedown" !== ve && "mousemove" !== ve && "touchmove" !== ve && "touchstart" !== ve || "mousedown" !== ve && "touchstart" !== ve && "touchmove" !== ve || ((t(ke, "timepicker-ui-clock-face") || t(ke, "timepicker-ui-circle-hand") || t(ke, "timepicker-ui-hour-time-12") || t(ke, "timepicker-ui-minutes-time") || t(ke, "timepicker-ui-clock-hand") || t(ke, "timepicker-ui-value-tips") || t(ke, "timepicker-ui-value-tips-24h") || t(ke, "timepicker-ui-tips-wrapper") || t(ke, "timepicker-ui-tips-wrapper-24h")) && !t(ke, "timepicker-ui-tips-disabled") ? (e2.preventDefault(), this._isTouchMouseMove = true) : this._isTouchMouseMove = false), !this._isTouchMouseMove)
          return;
        if (null !== this.minutesTips) {
          this.minutes.classList.add("active");
          let e3, i2 = xe && r(Math.trunc(180 * xe / Math.PI) + 90, ge, 6);
          if (void 0 === i2)
            return;
          if (i2 < 0 ? (e3 = Math.round(360 + i2 / 6) % 60, i2 = 360 + 6 * Math.round(i2 / 6)) : (e3 = Math.round(i2 / 6) % 60, i2 = 6 * Math.round(i2 / 6)), null === (o3 = this._disabledTime) || void 0 === o3 ? void 0 : o3.value.isInterval)
            if ((null === (c2 = this._disabledTime) || void 0 === c2 ? void 0 : c2.value.endType) === (null === (d2 = this._disabledTime) || void 0 === d2 ? void 0 : d2.value.startType)) {
              if ((null === (h2 = null === (m2 = null === (p3 = this._disabledTime) || void 0 === p3 ? void 0 : p3.value) || void 0 === m2 ? void 0 : m2.endMinutes) || void 0 === h2 ? void 0 : h2.includes(e3 <= 9 ? `0${e3}` : `${e3}`)) && this.hour.value === (null === (b2 = null === (v2 = this._disabledTime) || void 0 === v2 ? void 0 : v2.value) || void 0 === b2 ? void 0 : b2.removedEndHour) && (null === (k2 = this._disabledTime) || void 0 === k2 ? void 0 : k2.value.endType) === (null === (g2 = this.activeTypeMode) || void 0 === g2 ? void 0 : g2.textContent))
                return;
              if ((null === (T3 = null === (_2 = null === (y2 = this._disabledTime) || void 0 === y2 ? void 0 : y2.value) || void 0 === _2 ? void 0 : _2.startMinutes) || void 0 === T3 ? void 0 : T3.includes(e3 <= 9 ? `0${e3}` : `${e3}`)) && this.hour.value === (null === (x = null === (f2 = this._disabledTime) || void 0 === f2 ? void 0 : f2.value) || void 0 === x ? void 0 : x.removedStartedHour) && (null === (w = this._disabledTime) || void 0 === w ? void 0 : w.value.startType) === (null === (M = this.activeTypeMode) || void 0 === M ? void 0 : M.textContent))
                return;
            } else {
              if ((null === (C = this.activeTypeMode) || void 0 === C ? void 0 : C.textContent) === (null === (E = this._disabledTime) || void 0 === E ? void 0 : E.value.endType) && ((null === (S = null === (L = null === (H = this._disabledTime) || void 0 === H ? void 0 : H.value) || void 0 === L ? void 0 : L.endMinutes) || void 0 === S ? void 0 : S.includes(e3 <= 9 ? `0${e3}` : `${e3}`)) && (null === (N = this._disabledTime) || void 0 === N ? void 0 : N.value.removedPmHour) === this.hour.value || (null === ($ = this._disabledTime) || void 0 === $ ? void 0 : $.value.pmHours.map(Number).includes(Number(this.hour.value)))))
                return;
              if ((null === (A = this.activeTypeMode) || void 0 === A ? void 0 : A.textContent) === (null === (O = this._disabledTime) || void 0 === O ? void 0 : O.value.startType) && ((null === (j = null === (W = null === (I = this._disabledTime) || void 0 === I ? void 0 : I.value) || void 0 === W ? void 0 : W.startMinutes) || void 0 === j ? void 0 : j.includes(e3 <= 9 ? `0${e3}` : `${e3}`)) && (null === (F = this._disabledTime) || void 0 === F ? void 0 : F.value.removedAmHour) === this.hour.value || (null === (P = this._disabledTime) || void 0 === P ? void 0 : P.value.amHours.map(Number).includes(Number(this.hour.value)))))
                return;
            }
          else if (null === (l2 = null === (a2 = null === (s3 = this._disabledTime) || void 0 === s3 ? void 0 : s3.value) || void 0 === a2 ? void 0 : a2.minutes) || void 0 === l2 ? void 0 : l2.includes(e3 <= 9 ? `0${e3}` : `${e3}`))
            return;
          this.minutes.value = e3 >= 10 ? `${e3}` : `0${e3}`, this.clockHand.style.transform = `rotateZ(${i2}deg)`, this._degreesMinutes = i2, this._toggleClassActiveToValueTips(this.minutes.value), this._removeBgColorToCirleWithMinutesTips(), this._setBgColorToCircleWithMinutesTips(), n(this._element, "update", Object.assign(Object.assign({}, u(this.input, this._options.clockType)), { degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes, eventType: ve, type: null === (D = this.activeTypeMode) || void 0 === D ? void 0 : D.dataset.type }));
        }
        const we = be ? be[0] : void 0, Me = be && we ? document.elementFromPoint(we.clientX, we.clientY) : null;
        if (null !== this.hourTips) {
          if (null === (q = this.hour) || void 0 === q || q.classList.add("active"), !t(Me || ke, "timepicker-ui-value-tips-24h") && !t(Me || ke, "timepicker-ui-tips-disabled") && (t(Me || ke, "timepicker-ui-value-tips") || t(Me || ke, "timepicker-ui-tips-wrapper"))) {
            let e3, i2 = xe && r(Math.trunc(180 * xe / Math.PI) + 90, ye, 30);
            if (this._degreesHours = i2, void 0 === i2)
              return;
            i2 < 0 ? (e3 = Math.round(360 + i2 / 30) % 12, i2 = 360 + i2) : (e3 = Math.round(i2 / 30) % 12, (0 === e3 || e3 > 12) && (e3 = 12));
            const t2 = (null === (B = this._disabledTime) || void 0 === B ? void 0 : B.value.isInterval) ? "rangeArrHour" : "hours";
            if ((null === (V = this._disabledTime) || void 0 === V ? void 0 : V.value.endType) === (null === (U = null === (z = this._disabledTime) || void 0 === z ? void 0 : z.value) || void 0 === U ? void 0 : U.startType)) {
              if ("string" == typeof (null === (Y = null === (R = this._disabledTime) || void 0 === R ? void 0 : R.value) || void 0 === Y ? void 0 : Y.endType)) {
                if ((null === (K = null === (Z = this._disabledTime) || void 0 === Z ? void 0 : Z.value) || void 0 === K ? void 0 : K.endType) === (null === (X = this.activeTypeMode) || void 0 === X ? void 0 : X.textContent) && (null === (G = null === (J = this._disabledTime) || void 0 === J ? void 0 : J.value) || void 0 === G ? void 0 : G.startType) === (null === (Q = this.activeTypeMode) || void 0 === Q ? void 0 : Q.textContent) && (null === (ie = null === (ee = this._disabledTime) || void 0 === ee ? void 0 : ee.value[t2]) || void 0 === ie ? void 0 : ie.includes(e3.toString())))
                  return;
              } else if (null === (ne = null === (te = this._disabledTime) || void 0 === te ? void 0 : te.value[t2]) || void 0 === ne ? void 0 : ne.includes(e3.toString()))
                return;
            } else {
              if ((null === (re = this._disabledTime) || void 0 === re ? void 0 : re.value.startType) === (null === (oe = this.activeTypeMode) || void 0 === oe ? void 0 : oe.textContent) && (null === (se = this._disabledTime) || void 0 === se ? void 0 : se.value.amHours.includes(e3.toString())))
                return;
              if ((null === (ae = this._disabledTime) || void 0 === ae ? void 0 : ae.value.endType) === (null === (le = this.activeTypeMode) || void 0 === le ? void 0 : le.textContent) && (null === (ue = this._disabledTime) || void 0 === ue ? void 0 : ue.value.pmHours.includes(e3.toString())))
                return;
            }
            this.clockHand.style.transform = `rotateZ(${i2}deg)`, this.hour.value = e3 > 9 ? `${e3}` : `0${e3}`, this._removeCircleClockClasses24h(), this._toggleClassActiveToValueTips(e3);
          }
          if ((t(Me || ke, "timepicker-ui-value-tips-24h") || t(Me || ke, "timepicker-ui-tips-wrapper-24h")) && !t(Me || ke, "timepicker-ui-tips-disabled")) {
            let e3, i2 = xe && r(Math.trunc(180 * xe / Math.PI) + 90, ye, 30);
            if (this._degreesHours = i2, void 0 === i2)
              return;
            i2 < 0 ? (e3 = Math.round(360 + i2 / 30) % 24, i2 = 360 + i2) : (e3 = Math.round(i2 / 30) + 12, 12 === e3 && (e3 = "00"));
            const t2 = (null === (ce = this._disabledTime) || void 0 === ce ? void 0 : ce.value.isInterval) ? "rangeArrHour" : "hours";
            if (null === (pe = null === (de = this._disabledTime) || void 0 === de ? void 0 : de.value[t2]) || void 0 === pe ? void 0 : pe.includes(e3.toString()))
              return;
            this._setCircleClockClasses24h(), this.clockHand.style.transform = `rotateZ(${i2}deg)`, this.hour.value = `${e3}`, this._toggleClassActiveToValueTips(e3);
          }
          n(this._element, "update", Object.assign(Object.assign({}, u(this.input, this._options.clockType)), { degreesHours: this._degreesHours, degreesMinutes: this._degreesMinutes, eventType: ve, type: null === (me = this.activeTypeMode) || void 0 === me ? void 0 : me.dataset.type }));
        }
      }, this._toggleClassActiveToValueTips = (e2) => {
        const i2 = this.allValueTips.find((i3) => Number(i3.innerText) === Number(e2));
        this.allValueTips.map((e3) => e3.classList.remove("active")), void 0 !== i2 && i2.classList.add("active");
      }, this._handleMoveHand = () => {
        this._options.mobile || this._isMobileView || v.split(" ").forEach((e2) => {
          "touchstart" === e2 || "touchmove" === e2 || "touchend" === e2 ? document.addEventListener(e2, this._mutliEventsMoveHandler, { passive: false }) : document.addEventListener(e2, this._mutliEventsMoveHandler, false);
        });
      }, this._setModalTemplate = () => {
        if (!this._options)
          return;
        const { appendModalSelector: e2 } = this._options;
        if ("" !== e2 && e2) {
          const i2 = null === document || void 0 === document ? void 0 : document.querySelector(e2);
          null == i2 || i2.insertAdjacentHTML("beforeend", this.modalTemplate);
        } else
          document.body.insertAdjacentHTML("afterend", this.modalTemplate);
      }, this._setScrollbarOrNot = () => {
        this._options.enableScrollbar ? setTimeout(() => {
          document.body.style.overflowY = "", document.body.style.paddingRight = "";
        }, 400) : (document.body.style.paddingRight = `${(() => {
          const e2 = document.createElement("div");
          e2.className = "timepicker-ui-measure", document.body.appendChild(e2);
          const i2 = e2.getBoundingClientRect().width - e2.clientWidth;
          return document.body.removeChild(e2), i2;
        })()}px`, document.body.style.overflowY = "hidden");
      }, this._setAnimationToOpen = () => {
        var e2, i2;
        null === (e2 = this.modalElement) || void 0 === e2 || e2.classList.add("opacity"), this._options.animation ? setTimeout(() => {
          var e3;
          null === (e3 = this.modalElement) || void 0 === e3 || e3.classList.add("show");
        }, 150) : null === (i2 = this.modalElement) || void 0 === i2 || i2.classList.add("show");
      }, this._removeAnimationToClose = () => {
        var e2;
        this.modalElement && (this._options.animation ? setTimeout(() => {
          var e3;
          null === (e3 = this.modalElement) || void 0 === e3 || e3.classList.remove("show");
        }, 150) : null === (e2 = this.modalElement) || void 0 === e2 || e2.classList.remove("show"));
      }, this._handlerViewChange = () => _(() => {
        var e2, i2, n2, r2;
        const { clockType: o3 } = this._options;
        if (t(this.modalElement, "mobile")) {
          const e3 = c(this.hour.value, "hour", o3), t2 = c(this.minutes.value, "minutes", o3);
          if (false === e3 || false === t2)
            return t2 || this.minutes.classList.add("invalid-value"), void (e3 || null === (i2 = this.hour) || void 0 === i2 || i2.classList.add("invalid-value"));
          true === e3 && true === t2 && (t2 && this.minutes.classList.remove("invalid-value"), e3 && (null === (n2 = this.hour) || void 0 === n2 || n2.classList.remove("invalid-value"))), this.close()(), this._isMobileView = false, this._options.mobile = false;
          const s3 = this.hour.value, a2 = this.minutes.value, l2 = null === (r2 = this.activeTypeMode) || void 0 === r2 ? void 0 : r2.dataset.type;
          setTimeout(() => {
            this.destroy(), this.update({ options: { mobile: false } }), setTimeout(() => {
              if (this.open(), this.hour.value = s3, this.minutes.value = a2, "12h" === this._options.clockType) {
                const e4 = "PM" === l2 ? "AM" : "PM";
                this["PM" === l2 ? "PM" : "AM"].classList.add("active"), this[e4].classList.remove("active");
              }
              this._setTransformToCircleWithSwitchesHour(this.hour.value), this._toggleClassActiveToValueTips(this.hour.value), Number(this.hour.value) > 12 || 0 === Number(this.hour.value) ? this._setCircleClockClasses24h() : this._removeCircleClockClasses24h();
            }, 300);
          }, 300);
        } else {
          this.close()(), this._isMobileView = true, this._options.mobile = true;
          const i3 = this.hour.value, t2 = this.minutes.value, n3 = null === (e2 = this.activeTypeMode) || void 0 === e2 ? void 0 : e2.dataset.type;
          setTimeout(() => {
            this.destroy(), this.update({ options: { mobile: true } }), setTimeout(() => {
              if (this.open(), this.hour.value = i3, this.minutes.value = t2, "12h" === this._options.clockType) {
                const e3 = "PM" === n3 ? "AM" : "PM";
                this["PM" === n3 ? "PM" : "AM"].classList.add("active"), this[e3].classList.remove("active");
              }
            }, 300);
          }, 300);
        }
      }, this._options.delayHandler || 300), this._handleIconChangeView = () => e(this, void 0, void 0, function* () {
        this._options.enableSwitchIcon && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? this.keyboardClockIcon.addEventListener("touchstart", this._handlerViewChange()) : this.keyboardClockIcon.addEventListener("click", this._handlerViewChange()));
      }), this._handlerClickHourMinutes = (i2) => e(this, void 0, void 0, function* () {
        var e2, n2;
        if (!this.modalElement)
          return;
        const { clockType: r2, editable: o3 } = this._options, s3 = i2.target, a2 = c(this.hour.value, "hour", r2), l2 = c(this.minutes.value, "minutes", r2);
        o3 && (t(s3, "timepicker-ui-hour") || t(s3, "timepicker-ui-minutes") ? false !== a2 && false !== l2 || (l2 || this.minutes.classList.add("invalid-value"), a2 || null === (n2 = this.hour) || void 0 === n2 || n2.classList.add("invalid-value")) : true === a2 && true === l2 && (l2 && this.minutes.classList.remove("invalid-value"), a2 && (null === (e2 = this.hour) || void 0 === e2 || e2.classList.remove("invalid-value"))));
      }), this._handleClickOnHourMobile = () => {
        document.addEventListener("mousedown", this._eventsClickMobileHandler), document.addEventListener("touchstart", this._eventsClickMobileHandler);
      }, this._handleKeyPress = (e2) => {
        "Escape" === e2.key && this.modalElement && this.close()();
      }, this._handleEscClick = () => {
        document.addEventListener("keydown", this._handleKeyPress);
      }, this._focusTrapHandler = () => {
        setTimeout(() => {
          var e2, i2;
          const n2 = null === (e2 = this.wrapper) || void 0 === e2 ? void 0 : e2.querySelectorAll('div[tabindex="0"]:not([disabled])'), r2 = null === (i2 = this.wrapper) || void 0 === i2 ? void 0 : i2.querySelectorAll('input[tabindex="0"]:not([disabled])');
          if (!n2 || n2.length <= 0 || r2.length <= 0)
            return;
          const o3 = [...r2, ...n2], s3 = o3[0], a2 = o3[o3.length - 1];
          this.wrapper.focus(), this.wrapper.addEventListener("keydown", ({ key: e3, shiftKey: i3, target: n3 }) => {
            const r3 = n3;
            if ("Tab" === e3 && (i3 ? document.activeElement === s3 && a2.focus() : document.activeElement === a2 && s3.focus()), "Enter" === e3 && (t(r3, "timepicker-ui-minutes") && this.minutes.click(), t(r3, "timepicker-ui-hour") && this.hour.click(), t(r3, "timepicker-ui-cancel-btn") && this.cancelButton.click(), t(r3, "timepicker-ui-ok-btn") && this.okButton.click(), t(r3, "timepicker-ui-keyboard-icon-wrapper") && this.keyboardClockIcon.click(), t(r3, "timepicker-ui-am") && this.AM.click(), t(r3, "timepicker-ui-pm") && this.PM.click(), t(r3, "timepicker-ui-value-tips") || t(r3, "timepicker-ui-value-tips-24h"))) {
              const { left: e4, top: i4, x: n4, y: o4, width: s4, height: a3 } = r3.getBoundingClientRect(), l2 = document.elementFromPoint(n4, o4), u2 = () => {
                var n5;
                const r4 = new MouseEvent("mousedown", { clientX: e4 + s4 / 2, clientY: i4 + a3 / 2, cancelable: true, bubbles: true });
                t(l2, "timepicker-ui-value-tips-24h") ? null == l2 || l2.dispatchEvent(r4) : null === (n5 = null == l2 ? void 0 : l2.childNodes[0]) || void 0 === n5 || n5.dispatchEvent(r4), this._isTouchMouseMove = false;
              };
              u2();
            }
            setTimeout(() => {
              this.wrapper.addEventListener("mousedown", () => document.activeElement.blur());
            }, 100);
          });
        }, 301);
      }, this._handleOpenOnEnterFocus = () => {
        this.input.addEventListener("keydown", ({ target: e2, key: i2 }) => {
          e2.disabled || "Enter" === i2 && this.open();
        });
      }, this._element = o2, this._cloned = null, this._options = ((e2, i2) => Object.assign(Object.assign({}, i2), e2))(Object.assign(Object.assign({}, s2), ((e2) => {
        if (!e2)
          return;
        const i2 = JSON.parse(JSON.stringify(e2)), t2 = Object.keys(i2);
        return Object.values(i2).reduce((e3, i3, n2) => (Number(i3) ? e3[t2[n2]] = Number(i3) : e3[t2[n2]] = "true" === i3 || "false" === i3 ? JSON.parse(i3) : i3, e3), {});
      })(null === (p2 = this._element) || void 0 === p2 ? void 0 : p2.dataset)), h), this._isTouchMouseMove = false, this._degreesHours = 30 * Number(u(null === (T2 = this._element) || void 0 === T2 ? void 0 : T2.querySelector("input"), this._options.clockType).hour), this._degreesMinutes = 6 * Number(u(null === (f = this._element) || void 0 === f ? void 0 : f.querySelector("input"), this._options.clockType).minutes), this._isMobileView = false, this._mutliEventsMove = (e2) => this._handleEventToMoveHand(e2), this._mutliEventsMoveHandler = this._mutliEventsMove.bind(this), this._eventsClickMobile = (e2) => this._handlerClickHourMinutes(e2), this._eventsClickMobileHandler = this._eventsClickMobile.bind(this), this._checkMobileOption(), this._clickTouchEvents = ["click", "mousedown", "touchstart"], this._inputEvents = ["change", ...this._clickTouchEvents], this._disabledTime = null, this._preventClockTypeByCurrentTime(), this._isModalRemove = true;
    }
    get modalTemplate() {
      return this._options.mobile && this._isMobileView ? ((e2) => {
        const { mobileTimeLabel: i2, amLabel: t2, pmLabel: n2, cancelLabel: r2, okLabel: o2, iconTemplateMobile: s2, minuteMobileLabel: a2, hourMobileLabel: l2, enableSwitchIcon: u2, animation: c2, clockType: d2 } = e2;
        return `
  <div class="timepicker-ui-modal normalize mobile" role="dialog" style='transition:${c2 ? "opacity 0.15s linear" : "none"}'>
    <div class="timepicker-ui-wrapper mobile" tabindex="0">
      <div class="timepicker-ui-header mobile">
        <div class="timepicker-ui-select-time mobile">${i2}</div>
        <div class="timepicker-ui-wrapper-time mobile">
          <input class="timepicker-ui-hour mobile" tabindex="0" type="number" min="0" max="${"12h" === d2 ? "12" : "23"}" />
          <div class="timepicker-ui-hour-text mobile">${l2}</div>
          <div class="timepicker-ui-dots mobile">:</div>  
          <div class="timepicker-ui-minute-text mobile">${a2}</div>
          <input class="timepicker-ui-minutes mobile" tabindex="0" type="number" min="0" max="59" /> 
        </div>
  ${"24h" !== d2 ? `<div class="timepicker-ui-wrapper-type-time mobile">
          <div class="timepicker-ui-type-mode timepicker-ui-am mobile" data-type="AM" tabindex="0">${t2}</div>    
          <div class="timepicker-ui-type-mode timepicker-ui-pm mobile" data-type="PM" tabindex="0">${n2}</div>    
        </div>` : ""}
      </div>
      <div class="timepicker-ui-footer mobile" data-view="mobile">
      ${u2 ? `
      <div class="timepicker-ui-keyboard-icon-wrapper mobile" role="button" aria-pressed="false" data-view="desktop" tabindex="0">
      ${s2}
      </div>` : ""}
      <div class="timepicker-ui-wrapper-btn mobile">
        <div class="timepicker-ui-cancel-btn mobile" role="button" aria-pressed="false" tabindex="0">${r2}</div>
        <div class="timepicker-ui-ok-btn mobile" role="button" aria-pressed="false" tabindex="0">${o2}</div>
      </div>
      </div>
    </div>  
  </div>`;
      })(this._options) : ((e2) => {
        const { iconTemplate: i2, timeLabel: t2, amLabel: n2, pmLabel: r2, cancelLabel: o2, okLabel: s2, enableSwitchIcon: a2, animation: l2, clockType: u2, editable: c2 } = e2;
        return `
  <div class="timepicker-ui-modal normalize" role="dialog" style='transition:${l2 ? "opacity 0.15s linear" : "none"}'>
    <div class="timepicker-ui-wrapper" tabindex="0">
      <div class="timepicker-ui-header">
        <div class="timepicker-ui-select-time">${t2}</div>
        <div class="timepicker-ui-wrapper-time ${"24h" === u2 ? "timepicker-ui-wrapper-time-24h" : ""}">
          <input ${c2 ? "" : "readonly"} class="timepicker-ui-hour" tabindex="0" type="number" min="0" max="${"12h" === u2 ? "12" : "23"}" />
          <div class="timepicker-ui-dots">:</div>    
          <input ${c2 ? "" : "readonly"} class="timepicker-ui-minutes" tabindex="0" type="number" min="0" max="59" /> 
        </div>
      ${"24h" !== u2 ? `
      <div class="timepicker-ui-wrapper-type-time">
        <div class="timepicker-ui-type-mode timepicker-ui-am" tabindex="0" role="button" data-type="AM">${n2}</div>    
        <div class="timepicker-ui-type-mode timepicker-ui-pm" tabindex="0" role="button" data-type="PM">${r2}</div>    
      </div>
      ` : ""}
      </div>
      <div class="timepicker-ui-wrapper-landspace">
        <div class="timepicker-ui-body">
          <div class="timepicker-ui-clock-face">
            <div class="timepicker-ui-dot"></div>
            <div class="timepicker-ui-clock-hand">
              <div class="timepicker-ui-circle-hand"></div>
            </div>
            <div class="timepicker-ui-tips-wrapper"></div>
            ${"24h" === u2 ? '<div class="timepicker-ui-tips-wrapper-24h"></div>' : ""}
          </div>
        </div>
        <div class="timepicker-ui-footer">
        ${a2 ? `
      <div class="timepicker-ui-keyboard-icon-wrapper" tabindex="0" role="button" aria-pressed="false" data-view="desktop">
        ${i2}
      </div>` : ""}
        <div class="timepicker-ui-wrapper-btn" >
          <div class="timepicker-ui-cancel-btn" tabindex="0" role="button" aria-pressed="false">${o2}</div>
          <div class="timepicker-ui-ok-btn" tabindex="0" role="button" aria-pressed="false">${s2}</div>
        </div>
        </div>
      </div>
    </div>  
  </div>`;
      })(this._options);
    }
    get modalElement() {
      return document.querySelector(".timepicker-ui-modal");
    }
    get clockFace() {
      return document.querySelector(".timepicker-ui-clock-face");
    }
    get input() {
      var e2;
      return null === (e2 = this._element) || void 0 === e2 ? void 0 : e2.querySelector("input");
    }
    get clockHand() {
      return document.querySelector(".timepicker-ui-clock-hand");
    }
    get circle() {
      return document.querySelector(".timepicker-ui-circle-hand");
    }
    get tipsWrapper() {
      return document.querySelector(".timepicker-ui-tips-wrapper");
    }
    get tipsWrapperFor24h() {
      return document.querySelector(".timepicker-ui-tips-wrapper-24h");
    }
    get minutes() {
      return document.querySelector(".timepicker-ui-minutes");
    }
    get hour() {
      return document.querySelector(".timepicker-ui-hour");
    }
    get AM() {
      return document.querySelector(".timepicker-ui-am");
    }
    get PM() {
      return document.querySelector(".timepicker-ui-pm");
    }
    get minutesTips() {
      return document.querySelector(".timepicker-ui-minutes-time");
    }
    get hourTips() {
      return document.querySelector(".timepicker-ui-hour-time-12");
    }
    get allValueTips() {
      return [...document.querySelectorAll(".timepicker-ui-value-tips"), ...document.querySelectorAll(".timepicker-ui-value-tips-24h")];
    }
    get openElementData() {
      var e2;
      const i2 = null === (e2 = this._element) || void 0 === e2 ? void 0 : e2.querySelectorAll("[data-open]");
      if ((null == i2 ? void 0 : i2.length) > 0) {
        const e3 = [];
        return i2.forEach(({ dataset: i3 }) => {
          var t2;
          return e3.push(null !== (t2 = i3.open) && void 0 !== t2 ? t2 : "");
        }), [...new Set(e3)];
      }
      return null;
    }
    get openElement() {
      var e2, i2;
      return null === this.openElementData ? (null === (e2 = this.input) || void 0 === e2 || e2.setAttribute("data-open", "timepicker-ui-input"), [this.input]) : null !== (i2 = this.openElementData.map((e3) => {
        var i3;
        return null === (i3 = this._element) || void 0 === i3 ? void 0 : i3.querySelectorAll(`[data-open='${e3}']`);
      })[0]) && void 0 !== i2 ? i2 : "";
    }
    get cancelButton() {
      return document.querySelector(".timepicker-ui-cancel-btn");
    }
    get okButton() {
      return document.querySelector(".timepicker-ui-ok-btn");
    }
    get activeTypeMode() {
      return document.querySelector(".timepicker-ui-type-mode.active");
    }
    get keyboardClockIcon() {
      return document.querySelector(".timepicker-ui-keyboard-icon-wrapper");
    }
    get footer() {
      return document.querySelector(".timepicker-ui-footer");
    }
    get wrapper() {
      return document.querySelector(".timepicker-ui-wrapper");
    }
    _checkDisabledValuesOnStart() {
      if (!this._options.disabledTime || this._options.disabledTime.interval)
        return;
      const { disabledTime: { hours: e2, minutes: i2 }, clockType: t2 } = this._options, n2 = !e2 || d(e2, "hour", t2), r2 = !i2 || d(i2, "minutes", t2);
      if (!n2 || !r2)
        throw new Error("You set wrong hours or minutes in disabled option");
    }
    _checkMobileOption() {
      this._isMobileView = !!this._options.mobile, this._options.mobile && (this._options.editable = true);
    }
    _getDisableTime() {
      this._disabledTime = ((e2) => {
        if (!e2)
          return;
        const { disabledTime: i2, clockType: t2 } = e2;
        if (!i2 || Object.keys(i2).length <= 0 || "Object" !== i2.constructor.name)
          return;
        const { hours: n2, interval: r2, minutes: a2 } = i2;
        if (r2) {
          delete i2.hours, delete i2.minutes;
          const [e3, n3] = r2.toString().split("-"), { hour: a3, minutes: l2, type: c2 } = u({ value: e3.trimEnd() }, t2), { hour: d2, minutes: p2, type: m2 } = u({ value: n3.trimEnd().trimStart() }, t2);
          let h2 = o(a3, d2).map((e4) => "00" === e4 || 0 === Number(e4) ? `0${Number(e4)}` : `${Number(e4)}`);
          const v2 = [], b2 = Number(l2), k2 = Number(p2);
          if (m2 === c2)
            return b2 > 0 && k2 <= 0 ? (v2.push(h2[0], h2[h2.length - 1]), h2 = h2.slice(1, -1)) : k2 < 59 && k2 > 0 && b2 <= 0 ? (v2.push(void 0, h2[h2.length - 1]), h2 = h2.slice(0, -1)) : k2 > 0 && b2 > 0 ? (v2.push(h2[0], h2[h2.length - 1]), h2 = h2.slice(1, -1)) : 0 === k2 && 0 === b2 && (v2.push(void 0, h2[h2.length - 1]), h2.pop()), { value: { removedStartedHour: Number(v2[0]) <= 9 ? `0${v2[0]}` : v2[0], removedEndHour: Number(v2[1]) <= 9 ? `0${v2[1]}` : v2[1], rangeArrHour: h2, isInterval: true, startMinutes: o(l2, 59).map((e4) => Number(e4) <= 9 ? `0${e4}` : `${e4}`), endMinutes: s(0, p2).map((e4) => Number(e4) <= 9 ? `0${e4}` : `${e4}`), endType: m2, startType: c2 } };
          {
            const e4 = o(a3, 12).map(String), i3 = s(1, d2).map(String), t3 = [], n4 = [];
            return b2 > 0 && k2 <= 0 ? (t3.push(i3[i3.length - 1]), n4.push(e4[0]), i3.splice(-1, 1), e4.splice(0, 1)) : k2 < 59 && k2 > 0 && b2 <= 0 ? (n4.push(e4[0]), t3.push(i3[i3.length - 1]), i3.splice(-1, 1)) : k2 > 0 && b2 > 0 ? (t3.push(i3[i3.length - 1]), n4.push(e4[0]), i3.splice(-1, 1), e4.splice(0, 1)) : 0 === k2 && 0 === b2 && (t3.push(i3[i3.length - 1]), n4.push(e4[0]), i3.pop()), { value: { isInterval: true, endType: m2, startType: c2, pmHours: i3, amHours: e4, startMinutes: 0 === Number(l2) ? [] : o(l2, 59).map((e5) => Number(e5) <= 9 ? `0${e5}` : `${e5}`), endMinutes: s(0, p2).map((e5) => Number(e5) <= 9 ? `0${e5}` : `${e5}`), removedAmHour: Number(n4[0]) <= 9 ? `0${n4[0]}` : n4[0], removedPmHour: Number(t3[0]) <= 9 ? `0${t3[0]}` : t3[0] } };
          }
        }
        return null == n2 || n2.forEach((e3) => {
          if ("12h" === t2 && Number(e3) > 12)
            throw new Error("The disabled hours value has to be less than 13");
          if ("24h" === t2 && Number(e3) > 23)
            throw new Error("The disabled hours value has to be less than 24");
        }), null == a2 || a2.forEach((e3) => {
          if (Number(e3) > 59)
            throw new Error("The disabled minutes value has to be less than 60");
        }), { value: { hours: null == n2 ? void 0 : n2.map((e3) => "00" === e3 || 0 === Number(e3) ? `0${Number(e3)}` : `${Number(e3)}`), minutes: null == a2 ? void 0 : a2.map((e3) => Number(e3) <= 9 ? `0${e3}` : `${e3}`) } };
      })(this._options);
    }
    _removeCircleClockClasses24h() {
      var e2, i2;
      null === (e2 = this.circle) || void 0 === e2 || e2.classList.remove("timepicker-ui-circle-hand-24h"), null === (i2 = this.clockHand) || void 0 === i2 || i2.classList.remove("timepicker-ui-clock-hand-24h");
    }
    _setCircleClockClasses24h() {
      var e2, i2;
      this.circle && (null === (e2 = this.circle) || void 0 === e2 || e2.classList.add("timepicker-ui-circle-hand-24h")), this.clockHand && (null === (i2 = this.clockHand) || void 0 === i2 || i2.classList.add("timepicker-ui-clock-hand-24h"));
    }
    _setErrorHandler() {
      var e2, i2, t2, r2;
      const { error: o2, currentHour: s2, currentMin: a2, currentType: l2, currentLength: c2 } = u(this.input, this._options.clockType);
      if (o2) {
        const u2 = document.createElement("div");
        throw null === (e2 = this.input) || void 0 === e2 || e2.classList.add("timepicker-ui-invalid-format"), u2.classList.add("timepicker-ui-invalid-text"), u2.innerHTML = "<b>Invalid Time Format</b>", (null === (i2 = this.input) || void 0 === i2 ? void 0 : i2.parentElement) && null === (null === (t2 = this.input) || void 0 === t2 ? void 0 : t2.parentElement.querySelector(".timepicker-ui-invalid-text")) && (null === (r2 = this.input) || void 0 === r2 || r2.after(u2)), n(this._element, "geterror", { error: o2, currentHour: s2, currentMin: a2, currentType: l2, currentLength: c2 }), new Error(`Invalid Time Format: ${o2}`);
      }
    }
    _removeErrorHandler() {
      var e2, i2;
      null === (e2 = this.input) || void 0 === e2 || e2.classList.remove("timepicker-ui-invalid-format");
      const t2 = null === (i2 = this._element) || void 0 === i2 ? void 0 : i2.querySelector(".timepicker-ui-invalid-text");
      t2 && t2.remove();
    }
    _setOnStartCSSClassesIfClockType24h() {
      if ("24h" === this._options.clockType) {
        let { hour: e2 } = u(this.input, this._options.clockType, this._options.currentTime);
        this.input.value.length > 0 && (e2 = this.input.value.split(":")[0]), (Number(e2) > 12 || 0 === Number(e2)) && this._setCircleClockClasses24h();
      }
    }
    _getDestructuringObj(e2) {
      var i2;
      const { endMinutes: t2, removedEndHour: n2, removedStartedHour: r2, startMinutes: o2, pmHours: s2, amHours: a2, removedAmHour: l2, removedPmHour: u2 } = this._disabledTime.value;
      return e2 ? { minutesToUpdate: { actualHour: this.hour.value, pmHours: s2, amHours: a2, activeMode: null === (i2 = this.activeTypeMode) || void 0 === i2 ? void 0 : i2.textContent, startMinutes: o2, endMinutes: t2, removedAmHour: l2, removedPmHour: u2 } } : { minutesToUpdate: { endMinutes: t2, removedEndHour: n2, removedStartedHour: r2, actualHour: this.hour.value, startMinutes: o2 } };
    }
  };

  // app/javascript/controllers/index.js
  application.register("hello", hello_controller_default);
  window.TimepickerUI = T;

  // app/javascript/libs/index.js
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  window.addEventListener("resize", () => {
    let vh2 = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh2}px`);
  });
  function tagSelect() {
    return {
      open: false,
      textInput: "",
      tags: [],
      tagIds: [],
      removeTags: [],
      init() {
        this.tags = JSON.parse(this.$el.parentNode.getAttribute("data-tags"));
        this.tagIds = JSON.parse(this.$el.parentNode.getAttribute("data-tagIds"));
      },
      addTag(tag) {
        tag = tag.trim();
        if (tag != "" && !this.hasTag(tag)) {
          this.tags.push(tag);
        }
        this.clearSearch();
        this.$refs.textInput.focus();
        this.fireTagsUpdateEvent();
      },
      toggleTag(tag) {
        tag = tag.trim();
        if (this.hasTag(tag)) {
          index = this.tags.indexOf(tag);
          this.removeTag(index);
        } else {
          this.tags.push(tag);
        }
        this.fireTagsUpdateEvent();
      },
      fireTagsUpdateEvent() {
        this.$el.dispatchEvent(
          new CustomEvent("tags-update", {
            detail: { tags: this.tags, removeTags: this.removeTags },
            bubbles: true
          })
        );
      },
      hasTag(tag) {
        var tag = this.tags.find((e2) => {
          return e2.toLowerCase() === tag.toLowerCase();
        });
        return tag != void 0;
      },
      removeTag(index2) {
        if (this.tagIds[index2] !== void 0) {
          this.removeTags.push(this.tagIds[index2]);
          this.tagIds.splice(index2, 1);
        }
        this.tags.splice(index2, 1);
        this.fireTagsUpdateEvent();
      },
      search(q) {
        if (q.includes(",")) {
          q.split(",").forEach(function(val) {
            this.addTag(val);
          }, this);
        }
        this.toggleSearch();
      },
      clearSearch() {
        this.textInput = "";
        this.toggleSearch();
      },
      toggleSearch() {
        this.open = this.textInput != "";
      },
      focusTag() {
        this.clearSearch();
        this.$refs.textInput.focus();
      }
    };
  }
  window.tagSelect = tagSelect;

  // node_modules/alpine-turbo-drive-adapter/dist/alpine-turbo-drive-adapter.esm.js
  function isValidVersion(required, current) {
    var requiredArray = required.split(".");
    var currentArray = current.split(".");
    for (var i2 = 0; i2 < requiredArray.length; i2++) {
      if (!currentArray[i2] || currentArray[i2] < requiredArray[i2]) {
        return false;
      }
    }
    return true;
  }
  function beforeDomReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "interactive") {
          callback();
        }
      });
    } else {
      callback();
    }
  }
  var Bridge = class {
    init() {
      document.body.querySelectorAll("[x-cloak]").forEach((el) => {
        var _el$getAttribute;
        el.setAttribute("data-alpine-was-cloaked", (_el$getAttribute = el.getAttribute("x-cloak")) !== null && _el$getAttribute !== void 0 ? _el$getAttribute : "");
      });
      this.configureEventHandlers();
    }
    setMutationObserverState(state) {
      if (!window.Alpine.version || !isValidVersion("2.4.0", window.Alpine.version)) {
        throw new Error("Invalid Alpine version. Please use Alpine 2.4.0 or above");
      }
      window.Alpine.pauseMutationObserver = !state;
    }
    configureEventHandlers() {
      var renderCallback = () => {
        if (document.documentElement.hasAttribute("data-turbo-preview")) {
          return;
        }
        window.Alpine.discoverUninitializedComponents((el) => {
          window.Alpine.initializeComponent(el);
        });
        requestAnimationFrame(() => {
          this.setMutationObserverState(true);
        });
      };
      var beforeRenderCallback = (event) => {
        var newBody = event.data ? event.data.newBody : event.detail.newBody;
        newBody.querySelectorAll("[data-alpine-generated-me],[x-cloak]").forEach((el) => {
          if (el.hasAttribute("x-cloak")) {
            var _el$getAttribute2;
            el.setAttribute("data-alpine-was-cloaked", (_el$getAttribute2 = el.getAttribute("x-cloak")) !== null && _el$getAttribute2 !== void 0 ? _el$getAttribute2 : "");
          }
          if (el.hasAttribute("data-alpine-generated-me")) {
            el.removeAttribute("data-alpine-generated-me");
            if (typeof el.__x_for_key === "undefined" && typeof el.__x_inserted_me === "undefined") {
              el.remove();
            }
          }
        });
      };
      var beforeCacheCallback = () => {
        this.setMutationObserverState(false);
        document.body.querySelectorAll("[x-for],[x-if],[data-alpine-was-cloaked]").forEach((el) => {
          if (el.hasAttribute("data-alpine-was-cloaked")) {
            var _el$getAttribute3;
            el.setAttribute("x-cloak", (_el$getAttribute3 = el.getAttribute("data-alpine-was-cloaked")) !== null && _el$getAttribute3 !== void 0 ? _el$getAttribute3 : "");
            el.removeAttribute("data-alpine-was-cloaked");
          }
          if (el.hasAttribute("x-for")) {
            var nextEl = el.nextElementSibling;
            while (nextEl && typeof nextEl.__x_for_key !== "undefined") {
              var currEl = nextEl;
              nextEl = nextEl.nextElementSibling;
              currEl.setAttribute("data-alpine-generated-me", true);
            }
          } else if (el.hasAttribute("x-if")) {
            var ifEl = el.nextElementSibling;
            if (ifEl && typeof ifEl.__x_inserted_me !== "undefined") {
              ifEl.setAttribute("data-alpine-generated-me", true);
            }
          }
        });
      };
      var beforeStreamFormRenderCallback = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            renderCallback();
          });
        });
      };
      document.addEventListener("turbo:render", renderCallback);
      document.addEventListener("turbolinks:load", renderCallback);
      document.addEventListener("turbo:before-render", beforeRenderCallback);
      document.addEventListener("turbolinks:before-render", beforeRenderCallback);
      document.addEventListener("turbo:before-cache", beforeCacheCallback);
      document.addEventListener("turbolinks:before-cache", beforeCacheCallback);
      document.addEventListener("turbo:before-stream-render", beforeStreamFormRenderCallback);
    }
  };
  if (window.Alpine) {
    console.error("Alpine-turbo-drive-adapter must be included before AlpineJs");
  }
  if (!Object.getOwnPropertyDescriptor(NodeList.prototype, "forEach")) {
    Object.defineProperty(NodeList.prototype, "forEach", Object.getOwnPropertyDescriptor(Array.prototype, "forEach"));
  }
  beforeDomReady(() => {
    var bridge = new Bridge();
    bridge.init();
  });

  // app/javascript/application.js
  var import_alpinejs = __toESM(require_alpine());
})();
//# sourceMappingURL=assets/application.js.map
