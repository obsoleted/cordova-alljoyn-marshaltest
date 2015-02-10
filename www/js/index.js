/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        AllJoyn.connect(function(bus) {
            app.bus = bus;
            var proxyObjects = [{
                    path: "/test",
                    interfaces: [
                        [
                            "org.alljoyn.Bus.TestService",
                            "?Get <sas >v",
                            "?Set <v >v"
                        ],
                        null
                    ]
                },
                null
            ];
            AllJoyn.registerObjects(function() {
                var nameToSearchFor = "org.alljoyn.Bus.TestService";
                app.bus.addAdvertisedNameListener(nameToSearchFor, app.onFoundTestService);
            }, function() {
                app.setupFailure();
            }, null, proxyObjects);
        }, function(error) {
            app.setupFailure();
        });
    },
    marshalTests: [
        ['n', -1], //in16
        ['b', true], //boolean
        ['i', 3], //int32
        ['d', 33.52], // double
        ['q', 27], //uint16
        ['t', 2352352], //uint64
        ['u', 2020], //uint32
        ['x', -23909], //int64
        ['s', "foo"], //string
        ['y', 3], //byte
        ['as', ["one", "two", "three"]], // array of strings
        ['ai', [1, -1, 0, -33, 55]], //array of int32
    ],
    onFoundTestService: function(serviceMatch) {
        if (!app.foundService) {
            app.name = serviceMatch.name;
            app.port = 25;
            console.log(JSON.stringify(serviceMatch));
            app.bus.joinSession(function(session) {
                app.session = session;
                app.session.testGet = function(successCallback, failureCallback, typeString, variantArgs) {
                    session.callMethod(successCallback, failureCallback, session.sessionHost, null, [2, 0, 0, 0], "sas", [typeString, variantArgs], "v");
                };
                app.foundService = true;
                app.setupTests();
            }, function() {
                app.setupFailure();
            }, {
                name: app.name,
                port: app.port
            });
        }
    },
    createTestElement: function(testInfo) {
        if (!testInfo) return;
        var testType = testInfo[0];
        var testValue = testInfo[1];

        var testDiv = document.createElement('div');
        testDiv.className = 'marshaltest';

        var testName = document.createElement('div');
        testName.className = 'marshaltestpart testname';
        var testNameConent = document.createTextNode(testType);
        testName.appendChild(testNameConent);
        testDiv.appendChild(testName);

        var testGet = document.createElement('div');
        testGet.className = 'marshaltestpart notrun';
        var testGetContent = document.createTextNode('Not Run');

        testGet.appendChild(testGetContent);
        testGet.addEventListener('click', function() {

            // This should run the Get Test
            console.log("Doing get test");
            app.session.testGet(function() {
                console.log(JSON.stringify(arguments));
                app.logOutput(JSON.stringify(arguments));
                console.log("testGet success");
                testGet.className = 'marshaltestpart passed';
                testGet.textContent = 'passed';

            }, function() {

                testGet.className = 'marshaltestpart failed';
                testGetContent.textContent = "failed";

            }, testType, []);
        }, false);
        testDiv.appendChild(testGet);

        var testSet = document.createElement('div');
        testSet.className = 'marshaltestpart notrun';
        var testSetContent = document.createTextNode('Not Run');
        testSet.appendChild(testSetContent);
        testSet.addEventListener('click', function() {
            // This should run the Set Test
            testSet.className = 'marshaltestpart failed';
            testSet.textContent = "failed";
        }, false);
        testDiv.appendChild(testSet);

        return testDiv;
    },
    setupFailure: function() {
        var statusElement = document.getElementById('status');
        var setupElement = statusElement.querySelector('.setup');
        var readyElement = statusElement.querySelector('.ready');
        var failedElement = statusElement.querySelector('.failed');

        setupElement.setAttribute('style', 'display:none;');
        readyElement.setAttribute('style', 'display:none;');
        failedElement.setAttribute('style', 'dispaly:block');

    },
    logOutput: function(output) {
        var outputDiv = document.querySelector('.output');
        outputDiv.textContent = output;
    },
    setupTests: function() {
        var statusElement = document.getElementById('status');
        var setupElement = statusElement.querySelector('.setup');
        var readyElement = statusElement.querySelector('.ready');

        setupElement.setAttribute('style', 'display:none;');
        readyElement.setAttribute('style', 'display:block;');

        var tests = document.querySelector('.tests');
        app.marshalTests.forEach(function(element, index, array) {
            var testElement = app.createTestElement(element);
            tests.appendChild(testElement);
        });
        //tests.setAttribute('style', 'display:block;');

        console.log('Test setup completed.');
    },
};

app.initialize();