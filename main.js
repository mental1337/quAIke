const { app, BrowserWindow, globalShortcut, screen } = require('electron');

let win;
const WINDOW_WIDTH_RATIO = 0.7;
const WINDOW_HEIGHT_RATIO = 0.7;

function createWindow() {
  // Get the dimensions of the primary display's work area
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Create the browser window with specified dimensions and position
  win = new BrowserWindow({
    width: Math.floor(width * WINDOW_WIDTH_RATIO), // Set width to 80% of screen width
    height: Math.floor(height * WINDOW_HEIGHT_RATIO), // Set height to 60% of screen height
    x: Math.floor((width - width * WINDOW_WIDTH_RATIO) / 2), // Center the window horizontally
    y: -Math.floor(height * WINDOW_HEIGHT_RATIO), // Start off-screen at the top (for slide-in effect)
    frame: false, // Frameless window for a sleek appearance
    alwaysOnTop: true, // Keep the window always on top of other windows
    resizable: true, // Disable window resizing
    show: false, // Start hidden until ready to be shown
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration for security
      contextIsolation: true, // Enable context isolation for security
    }
  });

  // Load the Open-WebUI url
  win.loadURL('http://localhost:8080');

  // Hide the window initially until it's ready to be shown
  win.once('ready-to-show', () => {
    win.hide(); // Start hidden
  });

  // // Handle the close event
  // win.on('close', () => {
  //   win = null; // Dereference the window object
  // });
}

// Show Window Animation
function slideIn() {
  // Get the active display's work area dimensions  
  const activeDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const { display_x, display_y, width, height } = activeDisplay.workArea;
  
  // Set initial position off-screen and make the window visible  
  win.setBounds({x: Math.floor((width - width * WINDOW_WIDTH_RATIO) / 2), y: -Math.floor(height * WINDOW_HEIGHT_RATIO) });
  win.show();

  let start = Date.now(); // Record the start time of the animation
  const duration = 10; // Animation duration in milliseconds
  const targetY = 0; // Target position (fully visible at the top)
  const startY = -Math.floor(height * WINDOW_HEIGHT_RATIO); // Starting position (off-screen)

  function animate() {
    let elapsed = Date.now() - start; // Calculate elapsed time
    let progress = Math.min(elapsed / duration, 1); // Calculate progress (between 0 and 1)
    let newY = Math.floor(startY + progress * (targetY - startY)); // Interpolate Y position
    win.setBounds({ y: newY }); // Update window position

    if (progress < 1) {
      win.webContents.executeJavaScript('window.requestAnimationFrame(() => {})').then(() => animate()); // Continue animation until complete
    }
  }

  animate(); // Start the animation
}

// Hide Window Animation
function slideOut() {
  // Get the height of the primary display's work area
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  
  let start = Date.now(); // Record the start time of the animation
  const duration = 10; // Animation duration in milliseconds
  const startY = 0; // Starting position (fully visible at the top)
  const targetY = -Math.floor(height * WINDOW_HEIGHT_RATIO); // Target position (off-screen)

  function animate() {
    let elapsed = Date.now() - start; // Calculate elapsed time
    let progress = Math.min(elapsed / duration, 1); // Calculate progress (between 0 and 1)
    let newY = Math.floor(startY + progress * (targetY - startY)); // Interpolate Y position
    win.setBounds({ y: newY }); // Update window position

    if (progress < 1) {
      win.webContents.executeJavaScript('window.requestAnimationFrame(() => {})').then(() => animate()); // Continue animation until complete
    } else {
      win.hide(); // Hide the window once the animation is complete
    }
  }

  animate(); // Start the animation
}

app.on('ready', () => {
  createWindow();

  // Set global shortcut, e.g., Win+F12, to toggle the window
  globalShortcut.register('Super+Space', () => {
    if (win.isVisible()) {
      slideOut(); // Slide out if the window is visible
    } else {
      slideIn(); // Slide in if the window is hidden
    }
  });
});

// Unregister all global shortcuts when the application is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
