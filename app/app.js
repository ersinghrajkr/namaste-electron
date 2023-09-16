const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require("path");

let mainWindow, addWindow;

app.on('ready', () => {
    console.log("App is now ready!");
    mainWindow = new BrowserWindow({
        title: 'Todo App',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        },
    })
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    const mainMenuTemplate = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenuTemplate)


    mainWindow.on('closed', () => {
        // On closer of main windown, quit app completely
        app.quit()
    })
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 350,
        height: 300,
        title: 'Add new Todo',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: `${__dirname}/preload.js`,
        },
    })
    addWindow.loadURL(`file://${__dirname}/addTodo.html`);
    addWindow.on("closed", () => (addWindow = null));
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    console.log(`${todo} added!`)
    addWindow.close()
})

const menuTemplate = [{
    label: 'File', submenu: [
        {
            label: 'New Todo', click() { createAddWindow() },
        },
        {
            label: 'Clear Todos',
            click() {
                mainWindow.webContents.send('todo:clear');
            }
        },
        {
            label: 'Exit',
            accelerator: (() => {
                if (process.platform === "darwin") {
                    return 'Cmd+Q'
                } else {
                    return 'Ctrl + Q';
                }
            })(),
            click() { app.quit() }
        }]
}]

if (process.platform === "darwin") {
    menuTemplate.unshift({ label: "" });
}

if (process.env.NODE_ENV !== 'production') {
    // Add developer tools item to right-click menu in development mode only
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            {
                label: 'Developer Tools',
                accelerator: process.platform === "darwin" ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]

    })
}
