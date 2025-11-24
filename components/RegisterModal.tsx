import React, { useState, useEffect } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const hashPassword = async (password: string): Promise<string> => {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        // --- SIMULAÇÃO DE CRIPTOGRAFIA ---
        // Em uma aplicação real, a senha em texto plano seria enviada via HTTPS para o servidor.
        // O servidor, então, geraria um "salt" e aplicaria um algoritmo de hashing (como bcrypt ou Argon2)
        // para armazenar a senha de forma segura no banco de dados.
        // O código abaixo simula o hashing da senha no lado do cliente para fins de demonstração.
        const hashedPassword = await hashPassword(password);

        console.log({ name, email, hashedPassword });
        alert('Cadastro realizado com sucesso! (Simulação)\nSenha criptografada no console.');
        onClose();
    };

    if (!isOpen) {
        return null;
    }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md m-4 transform animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
              aria-label="Fechar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
             <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    minLength={6}
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
            <div>
                <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-300 mb-1">Confirmar Senha</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold rounded-lg px-6 py-3 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 mt-2"
            >
                Criar Conta
            </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;