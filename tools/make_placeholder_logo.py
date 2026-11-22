#!/usr/bin/env python3
"""Create an explicitly-marked PLACEHOLDER logo (not the real OMJAPAN logo).

No fonts or third-party libraries: a tiny 5x7 bitmap font is embedded.
Replace tools/PLACEHOLDER_NOTICE.txt with the supplied 1000005646.jpg when it
arrives; do not ship this placeholder as the final brand mark.
"""
import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GLYPHS = {
    'A': ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    'C': ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
    'D': ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    'E': ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    'H': ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    'J': ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
    'L': ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    'M': ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    'N': ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    'O': ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    'P': ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    'R': ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    'T': ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    '?': ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
    '!': ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
    '-': ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
    ' ': ["00000"] * 7,
}

BG = (10, 12, 10, 255)
LIME = (182, 241, 60, 255)
DIM = (154, 166, 148, 255)


def new_canvas(w, h, color=BG):
    return [[list(color) for _ in range(w)] for _ in range(h)]


def rect(canvas, x0, y0, x1, y1, color):
    for y in range(max(0, y0), min(len(canvas), y1)):
        for x in range(max(0, x0), min(len(canvas[0]), x1)):
            canvas[y][x] = list(color)


def draw_text(canvas, text, cx, cy, scale, color):
    width = len(text) * 6 * scale - scale
    start_x = cx - width // 2
    start_y = cy - (7 * scale) // 2
    for i, ch in enumerate(text.upper()):
        glyph = GLYPHS.get(ch, GLYPHS['?'])
        for row, bits in enumerate(glyph):
            for col, bit in enumerate(bits):
                if bit == '1':
                    rect(canvas, start_x + i * 6 * scale + col * scale,
                         start_y + row * scale,
                         start_x + i * 6 * scale + (col + 1) * scale,
                         start_y + (row + 1) * scale, color)


def write_png(path, canvas):
    h, w = len(canvas), len(canvas[0])
    raw = b''.join(b'\x00' + b''.join(bytes(px) for px in row) for row in canvas)

    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data +
                struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF))

    header = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    with open(path, 'wb') as fh:
        fh.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', header) +
                 chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def launcher(size=192):
    c = new_canvas(size, size)
    rect(c, 0, 0, size, size, LIME)
    m = size // 10
    rect(c, m, m, size - m, size - m, BG)
    draw_text(c, '?', size // 2, int(size * 0.44), max(2, size // 30), LIME)
    draw_text(c, 'OMJAPAN', size // 2, int(size * 0.76), max(1, size // 64), DIM)
    return c


def in_app(size=512):
    c = new_canvas(size, size)
    rect(c, 0, 0, size, size, BG)
    rect(c, 12, 12, size - 12, size - 12, DIM)
    rect(c, 16, 16, size - 16, size - 16, BG)
    draw_text(c, '?', size // 2, int(size * 0.42), size // 34, LIME)
    draw_text(c, 'OMJAPAN', size // 2, int(size * 0.70), max(2, size // 74), LIME)
    draw_text(c, 'PLACEHOLDER', size // 2, int(size * 0.84), max(1, size // 110), DIM)
    return c


if __name__ == '__main__':
    res = os.path.join(ROOT, 'android', 'res', 'drawable')
    assets = os.path.join(ROOT, 'android', 'assets', 'www', 'img')
    os.makedirs(res, exist_ok=True)
    os.makedirs(assets, exist_ok=True)
    write_png(os.path.join(res, 'ic_launcher.png'), launcher())
    write_png(os.path.join(assets, 'logo_placeholder.png'), in_app())
    with open(os.path.join(ROOT, 'tools', 'PLACEHOLDER_NOTICE.txt'), 'w') as fh:
        fh.write('These images are PLACEHOLDERS, generated locally.\n')
        fh.write('Replace them with the supplied 1000005646.jpg when available.\n')
        fh.write('They must never be presented as the official OMJAPAN logo.\n')
    print('placeholder assets written')
