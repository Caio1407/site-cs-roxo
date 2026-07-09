# Site ComSenso

Site institucional da ComSenso — marketing, terceirização de serviços e desenvolvimento profissional.

## Estrutura

```
index.html   Marcação e conteúdo das seções (hero, sobre, serviços, time, depoimentos, contato)
style.css    Estilos do site
script.js    Menu mobile, animações de rolagem, contador de estatísticas e validação do formulário de contato
Assets/      Imagens usadas no site
```

## Como rodar localmente

Como é um site estático, basta abrir o `index.html` diretamente no navegador, ou servir a pasta com um servidor local, por exemplo:

```
npx serve .
```

## Observações

- O formulário de contato (`#contactForm`) faz apenas validação e envio simulado no front-end — não há backend conectado neste protótipo.
