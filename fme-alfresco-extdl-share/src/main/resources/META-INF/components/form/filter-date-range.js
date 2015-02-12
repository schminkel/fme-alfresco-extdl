/**
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
 
/**
 * DateRange component.
 * 
 * @namespace Alfresco
 * @class Alfresco.DateRange
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      KeyListener = YAHOO.util.KeyListener;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
    * FilterDateRange constructor.
    * 
    * @param {String} htmlId The HTML id of the control element
    * @param {String} valueHtmlId The HTML id prefix of the value elements
    * @return {Alfresco.FilterDateRange} The new DateRange instance
    * @constructor
    */
   Alfresco.FilterDateRange = function(htmlId, valueHtmlId)
   {
      Alfresco.FilterDateRange.superclass.constructor.call(this, "Alfresco.FilterDateRange", htmlId, ["button", "calendar"]);
      
      this.valueHtmlId = valueHtmlId;
      this.currentFromDate = "";
      this.currentToDate = "";
      
      return this;
   };
   
   YAHOO.extend(Alfresco.FilterDateRange, Alfresco.component.Base,
   {
      /**
       * Current From date value
       * 
       * @property currentFromDate
       * @type string
       */
      currentFromDate: null,
      
      /**
       * Current To date value
       * 
       * @property currentToDate
       * @type string
       */
      currentToDate: null,
      
      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function FilterDateRange_onReady()
      {
          // TODO TSL: Find better solution, event listener might be overwritten somewhere else
          var thing = this;
          setTimeout(function() {

             var toDate = new Date();
             var fromDate = new Date();
             fromDate.setMonth(toDate.getMonth() - 1);

             // construct the pickers
             var page = (fromDate.getMonth() + 1) + "/" + fromDate.getFullYear();
             var selected = (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "/" + fromDate.getFullYear();
             thing.widgets.calendarFrom = new YAHOO.widget.Calendar(thing.id + "-from", thing.id + "-from", { title:thing.msg("form.control.date-picker.choose"), close:true, navigator:true });
             thing.widgets.calendarFrom.cfg.setProperty("pagedate", page);
             thing.widgets.calendarFrom.cfg.setProperty("selected", selected);
             thing.widgets.calendarFrom.hideEvent.subscribe(function()
             {
                // Focus icon after calendar is closed
                Dom.getElementsByClassName("datepicker-icon", "img", thing.id + "-icon-from")[0].focus();
             }, thing, true);
             Alfresco.util.calI18nParams(thing.widgets.calendarFrom);
             // setup keyboard enter events on the image instead of the link to get focus outline displayed
             //3.4.d doesn't havve thing util function...
             if(Alfresco.util.useAsButton){
                Alfresco.util.useAsButton(Dom.getElementsByClassName("datepicker-icon", "img", thing.id + "-icon-from")[0], thing._showPickerFrom, null, thing);
             }

             page = (toDate.getMonth() + 1) + "/" + toDate.getFullYear();
             selected = (toDate.getMonth() + 1) + "/" + toDate.getDate() + "/" + toDate.getFullYear();
             thing.widgets.calendarTo = new YAHOO.widget.Calendar(thing.id + "-to", thing.id + "-to", { title:thing.msg("form.control.date-picker.choose"), close:true, navigator:true });
             thing.widgets.calendarTo.cfg.setProperty("pagedate", page);
             thing.widgets.calendarTo.cfg.setProperty("selected", selected);
             thing.widgets.calendarTo.hideEvent.subscribe(function()
             {
                // Focus icon after calendar is closed
                Dom.getElementsByClassName("datepicker-icon", "img", thing.id + "-icon-to")[0].focus();
             }, thing, true);
             Alfresco.util.calI18nParams(thing.widgets.calendarTo);
             // setup keyboard enter events on the image instead of the link to get focus outline displayed
             //3.4.d doesn't havve thing util function...
             if(Alfresco.util.useAsButton){
                 Alfresco.util.useAsButton(Dom.getElementsByClassName("datepicker-icon", "img", thing.id + "-icon-to")[0], thing._showPickerTo, null, thing);
             }

             // setup events
             thing.widgets.calendarFrom.selectEvent.subscribe(thing._handlePickerChangeFrom, thing, true);
             Event.addListener(thing.id + "-date-from", "keyup", thing._handleFieldChangeFrom, thing, true);
             Event.addListener(thing.id + "-icon-from", "click", thing._showPickerFrom, thing, true);
             thing.widgets.calendarTo.selectEvent.subscribe(thing._handlePickerChangeTo, thing, true);
             Event.addListener(thing.id + "-date-to", "keyup", thing._handleFieldChangeTo, thing, true);
             Event.addListener(thing.id + "-icon-to", "click", thing._showPickerTo, thing, true);

             // render the calendar controls
             thing.widgets.calendarFrom.render();
             thing.widgets.calendarTo.render();

         }, 500);

      },
      
      /**
       * Handles the date picker icon being clicked.
       * 
       * @method _showPickerFrom
       * @param event The event that occurred
       * @private
       */
      _showPickerFrom: function FilterDateRange__showPickerFrom(event)
      {
         this.widgets.calendarFrom.show();
      },
      
      /**
       * Handles the date picker icon being clicked.
       * 
       * @method _showPickerTo
       * @param event The event that occurred
       * @private
       */
      _showPickerTo: function FilterDateRange__showPickerTo(event)
      {
         this.widgets.calendarTo.show();
      },
      
      /**
       * Handles the from date being changed in the date picker YUI control.
       * 
       * @method _handlePickerChangeFrom
       * @param type
       * @param args
       * @param obj
       * @private
       */
      _handlePickerChangeFrom: function FilterDateRange__handlePickerChangeFrom(type, args, obj)
      {
         // update the date field
         var selected = args[0];
         var selDate = this.widgets.calendarFrom.toDate(selected[0]);
         var dateEntry = selDate.toString(this.msg("form.control.date-picker.entry.date.format"));
         Dom.get(this.id + "-date-from").value = dateEntry;
         
         // if we have a valid date, convert to ISO format and set value on hidden field
         if (selDate != null)
         {
            var isoValue = Alfresco.util.toISO8601(selDate, {"milliseconds":false});
            this.currentFromDate = isoValue;
            this._updateCurrentValue();
            
            Dom.removeClass(this.id + "-date-from", "invalid");
         }
         
         // Hide calendar if the calendar was open (Unfortunately there is no proper yui api method for this)
         if (Dom.getStyle(this.id + "-from", "display") != "none")
         {
            this.widgets.calendarFrom.hide();
         }
      },
      
      /**
       * Handles the from date being changed in the date picker YUI control.
       * 
       * @method _handlePickerChangeTo
       * @param type
       * @param args
       * @param obj
       * @private
       */
      _handlePickerChangeTo: function FilterDateRange__handlePickerChangeTo(type, args, obj)
      {
         // update the date field
         var selected = args[0];
         var selDate = this.widgets.calendarTo.toDate(selected[0]);
         var dateEntry = selDate.toString(this.msg("form.control.date-picker.entry.date.format"));
         Dom.get(this.id + "-date-to").value = dateEntry;
         
         // if we have a valid date, convert to ISO format and set value on hidden field
         if (selDate != null)
         {
            var isoValue = Alfresco.util.toISO8601(selDate, {"milliseconds":false});
            this.currentToDate = isoValue;
            this._updateCurrentValue();
            
            Dom.removeClass(this.id + "-date-to", "invalid");
         }
         
         // Hide calendar if the calendar was open (Unfortunately there is no proper yui api method for this)
         if (Dom.getStyle(this.id + "-to", "display") != "none")
         {
            this.widgets.calendarTo.hide();
         }
      },
      
      /**
       * Updates the currently stored date range value in the hidden form field.
       * 
       * @method _updateCurrentValue
       * @private
       */
      _updateCurrentValue: function FilterDateRange__updateCurrentValue()
      {
         var value = this.currentFromDate + "TO" + this.currentToDate;
         value = value == "TO" ? "" : value;         
         Dom.get(this.valueHtmlId).value = value;
      },
      
      /**
       * Handles the date or time being changed in either input field.
       * 
       * @method _handleFieldChangeFrom
       * @param event The event that occurred
       * @private
       */
      _handleFieldChangeFrom: function FilterDateRange__handleFieldChangeFrom(event)
      {
         var changedDate = Dom.get(this.id + "-date-from").value;
         if (changedDate.length > 0)
         {
            // Only set for actual value changes so tab or shift events doesn't remove the "text selection" of the input field
            if (event == undefined || (event.keyCode != KeyListener.KEY.TAB && event.keyCode != KeyListener.KEY.SHIFT))
            {

               // convert to format expected by YUI
               var parsedDate = Date.parseExact(changedDate, this.msg("form.control.date-picker.entry.date.format"));
               if (parsedDate != null)
               {
                  this.widgets.calendarFrom.select((parsedDate.getMonth() + 1) + "/" + parsedDate.getDate() + "/" + parsedDate.getFullYear());
                  var selectedDates = this.widgets.calendarFrom.getSelectedDates();
                  if (selectedDates.length > 0)
                  {
                     Dom.removeClass(this.id + "-date-from", "invalid");
                     var firstDate = selectedDates[0];
                     this.widgets.calendarFrom.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
                     this.widgets.calendarFrom.render();
                  }
               }
               else
               {
                  Dom.addClass(this.id + "-date-from", "invalid");
               }
            }
         }
         else
         {
            // when the date is completely cleared remove the hidden field and remove the invalid class
            Dom.removeClass(this.id + "-date-from", "invalid");
            this.currentFromDate = "";
            this._updateCurrentValue();
         }
      },
      
      /**
       * Handles the date or time being changed in either input field.
       * 
       * @method _handleFieldChangeFrom
       * @param event The event that occurred
       * @private
       */
      _handleFieldChangeTo: function FilterDateRange__handleFieldChangeTo(event)
      {
         var changedDate = Dom.get(this.id + "-date-to").value;
         if (changedDate.length > 0)
         {
            // convert to format expected by YUI
            var parsedDate = Date.parseExact(changedDate, this.msg("form.control.date-picker.entry.date.format"));
            if (parsedDate != null)
            {
               this.widgets.calendarTo.select((parsedDate.getMonth() + 1) + "/" + parsedDate.getDate() + "/" + parsedDate.getFullYear());
               var selectedDates = this.widgets.calendarTo.getSelectedDates();
               if (selectedDates.length > 0)
               {
                  Dom.removeClass(this.id + "-date-to", "invalid");
                  var firstDate = selectedDates[0];
                  this.widgets.calendarTo.cfg.setProperty("pagedate", (firstDate.getMonth()+1) + "/" + firstDate.getFullYear());
                  this.widgets.calendarTo.render();
               }
            }
            else
            {
               Dom.addClass(this.id + "-date-to", "invalid");
            }
         }
         else
         {
            // when the date is completely cleared remove the hidden field and remove the invalid class
            Dom.removeClass(this.id + "-date-to", "invalid");
            this.currentToDate = "";
            this._updateCurrentValue();            
         }
      }
   });
})();