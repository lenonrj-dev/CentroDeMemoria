# Error Catalog

## Error Contract
All API errors follow the same shape:

- status: number
- code: string
- message: string
- details: object (optional)
- requestId: string
- timestamp: ISO string
- path: string
- method: string

## Codes
| code | status | when | user message | action |
| --- | --- | --- | --- | --- |
| AUTH_REQUIRED | 401 | Token missing/expired | "Sessao expirada. Faca login novamente." | Login again |
| FORBIDDEN | 403 | Role not allowed | "Acesso negado." | Check permissions |
| INVALID_PAYLOAD | 400 | Empty body / invalid JSON | "JSON invalido" or "Corpo da requisicao vazio." | Fix request body |
| VALIDATION_ERROR | 422 | Field validation failed | "Campos invalidos" | Fix fields in details.fieldErrors |
| NOT_FOUND | 404 | Resource not found | "Conteudo nao encontrado." | Check ID/slug |
| CONFLICT | 409 | Slug already exists | "Ja existe um <tipo> com esse slug." | Use another slug |
| UNSUPPORTED_MEDIA | 415 | Wrong Content-Type | "Content-Type deve ser application/json." | Send JSON |
| RATE_LIMIT | 429 | Too many requests | "Limite de requisicoes excedido." | Retry later |
| DB_ERROR | 500 | Database error | "Falha de validacao no banco." | Check logs |
| EXTERNAL_API_ERROR | 502 | External API failure | "Falha ao consultar servico externo." | Retry or contact support |
| INTERNAL_ERROR | 500 | Unexpected error | "Erro interno. Tente novamente." | Retry with requestId |

## Examples

### POST /api/admin/depoimentos
- Missing auth -> 401 AUTH_REQUIRED
- Invalid youtubeUrl -> 422 VALIDATION_ERROR
  - details.fieldErrors.youtubeUrl = "Link do YouTube invalido. Cole uma URL valida."
- Duplicate slug -> 409 CONFLICT
  - message: "Ja existe um depoimento com esse slug."
  - details.fieldErrors.slug = "Slug ja existe. Use outro."

### POST /api/admin/entrevistas
- Same rules as depoimentos (alias endpoint)

## Client handling
- Show error.message + requestId (when available).
- Render fieldErrors near the form or in a summary list.
- For 401, clear token and redirect to login.
