var script = function() {
    var getData = function(params) {
            var data = {
                //any constants
            };

            //add input values as-is for troubleshooting errors in the pipeline
            var keyArray = params.keySet().toArray();
            for (var index in keyArray) {
                var key = keyArray[index];
                data.inputDataFields[key] = params.get(key);
            }

            // add any logic, validation, etc...

            return data;
        };
    return {
        input: input,
        output: output,
        error: error,
        log: log,
        execute: function() {
            log.info("script started");
            while (input.hasNext()) {
                var data = {};
                try {
                    var doc = this.input.next();
                    data = getData(doc);
                    // add implementation

                    output.write(doc, data);
                } catch (err) {
                    data.error = true;
                    data.errorMessage = err ? err.toString() : "empty";
                    error.write(doc, data);
                }
            }

            log.info("script finished");
        }
    };
}();

var hook = new com.snaplogic.scripting.language.ScriptHook(script);
