import React, { useState } from 'react';

const FloatingButtonWithModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        bbbbbb
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            {/* Botão Fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              aaaa
            </button>

            {/* Conteúdo da Modal */}
            <h2 className="text-xl font-bold mb-4">Título da Modal</h2>
            <p>Aqui vai o conteúdo da sua modal. Pode ser formulário, texto, ou o que você quiser.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingButtonWithModal;
