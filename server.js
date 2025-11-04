// ===============================
// server.js – WebSocket relay (Render Deployment)
// ===============================
import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 10000; // Render otomatis kasih PORT
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket server berjalan di ws://0.0.0.0:${PORT}`);

// Ganti URL ini ke lokasi receiver kamu
const RECEIVER_URL = process.env.RECEIVER_URL || 'http://192.168.100.59/aktnusaputera/receiver.php';

wss.on('connection', (ws) => {
  console.log('🔌 Klien terhubung ke WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📦 Data kasbon diterima:', data);

      const response = await fetch(RECEIVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result.success ? '✅ Data berhasil dikirim ke lokal!' : `⚠️ Gagal simpan: ${result.error}`);

      ws.send(JSON.stringify(result));
    } catch (err) {
      console.error('❌ Error saat memproses data:', err);
      ws.send(JSON.stringify({ success: false, error: err.message }));
    }
  });

  ws.on('close', () => console.log('🔌 Klien terputus'));
});
