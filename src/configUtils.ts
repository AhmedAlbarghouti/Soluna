import { get } from "http";
import { ConfigurationTarget, WorkspaceConfiguration, extensions, window, workspace } from "vscode";
import { isLightTimeBeforeDarkTime, verifyValidTimeFormat } from "./timeUtils";

export function getConfig(nameSpace: string): WorkspaceConfiguration {
  return nameSpace ? workspace.getConfiguration(nameSpace) : workspace.getConfiguration();
}

export async function setupDefaults(): Promise<void> {
  try {
    const config = getConfig("soluna");
    const hasUserSetPreferences =
      config.has("preferredLightTheme") && config.has("preferredDarkTheme");

    if (!hasUserSetPreferences) {
      await config.update("preferredLightTheme", "Default Light+", ConfigurationTarget.Global);
      await config.update("preferredDarkTheme", "Default Dark+", ConfigurationTarget.Global);
    }
  } catch (error) {
    console.error("Error setting up defaults", error);
    window.showErrorMessage("Error setting up defaults - Soluna");
  }
}

export async function enableAutomaticSwitching(): Promise<void> {
  try {
    const config = getConfig("soluna");
    const isAutomaticSwitchingEnabled = config.get("automaticSwitching") as boolean;
    if (isAutomaticSwitchingEnabled) {
      window.showInformationMessage("Automatic switching is already enabled - Soluna");
    } else {
      await config.update("automaticSwitching", true, ConfigurationTarget.Global);
      checkAndSwitchTheme();
      window.showInformationMessage("Automatic switching enabled - Soluna");
    }
  } catch (error) {
    console.error("Failed to enable automatic switching", error);
    window.showErrorMessage("Failed to enable automatic switching - Soluna");
  }
}

export async function disableAutomaticSwitching(): Promise<void> {
  try {
    const config = getConfig("soluna");
    const isAutomaticSwitchingEnabled = config.get("automaticSwitching") as boolean;
    if (!isAutomaticSwitchingEnabled) {
      window.showInformationMessage("Automatic switching is already disabled - Soluna");
    } else {
      await config.update("automaticSwitching", false, ConfigurationTarget.Global);
      checkAndSwitchTheme();
      window.showInformationMessage("Automatic switching disabled - Soluna");
    }
  } catch (error) {
    console.error("Failed to disable automatic switching", error);
    window.showErrorMessage("Failed to disable automatic switching - Soluna");
  }
}

export async function switchToLightTheme() {
  try {
    const config = getConfig("");
    const preferredLightTheme = config.get("soluna.preferredLightTheme") as string;
    if (preferredLightTheme === config.get("workbench.colorTheme")) {
      return;
    }
    await config.update("workbench.colorTheme", preferredLightTheme, ConfigurationTarget.Global);
    window.showInformationMessage(
      `Theme switched to set light theme: ${preferredLightTheme} - Soluna`
    );
  } catch (error) {
    console.error("Failed to switch to light theme", error);
    window.showErrorMessage("Failed to switch to light theme - Soluna");
  }
}

export async function switchToDarkTheme() {
  try {
    const config = getConfig("");
    const preferredDarkTheme = config.get("soluna.preferredDarkTheme") as string;
    if (preferredDarkTheme === config.get("workbench.colorTheme")) {
      return;
    }
    await config.update("workbench.colorTheme", preferredDarkTheme, ConfigurationTarget.Global);
    window.showInformationMessage(
      `Theme switched to set dark theme: ${preferredDarkTheme} - Soluna`
    );
  } catch (error) {
    console.error("Failed to switch to dark theme", error);
    window.showErrorMessage("Failed to switch to dark theme - Soluna");
  }
}

