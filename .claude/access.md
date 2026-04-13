# Claude Access Playbook — Tour in Koh Samui Operations

> **Para Claude:** Este archivo dice qué accesos tenés, qué te falta, y cómo pedirlos. Léelo cuando te topes con un "no encuentro X" antes de dar la nota.
>
> **Para el usuario:** Esto es la checklist de credenciales para que cualquier sesión de Claude trabaje sin fricción. Llenala una vez y listo.

---

## 1. Filosofía

Claude Code no es una cuenta con "permisos". Es una CLI que hereda el entorno de tu máquina. Para que "tenga acceso a todo" hay que configurar **3 capas**:

1. **MCPs** (Model Context Protocol servers) — herramientas que Claude puede invocar
2. **Credenciales locales** — tokens en `.env` o CLIs autenticadas (`shopify login`, `gh auth login`)
3. **Documentación en el repo** — para que Claude sepa dónde buscar (este archivo + `CLAUDE.md`)

**Jamás** se commiteán tokens. `.env` está en `.gitignore`. Este archivo solo dice *dónde* van las credenciales, nunca *cuáles* son.

---

## 2. Inventario — qué está activo ahora

### ✅ Configurado y funcionando

| Servicio | Mecanismo | Uso típico |
|---|---|---|
| **GitHub (repo `tisaautomation/operations`)** | MCP (`mcp__github__*`) | Leer/crear PRs, issues, comentarios, ver commits. Scope limitado a este repo. |
| **Supabase** | MCP (`mcp__...__supabase`) | DB, migrations, edge functions. |
| **Vercel** | MCP | Deploys, logs, domains. |
| **Canva** | MCP | Generar diseños, exportar assets, brand kits. |
| **Google Calendar** | MCP | Agenda, eventos. |
| **Shopify Dev MCP** | MCP (`mcp__shopify-dev__*`) | **Docs oficiales de Liquid + Admin/Storefront/Functions GraphQL + validación de theme (`validate_theme`) y de GraphQL. Verificado en vivo — puede auditar theme completo.** |
| **Filesystem local** | Nativo | `Read`, `Write`, `Edit`, `Bash`. |
| **Internet** | Nativo | `WebFetch`, `WebSearch`. |
| **Sub-agentes** | `.claude/agents/*.md` | `code-reviewer`, `debugger`, `session-explorer`, `test-writer`. |

### ⚠️ Configurado parcialmente / necesita tokens

| Servicio | Qué falta | Cómo resolverlo |
|---|---|---|
| **Shopify Admin MCP** (leer/escribir productos, themes, colecciones vía API) | Package NPM no instalado + tokens no puestos | Ver §3 abajo |
| **Shopify CLI** (`shopify theme dev/push/pull`) | No instalado globalmente | `npm i -g @shopify/cli` y después `shopify login --store tourinkohsamui.myshopify.com` |
| **Playwright MCP** (browser automation — OBLIGATORIO para theme edits per §12c) | Declarado en `.mcp.json`, necesita aprobación del usuario + 1ª descarga de browser binaries (~300MB) | Ver §3b abajo |

### ❌ No configurado (cosas que hoy Claude NO puede hacer)

| Capacidad | Qué haría falta | Prioridad |
|---|---|---|
| Editar productos / colecciones directamente desde la sesión | Shopify Admin API token en `.env` + MCP activo | Media |
| Deploy del theme desde Claude | Shopify CLI instalado + `shopify login` | Media |
| Acceder a Shopify Analytics | Shopify Admin API con scope `read_analytics` | Baja |

---

## 3. Cómo darle a Claude acceso a Shopify (paso a paso)

### Paso 1 — Crear Admin API credentials en Shopify
1. Shopify admin → **Settings** → **Apps and sales channels** → **Develop apps**
2. **Create an app** → nombre: `Claude Operations`
3. **Configure Admin API scopes** — marcar al menos:
   - `read_themes`, `write_themes`
   - `read_products`, `write_products`
   - `read_content`, `write_content` (pages, blogs, files)
   - `read_locales`, `write_locales` (si usás multi-idioma)
   - `read_metaobjects`, `write_metaobjects`
4. **Install app** → copiar el **Admin API access token** (empieza con `shpat_`)

### Paso 2 — Crear `.env` local
```bash
cp .env.example .env
# Editá .env con los valores reales
```
Rellenar:
- `SHOPIFY_STORE_DOMAIN=tourinkohsamui.myshopify.com`
- `SHOPIFY_ADMIN_API_ACCESS_TOKEN=shpat_xxx...`

### Paso 3 — Instalar Shopify CLI localmente
```bash
npm install -g @shopify/cli @shopify/theme
shopify login --store tourinkohsamui.myshopify.com
```
Esto deja la sesión guardada en `~/.shopify/`. Claude detectará que `shopify` está en el PATH y lo usará.

### Paso 4 — Aprobar MCPs en Claude Code
La próxima vez que abras Claude Code en este repo, te prompteará:
> *"This project has a .mcp.json with 2 servers (shopify-dev, shopify-admin). Enable?"*

Aceptar. Los MCPs arrancan y Claude ya ve las herramientas de Shopify.

### Paso 5 — Verificar
En una sesión nueva, pedile a Claude:
> *"Listá los productos de la colección `private-tours`"*

Si responde con productos reales, está todo OK. Si dice "no tengo acceso", revisar que:
- `.env` tiene los valores correctos
- El token tiene los scopes necesarios
- El MCP aparece activo en Claude Code (slash command `/mcp`)

