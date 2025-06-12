import axios, { type AxiosResponse, type AxiosError } from "axios";
import * as cheerio from "cheerio";
import type { OpggAgentStats, OpggMapStats, OpggWeaponStats, OpggScrapedData } from "../types";
import { SCRAPER_CONFIG } from "./config";

export class OpggScraper {
  private readonly baseUrl: string;
  private readonly userAgent: string;
  private readonly requestDelay: number;
  private readonly retryAttempts: number;
  private readonly timeout: number;
  private readonly maxConcurrentRequests: number;
  private activeRequests: number = 0;

  constructor() {
    this.baseUrl = SCRAPER_CONFIG.BASE_URL;
    this.userAgent = SCRAPER_CONFIG.USER_AGENT;
    this.requestDelay = SCRAPER_CONFIG.REQUEST_DELAY;
    this.retryAttempts = SCRAPER_CONFIG.RETRY_ATTEMPTS;
    this.timeout = SCRAPER_CONFIG.TIMEOUT;
    this.maxConcurrentRequests = SCRAPER_CONFIG.MAX_CONCURRENT_REQUESTS;

    // Validar configuración
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.baseUrl || !this.baseUrl.startsWith("https://")) {
      throw new Error("Base URL debe ser HTTPS para seguridad");
    }

    if (this.requestDelay < 1000) {
      console.warn("Request delay muy bajo, puede causar rate limiting");
    }
  }

  private async makeRequest(url: string): Promise<string> {
    // Control de concurrencia
    if (this.activeRequests >= this.maxConcurrentRequests) {
      await this.delay(this.requestDelay);
    }

    // Validar URL antes de hacer request
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.protocol.startsWith("https")) {
        throw new Error("Solo se permiten URLs HTTPS");
      }
    } catch (error) {
      throw new Error(`URL inválida: ${url}`);
    }

    this.activeRequests++;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 Realizando request a: ${this.sanitizeUrl(url)} (intento ${attempt})`);

        const response: AxiosResponse<string> = await axios.get(url, {
          headers: {
            "User-Agent": this.userAgent,
            ...SCRAPER_CONFIG.ADDITIONAL_HEADERS,
          },
          timeout: this.timeout,
          maxRedirects: 3, // Limitar redirects
          validateStatus: (status) => status >= 200 && status < 300, // Solo aceptar 2xx
          maxContentLength: 10 * 1024 * 1024, // Máximo 10MB
          decompress: true,
        });

        console.log(`✅ Request exitoso (${response.status}) - ${response.data.length} bytes`);

        // Validar contenido básico
        if (!response.data || response.data.length < 100) {
          throw new Error("Respuesta vacía o muy pequeña");
        }

        // Delay entre requests para no sobrecargar el servidor
        if (attempt < this.retryAttempts) {
          await this.delay(this.requestDelay);
        }

        this.activeRequests--;
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`❌ Error en intento ${attempt}:`, {
          message: axiosError.message,
          status: axiosError.response?.status,
          url: this.sanitizeUrl(url),
        });

        if (attempt === this.retryAttempts) {
          this.activeRequests--;
          throw new Error(
            `Failed to fetch ${this.sanitizeUrl(url)} after ${this.retryAttempts} attempts: ${
              axiosError.message
            }`
          );
        }

        // Esperar más tiempo antes del siguiente intento (backoff exponencial)
        await this.delay(this.requestDelay * Math.pow(2, attempt - 1));
      }
    }

    this.activeRequests--;
    throw new Error("Unexpected error in makeRequest");
  }

  private sanitizeUrl(url: string): string {
    // Ocultar parámetros sensibles en logs
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.origin}${parsedUrl.pathname}`;
    } catch {
      return "[URL inválida]";
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getWeekString(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/[<>\"'&]/g, "") // Remover caracteres peligrosos
      .trim()
      .substring(0, 200); // Limitar longitud
  }

  private validateImageUrl(url: string): string {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url, this.baseUrl);
      // Solo permitir URLs de op.gg o HTTPS
      if (parsedUrl.hostname.includes("op.gg") || parsedUrl.protocol === "https:") {
        return parsedUrl.toString();
      }
    } catch {
      // URL inválida
    }

    return "";
  }

  async scrapeAgentStats(): Promise<OpggAgentStats[]> {
    try {
      console.log("🎯 Scrapeando estadísticas de agentes...");
      const html = await this.makeRequest(`${this.baseUrl}/agents`);
      const $ = cheerio.load(html);
      const agents: OpggAgentStats[] = [];

      // Buscar la tabla o contenedor de estadísticas de agentes
      $(".agent-statistics-table tr, .agent-stats-row, [data-agent-name]").each(
        (index, element) => {
          try {
            const $row = $(element);

            // Extraer datos del agente (ajusta los selectores según la estructura real)
            const agentName = this.sanitizeText(
              $row.find(".agent-name, [data-agent-name], .name").text()
            );
            const agentIcon = this.validateImageUrl(
              $row.find(".agent-icon img, .icon img").attr("src") || ""
            );
            const tier = this.sanitizeText($row.find(".tier, .rank, .rating").text());
            const pickRate = this.sanitizeText($row.find(".pick-rate, [data-pick-rate]").text());
            const winRate = this.sanitizeText($row.find(".win-rate, [data-win-rate]").text());
            const avgKDA = this.sanitizeText($row.find(".kda, .avg-kda, [data-kda]").text());
            const avgScore = this.sanitizeText(
              $row.find(".score, .avg-score, [data-score]").text()
            );
            const avgDamage = this.sanitizeText(
              $row.find(".damage, .avg-damage, [data-damage]").text()
            );

            if (agentName && pickRate && winRate) {
              agents.push({
                agentName,
                agentIcon,
                tier,
                pickRate,
                winRate,
                avgKDA,
                avgScore,
                avgDamage,
              });
            }
          } catch (error) {
            console.warn(
              `⚠️ Error procesando fila de agente:`,
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        }
      );

      if (agents.length === 0) {
        console.warn("⚠️ No se encontraron agentes, posible cambio en la estructura del sitio");
      }

      console.log(`✅ ${agents.length} agentes extraídos`);
      return agents;
    } catch (error) {
      console.error(
        "❌ Error scrapeando estadísticas de agentes:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  async scrapeMapStats(): Promise<OpggMapStats[]> {
    try {
      console.log("🗺️ Scrapeando estadísticas de mapas...");
      const html = await this.makeRequest(`${this.baseUrl}/maps`);
      const $ = cheerio.load(html);
      const maps: OpggMapStats[] = [];

      $(".map-statistics-table tr, .map-stats-row, [data-map-name]").each((index, element) => {
        try {
          const $row = $(element);

          const mapName = this.sanitizeText($row.find(".map-name, [data-map-name], .name").text());
          const mapIcon = this.validateImageUrl(
            $row.find(".map-icon img, .icon img").attr("src") || ""
          );
          const pickRate = this.sanitizeText($row.find(".pick-rate, [data-pick-rate]").text());
          const winRateAttack = this.sanitizeText(
            $row.find(".win-rate-attack, [data-win-rate-attack]").text()
          );
          const winRateDefense = this.sanitizeText(
            $row.find(".win-rate-defense, [data-win-rate-defense]").text()
          );
          const avgRounds = this.sanitizeText($row.find(".avg-rounds, [data-avg-rounds]").text());

          if (mapName && pickRate) {
            maps.push({
              mapName,
              mapIcon,
              pickRate,
              winRateAttack,
              winRateDefense,
              avgRounds,
            });
          }
        } catch (error) {
          console.warn(
            `⚠️ Error procesando fila de mapa:`,
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      });

      if (maps.length === 0) {
        console.warn("⚠️ No se encontraron mapas, posible cambio en la estructura del sitio");
      }

      console.log(`✅ ${maps.length} mapas extraídos`);
      return maps;
    } catch (error) {
      console.error(
        "❌ Error scrapeando estadísticas de mapas:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  async scrapeWeaponStats(): Promise<OpggWeaponStats[]> {
    try {
      console.log("🔫 Scrapeando estadísticas de armas...");
      const html = await this.makeRequest(`${this.baseUrl}/weapons`);
      const $ = cheerio.load(html);
      const weapons: OpggWeaponStats[] = [];

      $(".weapon-statistics-table tr, .weapon-stats-row, [data-weapon-name]").each(
        (index, element) => {
          try {
            const $row = $(element);

            const weaponName = this.sanitizeText(
              $row.find(".weapon-name, [data-weapon-name], .name").text()
            );
            const weaponIcon = this.validateImageUrl(
              $row.find(".weapon-icon img, .icon img").attr("src") || ""
            );
            const pickRate = this.sanitizeText($row.find(".pick-rate, [data-pick-rate]").text());
            const killRate = this.sanitizeText($row.find(".kill-rate, [data-kill-rate]").text());
            const headshotRate = this.sanitizeText(
              $row.find(".headshot-rate, [data-headshot-rate]").text()
            );
            const avgDamage = this.sanitizeText(
              $row.find(".damage, .avg-damage, [data-damage]").text()
            );

            if (weaponName && pickRate) {
              weapons.push({
                weaponName,
                weaponIcon,
                pickRate,
                killRate,
                headshotRate,
                avgDamage,
              });
            }
          } catch (error) {
            console.warn(
              `⚠️ Error procesando fila de arma:`,
              error instanceof Error ? error.message : "Unknown error"
            );
          }
        }
      );

      if (weapons.length === 0) {
        console.warn("⚠️ No se encontraron armas, posible cambio en la estructura del sitio");
      }

      console.log(`✅ ${weapons.length} armas extraídas`);
      return weapons;
    } catch (error) {
      console.error(
        "❌ Error scrapeando estadísticas de armas:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  async scrapeAllData(): Promise<OpggScrapedData> {
    try {
      console.log("🚀 Iniciando scraping completo de op.gg...");

      // Usar la página principal que contiene todos los datos
      const scrapedData = await this.scrapeMainStatistics();

      console.log("✅ Scraping completo finalizado");
      console.log(
        `📊 Resumen: ${scrapedData.agents.length} agentes, ${scrapedData.maps.length} mapas, ${scrapedData.weapons.length} armas`
      );

      return scrapedData;
    } catch (error) {
      console.error("❌ Error en scraping completo:", error);
      throw error;
    }
  }

  // Método para scraper datos específicos de la página principal
  async scrapeMainStatistics(): Promise<OpggScrapedData> {
    try {
      console.log("📊 Scrapeando estadísticas principales...");
      const html = await this.makeRequest(this.baseUrl);
      const $ = cheerio.load(html);

      const agents: OpggAgentStats[] = [];
      const maps: OpggMapStats[] = [];
      const weapons: OpggWeaponStats[] = [];

      // Buscar la tabla principal de estadísticas de composición/agentes
      // Basado en la estructura que vimos en la búsqueda web
      $("table tr, tbody tr").each((index, element) => {
        try {
          const $row = $(element);

          // Skip header rows
          if ($row.find("th").length > 0) return;

          const cells = $row.find("td");
          if (cells.length < 5) return; // Necesitamos al menos varias columnas

          // Extraer datos del agente basado en la estructura de op.gg
          const agentNameElement = $row.find('a[href*="/valorant/agents/"], [href*="/agents/"]');
          const agentName =
            agentNameElement.text().trim() || $row.find("td:nth-child(2)").text().trim();

          if (!agentName || agentName.includes("%") || agentName.includes("#")) return;

          // Buscar icono del agente
          const agentIcon = $row.find("img").first().attr("src") || "";

          // Extraer estadísticas (ajustar índices según la estructura real)
          const winRate = $row.find("td").eq(2).text().trim(); // Win rate column
          const pickRate = $row.find("td").eq(3).text().trim(); // Pick rate column
          const kda = $row.find("td").eq(4).text().trim(); // KDA column
          const avgScore = $row.find("td").eq(6).text().trim(); // Avg score column

          // Extraer role/tier si está disponible
          const roleElement = $row.find(
            '[class*="role"], [class*="duelist"], [class*="controller"], [class*="initiator"], [class*="sentinel"]'
          );
          const tier = roleElement.text().trim() || "Unknown";

          if (agentName && (winRate.includes("%") || pickRate.includes("%"))) {
            agents.push({
              agentName,
              agentIcon: agentIcon.startsWith("/") ? `https://op.gg${agentIcon}` : agentIcon,
              tier,
              pickRate,
              winRate,
              avgKDA: kda,
              avgScore,
              avgDamage: "", // No disponible en la tabla principal
            });
          }
        } catch (error) {
          console.warn(`⚠️ Error procesando fila:`, error);
        }
      });

      // También buscar datos específicos con selectores más específicos
      $('[href*="/valorant/agents/"]').each((index, element) => {
        try {
          const $link = $(element);
          const $row = $link.closest('tr, [class*="row"]');

          const agentName = $link.text().trim();
          const agentIcon = $row.find("img").first().attr("src") || "";

          // Buscar estadísticas en la misma fila
          const stats = $row
            .find("td")
            .map((i, el) => $(el).text().trim())
            .get();

          if (agentName && stats.length >= 3) {
            const existingAgent = agents.find((a) => a.agentName === agentName);
            if (!existingAgent) {
              // Extraer estadísticas de las columnas
              const winRate = stats.find((s) => s.includes("%") && parseFloat(s) < 100) || "";
              const pickRate = stats.find((s) => s.includes("%") && parseFloat(s) >= 0) || "";

              agents.push({
                agentName,
                agentIcon: agentIcon.startsWith("/") ? `https://op.gg${agentIcon}` : agentIcon,
                tier: "Unknown",
                pickRate,
                winRate,
                avgKDA: stats[4] || "",
                avgScore: stats[6] || "",
                avgDamage: "",
              });
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error procesando agente:`, error);
        }
      });

      console.log(`✅ Extraídos ${agents.length} agentes de la página principal`);

      return {
        agents,
        maps, // Por ahora vacío, se puede expandir
        weapons, // Por ahora vacío, se puede expandir
        scrapedAt: new Date(),
        week: this.getWeekString(),
      };
    } catch (error) {
      console.error("❌ Error scrapeando estadísticas principales:", error);
      throw error;
    }
  }
}
