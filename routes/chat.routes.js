const express = require('express');
const router = express.Router();
const validateChatInput = require('../middlewares/validateChatInput.middleware');
const { chat, saveHistory, getHistory } = require('../controllers/chat.controller');

// endpoint public, user gak perlu login buat nanya ke CS bot
router.post('/', validateChatInput, chat);

// simpan & ambil riwayat percakapan (aktif kalau user setuju simpan riwayat)
router.post('/history', saveHistory);
router.get('/history/:session_id', getHistory);

module.exports = router;