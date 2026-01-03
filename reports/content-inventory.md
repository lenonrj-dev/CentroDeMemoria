# Inventário de Conteúdo (site x admin schema)

Gerado em: 2025-12-17T19:43:24.966Z

Observação: itens do MongoDB (backend) estão listados quando existirem; caso contrário, o site usa fallbacks locais do frontend.

## Documentos

Rotas públicas (lista): /acervo/documentos  |  /{locale}/acervo/documentos

- Backend (MongoDB): 0
- Fallback (frontend): 10

| origem | título | slug | onde aparece | fonte | observações |
|---|---|---|---|---|---|
| fallback | Ata de Assembleia – Setembro de 1961 | ata-1961-09 | /acervo/documentos/ata-1961-09 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Ofício ao Ministério do Trabalho – Fevereiro de 1958 | oficio-1958-02 | /acervo/documentos/oficio-1958-02 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Relatório de Gestão – 1965 | relatorio-1965 | /acervo/documentos/relatorio-1965 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Cartaz de Mobilização – 1979 | 1979-mob | /acervo/cartazes/1979-mob | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Cartaz – Assembleia Geral 1984 | 1984-assembleia | /acervo/cartazes/1984-assembleia | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Cartaz – 1º de Maio 1972 | 1972-1maio | /acervo/cartazes/1972-1maio | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Ata de Assembleia – 1961 | volta-redonda-documentos-1961-09-18 | /acervo/volta-redonda/documentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Relatório de Gestão – 1965 | volta-redonda-documentos-1965-12-20 | /acervo/volta-redonda/documentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Ofício ao MT – 1958 | barra-mansa-documentos-1958-02-09 | /acervo/barra-mansa/documentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Ata de assembleia – 1950 | barra-mansa-documentos-1950-11-14 | /acervo/barra-mansa/documentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |

## Depoimentos

Rotas públicas (lista): /acervo/entrevistas  |  /{locale}/acervo/entrevistas

- Backend (MongoDB): 0
- Fallback (frontend): 6

| origem | título | slug | onde aparece | fonte | observações |
|---|---|---|---|---|---|
| fallback | Entrevista com M. Santos – 1983 | m-santos-1983 | /acervo/entrevistas/m-santos-1983 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Entrevista com A. Oliveira – 1978 | a-oliveira-1978 | /acervo/entrevistas/a-oliveira-1978 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Entrevista com M. Santos – 1983 | volta-redonda-depoimentos-1983-11-02 | /acervo/volta-redonda/depoimentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Depoimento A. Oliveira – 1978 | volta-redonda-depoimentos-1978-06-15 | /acervo/volta-redonda/depoimentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Depoimento A. Oliveira – 1978 | barra-mansa-depoimentos-1978-06-15 | /acervo/barra-mansa/depoimentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Relato comunitário – 1980 | barra-mansa-depoimentos-1980-01-01 | /acervo/barra-mansa/depoimentos | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |

## Referência bibliográfica

Rotas públicas (lista): /producao-bibliografica  |  /{locale}/producao-bibliografica

- Backend (MongoDB): 0
- Fallback (frontend): 10

| origem | título | slug | onde aparece | fonte | observações |
|---|---|---|---|---|---|
| fallback | Clipping VR – anos 80 | volta-redonda-referencia-bibliografica-1980-01-01 | /acervo/volta-redonda/referencia-bibliografica | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Bibliografia básica | volta-redonda-referencia-bibliografica-1985-01-01 | /acervo/volta-redonda/referencia-bibliografica | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Clipping BM – década de 80 | barra-mansa-referencia-bibliografica-1985-01-01 | /acervo/barra-mansa/referencia-bibliografica | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Bibliografia básica | barra-mansa-referencia-bibliografica-1990-01-01 | /acervo/barra-mansa/referencia-bibliografica | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | MemÃ³ria operÃ¡ria e espaÃ§o urbano | memoria-operaria-espaco-urbano | /producao-bibliografica | `frontend/app/api/content/production/data.ts` | Href de detalhe declarado: /producao-bibliografica/memoria-operaria-espaco-urbano \| Link de detalhe sem página: /producao-bibliografica/memoria-operaria-espaco-urbano |
| fallback | InventÃ¡rio do acervo fotogrÃ¡fico 1940â€“1970 | inventario-acervo-fotografico | /producao-bibliografica | `frontend/app/api/content/production/data.ts` | Href de detalhe declarado: /producao-bibliografica/inventario-acervo-fotografico \| Link de detalhe sem página: /producao-bibliografica/inventario-acervo-fotografico |
| fallback | Sindicalismo e habitaÃ§Ã£o popular | sindicalismo-habitacao-popular | /producao-bibliografica | `frontend/app/api/content/production/data.ts` | Href de detalhe declarado: /producao-bibliografica/sindicalismo-habitacao-popular \| Link de detalhe sem página: /producao-bibliografica/sindicalismo-habitacao-popular |
| fallback | Guia de digitalizaÃ§Ã£o e restauraÃ§Ã£o | guia-digitalizacao | /producao-bibliografica | `frontend/app/api/content/production/data.ts` | Href de detalhe declarado: /producao-bibliografica/guia-digitalizacao \| Link de detalhe sem página: /producao-bibliografica/guia-digitalizacao |
| fallback | Boletins sindicais: uma leitura histÃ³rica | boletins-leitura-historica | /producao-bibliografica | `frontend/app/api/content/production/data.ts` | Href de detalhe declarado: /producao-bibliografica/boletins-leitura-historica \| Link de detalhe sem página: /producao-bibliografica/boletins-leitura-historica |
| fallback | Mapeamento de comissÃµes de fÃ¡brica (1960â€“1980) | comissoes-fabrica-mapeamento | /producao-bibliografica | `frontend/app/api/content/production/data.ts` | Href de detalhe declarado: /producao-bibliografica/comissoes-fabrica-mapeamento \| Link de detalhe sem página: /producao-bibliografica/comissoes-fabrica-mapeamento |

