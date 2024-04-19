import { ConfigurationTarget, WorkspaceConfiguration, extensions, window, workspace } from "vscode";
import { isLightTimeBeforeDarkTime, verifyValidTimeFormat } from "./timeUtils";
import { get } from "http";

export function getConfig(nameSpace: string): WorkspaceConfiguration {
  return nameSpace ? workspace.getConfiguration(nameSpace) : workspace.getConfiguration();
}

export async function updateConfig(nameSpace: string, key: string, value: string | boolean) {
  const config = getConfig(nameSpace);
  await config.update(key, value, ConfigurationTarget.Global);
}

export function getConfigValue(nameSpace: string, key: string) {
  const config = getConfig(nameSpace);
  return config.get(key);
}

export async function setupDefaults() {
  try {
    const config = getConfig("soluna");
    const hasUserSetPreferences =
      config.has("preferredLightTheme") &&
      config.has("preferredDarkTheme") &&
      config.has("automaticSwitching") &&
      config.has("switchToLightThemeTime") &&
      config.has("switchToDarkThemeTime");

    if (!hasUserSetPreferences) {
      await updateConfig("soluna", "preferredLightTheme", "Default Light+");
      await updateConfig("soluna", "preferredDarkTheme", "Default Dark+");
      await updateConfig("soluna", "automaticSwitching", false);
      await updateConfig("soluna", "switchToLightThemeTime", "08:00");
      await updateConfig("soluna", "switchToDarkThemeTime", "18:00");
    }
  } catch (error) {
    console.error("Error setting up defaults", error);
    window.showErrorMessage("Error setting up defaults - Soluna");
  }
}

export async function enableAutomaticSwitching() {
  try {
    const isAutomaticSwitchingEnabled = getConfigValue("soluna", "automaticSwitching") as boolean;
    if (!isAutomaticSwitchingEnabled) {
      await updateConfig("soluna", "automaticSwitching", true);
      checkAndSwitchTheme();
      window.showInformationMessage("Automatic day/night theme switching is enabled - Soluna");
    } else {
      window.showInformationMessage(
        "Automatic day/night theme switching is already enabled - Soluna"
      );
    }
  } catch (error) {
    console.error("Failed to enable automatic theme switching", error);
    window.showErrorMessage("Failed to enable automatic theme switching - Soluna");
  }
}

export async function disableAutomaticSwitching() {
  try {
    const isAutomaticSwitchingEnabled = getConfigValue("soluna", "automaticSwitching") as boolean;
    if (isAutomaticSwitchingEnabled) {
      await updateConfig("soluna", "automaticSwitching", false);
      window.showInformationMessage("Automatic day/night theme switching is disabled - Soluna");
    } else {
      window.showInformationMessage(
        "Automatic day/night theme switching is already disabled - Soluna"
      );
    }
  } catch (error) {
    console.error("Failed to disable automatic theme switching", error);
    window.showErrorMessage("Failed to disable automatic theme switching - Soluna");
  }
}

export function disableAutomaticSwitchingOnManualThemeChange() {
  const automaticSwitching = getConfigValue("soluna", "automaticSwitching") as boolean;
  if (automaticSwitching) {
    disableAutomaticSwitching();
  }
}

export async function switchToLightTheme() {
  try {
    const preferredLightTheme = getConfigValue("soluna", "preferredLightTheme") as string;
    const currentTheme = getConfigValue("", "workbench.colorTheme") as string;
    if (preferredLightTheme === currentTheme) {
      return;
    }
    await updateConfig("", "workbench.colorTheme", preferredLightTheme);
    window.showInformationMessage(
      `Theme switched to set day theme: ${preferredLightTheme} - Soluna`
    );
  } catch (error) {
    console.error("Failed to switch to day theme", error);
    window.showErrorMessage("Failed to switch to day theme - Soluna");
  }
}

export async function switchToDarkTheme() {
  try {
    const preferredDarkTheme = getConfigValue("soluna", "preferredDarkTheme") as string;
    const currentTheme = getConfigValue("", "workbench.colorTheme") as string;
    if (preferredDarkTheme === currentTheme) {
      return;
    }
    await updateConfig("", "workbench.colorTheme", preferredDarkTheme);
    window.showInformationMessage(
      `Theme switched to set night theme: ${preferredDarkTheme} - Soluna`
    );
  } catch (error) {
    console.error("Failed to switch to night theme", error);
    window.showErrorMessage("Failed to switch to night theme - Soluna");
  }
}

