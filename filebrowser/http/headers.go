//go:build !dev
// +build !dev

package http

// global headers to append to every response
var globalHeaders = map[string]string{
	"Cache-Control": "public, max-age=315360000",
}
