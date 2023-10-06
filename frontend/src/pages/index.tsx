// pages/home.tsx
import React from 'react';
import Layout from "@/components/Layout";
import RegistrationForm from '@/components/RegistrationForm';

export default function Home() {
  return (
    <Layout title="Event Name">
      <div className="hero bg-cover bg-center h-[33vh]" style={{ backgroundImage: 'url("/img/your-hero-background-image.jpg")' }}>
        <h1 className="text-center text-4xl font-bold mt-20">LA NUEVA ERA</h1>
        <p className="text-center text-xl mt-4">DE CIBERATAQUES</p>
        <p className="text-center text-lg mt-1">Actaliza tu estrategia</p>
        <p className="text-center text-xl mt-1.5">24 de octubre * 8:00 hrs</p>
        <p className="text-center text-lg mt-2">HOTEL ST. REGIS CDMX</p>
      </div>
      <hr className="border-t-2 border-white my-8" />
      <div className="text-center text-2xl mb-8">
        <span>Home |</span>
        <span> Agenda |</span>
        <span> Venue Map</span>
      </div>
      <h2 className="text-center text-3xl mb-8">Registration</h2>
      <RegistrationForm />
    </Layout>
  );
}
