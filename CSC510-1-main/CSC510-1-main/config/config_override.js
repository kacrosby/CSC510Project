const fs = require('fs');

const { config } = require('./config.js');

function check_default_overrides(config_override_file) {
    try {
        //Set the config override file
        let raw_json = fs.readFileSync(config_override_file);
        config_override = JSON.parse(raw_json);
        console.log("Using Config Override at: " + config_override_file);
        factory.update_object(config_override, config);
    } catch (exception) {
        if(exception.code == 'ENOENT') {
            console.error("File not found: " + config_override_file + ". Using default configuration Instead.");
        } else if(exception instanceof SyntaxError) {
            console.error("Invalid JSON in file at: " + config_override_file + ". Using default configuration instead.");
        } else {
            console.error(exception);
        }
    }
}

function update_object(config_override, config) {
    for (var key in config_override) {
        if (!(key in config)) {
            console.error('Invalid Key: ' + key);
            continue;
        }
        let config_value = config[key];
        if (typeof config_value === 'object' && !Array.isArray(config_value) && config_value !== null) {
            config[key] = update_object(config_override[key], config[key]);
        } else {
            config[key] = config_override[key];
        }
    }
    return config;
}

const factory = {
    check_default_overrides,
    update_object
}

module.exports = factory;
