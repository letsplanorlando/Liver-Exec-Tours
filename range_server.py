import http.server
import os
import re
import json

SAFE_ENTITIES = {
    '&mdash;': '—', '&ndash;': '–',
    '&rsquo;': '’', '&lsquo;': '‘',
    '&rdquo;': '”', '&ldquo;': '“',
    '&nbsp;': ' ', '&hellip;': '…',
    '&amp;': '&',
}

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return None

        ctype = self.guess_type(path)
        f = open(path, 'rb')
        fs = os.fstat(f.fileno())
        file_len = fs[6]
        range_header = self.headers.get('Range')
        if range_header:
            m = re.match(r'bytes=(\d*)-(\d*)', range_header)
            start, end = m.group(1), m.group(2)
            start = int(start) if start else 0
            end = int(end) if end else file_len - 1
            end = min(end, file_len - 1)
            length = end - start + 1
            self.send_response(206)
            self.send_header('Content-type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_len}')
            self.send_header('Content-Length', str(length))
            self.end_headers()
            f.seek(start)
            self.wfile.write(f.read(length))
            f.close()
            return None
        else:
            self.send_response(200)
            self.send_header('Content-type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Length', str(file_len))
            self.end_headers()
            return f

    def _send_json(self, code, obj):
        data = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path != '/__save':
            self.send_error(404, "Not found")
            return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        try:
            payload = json.loads(body)
            changes = payload.get('changes', [])
        except Exception:
            self._send_json(400, {'ok': False, 'error': 'invalid request body'})
            return

        target = os.path.join(os.getcwd(), 'liverexectours-site', 'index.html')
        if not os.path.exists(target):
            self._send_json(500, {'ok': False, 'error': 'index.html not found'})
            return

        with open(target, 'r', encoding='utf-8') as f:
            original_content = f.read()

        content = original_content
        for entity, char in SAFE_ENTITIES.items():
            content = content.replace(entity, char)

        applied = 0
        failed = 0
        for change in changes:
            old = (change.get('oldText') or '').strip()
            new = change.get('newText', '')
            if not old:
                failed += 1
                continue
            new_escaped = new.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            if content.count(old) == 1:
                content = content.replace(old, new_escaped, 1)
                applied += 1
            else:
                failed += 1

        if applied > 0:
            with open(target + '.bak', 'w', encoding='utf-8') as f:
                f.write(original_content)
            with open(target, 'w', encoding='utf-8') as f:
                f.write(content)

        self._send_json(200, {'ok': True, 'applied': applied, 'failed': failed})

if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8844
    http.server.test(HandlerClass=RangeHTTPRequestHandler, port=port)
