import express from 'express';
console.log('>>> INICIANDO EXPRESS...');
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { MSPI_QUESTIONS } from './data/questions.js';
import { buildReportHTML } from './reportTemplate.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app build in production
app.use(express.static(join(__dirname, '../dist')));

// --- Email Config ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- PDF Generation (Puppeteer) ---
async function generatePDF(user, scoringResult) {
  const html = buildReportHTML(user, scoringResult);

  console.log('>>> INICIANDO GENERACIÓN DE PDF...');
  
  // En Azure, el navegador se descarga en esta ruta relativa gracias al .puppeteerrc.cjs
  // Intentamos detectar la ruta automáticamente
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

// --- API Endpoints ---

// Submit evaluation
app.post('/api/submit', async (req, res) => {
  const { user, answers, scoringResult } = req.body;

  try {
    // 1. Insert or update user
    const userStmt = db.prepare(`
      INSERT INTO users (name, email, phone) 
      VALUES (?, ?, ?) 
      ON CONFLICT(email) DO UPDATE SET 
      name = excluded.name, 
      phone = excluded.phone 
      returning id
    `);
    const result = userStmt.get(user.name, user.email, user.phone);
    const userId = result ? result.id : null;

    // 2. Save evaluation
    const evalStmt = db.prepare(`
      INSERT INTO evaluations (user_id, total_score, maturity_level, gaps, full_results) 
      VALUES (?, ?, ?, ?, ?)
    `);
    evalStmt.run(
      userId, 
      scoringResult.totalScore, 
      scoringResult.maturityLevel, 
      JSON.stringify(scoringResult.gaps), 
      JSON.stringify({ answers, scoringResult })
    );

    // 3. Send Emails (Logic)
    await sendResultsEmails(user, scoringResult);

    res.json({ success: true, message: 'Resultados guardados correctamente' });
  } catch (err) {
    console.error('Error saving evaluation:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Analytics Tracking
app.post('/api/track', (req, res) => {
  const { event_type, session_id, question_id } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO analytics_events (event_type, session_id, question_id) 
      VALUES (?, ?, ?)
    `);
    stmt.run(event_type, session_id, question_id || null);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Admin Login (Simple for pilot)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') { // Simple password for pilot
    res.json({ success: true, token: 'mock-admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
  }
});

// Admin Get Data
app.get('/api/admin/data', (req, res) => {
  try {
    const data = db.prepare(`
      SELECT e.*, u.name, u.email, u.phone 
      FROM evaluations e 
      JOIN users u ON e.user_id = u.id 
      ORDER BY e.created_at DESC
    `).all();

    // Funnel Stats
    const starts = db.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'assessment_start'").get().count;
    const leadsCount = db.prepare("SELECT COUNT(*) as count FROM evaluations").get().count;
    const landingViews = db.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'landing_view'").get().count;
    
    // Drop-off Analytics
    const dropOffs = db.prepare(`
      SELECT question_id, COUNT(*) as count 
      FROM analytics_events 
      WHERE event_type = 'question_answered' 
      GROUP BY question_id 
      ORDER BY question_id
    `).all();

    res.json({ 
      success: true, 
      data,
      metrics: {
        landings: landingViews || starts * 1.3, // Fallback for simulation
        starts: starts,
        completions: leadsCount
      },
      churn: dropOffs
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// --- Email Logic ---

async function sendResultsEmails(user, scoringResult) {
  try {
    const pdfBuffer = await generatePDF(user, scoringResult);

    // Email to User
    await transporter.sendMail({
      from: `"SmartScore MSPI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Resultados de tu Evaluación MSPI - ${user.name}`,
      text: `Hola ${user.name},\n\nAdjunto encontrarás el informe detallado de tu evaluación de madurez MSPI.\n\nTu puntaje actual es: ${scoringResult.totalScore}/100\nNivel: ${scoringResult.maturityLevel}\n\nGracias por usar SmartScore.`,
      attachments: [
        {
          filename: `Informe_MSPI_${user.name.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // Email to Admin
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== user.email) {
      await transporter.sendMail({
        from: `"SmartScore System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `NUEVO LEAD: ${user.name} - Score: ${scoringResult.totalScore}`,
        text: `Se ha completado una nueva evaluación.\n\nNombre: ${user.name}\nEmail: ${user.email}\nTeléfono: ${user.phone}\nScore: ${scoringResult.totalScore}\nNivel: ${scoringResult.maturityLevel}`,
        attachments: [
          {
            filename: `Lead_MSPI_${user.name.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    }

    console.log(`Emails enviados correctamente a ${user.email}`);
  } catch (err) {
    console.error('Error sending emails:', err);
    // We don't throw here to avoid failing the whole request if email fails
  }
}

// All other requests serve the React app
app.use((req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

