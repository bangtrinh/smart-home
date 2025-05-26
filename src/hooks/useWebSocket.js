import { useEffect, useState, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (token) => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("❌ WebSocket disconnected");
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [token]);

  const subscribeToTopic = useCallback((topic, callback) => {
    if (clientRef.current && connected) {
      const sub = clientRef.current.subscribe(topic, (message) => {
        const payload = JSON.parse(message.body);
        callback(payload);
      });
      return sub.id;
    }
    return null;
  }, [connected]);

  const unsubscribeFromTopic = useCallback((subscriptionId) => {
    if (clientRef.current && subscriptionId) {
      clientRef.current.unsubscribe(subscriptionId);
    }
  }, []);

  return { connected, subscribeToTopic, unsubscribeFromTopic };
};
