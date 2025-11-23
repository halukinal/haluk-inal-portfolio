'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendEmail } from '../services/emailService'; // Client-side EmailJS servisi

// Form doğrulama şeması
const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır"),
});

type ContactFormValues = z.infer<typeof formSchema>;

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

    // EmailJS servisini kullanarak mail gönderimi
    const result = await sendEmail({
        from_name: data.name,
        from_email: data.email,
        message: `İLETİŞİM FORMU MESAJI:\n\n${data.message}\n\n---\nGönderen E-posta: ${data.email}`
    });

    if (result.success) {
        setIsSuccess(true);
        reset();
        // 5 saniye sonra başarı mesajını otomatik kaldır
        setTimeout(() => setIsSuccess(false), 5000);
    } else {
        setErrorMessage(result.message);
    }
    setIsSubmitting(false);
  };

  // Ortak Input Stilleri (Tailwind CSS)
  const inputStyles = "flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50";

  return (
    <section id="contact" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Arkaplan Efekti */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/5 blur-[100px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Sol Taraf: İletişim Bilgileri */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Birlikte <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Yaratalım</span>
            </h2>
            <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
              Aklınızda bir proje mi var? Modern web uygulamaları veya sinematik tanıtım filmleri için vizyonunuzu hayata geçirmeye hazırım.
            </p>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">@</div>
                    <div>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">E-posta</p>
                        <a href="mailto:iletisim@halukinal.com" className="text-white hover:text-blue-400 transition-colors">iletisim@halukinal.com</a>
                    </div>
                </div>
            </div>
          </div>

          {/* Sağ Taraf: Form */}
          <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12 text-center h-full"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Mesajınız İletildi!</h3>
                  <p className="text-zinc-400">En kısa sürede size dönüş yapacağım.</p>
                  <button onClick={() => setIsSuccess(false)} className="mt-8 text-sm text-blue-400 hover:text-blue-300 font-medium">
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
                  className="space-y-5"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">İsim Soyisim</label>
                        <input 
                          placeholder="Haluk İnal" 
                          {...register('name')} 
                          className={`${inputStyles} ${errors.name ? 'border-red-500/50 focus:ring-red-500/50' : ''}`} 
                        />
                        {errors.name && <span className="text-xs text-red-400 ml-1">{errors.name.message}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">E-posta</label>
                        <input 
                          type="email" 
                          placeholder="ornek@sirket.com" 
                          {...register('email')} 
                          className={`${inputStyles} ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : ''}`} 
                        />
                        {errors.email && <span className="text-xs text-red-400 ml-1">{errors.email.message}</span>}
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Mesajınız</label>
                    <textarea 
                      placeholder="Projenizden bahsedin..." 
                      {...register('message')} 
                      className={`${inputStyles} min-h-[140px] resize-none ${errors.message ? 'border-red-500/50 focus:ring-red-500/50' : ''}`} 
                    />
                    {errors.message && <span className="text-xs text-red-400 ml-1">{errors.message.message}</span>}
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      <AlertCircle size={16} />
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
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