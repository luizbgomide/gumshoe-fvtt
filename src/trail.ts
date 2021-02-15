import { registerSettings } from "./module/settings";
import { preloadTemplates } from "./module/preloadTemplates";
import { TrailActor } from "./module/TrailActor";
import { TrailItem } from "./module/TrailItem";
import { TrailActorSheetClass } from "./module/TrailActorSheetClass";
import { TrailItemSheetClass } from "./module/TrailItemSheetClass";
import { equipment, generalAbility, investigativeAbility, systemMigrationVersion, weapon } from "./constants";
import { generateTrailAbilitiesData } from "./generateTrailAbilitiesData";
import { TrailCombat } from "./module/TrailCombat";
import system from "./system.json";
import { migrateWorld } from "./migrations/migrateWorld";

// Initialize system
Hooks.once("init", async function () {
  console.log("trail-of-cthulhu-unsanctioned | Initializing system");
  // Assign custom classes and constants here

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // XXX TS needs going over here
  CONFIG.Actor.entityClass = (TrailActor as any);
  CONFIG.Item.entityClass = TrailItem;
  CONFIG.Combat.entityClass = TrailCombat;

  // Register custom sheets (if any)
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("trail-of-cthulhu-unsanctioned", TrailActorSheetClass, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(
    "trail-of-cthulhu-unsanctioned",
    TrailItemSheetClass,
    {
      makeDefault: true,
      types: [weapon, investigativeAbility, generalAbility, equipment],
    },
  );
});

// Setup system
Hooks.once("setup", function () {
  // Do anything after initialization but before
  // ready
});

// Migration hook
Hooks.on("ready", async () => {
  if (!game.user.isGM) { return; }

  const currentVersion = game.settings.get(system.name, systemMigrationVersion);
  const NEEDS_MIGRATION_VERSION = "1.0.0-alpha.2";
  const COMPATIBLE_MIGRATION_VERSION = "1.0.0-alpha.2";
  const needsMigration = isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if (!needsMigration) return;

  // warn users on old versions
  if (isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)) {
    const warning = `Your ${system.title} system data is from too old a version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`;
    ui.notifications.error(warning, { permanent: true });
  }

  // Perform the migration
  migrateWorld();
});

// CONFIG.debug.hooks = true;

(window as any).generateTrailAbilitiesData = generateTrailAbilitiesData;
