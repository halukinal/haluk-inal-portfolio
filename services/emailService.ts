import emailjs from '@emailjs/browser';

// EmailJS paneline göre bu sabitleri doldurmalısın veya .env dosyasına koymalısın
// VITE_EMAIL_SERVICE_ID=...
// VITE_EMAIL_TEMPLATE_ID=...
// VITE_EMAIL_PUBLIC_KEY=...

const SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID || "service_ump1r72";
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID || "template_lkrqrus";
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY || "gDYOWdF4Kg_3JOnKb";

interface EmailParams {
  from_name: string;
  from_email: string;
  message: string;
  to_name?: string; // Haluk Inal
}

export const sendEmail = async (params: EmailParams) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      params as unknown as Record<string, unknown>,
      PUBLIC_KEY
    );
    
    if (response.status === 200) {
      return { success: true, message: 'E-posta başarıyla gönderildi.' };
    }
    throw new Error('EmailJS Status: ' + response.status);
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, message: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' };
  }
};