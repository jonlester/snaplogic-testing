Unit testing example for SnapLogic "execute script" snaps.
- this example tests a monthly payment calculation script
- use template.js as a starting point for creating new snap scripts
- unit tests run using mocha framework, installed and configured in your IDE (tested in WebStorm 11)
- the snaplogic-harness.js module mocks the snaplogic/rhino environment, providing run-time context so that tests can be run in a node.js sandbox.