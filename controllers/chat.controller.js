const { askGemini } = require('../services/gemini.service');
const sendResponse = require('../utils/response');
const { ChatHistory } = require('../models');

async function chat(req, res) {
  try {
    const { message } = req.body;

    const reply = await askGemini(message);

    return sendResponse(res, {
      message: 'Berhasil dapat balasan',
      data: { reply },
    });
  } catch (err) {
    console.error('Gemini error:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menghubungi AI, coba lagi nanti',
    });
  }
}

// create - simpan satu pesan ke riwayat percakapan
// endpoint ini cuma dipanggil dari sisi client kalau user sudah setuju simpan riwayat
async function saveHistory(req, res) {
  try {
    const { session_id, role, message } = req.body;

    if (!session_id || !role || !message) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'session_id, role, dan message wajib diisi',
      });
    }

    if (!['user', 'bot'].includes(role)) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: "role harus 'user' atau 'bot'",
      });
    }

    const saved = await ChatHistory.create({ session_id, role, message });

    return sendResponse(res, {
      code: 201,
      message: 'Riwayat percakapan tersimpan',
      data: saved,
    });
  } catch (err) {
    console.error('Save history error:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menyimpan riwayat percakapan',
    });
  }
}

// read - ambil semua pesan dalam satu sesi percakapan, urut dari yang paling lama
async function getHistory(req, res) {
  try {
    const { session_id } = req.params;

    const history = await ChatHistory.findAll({
      where: { session_id },
      order: [['createdAt', 'ASC']],
    });

    return sendResponse(res, {
      message: 'Riwayat percakapan berhasil diambil',
      data: history,
    });
  } catch (err) {
    console.error('Get history error:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil riwayat percakapan',
    });
  }
}

module.exports = { chat, saveHistory, getHistory };