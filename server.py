#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Server Backend Tự Động Hóa Thanh Toán VietQR & Webhook SePay
Dành cho: Nhà Nghỉ Diễm Châu
Tài khoản nhận: TPBank - NGUYEN CHI THANH - 88188968888
"""

import os
import sys
import json
import re
import time
import mimetypes
import sqlite3
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from threading import Lock

PORT = 5001
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'diemchau.db')
db_lock = Lock()

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db_lock:
        conn = get_db()
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS rooms (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT,
                is_available INTEGER DEFAULT 1,
                pin_code TEXT DEFAULT '*3892#',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        c.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sepay_id TEXT UNIQUE,
                room TEXT NOT NULL,
                phone TEXT,
                amount INTEGER NOT NULL,
                content TEXT,
                pin_code TEXT,
                date_str TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        try:
            c.execute('ALTER TABLE transactions ADD COLUMN pin_code TEXT')
        except sqlite3.OperationalError:
            pass
        try:
            c.execute('ALTER TABLE transactions ADD COLUMN check_in TEXT')
        except sqlite3.OperationalError:
            pass
        try:
            c.execute('ALTER TABLE transactions ADD COLUMN check_out TEXT')
        except sqlite3.OperationalError:
            pass
        try:
            c.execute('ALTER TABLE transactions ADD COLUMN cleaning_until TEXT')
        except sqlite3.OperationalError:
            pass
        try:
            c.execute('ALTER TABLE transactions ADD COLUMN package TEXT')
        except sqlite3.OperationalError:
            pass
        default_rooms = [
            ('101', 'Phòng 101', 'Phòng Đôi Tiêu Chuẩn (Giường Gỗ)', 'Tầng 1 (Trệt) • Giường gỗ tự nhiên • Máy lạnh Inverter', 1, '*3892#'),
            ('102', 'Phòng 102', 'Phòng Đôi Riêng Tư (Yên Tĩnh)', 'Tầng 1 (Trệt) • Cửa cách âm kín đáo • Tủ đồ', 1, '*5678#'),
            ('103', 'Phòng 103', 'Phòng Đôi Thư Thái (Thoáng Mát)', 'Tầng 1 (Trệt) • Bàn trà riêng • Thoáng đãng', 1, '*9124#'),
            ('104', 'Phòng 104', 'Phòng Đôi Cao Cấp (Kín Đáo)', 'Tầng 1 (Trệt) • Nóng lạnh • Cách âm tuyệt đối', 1, '*8866#')
        ]
        for r in default_rooms:
            c.execute('INSERT OR IGNORE INTO rooms (id, name, type, description, is_available, pin_code) VALUES (?, ?, ?, ?, ?, ?)', r)
        conn.commit()
        conn.close()
        print(f"📦 [SQLITE] Cơ sở dữ liệu SQLite đã sẵn sàng: {DB_PATH}")

# Quản lý danh sách client kết nối Realtime (Server-Sent Events)
clients_lock = Lock()
pending_intents = {}
connected_clients = []

# Lưu trữ lịch sử giao dịch gần nhất
recent_transactions = []

def broadcast_payment_event(data):
    """Gửi sự kiện thanh toán thành công tới tất cả trình duyệt đang mở"""
    payload = f"data: {json.dumps(data, ensure_ascii=False)}\n\n".encode('utf-8')
    with clients_lock:
        to_remove = []
        for client in connected_clients:
            try:
                client.wfile.write(payload)
                client.wfile.flush()
            except Exception:
                to_remove.append(client)
        for client in to_remove:
            if client in connected_clients:
                connected_clients.remove(client)

class DiễmChâuRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        # Hỗ trợ CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # 1. Kênh Realtime Server-Sent Events (SSE)
        if path == '/api/payment-stream':
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache, no-transform')
            self.send_header('Connection', 'keep-alive')
            self.send_header('X-Accel-Buffering', 'no')
            self.end_headers()

            # Gửi tin nhắn chào mừng kèm danh sách giao dịch gần nhất để client bù đắp nếu bị ngắt kết nối
            welcome_payload = {
                'type': 'CONNECTED',
                'message': 'Đã kết nối Realtime Server Diễm Châu',
                'recent': recent_transactions[:5]
            }
            welcome = f"data: {json.dumps(welcome_payload, ensure_ascii=False)}\n\n".encode('utf-8')
            try:
                self.wfile.write(welcome)
                self.wfile.flush()
            except Exception:
                return

            with clients_lock:
                connected_clients.append(self)
                print(f"[SSE] Đã kết nối thêm 1 client (Tổng: {len(connected_clients)})")

            # Giữ kết nối
            try:
                while True:
                    time.sleep(15)
                    # Gửi ping giữ kết nối
                    ping = f": ping {time.time()}\n\n".encode('utf-8')
                    self.wfile.write(ping)
                    self.wfile.flush()
            except (ConnectionResetError, BrokenPipeError, Exception):
                pass
            finally:
                with clients_lock:
                    if self in connected_clients:
                        connected_clients.remove(self)
                print(f"[SSE] 1 client ngắt kết nối (Còn: {len(connected_clients)})")
            return

        # 1b. API lấy danh sách trạng thái phòng từ SQLite
        if path == '/api/rooms':
            with db_lock:
                conn = get_db()
                rows = conn.execute('SELECT * FROM rooms ORDER BY id ASC').fetchall()
                data = {}
                for r in rows:
                    data[r['id']] = {
                        'name': r['name'],
                        'type': r['type'],
                        'desc': r['description'],
                        'isAvailable': bool(r['is_available']),
                        'pinCode': r['pin_code']
                    }
                conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            return

        # 2. API lấy danh sách giao dịch gần nhất (trong vòng 15 phút)
        if path == '/api/transactions':
            now = time.time()
            valid_txs = [tx for tx in recent_transactions if (now - tx.get('timestamp', now)) < 900]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(valid_txs, ensure_ascii=False).encode('utf-8'))
            return

        # 2b. API xóa sạch giao dịch test cũ
        if path == '/api/clear-transactions':
            recent_transactions.clear()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Đã làm sạch toàn bộ giao dịch test cũ'}, ensure_ascii=False).encode('utf-8'))
            return

        # 2c. API Dành cho Chủ Nhà: Thống Kê Tổng Thu Nhập & Lịch Sử Đặt Phòng
        if path == '/api/admin/revenue':
            with db_lock:
                conn = get_db()
                rows = conn.execute('SELECT * FROM transactions ORDER BY id DESC').fetchall()
                total_row = conn.execute('SELECT SUM(amount) as total FROM transactions').fetchone()
                total_revenue = total_row['total'] if total_row and total_row['total'] else 0
                tx_list = []
                for r in rows:
                    tx_list.append({
                        'id': r['id'],
                        'sepayId': r['sepay_id'],
                        'room': r['room'],
                        'phone': r['phone'] or '---',
                        'amount': r['amount'],
                        'content': r['content'],
                        'pinCode': r['pin_code'] or '*3892#',
                        'checkIn': r['check_in'] or '',
                        'checkOut': r['check_out'] or '',
                        'cleaningUntil': r['cleaning_until'] or '',
                        'package': r['package'] or '',
                        'date': r['date_str'] or r['created_at']
                    })
                conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'totalRevenue': total_revenue,
                'totalCount': len(tx_list),
                'transactions': tx_list
            }, ensure_ascii=False).encode('utf-8'))
            return

        # 2d. API Kiểm tra lịch đặt phòng & thời gian dọn phòng của 4 phòng
        if path == '/api/bookings/schedule':
            with db_lock:
                conn = get_db()
                rows = conn.execute('''
                    SELECT id, sepay_id, room, phone, check_in, check_out, cleaning_until, package, date_str, created_at
                    FROM transactions
                    ORDER BY id DESC LIMIT 50
                ''').fetchall()
                schedules = []
                for r in rows:
                    schedules.append({
                        'id': r['id'],
                        'room': r['room'],
                        'phone': r['phone'] or '',
                        'checkIn': r['check_in'] or '',
                        'checkOut': r['check_out'] or '',
                        'cleaningUntil': r['cleaning_until'] or '',
                        'package': r['package'] or '',
                        'date': r['date_str'] or r['created_at']
                    })
                conn.close()
            now = time.time()
            active_intents = [
                v for v in pending_intents.values() if (now - v.get('timestamp', 0)) < 900
            ]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                'schedules': schedules,
                'intents': active_intents
            }, ensure_ascii=False).encode('utf-8'))
            return

        # 3. Phục vụ file tĩnh (Mockup HTML, Logo, Ảnh phòng)
        if path == '/' or path == '/index.html':
            file_path = os.path.join(BASE_DIR, 'mockup-thiet-ke-diemchau.html')
        else:
            rel_path = path.lstrip('/')
            file_path = os.path.join(BASE_DIR, rel_path)

        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                mime_type = 'application/octet-stream'
            if mime_type.startswith('text/') or mime_type == 'application/javascript':
                mime_type += '; charset=utf-8'
            self.send_header('Content-Type', mime_type)
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(b"404 Not Found - Di\xe1\xbb\x85m Ch\xc3\xa2u Server")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Đọc body JSON
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8', errors='ignore')

        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            body = {}

        # 1. CẬP NHẬT THÔNG TIN PHÒNG (TRẠNG THÁI HOẶC MÃ PIN) VÀO SQLITE
        if path == '/api/rooms/update':
            room_id = str(body.get('roomId', ''))
            is_avail = body.get('isAvailable')
            pin_code = body.get('pinCode')
            if room_id:
                with db_lock:
                    conn = get_db()
                    if is_avail is not None:
                        conn.execute('UPDATE rooms SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (1 if is_avail else 0, room_id))
                    if pin_code:
                        conn.execute('UPDATE rooms SET pin_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (str(pin_code), room_id))
                    conn.commit()
                    conn.close()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}, ensure_ascii=False).encode('utf-8'))
            return

        # 1b. GHI NHẬN Ý ĐỊNH ĐẶT PHÒNG & THỜI GIAN NHẬN/TRẢ (BOOKING INTENT)
        if path == '/api/bookings/intent':
            room_id = str(body.get('room', ''))
            phone = str(body.get('phone', ''))
            check_in = str(body.get('checkIn', ''))
            check_out = str(body.get('checkOut', ''))
            cleaning_until = str(body.get('cleaningUntil', ''))
            package = str(body.get('package', '3h'))
            amount = body.get('amount', 100000)

            if room_id:
                pending_intents[room_id] = {
                    'room': room_id,
                    'phone': phone,
                    'check_in': check_in,
                    'check_out': check_out,
                    'cleaning_until': cleaning_until,
                    'package': package,
                    'amount': amount,
                    'timestamp': time.time()
                }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}, ensure_ascii=False).encode('utf-8'))
            return

        # 2. CỔNG TIẾP NHẬN WEBHOOK TỪ SEPAY (HOẶC CASSO)
        if path in ['/api/sepay-webhook', '/webhook', '/api/webhook']:
            print("\n" + "="*50)
            print("🔔 [SEPAY WEBHOOK] NHẬN BIẾN ĐỘNG SỐ DƯ TPBANK!")
            print(json.dumps(body, indent=2, ensure_ascii=False))
            print("="*50 + "\n")

            # Trích xuất dữ liệu SePay
            amount = body.get('transferAmount') or body.get('amount') or 0
            content = body.get('content') or body.get('description') or ''
            tx_id = body.get('id') or body.get('referenceCode') or str(int(time.time()))
            tx_date = body.get('transactionDate') or time.strftime('%Y-%m-%d %H:%M:%S')

            # Phân tích nội dung chuyển khoản để tìm chính xác số phòng (101, 102, 103, 104)
            room_match = re.search(r'(?:P|PHONG|PHÒNG)\s*(10[1-4])', content, re.IGNORECASE)
            if not room_match:
                room_match = re.search(r'\b(10[1-4])\b', content)
            detected_room = room_match.group(1) if room_match else '101'

            phone_match = re.search(r'\b(0\d{9,10})\b', content)
            detected_phone = phone_match.group(1) if phone_match else ''

            # Lấy thông tin thời gian đặt phòng từ intent (hoặc mặc định chuẩn: 3h + 2h dọn)
            intent = pending_intents.get(detected_room)
            now_dt = time.strftime('%Y-%m-%d %H:%M')
            check_in = now_dt
            check_out_ts = time.time() + 3 * 3600
            check_out = time.strftime('%Y-%m-%d %H:%M', time.localtime(check_out_ts))
            cleaning_until = time.strftime('%Y-%m-%d %H:%M', time.localtime(check_out_ts + 2 * 3600))
            pkg_name = '3h'

            if intent and (time.time() - intent.get('timestamp', 0) < 1800):
                if intent.get('check_in'): check_in = intent['check_in']
                if intent.get('check_out'): check_out = intent['check_out']
                if intent.get('cleaning_until'): cleaning_until = intent['cleaning_until']
                if intent.get('package'): pkg_name = intent['package']
                if not detected_phone and intent.get('phone'): detected_phone = intent['phone']

            # Ghi nhận vĩnh viễn vào SQLite (Cơ sở dữ liệu)
            assigned_pin = '*3892#'
            with db_lock:
                conn = get_db()
                try:
                    # Lấy mã PIN hiện tại của phòng này để lưu vết
                    r_row = conn.execute('SELECT pin_code FROM rooms WHERE id = ?', (detected_room,)).fetchone()
                    if r_row and r_row['pin_code']:
                        assigned_pin = r_row['pin_code']
                    conn.execute('''
                        INSERT OR REPLACE INTO transactions (sepay_id, room, phone, amount, content, pin_code, check_in, check_out, cleaning_until, package, date_str)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (str(tx_id), detected_room, detected_phone, amount, content, assigned_pin, check_in, check_out, cleaning_until, pkg_name, tx_date))
                    # Đánh dấu phòng chuyển sang ĐANG CÓ KHÁCH trong SQLite
                    conn.execute('UPDATE rooms SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (detected_room,))
                    conn.commit()
                except Exception as e:
                    print("[SQLITE DB ERROR]", e)
                finally:
                    conn.close()

            event_data = {
                'type': 'PAYMENT_SUCCESS',
                'amount': amount,
                'room': detected_room,
                'phone': detected_phone,
                'content': content,
                'pin': assigned_pin,
                'checkIn': check_in,
                'checkOut': check_out,
                'cleaningUntil': cleaning_until,
                'package': pkg_name,
                'transactionId': tx_id,
                'timestamp': int(time.time()),
                'date': tx_date,
                'message': f'Tài khoản TPBank đã nhận thành công {amount:,.0f}đ cho Phòng {detected_room}!'
            }

            recent_transactions.insert(0, event_data)
            if len(recent_transactions) > 20:
                recent_transactions.pop()

            # Bắn tín hiệu Realtime tới trình duyệt web
            broadcast_payment_event(event_data)

            # Trả lời SePay: HTTP 200 OK (Bắt buộc theo chuẩn SePay)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            resp = {'success': True, 'message': 'Đã xử lý webhook Diễm Châu thành công', 'room': detected_room}
            self.wfile.write(json.dumps(resp, ensure_ascii=False).encode('utf-8'))
            return

        # 2. CỔNG TEST THANH TOÁN (MÔ PHỎNG THỬ)
        if path == '/api/test-payment':
            amount = body.get('amount', 100000)
            room = str(body.get('room', '101'))
            phone = body.get('phone', '0942817633')
            content = f"DIEMCHAU P{room} {phone}"

            event_data = {
                'type': 'PAYMENT_SUCCESS',
                'amount': amount,
                'room': room,
                'phone': phone,
                'content': content,
                'transactionId': 'TEST_' + str(int(time.time())),
                'timestamp': int(time.time()),
                'date': time.strftime('%Y-%m-%d %H:%M:%S'),
                'message': f'[MÔ PHỎNG] TPBank nhận {amount:,.0f}đ cho Phòng {room}!'
            }
            broadcast_payment_event(event_data)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'event': event_data}, ensure_ascii=False).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

def run_server():
    init_db()
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, DiễmChâuRequestHandler)
    print("="*60)
    print(f"🏨 SERVER NHÀ NGHỈ DIỄM CHÂU ĐANG CHẠY TẠI:")
    print(f"👉 Website:  http://localhost:{PORT}")
    print(f"👉 Webhook:  http://localhost:{PORT}/api/sepay-webhook")
    print(f"👉 SSE Stream: http://localhost:{PORT}/api/payment-stream")
    print("="*60)
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
