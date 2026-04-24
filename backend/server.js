const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Routes
app.use('/api/bookings', require('./routes/bookings'));

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send confirmation email
app.post('/api/send-confirmation', async (req, res) => {
  try {
    const { email, name, service, appointmentDate } = req.body;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Appointment Confirmed - Traditional Cuts',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">✂️ Traditional Cuts - Appointment Confirmed!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your appointment has been successfully booked:</p>
          <ul style="background: #f8f4e8; padding: 20px; border-radius: 10px;">
            <li><strong>Service:</strong> ${service}</li>
            <li><strong>Date & Time:</strong> ${new Date(appointmentDate).toLocaleString()}</li>
          </ul>
          <p>We look forward to serving you with our traditional techniques!</p>
          <p style="color: #666;">Traditional Cuts Team</p>
        </div>
      `
    });

    res.json({ message: 'Confirmation email sent!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
