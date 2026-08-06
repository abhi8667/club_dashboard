import os
import sys

PORT = 8080

def main():
    try:
        from livereload import Server
        server = Server()
        server.watch("index.html")
        server.watch("css/*")
        server.watch("js/*")
        server.watch("clubs/*")
        server.watch("assets/*")
        print(f"🚀 Live Reload server running at http://localhost:{PORT}")
        server.serve(port=PORT, host="127.0.0.1")
    except ImportError:
        print(f"⚠️  livereload package not found.")
        print(f"💡 Tip: Run 'pip install -r requirements.txt' for live reload support.\n")
        print(f"🚀 Standard server running at http://localhost:{PORT}")
        import http.server
        import socketserver
        Handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped.")

if __name__ == "__main__":
    main()
