import { computed } from "vue";

/**
 * Composable para manejar la configuración de la aplicación
 * desde variables de entorno
 */
export function useAppConfig() {
  // Configuración de la aplicación
  const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || "Tactical Nexus");
  const appDescription = computed(
    () => import.meta.env.VITE_APP_DESCRIPTION || "Datos y Estadísticas de VALORANT"
  );

  // Configuración de APIs
  const apiConfig = computed(() => ({
    henrikApiKey: import.meta.env.VITE_HENRIK_API_KEY,
    valorantApiBase: import.meta.env.VITE_VALORANT_API_BASE || "https://valorant-api.com/v1",
    henrikApiBase: import.meta.env.VITE_HENRIK_API_BASE || "https://api.henrikdev.xyz/valorant",
  }));

  // Verificar si la configuración está completa
  const isConfigValid = computed(() => {
    const config = apiConfig.value;
    return !!(config.henrikApiKey && config.valorantApiBase && config.henrikApiBase);
  });

  // Lista de variables faltantes para debugging
  const missingVariables = computed(() => {
    const missing: string[] = [];

    if (!import.meta.env.VITE_HENRIK_API_KEY) {
      missing.push("VITE_HENRIK_API_KEY");
    }
    if (!import.meta.env.VITE_VALORANT_API_BASE) {
      missing.push("VITE_VALORANT_API_BASE");
    }
    if (!import.meta.env.VITE_HENRIK_API_BASE) {
      missing.push("VITE_HENRIK_API_BASE");
    }

    return missing;
  });

  // Función para loggear la configuración en desarrollo
  const logConfig = () => {
    if (import.meta.env.DEV) {
      console.group("🔧 Configuración de la aplicación");
      console.log("📱 App:", {
        title: appTitle.value,
        description: appDescription.value,
      });
      console.log("🌐 APIs:", apiConfig.value);
      console.log("✅ Configuración válida:", isConfigValid.value);

      if (!isConfigValid.value) {
        console.warn("⚠️ Variables faltantes:", missingVariables.value);
        console.info(
          "💡 Revisa el archivo .env y asegúrate de tener todas las variables configuradas"
        );
      }

      console.groupEnd();
    }
  };

  return {
    appTitle,
    appDescription,
    apiConfig,
    isConfigValid,
    missingVariables,
    logConfig,
  };
}
