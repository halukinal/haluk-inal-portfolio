'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
// HATA ÇIKARAN IMPORTLARI KALDIRDIK ve yerine standart HTML kullanacağız
// import { Button } from './ui/button';
// import { Input } from './ui/input'; ...

import { sendReportEmail } from '@/app/actions/sendEmail';

// Tipler
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır"),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedMessage = `
--- WEB SİTESİ İLETİŞİM FORMU ---
Gönderen: ${data.name}
E-posta: ${data.email}

Mesaj:
${data.message}
    `;

    try {
      const response = await sendReportEmail(formattedMessage);
      if (response.success) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorMessage("Mesaj gönderilemedi: " + response.message);
      }
    } catch (error) {
      console.error("Hata:", error);
      setErrorMessage("Beklenmedik bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ortak Input Stilleri (Tailwind)
  const inputStyles = "flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section id="contact" className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Sol Taraf: Bilgilendirme */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Birlikte Yaratalım</h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              Aklınızda bir proje mi var? Modern web uygulamaları veya sinematik tanıtım filmleri için vizyonunuzu hayata geçirmeye hazırım.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                <span className="text-white font-bold">@</span>
              </div>
              <div>
                <p className="text-white font-medium">E-posta</p>
                <a href="mailto:iletisim@halukinal.com" className="hover:text-blue-400 transition-colors">iletisim@halukinal.com</a>
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Form */}
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-12 text-center h-full"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-500 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Mesajınız İletildi!</h3>
                  <p className="text-gray-400">En kısa sürede size dönüş yapacağım.</p>
                  <button onClick={() => setIsSuccess(false)} className="mt-6 text-sm text-blue-400 hover:underline">
                    Yeni Mesaj Gönder
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 relative z-10"
                >
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Adınız Soyadınız</label>
                    <input
                      id="name"
                      placeholder="Haluk İnal"
                      {...register('name')}
                      className={`${inputStyles} ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">E-posta Adresi</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="ornek@sirket.com"
                      {...register('email')}
                      className={`${inputStyles} ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Mesajınız</label>
                    <textarea
                      id="message"
                      placeholder="Projenizden bahsedin..."
                      className={`flex min-h-[120px] w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none ${errors.message ? 'border-red-500' : ''}`}
                      {...register('message')}
                    />
                    {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 p-3 rounded-md border border-red-900/50">
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                    {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}