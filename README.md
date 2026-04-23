# Skyline Weather

Aplicativo de clima criado para portfolio, com foco em visual premium, dados reais e interacoes de interface.

## O que ele mostra

- Hero principal com temperatura atual e destaque visual
- Busca entre cidades com geocodificacao em tempo real
- Previsao para varios dias com selecao ativa
- Grafico horario em SVG
- Cards de qualidade do ar e umidade com dados ao vivo
- Layout responsivo com alternancia de atmosfera visual

## Tecnologias

- HTML
- CSS
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Open-Meteo Air Quality API

## Como abrir

Abra o arquivo [index.html](C:\Users\gabri\Desktop\aplicativo de clima\index.html) no navegador.

## Como publicar

- GitHub Pages: envie os arquivos para um repositorio e publique a branch principal
- Netlify: arraste a pasta do projeto para criar um deploy estatico
- Vercel: crie um projeto estatico apontando para esta pasta

## Arquivos de deploy incluidos

- `netlify.toml` com cache basico para arquivos estaticos
- `vercel.json` para servir o projeto como site estatico
- `.gitignore` para manter o repositorio limpo
- `.github/workflows/deploy-pages.yml` para publicar automaticamente no GitHub Pages
- `.nojekyll` para evitar processamento desnecessario no Pages

## Observacoes

- O app consome dados ao vivo diretamente das APIs publicas da Open-Meteo no navegador
- Como e um projeto estatico, nao precisa de backend nem variaveis de ambiente
- Para portfolio, vale adicionar depois o link de producao no topo deste README

## GitHub Pages passo a passo

1. Crie um repositorio novo no GitHub.
2. Envie estes arquivos para a branch `main`.
3. No GitHub, abra `Settings > Pages`.
4. Em `Build and deployment`, escolha `GitHub Actions`.
5. O workflow `Deploy GitHub Pages` vai publicar o site automaticamente a cada push na `main`.
6. Depois do primeiro deploy, o link publico aparecera na pagina de Pages e na aba `Actions`.

## Git local

- Tentei inicializar o repositorio daqui, mas o ambiente atual nao tem `git` instalado nem disponivel no PATH.
- Assim que o Git estiver instalado na sua maquina, os comandos basicos serao:

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial portfolio weather app"
```

## Ideias para evoluir

- Adicionar geolocalizacao
- Salvar cidades favoritas no `localStorage`
- Criar modo escuro/claro com persistencia
- Incluir comparacao entre cidades e proximas horas
