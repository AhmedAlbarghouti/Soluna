# Soluna

Soluna enhances your Visual Studio Code environment by automatically or manually toggling between your chosen day and night themes. It's designed to keep your workspace in harmony with your circadian rhythms and external lighting conditions.

## Features

Soluna offers the following features to improve your VS Code experience:

- **Automatic Theme Switching**: Soluna can automatically switch between light and dark themes based on specified times. This is ideal for users who prefer different themes during different parts of the day or night.
- **Manual Theme Control**: Quickly toggle between your predefined light and dark themes with a simple click from the status bar.

![Soluna in action](./src/assets/soluna-demo.gif)

## Commands

Soluna includes several commands to customize and control theme settings:

- `soluna.switchToLightTheme`: Switches to your predefined light theme.
- `soluna.switchToDarkTheme`: Switches to your predefined dark theme.
- `soluna.setPreferredLightTheme`: Allows you to select and set your preferred light theme from installed themes.
- `soluna.setPreferredDarkTheme`: Allows you to select and set your preferred dark theme from installed themes.
- `soluna.enableAutomaticSwitching`: Enables automatic switching between themes based on the times you set.
- `soluna.disableAutomaticSwitching`: Disables automatic theme switching.
- `soluna.setSwitchToLightThemeTime`: Sets the time for automatically switching to the light theme.
- `soluna.setSwitchToDarkThemeTime`: Sets the time for automatically switching to the dark theme.
- `soluna.showCommandsMenu`: Displays a menu with all Soluna commands for easy access.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0 | 2024-04-12

Initial release of Soluna

---

## Installation

You can install Soluna from the Visual Studio Code Marketplace:

1. Open VS Code.
2. Navigate to the Extensions view by clicking on the square icon on the sidebar or pressing `Ctrl+Shift+X`.
3. Search for "Soluna".
4. Click on the Install button.

## Usage

To use Soluna, you can access its commands through the Command Palette or by clicking the Soluna icon in the status bar:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type `Soluna` to see all available commands.
3. Select a command to execute.

Or you can use the `Soluna` button avaiable below on the status bar which would display all the available commands.

For automatic theme switching, make sure to enable automatic switching via `enableAutomaticSwitching` command and configure your preferred themes and set the appropriate times for switching.

### The Default values:

- Light Theme: `Default Light+`
- Dark Theme: `Default Dark+`
- Automatic Switching: `false`
- Light Theme Time: `08:00`
- Dark Theme Time: `20:00`

## Contributing

Contributions are always welcome! Please read the contributing guidelines in `CONTRIBUTING.md` to get started.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Support

If you encounter any issues or have suggestions for improvements, please file an issue on the GitHub repository.

**Enjoy!**