export async function setSwitchToLightThemeTime() {
  try {
    const config = getConfig("soluna");
    const selectedTime = await window.showInputBox({
      placeHolder: "Enter the time to switch to light theme (HH:MM)",
    });
    if (!selectedTime || !verifyValidTimeFormat(selectedTime)) {
      window.showInformationMessage(`No time selected - Soluna`);
      return;
    }
    const darkThemeTime = config.get("switchToDarkThemeTime") as string;
    if (isLightTimeBeforeDarkTime(selectedTime, darkThemeTime)) {
      window.showErrorMessage("Light theme time must be before dark theme time - Soluna");
      return;
    } else {
      config.update("switchToLightThemeTime", selectedTime, ConfigurationTarget.Global);
      window.showInformationMessage(`Switch to light theme time set to ${selectedTime} - Soluna`);
    }
  } catch (error) {
    console.error("Failed to set light theme time", error);
    window.showErrorMessage("Failed to set light theme time - Soluna");
  }
}

export async function setSwitchToDarkThemeTime() {
  try {
    const config = getConfig("soluna");
    const selectedTime = await window.showInputBox({
      placeHolder: "Enter the time to switch to dark theme (HH:MM)",
    });
    if (!selectedTime || !verifyValidTimeFormat(selectedTime)) {
      window.showInformationMessage(`No time selected - Soluna`);
      return;
    }
    const lightThemeTime = config.get("switchToLightThemeTime") as string;
    if (!isLightTimeBeforeDarkTime(lightThemeTime, selectedTime)) {
      window.showErrorMessage("Dark theme time must be after light theme time - Soluna");
      return;
    } else {
      config.update("switchToDarkThemeTime", selectedTime, ConfigurationTarget.Global);
      window.showInformationMessage(`Switch to dark theme time set to ${selectedTime} - Soluna`);
    }
  } catch (error) {
    console.error("Failed to set dark theme time", error);
    window.showErrorMessage("Failed to set dark theme time - Soluna");
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
          ? "Select your preferred light theme - Soluna"
          : "Select your preferred dark theme - Soluna",
      }
    );

    if (selectedTheme) {
      const config = getConfig("soluna");
      const themeConfigKey = isLightTheme ? "preferredLightTheme" : "preferredDarkTheme";
      await config.update(themeConfigKey, selectedTheme, ConfigurationTarget.Global);

      window.showInformationMessage(
        `Preferred ${isLightTheme ? "light" : "dark"} theme set to ${selectedTheme} - Soluna`
      );
      // if automatic switching is enabled, check if it's time to switch themes
      if (config.get("automaticSwitching") as boolean) {
        checkAndSwitchTheme();
      }
    } else {
      window.showInformationMessage(`No theme selected - Soluna`);
    }
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Failed to set preferred ${isLightTheme ? "light" : "dark"} theme - Soluna`
    );
  }
}

export async function checkAndSwitchTheme() {
  try {
    const config = getConfig("soluna");
    const automaticSwitching = config.get("automaticSwitching") as boolean;

    if (!automaticSwitching) {
      return;
    }

    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();

    const lightThemeTime = config.get("switchToLightThemeTime") as string;
    const darkThemeTime = config.get("switchToDarkThemeTime") as string;

    // Convert times to minutes for easier comparison
    const [lightHours, lightMinutes] = lightThemeTime.split(":").map(Number);
    const [darkHours, darkMinutes] = darkThemeTime.split(":").map(Number);
    const lightThemeTimeInMinutes = lightHours * 60 + lightMinutes;
    const darkThemeTimeInMinutes = darkHours * 60 + darkMinutes;
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    // Handle edge cases, such as the dark theme time being after midnight
    const isAfterMidnight = darkThemeTimeInMinutes < lightThemeTimeInMinutes;
    const isInLightPeriod = isAfterMidnight
      ? currentTimeInMinutes < darkThemeTimeInMinutes ||
        currentTimeInMinutes >= lightThemeTimeInMinutes
      : currentTimeInMinutes >= lightThemeTimeInMinutes &&
        currentTimeInMinutes < darkThemeTimeInMinutes;

    if (isInLightPeriod) {
      switchToLightTheme();
    } else {
      switchToDarkTheme();
    }
  } catch (error) {
    console.error("Error switching themes in Soluna: ", error);
    window.showErrorMessage("Soluna encountered an error trying to switch themes.");
  }
}
