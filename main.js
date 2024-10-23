const { app, BrowserWindow, globalShortcut, screen } = require('electron');

let win;
const WINDOW_WIDTH_RATIO = 0.7;
const WINDOW_HEIGHT_RATIO = 0.7;

function createWindow() {
  // Get the dimensions of the primary display's work area
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Create the browser window with specified dimensions and position
  win = new BrowserWindow({
    width: Math.floor(width * WINDOW_WIDTH_RATIO), // Set width to 70% of screen width
    height: Math.floor(height * WINDOW_HEIGHT_RATIO), // Set height to 70% of screen height
    x: 0,
    y: Math.floor((height - height * WINDOW_HEIGHT_RATIO)),
    frame: false, // Frameless window for a sleek appearance
    alwaysOnTop: true, // Keep the window always on top of other windows
    resizable: true,
    show: false, // Start hidden until ready to be shown
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration for security
      contextIsolation: true, // Enable context isolation for security
    }
  });

  // Load the url
  win.loadURL('http://chatgpt.com');

  // Hide the window initially until it's ready to be shown
  win.once('ready-to-show', () => {
    win.hide(); // Start hidden
  });

  // Handle the close event
  win.on('close', () => {
    win = null; // Dereference the window object
  });
}

// Show Window Animation
function showWindow() {
  // Get the active display's work area dimensions  
  // const activeDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  // const { width, height } = activeDisplay.workArea;
  // // Set initial position off-screen and make the window visible  
  // win.setBounds({ x: 0, y: Math.floor((height - height * WINDOW_HEIGHT_RATIO)) });

  win.show();
}

// Hide Window Animation
function hideWindow() {
  const activeDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const { width, height } = activeDisplay.workArea;

  win.hide(); // Hide the window once the animation is complete
}

app.on('ready', () => {
  createWindow();

  // Set global shortcut, e.g., Win+F12, to toggle the window
  globalShortcut.register('Super+Shift+`', () => {
    if (win.isVisible()) {
      hideWindow(); // Slide out if the window is visible
    } else {
      showWindow(); // Slide in if the window is hidden
    }
  });
});

// Unregister all global shortcuts when the application is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
