# Medium Blog

![Logo Medium](https://i.imgur.com/RWAohFi.png)

## O Que é

**Para você que deseja adicionar as postagens do Medium em seu site, esse projeto irá te ajudar!**
Antigamente o Medium fornecia uma API para realizar isso, mas essa API foi descontinuada. Mas através do XML que o Medium fornece construímos esse projeto, que falando a "modo grosso" ele puxa as postagens do XML e renderiza no view.

## Como Usar

- git clone https://github.com/GuiiHenriq/medium-blog.git
- npm install
- npm run start (_desenvolvimento_)
- npm run build (_produção_)

## Observações

Nosso projeto é construido totalmente em componentização, os componentes base são:

- Posts.js
- PostContent.js
- Search.js
- Categories.js

## Guia

- Pacote necessário: **xml-js** (já esta incluso no _package.json_)

- Necessario uso de algum CORS para não bloquear a API (ex: https://cors-anywhere.herokuapp.com/https://medium.com/feed/@USERNAME

- O XML fornecido pelo Medium é convertido em um JSON que gera um Array, entao devemos percorer o caminho para encontrar os elementos que precisamos, caso alguma informação da sua postagem não seja exibida, como Titulom, Thumbnail, URL do Post e etc. Verifique o caminho que está sendo chamado e o caminho fornecido pelo XML.
  \*Exemplo do caminho percorrido no Array para chamar o título dos posts: **postList.elements[0].elements[0].cdata\***

- Todos os fetchs e a chamada dos Array são inclusos no **componentDidUpdate** de cada arquivo **.JS**

- A aplicação é baseada em 4 arquivos base:
  **Posts.js** = Pagina principal onde renderiza todas as postagens
  **PostContent.js** = Pagina especifica de cada post, com seu conteúdo completo.
  **Search.js** = Pagina de busca das postagens
  **Categories.js** = Pagina especifica para as categorias das postagens.

- Existe um padrão que deve ser seguido na criação dos seus posts no Medium para que cada informação seja exibida corretamente no nosso view
  **Exemplo:**
  O Medium permite adicionar até 4 categorias em cada post, mas em nossa aplicação consideramos apenas a 1ª categoria, sendo assim, das 4 categorias que você colocar no seu post, considere que a primeira será a exibida em nossa aplicação.
