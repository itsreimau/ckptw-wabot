const {
    bold
} = require('@mengkodingan/ckptw');

// API Key
global.apiKey = {
    imgbb: 'REPLACE_THIS_WITH_YOUR_API_KEY', // Dapatkan di: https://id.imgbb.com/
    lowline: 'REPLACE_THIS_WITH_YOUR_API_KEY' // Dapatkan di: https://www.lowline.ai/
};

// Bot
global.bot = {
    name: 'Rei Ayanami',
    prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i
};

// MSG (Message / Pesan)
global.msg = {
    // Akses perintah
    admin: `${bold('[ ! ]')} Perintah hanya dapat diakses oleh admin grup!`,
    owner: `${bold('[ ! ]')} Perintah hanya dapat diakses Owner!`,
    group: `${bold('[ ! ]')} Perintah hanya dapat diakses dalam grup!`,
    private: `${bold('[ ! ]')} Perintah hanya dapat mengakses obrolan pribadi!`,

    // Proses perintah
    argument: `${bold('[ ! ]')} Masukkan argumen!`,
    botAdmin: `${bold('[ ! ]')} Bot bukan admin, tidak bisa menggunakan perintah!`,
    notFound: `${bold('[ ! ]')} Tidak ada hasil yang ditemukan!`,
    urlInvalid: `${bold('[ ! ]')} URL tidak valid!`,
    wait: `${bold('[ ! ]')} Tunggu sebentar...`
};

// Owner
global.owner = {
    name: 'ItsReimau',
    number: '6283838039693',
    organization: 'Kumaha Aing'
};

// Sticker
global.sticker = {
    packname: 'Take care of yourself.',
    author: '@rei-ayanami'
};

// System
global.system = {
    startTime: null
};