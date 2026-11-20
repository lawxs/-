// Os links das plataformas funcionam mesmo com o JavaScript desativado.
(() => {
  const botao = document.querySelector("#compartilhar");
  const janela = document.querySelector("#janela-link");
  const campo = document.querySelector("#endereco");
  const retorno = document.querySelector("#retorno");
  const url = document.querySelector('link[rel="canonical"]').href;
  const podeAbrirJanela = typeof janela.showModal === "function";
  const podeCompartilhar = typeof navigator.share === "function";

  if (!podeAbrirJanela && !podeCompartilhar) return;

  campo.value = url;
  botao.hidden = false;

  botao.addEventListener("click", async () => {
    if (podeCompartilhar) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch (erro) {
        if (erro.name === "AbortError") return;
      }
    }

    if (podeAbrirJanela) {
      retorno.textContent = "";
      janela.showModal();
      campo.focus();
      campo.select();
    } else {
      window.prompt("Copie o endereço desta página", url);
    }
  });

  document.querySelector("#copiar").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      retorno.textContent = "Link copiado.";
    } catch {
      campo.focus();
      campo.select();
      retorno.textContent = "Link selecionado. Use a opção Copiar do navegador.";
    }
  });

  document.querySelector("#fechar").addEventListener("click", () => janela.close());
  janela.addEventListener("close", () => botao.focus());
  janela.addEventListener("click", (evento) => {
    if (evento.target !== janela) return;
    const area = janela.getBoundingClientRect();
    if (evento.clientX < area.left || evento.clientX > area.right ||
        evento.clientY < area.top || evento.clientY > area.bottom) {
      janela.close();
    }
  });
})();
