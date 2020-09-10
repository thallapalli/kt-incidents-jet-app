define(
        ['accUtils',
            'knockout',

            'ojs/ojarraydataprovider',
            'ojs/ojbufferingdataprovider',
            'ojs/ojkeyset', 'ojs/ojcontext',
            'ojs/ojknockout', 'ojs/ojinputtext',
            'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojlabel', 'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojtoolbar', 'ojs/ojmessages'
                    , 'ojs/ojmodel',
            'ojs/ojarraytabledatasource'

        ],
        function (accUtils, ko, $, ArrayDataProvider, HtmlUtils, ResponsiveUtils, ResponsiveKnockoutUtils) {

            function crudViewModel()
            {
                var self = this;
                self.ContCol = ko.observable();
                self.datasource = ko.observable();
                var contactArray = [];
                self.contactObservableArray = ko.observableArray(contactArray);
               
                // self.serviceURL = 'http://ktservice.ca-central-1.elasticbeanstalk.com/incidents/';
                //self.serviceURL = 'http://localhost:5000/incidents/';
                self.serviceURL = 'http://ktservice.ca-central-1.elasticbeanstalk.com/incidents/';
                self.parseContact = function (response) {
                    return {incidentId: response ['incidentId'],
                        contact: response ['contact'],
                        priority: response ['priority'],
                        summary: response ['summary'],
                        description: response ['description'],
                        status: response ['status']

                    };
                };
                self.Contact = oj.Model.extend({
                    urlRoot: self.serviceURL,
                    parse: self.parseContact,
                    parseSave: self.parseContact,
                    idAttribute: 'incidentId'
                });
                self.myCont = new self.Contact ();
                self.ContCollection = oj.Collection.extend({
                    url: self.serviceURL,
                    model: self.myCont
                });
                self.ContCol(new self.ContCollection());
                self.ContCol().fetch({
                    success: function (model, response, options) {
                        for (x = 0; x < response.length; x++) {
                            self.contactObservableArray.push(response [x]);
                            console.log("Load contacts success");
                        }
                    },
                    error: function (model, xhr, options) {
                        console.log("Load contacts error");
                    }
                });
                self.datasource = new oj.ArrayTableDataSource(self.contactObservableArray, {idAttribute: 'incidentId'});
            }
         
            self.addRow = function()
            {
                var addCon = new self.Contact();

                addCon.save({'contact': self.inputcontact(),
                    'priority': self.inputpriority(),
                    'summary': self.inputsummary()}, {
                    success: function (model, response, options) {
                        self.contactObservableArray.push(response);
                        console.log("Save contact success");
                    },
                    error: function (model, xhr, options) {
                        console.log("Save contact error");
                    }
                });

            };
            
            
           //UPDATE ROW BUTTON ** /
    self.updateRow = function ()
    {
        var currentRow = $ ('#table'). OjTable ('option', 'currentRow');

        var updateCon = new self.Contact ();

        if (currentRow!= null) {
            updateCon.save ({'contact': self.inputcontact(),
                    'priority': self.inputpriority(),
                    'summary': self.inputsummary()}, {
                                success: function (model, response, options) {
                                    self.contactObservableArray.splice (currentRow ['rowIndex'], 1, response);
                                    console.log ("Update contact success");
                                },
                                error: function (model, xhr, options) {
                                     console.log ("Update contact error");
                                }
            });
        }
    };

    /// ** DELETE ROW BUTTON ** /
    self.removeRow = function ()
    {
        var currentRow = $ ('#table'). OjTable ('option', 'currentRow');

        if (currentRow!= null)
        {

            var destroyContact = self.contactObservableArray () [currentRow ['rowIndex']];
            var deleteCon = new self.Contact ({'contactId': destroyContact.contactId});

            deleteCon.destroy ({
                               success: function (model, response, options) {
                                    self.contactObservableArray.splice (currentRow ['rowIndex'], 1);
                                    console.log ("Delete contact success");
                               },
                               error: function (model, xhr, options) {
                                    console.log ("Delete contact error");
                               }
            });
        }
    };
            self.inputcontact = ko.observable();
            self.inputpriority = ko.observable();
            self.inputsummary = ko.observable();
            return new crudViewModel();
        }
);