## Jornais de época

Rotas públicas (lista): /jornais-de-epoca  |  /{locale}/jornais-de-epoca

- Backend (MongoDB): 0
- Fallback (frontend): 11

| origem | título | slug | onde aparece | fonte | observações |
|---|---|---|---|---|---|
| fallback | Boletim Operário – Março de 1952 | 1952-03 | /acervo/boletins/1952-03 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Boletim Operário – Julho de 1953 | 1953-07 | /acervo/boletins/1953-07 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Boletim Operário – Novembro de 1950 | 1950-11 | /acervo/boletins/1950-11 | `frontend/app/acervo/api.ts` | Mock local usado quando o backend falha (ou em páginas de detalhe via fallback). |
| fallback | Boletim Operário – 1952 | volta-redonda-jornais-de-epoca-1952-03-10 | /acervo/volta-redonda/jornais-de-epoca | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Edição histórica – 1953 | volta-redonda-jornais-de-epoca-1953-07-05 | /acervo/volta-redonda/jornais-de-epoca | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Edição histórica – 1937 | barra-mansa-jornais-de-epoca-1937-07-17 | /acervo/barra-mansa/jornais-de-epoca | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Boletim local – 1953 | barra-mansa-jornais-de-epoca-1953-07-05 | /acervo/barra-mansa/jornais-de-epoca | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | O Operário | o-operario-1913-05-12 | /jornais-de-epoca/o-operario-1913-05-12 | `frontend/app/api/content/journals/data.ts` | Lista local (fallback) usada na landing de jornais quando o backend falha; o leitor usa o backend. |
| fallback | Folha do Trabalhador | folha-trabalhador-1921-09-03 | /jornais-de-epoca/folha-trabalhador-1921-09-03 | `frontend/app/api/content/journals/data.ts` | Lista local (fallback) usada na landing de jornais quando o backend falha; o leitor usa o backend. |
| fallback | Gazeta Sindical | gazeta-sindical-1932-02-28 | /jornais-de-epoca/gazeta-sindical-1932-02-28 | `frontend/app/api/content/journals/data.ts` | Lista local (fallback) usada na landing de jornais quando o backend falha; o leitor usa o backend. |
| fallback | O Dia do Povo | o-dia-do-povo-1937-07-17 | /jornais-de-epoca/o-dia-do-povo-1937-07-17 | `frontend/app/api/content/journals/data.ts` | Lista local (fallback) usada na landing de jornais quando o backend falha; o leitor usa o backend. |

## Acervo fotográfico

Rotas públicas (lista): /acervo/fotos  |  /{locale}/acervo/fotos

- Backend (MongoDB): 0
- Fallback (frontend): 5

| origem | título | slug | onde aparece | fonte | observações |
|---|---|---|---|---|---|
| fallback | Pátio da fábrica – 1948 | volta-redonda-acervo-fotografico-1948-06-01 | /acervo/volta-redonda/acervo-fotografico | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Assembleia na praça | volta-redonda-acervo-fotografico-1950-01-01 | /acervo/volta-redonda/acervo-fotografico | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Registro de assembleia | barra-mansa-acervo-fotografico-1950-01-01 | /acervo/barra-mansa/acervo-fotografico | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Cena urbana | barra-mansa-acervo-fotografico-1948-06-01 | /acervo/barra-mansa/acervo-fotografico | `frontend/app/acervo/cityData.ts` | Cards de exemplo por cidade; não são páginas de item individual. |
| fallback | Funcionários da siderúrgica | siderurgica-1950-equipe | /acervo/fotos/siderurgica-1950-equipe | `frontend/app/acervo/fotos/PhotosGalleryClient.tsx` | Fallback usado quando a API /api/acervo-fotografico retorna vazio. |
