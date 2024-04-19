import * as assert from "assert";

import {
  getConfig,
  updateConfig,
  getConfigValue,
  setupDefaults,
  enableAutomaticSwitching,
  disableAutomaticSwitching,
  disableAutomaticSwitchingOnManualThemeChange,
  switchToLightTheme,
  switchToDarkTheme,
  setSwitchToLightThemeTime,
  setSwitchToDarkThemeTime,
  setPreferredTheme,
  checkAndSwitchTheme,
  determineThemeBasedOnTime,
} from "../../configUtils";

suite("Soluna Utils Test Suite", () => {
  test("getConfig should return the workspace configuration", () => {
    const config = getConfig("");
    assert.ok(config);
  });

  test("setupDefaults should set default themes if not set", async () => {
    await setupDefaults();
    const lightTheme = getConfigValue("soluna", "preferredLightTheme");
    const darkTheme = getConfigValue("soluna", "preferredDarkTheme");
    assert.strictEqual(lightTheme, "Default Light+");
    assert.strictEqual(darkTheme, "Default Dark+");
  });

  test("switch to day theme", async () => {
    await switchToLightTheme();
    const currentTheme = getConfigValue("", "workbench.colorTheme");
    assert.strictEqual(currentTheme, "Default Light+");
  });

  test("switch to night theme", async () => {
    await switchToDarkTheme();
    const currentTheme = getConfigValue("", "workbench.colorTheme");
    assert.strictEqual(currentTheme, "Default Dark+");
  });

  test("enable automatic switching", async () => {
    await enableAutomaticSwitching();
    const isAutomaticSwitchingEnabled = getConfigValue("soluna", "automaticSwitching");
    assert.strictEqual(isAutomaticSwitchingEnabled, true);
  });

  test("disable automatic switching", async () => {
    await disableAutomaticSwitching();
    const isAutomaticSwitchingEnabled = getConfigValue("soluna", "automaticSwitching");
    assert.strictEqual(isAutomaticSwitchingEnabled, false);
  });

  test("determine day theme based on time", async () => {
    await determineThemeBasedOnTime(480, 1080, 600); // 08:00, 18:00, 10:00
    const currentTheme = getConfigValue("", "workbench.colorTheme");
    assert.strictEqual(currentTheme, "Default Light+");
  });

  test("determine night theme based on time", async () => {
    await determineThemeBasedOnTime(480, 1080, 1200); // 08:00, 18:00, 2:00
    const currentTheme = getConfigValue("", "workbench.colorTheme");
    assert.strictEqual(currentTheme, "Default Dark+");
  });

  test("determine night theme after midnight", async () => {
    await determineThemeBasedOnTime(480, 1080, 120); // 18:00, 8:00, 2:00
    const currentTheme = getConfigValue("", "workbench.colorTheme");
    assert.strictEqual(currentTheme, "Default Dark+");
  });
});
