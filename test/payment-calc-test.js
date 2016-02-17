var assert = require('assert');
var scriptPath = './calculate-monthly-payment-snap.js';
var harness = require('./snaplogic-harness');

describe('calculate payment', function() {
    var mock = new harness();
    var input = mock.parameters();
    input.value["interest_rate"] = .05;
    input.value["term_months"] = 60;
    input.value["loan_amt"] = 10000;

    var snap = mock.environment(scriptPath, input);
    var result = snap.runSnap();

    it('no errors are thrown', function(done) {
        assert.equal(result.error, false);
        done();
    });
    it('payment amount is correct', function(done) {
        assert.equal(result.monthlyPayment, 188.71);
        done();
    });
});

describe('handle bad data', function() {
    var mock = new harness();
    var input = mock.parameters();
    input.value["interest_rate"] = -1; // negative value should throw error
    input.value["term_months"] = 60;
    input.value["loan_amt"] = 10000;

    var snap = mock.environment(scriptPath, input);
    var result = snap.runSnap();

    it('output routed to error view', function(done) {
        assert.equal(snap.isError, true);
        done();
    });
    it('error message is correct', function(done) {
        assert.equal(result.errorMessage, "interest_rate is invalid");
        done();
    });
});


