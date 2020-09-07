define(
  ['accUtils',
   'knockout',
   'jquery',
   'ojs/ojarraydataprovider',
   'ojs/ojhtmlutils',
   'ojs/ojresponsiveutils',
   'ojs/ojresponsiveknockoututils',
   'ojs/ojlabel',
   'ojs/ojselectsingle',
   'ojs/ojchart',
   'ojs/ojlistview',
   'ojs/ojmodule-element'
  ],
  function (accUtils, ko, $, ArrayDataProvider, HtmlUtils, ResponsiveUtils, ResponsiveKnockoutUtils) {

    function DashboardViewModel() {
      var self = this;
       
      /**
       *  Declare Activity List observables and read data from JSON file
       */
      var url = "js/store_data.json";  //defines link to local data file

      self.activityDataProvider = ko.observable();  //gets data for Activities list

      // Get local data from file using jQuery method and method to return a Promise
      $.getJSON(url).then(function(data) {
         // Create variable for Activities list and populate using key attribute fetch
         var activitiesArray = data;
         self.activityDataProvider(new ArrayDataProvider(activitiesArray, { keyAttributes: 'id' }));
        }
      );

      /**
       * Declare selection list observables and provide values
       */

      // chart type values array and ArrayDataProvider observable
      var types = [
        { value: 'pie', label: 'Pie' },
        { value: 'bar', label: 'Bar' }
      ];

      self.chartTypes = new ArrayDataProvider(types, { keyAttributes: 'value' });

      // chart selection observable and default value
      self.val = ko.observable("pie");

      /**
       * Declare chart observables and add the static data
       */

      // chart data array and  ArrayDataProvider observable
      var chartData = [
        { "id": 0, "series": "Baseball", "group": "Group A", "value": 42 },
        { "id": 1, "series": "Baseball", "group": "Group B", "value": 34 },
        { "id": 2, "series": "Bicycling", "group": "Group A", "value": 55 },
        { "id": 3, "series": "Bicycling", "group": "Group B", "value": 30 },
        { "id": 4, "series": "Skiing", "group": "Group A", "value": 36 },
        { "id": 5, "series": "Skiing", "group": "Group B", "value": 50 },
        { "id": 6, "series": "Soccer", "group": "Group A", "value": 22 },
        { "id": 7, "series": "Soccer", "group": "Group B", "value": 46 }
      ];

      self.chartDataProvider = new ArrayDataProvider(chartData, { keyAttributes: 'id' });

      /** 
       *  Define the oj-module inline template for Activity Items list
       */
      // Display this content for large and extra large screen sizes
      var lg_xl_view = '<h3><oj-label for="itemsList">Activity Items</oj-label></h3>' +
        '<oj-list-view style="font-size: 18px">' +
        '<ul>' +
        '<li>' +
        '<div class="oj-flex-item">' +
        '<p>SureCatch Baseball Glove</p>' +
        '<p>Western R16 Helmet</p>' +
        '<p>Western C1 Helmet</p>' +
        '<p>Western Bat</p>' +
        '</div>' +
        '</li>' +
        '<li>' +
        '<div class="oj-flex-item">' +
        '<p>Air-Lift Tire Pump</p>' +
        '<p>Intact Bike Helmet</p>' +
        '<p>Nimbus Bike Tire</p>' +
        '<p>Refill Water Bottle</p>' +
        '<p>Swift Boys 21 Speed</p>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</oj-list-view>'

      // Display this content for small and medium screen sizes
      var sm_md_view = '<div id="sm_md" style="background-color:lightcyan; padding: 10px; font-size: 10px">' +
        '<h3><oj-label for="itemsList">Activity Items</oj-label></h3>' +
        '<oj-list-view style="font-size: 18px">' +
        '<ul>' +
        '<li>' +
        '<div class="oj-flex-item">' +
        '<p>SureCatch Baseball Glove</p>' +
        '<p>Western R16 Helmet</p>' +
        '<p>Western C1 Helmet</p>' +
        '<p>Western Bat</p>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</oj-list-view>'
        '</div>';

      // Identify the screen size and display the content for that screen size
      var lgQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

      self.large = ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
      self.moduleConfig = ko.pureComputed(function () {
        var viewNodes = HtmlUtils.stringToNodeArray(self.large() ? lg_xl_view : sm_md_view);
        return { view: viewNodes };
      });

      /**
       * End of oj-module code
       */

      
      /**
       * This section is standard navdrawer starter template code
       */ 
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

      /*
       * Returns a constructor for the ViewModel so that the ViewModel is constructed
       * each time the view is displayed.  Return an instance of the ViewModel if
       * only one instance of the ViewModel is needed.
       */
      return new DashboardViewModel();
  }
);