export async function setSwitchToLightThemeTime() {
  try {
    const selectedTime = await window.showInputBox({
      placeHolder:
        "Set the time for the theme to automatically switch to day mode (HH:MM), for example, 08:00.",
    });
    if (!selectedTime || !verifyValidTimeFormat(selectedTime)) {
      window.showInformationMessage(`No time selected - Soluna`);
      return;
    }
    const darkThemeTime = getConfigValue("soluna", "switchToDarkThemeTime") as string;
    if (isLightTimeBeforeDarkTime(selectedTime, darkThemeTime)) {
      await updateConfig("soluna", "switchToLightThemeTime", selectedTime);
      window.showInformationMessage(
        `Day theme auto switch time is set to ${selectedTime} - Soluna`
      );
    } else {
      window.showErrorMessage("Day theme set time must be before night theme time - Soluna");
      return;
    }
  } catch (error) {
    console.error("Failed to set day theme time", error);
    window.showErrorMessage("Failed to set day theme time - Soluna");
  }
}

export async function setSwitchToDarkThemeTime() {
  try {
    const config = getConfig("soluna");
    const selectedTime = await window.showInputBox({
      placeHolder:
        "Set the time for the theme to automatically switch to night mode (HH:MM), for example, 18:00.",
    });
    if (!selectedTime || !verifyValidTimeFormat(selectedTime)) {
      window.showInformationMessage(`No time selected - Soluna`);
      return;
    }
    const lightThemeTime = getConfigValue("soluna", "switchToLightThemeTime") as string;
    if (isLightTimeBeforeDarkTime(lightThemeTime, selectedTime)) {
      await updateConfig("soluna", "switchToDarkThemeTime", selectedTime);
      window.showInformationMessage(
        `Night theme auto switch time is set to ${selectedTime} - Soluna`
      );
    } else {
      window.showErrorMessage("Night theme set time must be after day theme time - Soluna");
      return;
    }
  } catch (error) {
    console.error("Failed to set night theme time", error);
    window.showErrorMessage("Failed to set night theme time - Soluna");
  }
}

export async function setPreferredTheme(isLightTheme: boolean) {
  try {
    const selectedTheme = await window.showQuickPick(
      extensions.all.flatMap((extension) => {
        return extension.packageJSON.contributes && extension.packageJSON.contributes.themes
          ? extension.packageJSON.contributes.themes.map((theme: { id: string; label: string }) =>
              theme.id ? theme.id : theme.label
            )
          : [];
      }),
      {
        placeHolder: isLightTheme
          ? "Select your preferred day theme - Soluna"
          : "Select your preferred night theme - Soluna",
      }
    );

    if (selectedTheme) {
      const themeConfigKey = isLightTheme ? "preferredLightTheme" : "preferredDarkTheme";
      const oldTheme = getConfigValue("soluna", themeConfigKey) as string;
      const currentTheme = getConfigValue("", "workbench.colorTheme") as string;

      await updateConfig("soluna", themeConfigKey, selectedTheme);
      if (currentTheme === oldTheme) {
        updateConfig("", "workbench.colorTheme", selectedTheme);
      }
      window.showInformationMessage(
        `Preferred ${isLightTheme ? "day" : "night"} theme set to ${selectedTheme} - Soluna`
      );
    } else {
      window.showInformationMessage(`No theme selected - Soluna`);
    }
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Failed to set preferred ${isLightTheme ? "day" : "night"} theme - Soluna`
    );
  }
}

export function checkAndSwitchTheme() {
  try {
    const automaticSwitching = getConfigValue("soluna", "automaticSwitching") as boolean;
    if (!automaticSwitching) {
      return;
    }

    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    const lightThemeTime = getConfigValue("soluna", "switchToLightThemeTime") as string;
    const darkThemeTime = getConfigValue("soluna", "switchToDarkThemeTime") as string;

    // Convert times to minutes for easier comparison
    const [lightHours, lightMinutes] = lightThemeTime.split(":").map(Number);
    const [darkHours, darkMinutes] = darkThemeTime.split(":").map(Number);
    const lightThemeTimeInMinutes = lightHours * 60 + lightMinutes;
    const darkThemeTimeInMinutes = darkHours * 60 + darkMinutes;
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    determineThemeBasedOnTime(
      lightThemeTimeInMinutes,
      darkThemeTimeInMinutes,
      currentTimeInMinutes
    );
  } catch (error) {
    console.error("Error automatically switching day/night themes in Soluna: ", error);
    window.showErrorMessage("Soluna encountered an error trying to auto switch themes.");
  }
}

export async function determineThemeBasedOnTime(
  lightThemeTimeInMinutes: number,
  darkThemeTimeInMinutes: number,
  currentTimeInMinutes: number
) {
  // Handle edge cases, such as the dark theme time being after midnight
  const isAfterMidnight = darkThemeTimeInMinutes < lightThemeTimeInMinutes;
  const isInLightPeriod = isAfterMidnight
    ? currentTimeInMinutes < darkThemeTimeInMinutes ||
      currentTimeInMinutes >= lightThemeTimeInMinutes
    : currentTimeInMinutes >= lightThemeTimeInMinutes &&
      currentTimeInMinutes < darkThemeTimeInMinutes;

  if (isInLightPeriod) {
    await switchToLightTheme();
  } else {
    await switchToDarkTheme();
  }
}
