var vm = require('vm');
var fs = require('fs');
var path = require('path');

module.exports = function() {
    var _params = {
        keySet: function () {
            return {
                toArray: function () {
                    return Object.keys(_params)
                        .filter(function (member) {
                           return member !== "keySet" && member !== "get";
                        });
                }
            };
        },
        get: function (key) {
            return _params[key];
        }
    }
    var _canRead = true;

    return {
        environment: function (filePath, input) {
            input = input || {};
            var _results = {};
            var snap = {
                context: {
                    console: console,
                    input: input,
                    output: {
                        write: function (input, output) {
                            _results = output;
                            console.log("result: " + JSON.stringify(output));
                        }
                    },
                    log: {
                        info: function (message) {
                            console.log("log: " + message);
                        }
                    },
                    error: {
                        write: function (input, err) {
                            snap.isError = true;
                            _results = err;
                            console.log("error: " + JSON.stringify(err));
                        }
                    },
                    com: {
                        snaplogic: {
                            scripting: {
                                language: {
                                    ScriptHook: function (script) {
                                        return script;
                                    }
                                }
                            }
                        }
                    }
                },
                runSnap: function () {
                    snap.context.hook.execute();
                    return _results;
                },
                isError: false
            };

            vm.runInNewContext(fs.readFileSync(filePath), snap.context);
            return snap;
        },
        parameters: function () {
            return {
                hasNext: function () {
                    return (_canRead);
                },
                next: function () {
                    _canRead = false;
                    return _params;
                },
                value: _params
            }
        }
    }
};


