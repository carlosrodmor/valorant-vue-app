# Valorant Stats App

Aplicación web para visualizar estadísticas de agentes, mapas y armas de Valorant, con datos extraídos automáticamente desde op.gg.

## Características

- 📊 Visualización de estadísticas de agentes, mapas y armas
- 🤖 Scraping automático de datos desde op.gg
- 📅 Almacenamiento histórico de datos por semana
- 📱 Diseño responsive adaptado a dispositivos móviles
- 🔍 Búsqueda y filtrado de datos
- 📈 Comparación de datos entre semanas

## Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (instalado localmente o conexión a una instancia remota)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/TuUsuario/valorant-vue-app.git
cd valorant-vue-app
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```
MONGODB_URI=mongodb://localhost:27017/valorant-stats
PORT=3001
```

## Uso

### Ejecución de la aplicación completa (API + Frontend)

Para iniciar tanto el servidor API como la aplicación frontend:

```bash
npm run start
```

Esto ejecutará:

- El servidor API en http://localhost:3001
- La aplicación Vue.js en http://localhost:5173

### Ejecución del scraper

Para ejecutar el scraper y obtener datos actualizados:

```bash
npm run scraper
```

### Ejecución del scheduler

Para ejecutar el programador de tareas que actualizará los datos automáticamente:

```bash
npm run scheduler
```

## Estructura del Proyecto

```
src/
├── components/         # Componentes Vue
├── scraper/            # Código del scraper
│   ├── config.ts       # Configuración del scraper
│   ├── database.ts     # Gestión de MongoDB
│   ├── index.ts        # Punto de entrada del scraper
│   ├── scheduler.ts    # Programador de tareas
│   └── op-gg.ts        # Lógica de scraping
├── server/             # Servidor API
│   └── api.ts          # Definición de endpoints
├── services/           # Servicios para el frontend
├── types/              # Tipos TypeScript
└── views/              # Vistas principales de Vue
```

## API Endpoints

- `GET /api/health` - Estado del servidor
- `GET /api/opgg/latest` - Obtener los datos más recientes
- `GET /api/opgg/agents` - Obtener estadísticas de agentes
- `GET /api/opgg/agents/:week` - Obtener estadísticas de agentes por semana
- `GET /api/opgg/maps` - Obtener estadísticas de mapas
- `GET /api/opgg/maps/:week` - Obtener estadísticas de mapas por semana
- `GET /api/opgg/weapons` - Obtener estadísticas de armas
- `GET /api/opgg/weapons/:week` - Obtener estadísticas de armas por semana
- `GET /api/opgg/weeks` - Obtener lista de semanas disponibles

## Tecnologías Utilizadas

- **Frontend:** Vue.js 3, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Base de datos:** MongoDB
- **Scraping:** Cheerio, Axios
- **Automatización:** Node-cron

## Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue para discutir los cambios que te gustaría hacer.
