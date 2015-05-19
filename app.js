var draftApp = { };
draftApp.root = require('path').dirname(require.main.filename);
draftApp.package = require(draftApp.root+"/package.json");

require("./modules/core/utils")(draftApp);
require("./modules/core/core")(draftApp);

// Initialize draftApp
draftApp.core.initialize();