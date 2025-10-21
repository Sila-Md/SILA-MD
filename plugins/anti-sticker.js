const { cmd } = require('../command');
const fs = require('fs').promises;
const path = require('path');

// Ensure this path correctly points to your config.json file.
// It assumes config.json is in the parent directory of where this command file resides.
const configPath = path.join(__dirname, '../config.json');

cmd({
  pattern: "antisticker",
  fromMe: true, // Change to 'false' if you want non-admin users to use this command
  desc: "Enable or disable the anti-sticker feature for the bot.",
  usage: ".antisticker on/off"
}, async (conn, m, store, { args, reply }) => {
  const mode = args[0]?.toLowerCase(); // Get the first argument and convert to lowercase

  // Validate the provided argument
  if (!mode || (mode !== "on" && mode !== "off")) {
    return reply("❌ *Incorrect Usage:* Please use `.antisticker on` or `.antisticker off`.");
  }

  try {
    let currentConfig = {};
    
    // Attempt to read the config file. If it doesn't exist or is unreadable, initialize a default config.
    try {
      const configData = await fs.readFile(configPath, 'utf8');
      currentConfig = JSON.parse(configData);
    } catch (readError) {
      // If the file is not found or there's a parsing error, log a warning and create a default config object.
      console.warn(`[ANTI-STICKER] Config file not found or unreadable. Initializing with default settings. Error: ${readError.message}`);
      currentConfig = {
        ANTI_STICKER_KICK: "off" // Set a default value if the file was missing/corrupt
      };
      // No need to reply here, as we'll proceed to write the updated config below.
    }

    // Update the ANTI_STICKER_KICK value based on the user's input
    currentConfig.ANTI_STICKER_KICK = mode;

    // Write the updated configuration back to the file
    // The 'null, 2' in JSON.stringify formats the JSON with 2-space indentation, making it readable.
    await fs.writeFile(configPath, JSON.stringify(currentConfig, null, 2), 'utf8');

    // Send a success message to the user
    reply(`✅ *ANTI_STICKER* has been successfully turned *${mode.toUpperCase()}*.`);

  } catch (error) {
    // Catch any errors that occur during file operations (e.g., permission issues)
    console.error(`[ANTI-STICKER] Failed to update setting: ${error.message}`);
    return reply(`❌ Sorry, an error occurred while updating the setting. Please try again. \n\n*Error Message:* ${error.message}`);
  }
});
