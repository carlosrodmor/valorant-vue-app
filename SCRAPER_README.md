# Scraper de Estadísticas de Valorant - op.gg

Este sistema te permite scrapear automáticamente las estadísticas de Valorant desde [op.gg](https://op.gg/valorant/statistics) y almacenarlas en MongoDB para su posterior análisis.

## 🚀 Características

- **Scraping automático** de estadísticas de agentes, mapas y armas
- **Almacenamiento en MongoDB** con estructura organizada
- **Scheduler semanal** para actualizaciones automáticas
- **Interfaz modular** para integrar con tu aplicación Vue
- **Manejo de errores** robusto con reintentos
- **Logging detallado** para debugging y monitoreo

## 📦 Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto con:

```env
# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=valorant_stats

# Configuración del Scraper
OPGG_BASE_URL=https://op.gg/valorant/statistics
SCRAPER_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36

# Configuración de logs
LOG_LEVEL=info
LOG_FILE=logs/scraper.log

# Configuración del scheduler
CRON_SCHEDULE=0 3 * * 1
TIMEZONE=Europe/Madrid
```

3. **Configurar MongoDB:**

Si usas MongoDB local:

```bash
# Instalar MongoDB
# En Windows:
winget install MongoDB.Server

# En macOS:
brew install mongodb/brew/mongodb-community

# Iniciar el servicio
mongod
```

Si usas MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/valorant_stats?retryWrites=true&w=majority
```

## 🎯 Uso

### Ejecutar Scraping Manual

```bash
# Scrapear todos los datos
npm run scraper

# Scrapear solo agentes
npm run scraper agents

# Scrapear solo mapas
npm run scraper maps

# Scrapear solo armas
npm run scraper weapons
```

### Activar Scheduler Automático

```bash
# Iniciar scheduler (ejecuta cada lunes a las 3:00 AM)
npm run scheduler

# Ejecutar scraping inmediatamente
npm run scheduler -- --run-now
```

### Integración en Vue

```typescript
// En tu componente Vue
import { opggService } from '@/services/opggService'

export default {
  async mounted() {
    // Obtener datos más recientes
    const latestData = await opggService.getLatestData()

    // Obtener agentes ordenados por pick rate
    const agents = await opggService.getAgentStats()
    const topAgents = OpggService.getTopAgentsByPickRate(agents, 5)

    // Comparar dos semanas
    const comparison = await opggService.compareWeeks('2024-W01', '2024-W02')
  }
}
```

## 📊 Estructura de Datos

### OpggAgentStats

```typescript
interface OpggAgentStats {
  agentName: string // "Jett", "Sage", etc.
  agentIcon: string // URL del icono
  tier: string // "S", "A", "B", etc.
  pickRate: string // "23.5%"
  winRate: string // "51.2%"
  avgKDA: string // "1.32"
  avgScore: string // "245"
  avgDamage: string // "167"
}
```

### OpggMapStats

```typescript
interface OpggMapStats {
  mapName: string // "Bind", "Haven", etc.
  mapIcon: string // URL del icono
  pickRate: string // "15.3%"
  winRateAttack: string // "49.2%"
  winRateDefense: string // "50.8%"
  avgRounds: string // "24.1"
}
```

### OpggWeaponStats

```typescript
interface OpggWeaponStats {
  weaponName: string // "Vandal", "Phantom", etc.
  weaponIcon: string // URL del icono
  pickRate: string // "34.7%"
  killRate: string // "67.3%"
  headshotRate: string // "22.1%"
  avgDamage: string // "156"
}
```

## 🗄️ Estructura de MongoDB

### Colecciones creadas:

- `scraped_data`: Datos completos por semana
- `agent_stats`: Estadísticas de agentes separadas
- `map_stats`: Estadísticas de mapas separadas
- `weapon_stats`: Estadísticas de armas separadas

### Índices automáticos:

- Por semana (`week`)
- Por fecha de scraping (`scrapedAt`)
- Por nombre de agente/mapa/arma

## ⚙️ Configuración Avanzada

### Personalizar Selectores CSS

Si op.gg cambia su estructura, puedes ajustar los selectores en `src/scraper/opgg-scraper.ts`:

```typescript
// Ejemplo para agentes
const agentName = $row.find('.agent-name, [data-agent-name], .name').text().trim()
const pickRate = $row.find('.pick-rate, [data-pick-rate]').text().trim()
```

### Modificar Horario del Scheduler

Edita el cron expression en `.env`:

```env
# Cada lunes a las 3:00 AM
CRON_SCHEDULE=0 3 * * 1

# Cada día a las 2:00 AM
CRON_SCHEDULE=0 2 * * *

# Cada hora
CRON_SCHEDULE=0 * * * *
```

### Añadir Notificaciones

En `src/scraper/scheduler.ts`, puedes implementar notificaciones:

```typescript
private async sendErrorNotification(error: unknown): Promise<void> {
  // Discord webhook
  await fetch('https://discord.com/api/webhooks/...', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `❌ Error en scraper: ${error}`
    })
  });
}
```

## 🔧 Solución de Problemas

### Error de conexión a MongoDB

```bash
Error: MongoNetworkError: failed to connect to server
```

**Solución:** Verificar que MongoDB esté ejecutándose y la URI sea correcta.

### No se extraen datos

```bash
⚠️ No se extrajeron datos. Verificar selectores CSS.
```

**Solución:** op.gg cambió su estructura. Actualizar selectores en `opgg-scraper.ts`.

### Scheduler no funciona

```bash
❌ Cron expression inválida
```

**Solución:** Verificar formato del CRON_SCHEDULE en `.env`.

## 📈 Monitoreo

### Logs del Scheduler

```bash
# Ver logs en tiempo real
tail -f logs/scraper.log

# Ver status del scheduler
npm run scheduler
```

### Verificar Datos en MongoDB

```bash
# Conectar a MongoDB
mongosh

# Usar base de datos
use valorant_stats

# Ver últimos datos
db.scraped_data.find().sort({scrapedAt: -1}).limit(1)

# Contar registros por semana
db.agent_stats.aggregate([
  { $group: { _id: "$week", count: { $sum: 1 } } }
])
```

## 🤝 Contribuir

1. Crea un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Notas Importantes

- **Rate Limiting:** El scraper incluye delays para no sobrecargar op.gg
- **Robustez:** Sistema de reintentos automáticos en caso de fallos
- **Escalabilidad:** Diseño modular para fácil extensión
- **Mantenimiento:** Selectores CSS pueden requerir actualización si op.gg cambia su diseño

## 🚨 Consideraciones Legales

- Respeta los términos de servicio de op.gg
- Usa delays apropiados entre requests
- No hagas scraping excesivo que pueda afectar su servicio
- Este código es para uso educativo y personal

## 📞 Soporte

Si encuentras problemas:

1. Verifica la configuración de `.env`
2. Revisa los logs en `logs/scraper.log`
3. Comprueba que MongoDB esté funcionando
4. Verifica que op.gg sea accesible

¡Happy scraping! 🚀
