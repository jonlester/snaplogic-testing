var script = function() {
    var getData = function(params) {
            var data = {
                error: false,
                errorMessage: "",
                inputDataFields: {}
            };

            var keyArray = params.keySet().toArray();
            for (var index in keyArray) {
                var key = keyArray[index];
                data.inputDataFields[key] = params.get(key);
            }

            return data;
        },

        validateParameters = function(inputDataFields) {

            if (!inputDataFields["interest_rate"]
                    || isNaN(inputDataFields["interest_rate"])
                    || inputDataFields["interest_rate"] <= 0
                    || inputDataFields["interest_rate"] >= 100)
                throw "interest_rate is invalid";

            if (!inputDataFields["term_months"]
                    || isNaN(inputDataFields["term_months"])
                    || inputDataFields["term_months"] <= 0)
                throw "term_months is invalid";

            if (!inputDataFields["loan_amt"]
                    || isNaN(inputDataFields["loan_amt"])
                    || inputDataFields["loan_amt"] <= 0)
                throw "loan_amt is invalid";
        },

        calculatePayment = function(interest_rate, term_months, loan_amt) {
            var monthly_rate = interest_rate / 12;
            var factor = Math.pow(1 + monthly_rate, term_months);
            return parseFloat(
                (monthly_rate / (factor - 1) * (loan_amt * factor)).toFixed(2)
            );
        };

    return {
        input: input,
        output: output,
        error: error,
        log: log,
        execute: function() {
            log.info("Payment Calc script started");

            while (input.hasNext()) {
                var data = {};
                try {
                    var doc = input.next();
                    data = getData(doc);

                    validateParameters(data.inputDataFields);

                    data.monthlyPayment = calculatePayment(
                        data.inputDataFields["interest_rate"],
                        data.inputDataFields["term_months"],
                        data.inputDataFields["loan_amt"]);

                    output.write(doc, data);
                } catch (err) {
                    data.error = true;
                    data.errorMessage = err ? err.toString() : "empty";
                    error.write(doc, data);
                }
            }

            log.info("Payment Calc script finished");
        }
    };
}();

var hook = new com.snaplogic.scripting.language.ScriptHook(script);