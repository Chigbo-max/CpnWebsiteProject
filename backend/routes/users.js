const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const { IUserService, UserServiceImpl } = require('../services/UserService');
const puppeteer = require('puppeteer');

/** @type {IUserService} */
const userService = new UserServiceImpl();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, whatsapp, nationality, state } = req.body;
    const user = await userService.register({ email, firstName, lastName, whatsapp, nationality, state });

    const whatsappLink = process.env.VITE_WHATSAPP_LINK;

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      whatsappLink
    });

  } catch (error) {
    console.error('User registration error:', error);
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'CONFLICT') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await userService.list();

    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export users as PDF (admin only)
router.get('/admin/users/export', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .sort({ registeredAt: -1 })
      .select('-__v');

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CPN Users Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { margin-bottom: 30px; }
          .date { text-align: right; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Christian Professionals Network</h1>
          <h2>Registered Users Report</h2>
          <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Email</th>
              <th>WhatsApp</th>
              <th>Nationality</th>
              <th>State</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.whatsapp}</td>
                <td>${user.nationality}</td>
                <td>${user.state}</td>
                <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Total Users: ${users.length}</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cpn-users-${new Date().toISOString().split('T')[0]}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user statistics (admin only)
router.get('/admin/users/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await userService.stats();
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
