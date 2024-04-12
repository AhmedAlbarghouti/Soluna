import * as vscode from "vscode";
import {
  checkAndSwitchTheme,
  disableAutomaticSwitching,
  enableAutomaticSwitching,
  setPreferredTheme,
  setSwitchToDarkThemeTime,
  setSwitchToLightThemeTime,
  setupDefaults,
  switchToDarkTheme,
  switchToLightTheme,
} from "./configUtils";

export function activate(context: vscode.ExtensionContext) {
  setupDefaults();

  let switchToLightThemeDisposable = vscode.commands.registerCommand(
    "soluna.switchToLightTheme",
    () => switchToLightTheme()
  );

  let switchToDarkThemeDisposable = vscode.commands.registerCommand(
    "soluna.switchToDarkTheme",
    () => switchToDarkTheme()
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
    { label: "Switch To Light Theme", command: "soluna.switchToLightTheme" },
    { label: "Switch To Dark Theme", command: "soluna.switchToDarkTheme" },
    { label: "Set Preferred Light Theme", command: "soluna.setPreferredLightTheme" },
    { label: "Set Preferred Dark Theme", command: "soluna.setPreferredDarkTheme" },
    { label: "Enable Automatic Switching", command: "soluna.enableAutomaticSwitching" },
    { label: "Disable Automatic Switching", command: "soluna.disableAutomaticSwitching" },
    { label: "Set Switch To Light Theme Time", command: "soluna.setSwitchToLightThemeTime" },
    { label: "Set Switch To Dark Theme Time", command: "soluna.setSwitchToDarkThemeTime" },
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
