define(
        ['accUtils',
            'knockout',

            'ojs/ojarraydataprovider',
            'ojs/ojbufferingdataprovider',
            'ojs/ojkeyset', 'ojs/ojcontext',
            'ojs/ojknockout', 'ojs/ojinputtext',
            'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojlabel', 'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojtoolbar', 'ojs/ojmessages'
           ,'ojs/ojmodel',
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
                 self.serviceURL='http://ktservice.ca-central-1.elasticbeanstalk.com/incidents/';
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
                self.myCont = new self.Contact();
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
            return new crudViewModel();
        }
);