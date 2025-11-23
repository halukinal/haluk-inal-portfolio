'use server'

import nodemailer from 'nodemailer';

interface EmailResponse {
  success: boolean;
  message: string;
}

export async function sendReportEmail(reportContent: string): Promise<EmailResponse> {
  // 1. Transporter (Postacı) Ayarları
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 2. E-posta İçeriği
  const mailOptions = {
    from: `"Haluk İnal Asistan" <${process.env.SMTP_EMAIL}>`, // Gönderen
    to: "halukinal@gmail.com", // KENDİ MAİL ADRESİN (Raporun gideceği yer)
    subject: "🚀 Yeni Proje Raporu (Web Asistanı)",
    text: reportContent, // Düz metin yedeği
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Yeni Bir Müşteri Raporu Var!</h2>
        <p>Web sitendeki AI asistan üzerinden yeni bir proje özeti oluşturuldu.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
          ${reportContent.replace(/\n/g, '<br>')}
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 20px;">Bu mesaj otomatik olarak gönderilmiştir.</p>
      </div>
    `,
  };

  // 3. Gönderme İşlemi
  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'E-posta başarıyla gönderildi.' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'E-posta gönderilirken bir hata oluştu.' };
  }
}