document.addEventListener('DOMContentLoaded', () => {

  const CHAVE_MENSAGENS = 'mensagens_formulario_contato';

  const lista_mensagens = document.getElementById('lista_mensagens');
  const estado_vazio = document.getElementById('estado_vazio');
  const contador_mensagens = document.getElementById('contador_mensagens');
  const limpar_mensagens = document.getElementById('limpar_mensagens');

  const escaparHtml = (texto) => {
    const div = document.createElement('div');
    div.textContent = texto || '';
    return div.innerHTML;
  };

  const formatarData = (isoString) => {
    const data = new Date(isoString);
    if (Number.isNaN(data.getTime())) return '';
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  const renderizarMensagens = () => {
    const mensagens = JSON.parse(localStorage.getItem(CHAVE_MENSAGENS) || '[]');

    contador_mensagens.textContent = mensagens.length === 1
      ? '1 mensagem recebida'
      : `${mensagens.length} mensagens recebidas`;

    estado_vazio.style.display = mensagens.length === 0 ? 'block' : 'none';
    limpar_mensagens.style.display = mensagens.length === 0 ? 'none' : 'inline-flex';

    lista_mensagens.innerHTML = mensagens.slice().reverse().map((msg) => `
      <li class="cartao_mensagem">
        <div class="cartao_mensagem_cabecalho">
          <strong class="cartao_mensagem_nome">${escaparHtml(msg.nome)}</strong>
          <span class="cartao_mensagem_data">${formatarData(msg.data_envio)}</span>
        </div>
        <p class="cartao_mensagem_contato">${escaparHtml(msg.email)}${msg.empresa ? ' · ' + escaparHtml(msg.empresa) : ''}</p>
        <p class="cartao_mensagem_texto">${escaparHtml(msg.mensagem)}</p>
      </li>
    `).join('');
  };

  limpar_mensagens.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todas as mensagens recebidas?')) {
      localStorage.removeItem(CHAVE_MENSAGENS);
      renderizarMensagens();
    }
  });

  renderizarMensagens();

});