---

## 3b. Cómo activar Playwright MCP (browser testing)

### Paso 1 — Confirmar Node.js 20+
```bash
node --version   # debe mostrar v20.x.x o superior
```

### Paso 2 — Abrir Claude Code en el repo
Al detectar el `.mcp.json` actualizado, Claude Code va a promptear:
> *"This project's .mcp.json declares 3 MCP servers (shopify-dev, shopify-admin, playwright). Enable?"*

Aceptar. Playwright queda registrado.

### Paso 3 (opcional pero recomendado) — Instalar manualmente desde CLI
Si no aparece el prompt, corré:
```bash
claude mcp add playwright npx @playwright/mcp@latest
```
Esto persiste en `~/.claude.json` de tu usuario.

### Paso 4 — Primera ejecución: Playwright descarga Chromium
La primera vez que Claude invoque una herramienta de Playwright, el paquete descarga ~300MB de binarios de Chromium. Es **una sola vez por máquina**. Paciencia.

### Paso 5 — Verificar
En una sesión nueva, pedile a Claude:
> *"Tomá un screenshot de tourinkohsamui.com"*

Si responde con la imagen, está todo OK.

### Workflow obligatorio (per `CLAUDE.md §12c`) — Browser-Test Before Commit

Antes de aplicar cualquier cambio al theme:

```
1. Claude hace el cambio en un branch claude/*
2. shopify theme push --unpublished          # deploy a un theme no publicado
3. Playwright navega al preview URL:
   mcp__playwright__browser_navigate(url: "<preview-url>")
4. Playwright toma screenshot:
   mcp__playwright__browser_take_screenshot()
5. Claude compara visual antes/después contra producción
6. Si todo OK → usuario aprueba → merge a main → publish
7. Si algo cambió visualmente → revertir
```

### Herramientas que expone Playwright MCP (34 total)

Las más usadas para nuestro caso:
- `browser_navigate(url)` — ir a una URL
- `browser_take_screenshot()` — captura
- `browser_snapshot()` — accessibility tree (mejor que screenshot para ver estructura)
- `browser_click(element)` — click en un elemento
- `browser_fill_form(fields)` — llenar formulario (ideal para probar booking form)
- `browser_resize(width, height)` — simular mobile viewport (375×667 para iPhone)
- `browser_console_messages()` — ver errores de JS

## 4. Qué hacer si Claude dice "no encuentro X"

**Orden de búsqueda obligatorio** antes de dar "no lo encuentro":

1. ¿Está en el repo? → `Glob`, `Grep`, `Read`
2. ¿Está en el CDN público de Shopify? → `WebFetch` sobre `tourinkohsamui.com` o URLs `cdn.shopify.com/s/files/1/0708/1164/8194/...`
3. ¿Está en la documentación de Shopify? → MCP `shopify-dev` con `learn_shopify_api` + `search_docs_chunks` (✅ activo)
4. ¿Está en la Admin API? → MCP `shopify-admin` (si activo). Si NO está activo, leer §3 arriba y decirle al usuario qué le falta.
5. ¿Está en Supabase/Vercel/Canva? → usar el MCP correspondiente
6. ¿Está en la web pública? → `WebSearch` + `WebFetch`

**Solo** si las 6 fallan, responder "no lo encuentro, pero para resolverlo hace falta X". Nunca dar "no" a secas.

### Cómo usar el Shopify Dev MCP (workflow obligatorio)

1. **Primera llamada siempre:** `learn_shopify_api` con `api: "liquid"` (o `admin`, `storefront-graphql`, `functions`, etc.). Devuelve un `conversationId` que hay que **reusar** en todas las llamadas siguientes.
2. Para buscar docs: `search_docs_chunks(conversationId, prompt, api_name)`.
3. **Al crear/editar archivos del theme:** correr `validate_theme` contra el path absoluto del repo + lista de archivos tocados. Devuelve errores de Theme Check con fix sugerido.
4. Para GraphQL: `validate_graphql_codeblocks` antes de entregar cualquier query.
5. Para componentes Polaris / UI extensions: `validate_component_codeblocks`.

---

## 5. Archivos de referencia cruzada

| Archivo | Qué contiene |
|---|---|
| `CLAUDE.md` (root) | Brand, diseño, arquitectura del theme, convenciones |
| `.claude/CLAUDE.md` | Reglas de auto-trigger de subagentes |
| `.claude/access.md` (este) | Playbook de credenciales y MCPs |
| `.claude/agents/*.md` | Definiciones individuales de cada subagente |
| `.env.example` | Template de variables de entorno (sin valores) |
| `.env` | Valores reales — **gitignored, jamás se commitea** |
| `.mcp.json` | Declaración de MCPs del proyecto |
| `.gitignore` | Protege secretos y artefactos |

---

## 6. Quién tiene qué — responsabilidades

| Pieza | Quién la toca |
|---|---|
| `.env` real | **Solo el usuario** en su máquina |
| `.env.example` | Claude puede editar para documentar vars nuevas |
| Tokens en Shopify admin | **Solo el usuario** |
| `.mcp.json` | Claude puede proponer cambios, usuario aprueba |
| Claude Code config global (`~/.claude/settings.json`) | **Solo el usuario** — Claude no debe tocar |

---

*Mantenido por sesiones Claude. Última actualización: 2026-04-12.*
