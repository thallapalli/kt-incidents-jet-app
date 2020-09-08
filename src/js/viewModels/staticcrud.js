  require(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojbufferingdataprovider', 'ojs/ojkeyset', 'ojs/ojcontext', 'ojs/ojknockout', 'ojs/ojinputtext',
  'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojlabel', 'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojtoolbar', 'ojs/ojmessages'],
  function (ko, Bootstrap, ArrayDataProvider, BufferingDataProvider, KeySet, Context)
  {

    function staticcrudViewModel() {
     var deptArray = [{ DepartmentId: 10, DepartmentName: 'Administration', LocationId: 100, ManagerId: 1001 },
      { DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200, ManagerId: 1002 },
      { DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 300, ManagerId: 1003 },
      { DepartmentId: 40, DepartmentName: 'Human Resources', LocationId: 400, ManagerId: 1004 },
      { DepartmentId: 50, DepartmentName: 'Accounting', LocationId: 500, ManagerId: 1005 },
      { DepartmentId: 60, DepartmentName: 'Operations', LocationId: 600, ManagerId: 1006 },
      { DepartmentId: 70, DepartmentName: 'Engineering', LocationId: 700, ManagerId: 1007 },
      { DepartmentId: 80, DepartmentName: 'Production', LocationId: 800, ManagerId: 1008 },
      { DepartmentId: 90, DepartmentName: 'Sales', LocationId: 900, ManagerId: 1009 },
      { DepartmentId: 100, DepartmentName: 'Customer Service', LocationId: 1000, ManagerId: 1010 }];
      this.deptObservableArray = ko.observableArray(deptArray);
      this.dataprovider = new BufferingDataProvider(new ArrayDataProvider(this.deptObservableArray, { keyAttributes: 'DepartmentId' }));
      this.dataprovider.addEventListener('submittableChange', function(event) {
        // BufferingDataProvider fires the "submittableChange" event whenever there is a change in the number of submittable items.
        // We can use this to update the UI.
        var submittable = event.detail;
        this.disableSubmit(submittable.length === 0);
        this.showSubmittableItems(submittable);
      }.bind(this));
      this.dataprovider.addEventListener('mutate', function(event) {
        if (this.isEmptyTable() === true && event.detail.add != null) {
          this.isEmptyTable(false);
        }
      }.bind(this));
  
  
      this.messageArray = ko.observableArray();
      this.groupValid = ko.observable();
  
      // intialize the observable values in the forms
      this.inputDepartmentId = ko.observable();
      this.inputDepartmentName = ko.observable();
      this.inputLocationId = ko.observable();
      this.inputManagerId = ko.observable();
  
      this.firstSelected = ko.observable();
      this.disableSubmit = ko.observable(true);
  
      // Return true if the Create button should be disabled
      this.disableCreate = ko.computed(function() {
        return !this.inputDepartmentId() || this.groupValid() === 'invalidShown';
      }.bind(this));
  
      // Return true if the Remove and Update buttons should be disabled
      this.disableRemoveUpdate = ko.computed(function() {
        const firstSelected = this.firstSelected();
        return !firstSelected || !firstSelected.key || this.groupValid() === 'invalidShown';
      }.bind(this));
  
      // Add a new row
      this.addRow = function () {
        if (this.groupValid() !== 'invalidShown') {
          var dept = {
            DepartmentId: this.inputDepartmentId(),
            DepartmentName: this.inputDepartmentName(),
            LocationId: this.inputLocationId(),
            ManagerId: this.inputManagerId()
          };
          this.dataprovider.addItem({metadata: {key: dept.DepartmentId}, data: dept});
        }
      }.bind(this);
  
      // Update the selected row
      this.updateRow = function () {
        if (this.groupValid() !== 'invalidShown') {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;
  
          if (currentRow != null) {
            var key = this.inputDepartmentId();
            var newData = {
              DepartmentId: this.inputDepartmentId(),
              DepartmentName: this.inputDepartmentName(),
              LocationId: this.inputLocationId(),
              ManagerId: this.inputManagerId()
            };
            this.dataprovider.updateItem({metadata: {key: key}, data: newData});
          }
        }
      }.bind(this);
  
      // Remove the selected row
      this.removeRow = function () {
        var element = document.getElementById('table');
        var currentRow = element.currentRow;
  
        if (currentRow != null) {
          var dataObj = element.getDataForVisibleRow(currentRow.rowIndex);
          this.dataprovider.removeItem({metadata: {key: dataObj.key}, data: dataObj.data});
          // Clear the table selection
          element.selected = {row: new KeySet.KeySetImpl(), column: new KeySet.KeySetImpl()};
        }
      }.bind(this);
  
      // Reset all rows to discard buffered changes
      this.resetRows = function () {
        this.dataprovider.resetAllUnsubmittedItems();
        if(this.dataprovider.isEmpty() === 'yes') {
            this.isEmptyTable(true);
          }
        this.messageArray([{severity: 'confirmation', summary: 'Changes have been reset.', autoTimeout: 4000}]);
      }.bind(this);
  
      this.findIndex = function(key) {
        var ar = this.deptObservableArray();
        for (var idx = 0; idx < this.deptObservableArray().length; idx++) {
          if (ar[idx].DepartmentId === key) {
            return idx;
          }
        }
        return -1;
      }.bind(this);
  
      // Commit a row to the data source.  This is dependent on the data source.
      this.commitOneRow = function(editItem) {
        var idx = this.findIndex(editItem.item.metadata.key);
        var error;
        if (idx > -1) {
          if (editItem.operation === 'update') {
            this.deptObservableArray.splice(idx, 1, editItem.item.data);
          } else if (editItem.operation === 'remove') {
            this.deptObservableArray.splice(idx, 1);
            if(this.dataprovider.isEmpty() === 'yes') {
            this.isEmptyTable(true);
          }
          } else {
            error = {severity: 'error', summary: 'add error', detail: 'Row with same key already exists'};
          }
        } else {
          if (editItem.operation === 'add') {
            this.deptObservableArray.splice(this.deptObservableArray().length, 0, editItem.item.data);
          } else {
            error = {severity: 'error', summary: editItem.operation + ' error', detail: 'Row for key cannot be found'};
          }
        }
  
        if (error) {
          return Promise.reject(error);
        }
  
        return Promise.resolve();
      };
  
      // Submit the unsubmitted items
      this.submitRows = function() {
        this.disableSubmit(true);
  
        // Get all the submittable items
        var editItems = this.dataprovider.getSubmittableItems();
        editItems.forEach(function(editItem) {
          // Set each edit item to "submitting" status before data submission
          this.dataprovider.setItemStatus(editItem, 'submitting');
  
          // Commit data
          this.commitOneRow(editItem).then(function() {
            // Set the edit item to "submitted" if successful
            this.dataprovider.setItemStatus(editItem, 'submitted');
          }.bind(this)).catch(function(error) {
            // Set the edit item back to "unsubmitted" with error if not successful
            this.dataprovider.setItemStatus(editItem, 'unsubmitted', error);
            error.autoTimeout = 4000;
            this.messageArray.push(error);
          }.bind(this));
        }.bind(this));
  
        this.messageArray([{severity: 'confirmation', summary: 'Changes have been submitted.', autoTimeout: 4000}]);
      }.bind(this);
  
      // Show all submittable edit items
      this.showSubmittableItems = function(submittable) {
        var textarea = document.getElementById('bufferContent');
        var textValue = "";
        submittable.forEach(function(editItem) {
          textValue += editItem.operation + " ";
          textValue += editItem.item.metadata.key + ": ";
          textValue += JSON.stringify(editItem.item.data);
          if (editItem.item.metadata.message) {
            textValue += " error: " + JSON.stringify(editItem.item.metadata.message);
          }
          textValue += "\n";
        });
        textarea.value = textValue;
      }
  
      // Listener for updating the form when row selection changes in the table
      this.firstSelectedRowChangedListener = function (event) {
        var itemContext = event.detail.value;
        if (itemContext && itemContext.data) {
          var dept = itemContext.data;
          this.inputDepartmentId(dept.DepartmentId);
          this.inputDepartmentName(dept.DepartmentName);
          this.inputLocationId(dept.LocationId);
          this.inputManagerId(dept.ManagerId);
        }
      }.bind(this);
  
      this.hideTable = function (hide) {
        var table = document.getElementById('table');
        var noDataDiv = document.getElementById('noDataDiv');
        if (hide === true) {
          table.classList.add('oj-sm-hide');
          noDataDiv.classList.remove('oj-sm-hide');
        } else {
          table.classList.remove('oj-sm-hide');
          noDataDiv.classList.add('oj-sm-hide');
        }
      };
  
     this.isEmptyTable = ko.observable(false);
  
    }
      return new staticcrudViewModel();
  }
);