package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/websocket"
)

func sum(x int, y int) int {
	return x + y
}

func FakeTest(t *testing.T) {
	total := sum(6, 6)
	if total != 12 {
		t.Errorf("Wrong fucking sum")
	}
}

func TestWs(t *testing.T) {
	s := httptest.NewServer(http.HandlerFunc(handleConnections))
	defer s.Close()

	u := "ws" + strings.TrimPrefix(s.URL, "http")

	ws, _, err := websocket.DefaultDialer.Dial(u, nil)
	if err != nil {
		t.Fatalf("%v", err)
	}
	defer ws.Close()

	for i := 0; i < 10; i++ {
		if err := ws.WriteMessage(websocket.TextMessage, []byte("Hello")); err != nil {
			t.Fatalf("%v", err)
		}
		_, p, err := ws.ReadMessage()
		if err != nil {
			t.Fatalf("%v", err)
		}
		if string(p) != "Hello" {
			t.Fatalf("Bad message")
		}
	}
}
