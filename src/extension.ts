import * as vscode from "vscode";
import {
  checkAndSwitchTheme,
  disableAutomaticSwitching,
  disableAutomaticSwitchingOnManualThemeChange,
  enableAutomaticSwitching,
  setPreferredTheme,
  setSwitchToDarkThemeTime,
  setSwitchToLightThemeTime,
  switchToDarkTheme,
  switchToLightTheme,
} from "./configUtils";

export async function activate(context: vscode.ExtensionContext) {
  let switchToLightThemeDisposable = vscode.commands.registerCommand(
    "soluna.switchToLightTheme",
    () => {
      switchToLightTheme();
      disableAutomaticSwitchingOnManualThemeChange();
    }
  );

  let switchToDarkThemeDisposable = vscode.commands.registerCommand(
    "soluna.switchToDarkTheme",
    () => {
      switchToDarkTheme();
      disableAutomaticSwitchingOnManualThemeChange();
    }
  );

  let enableAutomaticSwitchingDisposable = vscode.commands.registerCommand(
    "soluna.enableAutomaticSwitching",
    () => enableAutomaticSwitching()
  );

  let disableAutomaticSwitchingDisposable = vscode.commands.registerCommand(
    "soluna.disableAutomaticSwitching",
    () => disableAutomaticSwitching()
  );

  let setSwitchToLightThemeTimeDisposable = vscode.commands.registerCommand(
    "soluna.setSwitchToLightThemeTime",
    () => setSwitchToLightThemeTime()
  );

  let setSwitchToDarkThemeTimeDisposable = vscode.commands.registerCommand(
    "soluna.setSwitchToDarkThemeTime",
    () => setSwitchToDarkThemeTime()
  );

  let setLightThemeDisposable = vscode.commands.registerCommand(
    "soluna.setPreferredLightTheme",
    async () => setPreferredTheme(true)
  );
  let setDarkThemeDisposable = vscode.commands.registerCommand(
    "soluna.setPreferredDarkTheme",
    async () => setPreferredTheme(false)
  );

  context.subscriptions.push(setLightThemeDisposable);
  context.subscriptions.push(setDarkThemeDisposable);
  context.subscriptions.push(switchToLightThemeDisposable);
  context.subscriptions.push(switchToDarkThemeDisposable);
  context.subscriptions.push(enableAutomaticSwitchingDisposable);
  context.subscriptions.push(disableAutomaticSwitchingDisposable);
  context.subscriptions.push(setSwitchToLightThemeTimeDisposable);
  context.subscriptions.push(setSwitchToDarkThemeTimeDisposable);

  const commands = [
    { label: "Switch To Day Theme", command: "soluna.switchToLightTheme" },
    { label: "Switch To Night Theme", command: "soluna.switchToDarkTheme" },
    { label: "Set Preferred Day Theme", command: "soluna.setPreferredLightTheme" },
    { label: "Set Preferred Night Theme", command: "soluna.setPreferredDarkTheme" },
    {
      label: "Enable Automatic Day/Night Theme Switching",
      command: "soluna.enableAutomaticSwitching",
    },
    {
      label: "Disable Automatic Day/Night Theme Switching",
      command: "soluna.disableAutomaticSwitching",
    },
    { label: "Set Day Theme Time (Auto-Switching)", command: "soluna.setSwitchToLightThemeTime" },
    { label: "Set Night Theme Time (Auto-Switching)", command: "soluna.setSwitchToDarkThemeTime" },
  ];

  // Status Bar Item Setup
  const toggleThemeStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  toggleThemeStatusBarItem.command = "soluna.showCommandsMenu"; // Make sure this matches your command registration
  toggleThemeStatusBarItem.text = `Soluna`; // Ensure you have a registered icon or use a default icon
  toggleThemeStatusBarItem.tooltip = "Open Soluna Commands Menu";
  toggleThemeStatusBarItem.backgroundColor = new vscode.ThemeColor(
    "statusBarItem.prominentBackground"
  );
  toggleThemeStatusBarItem.show();
  context.subscriptions.push(toggleThemeStatusBarItem);

  // Command to Open Custom Quick Pick
  let showCommandMenuDisposable = vscode.commands.registerCommand("soluna.showCommandsMenu", () => {
    vscode.window
      .showQuickPick(commands, {
        placeHolder: "Choose a Soluna command",
      })
      .then((selectedItem) => {
        if (selectedItem) {
          vscode.commands.executeCommand(selectedItem.command);
        }
      });
  });
  context.subscriptions.push(showCommandMenuDisposable);

  // Time-based theme switching setup
  checkAndSwitchTheme();
  const checkInterval = setInterval(checkAndSwitchTheme, 60000);
  context.subscriptions.push({ dispose: () => clearInterval(checkInterval) });
}

export function deactivate() {}
