package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"

	"github.com/fredhw/info344-in-class/zipsvr/handlers"
	"github.com/fredhw/info344-in-class/zipsvr/models"
)

const zipsPath = "/zips/"

func helloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	w.Header().Add("Content-Type", "text/plain")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "Hello %s!", name)
	// w.Write([]byte("Hello, World!"))
}
func memoryHandler(w http.ResponseWriter, r *http.Request) {
	runtime.GC()                 // runs garbage collector
	stats := &runtime.MemStats{} // an instance of the MemStats structure
	// a structure is a block of data with multiple fields
	// efficient for RAM
	// ampersand means a pointer to the heap
	runtime.ReadMemStats(stats)
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(stats) // takes struct and encode into JSON
}
func main() {
	addr := os.Getenv("ADDR")
	zips, err := models.LoadZips("zips.csv")
	if err != nil {
		log.Fatalf("error loading zips: %v", err)
		// don't use for HTTP handlers
	}
	log.Printf("loaded %d zips", len(zips))

	// return Seattle zips
	cityIndex := models.ZipIndex{}
	for _, z := range zips {
		cityLower := strings.ToLower(z.City)
		cityIndex[cityLower] = append(cityIndex[cityLower], z)
	}

	// fmt.Println("Hello World!")
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", helloHandler)
	mux.HandleFunc("/memory", memoryHandler)

	cityHandler := &handlers.CityHandler{
		Index:      cityIndex,
		PathPrefix: zipsPath,
	}
	mux.Handle("/zips/", cityHandler)

	fmt.Printf("server is listening at http://%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
