import React from 'react';
import authService from '../../services/auth.service';

// Evita a tela branca: se alguma tela quebrar ao renderizar, mostra uma mensagem em
// vez de desmontar o app inteiro. Se a causa for sessão expirada, volta para o login.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Erro inesperado na tela:', error, info);
    if (!authService.getCurrentUser()) {
      authService.expireSession();
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{ padding: '48px 16px', textAlign: 'center' }}>
        <h4>Algo deu errado</h4>
        <p>Ocorreu um erro ao carregar esta tela.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Recarregar a página
        </button>
      </div>
    );
  }
}
