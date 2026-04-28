/* flatpickr-hijri-calendar v0.0.2, @license MIT */
import { DateTime } from 'luxon';

// (function (l, r) {
//   if (!l || l.getElementById("livereloadscript")) return;
//   r = l.createElement("script");
//   r.async = 1;
//   r.src =
//     "//" +
//     (self.location.host || "localhost").split(":")[0] +
//     ":35729/livereload.js?snipver=1";
//   r.id = "livereloadscript";
//   l.getElementsByTagName("head")[0].appendChild(r);
// })(self.document);
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
      ? define(factory)
      : ((global =
          typeof globalThis !== "undefined" ? globalThis : global || self),
        (global["flatpickr-hijri-calendar"] = factory()));
})(this, function () {
  "use strict";

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  function createElement(tag, className, content) {
    var e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== undefined) e.textContent = content;
    return e;
  }

  var defaultConfig = {
    showHijriDates: true,
    showHijriToggle: false,
    theme: "light",
    hijriToggleText: "إظهار التاريخ الهجري",
  };
  function hijriCalendarPlugin(dateTime, pluginConfig) {
    if (!dateTime || typeof dateTime.fromJSDate === "undefined") {
      throw new Error("hijriCalendarPlugin requires luxon DateTime class.");
    }
    var config = __assign(__assign({}, defaultConfig), pluginConfig);
    return function (fp) {
      var self = {
        luxon: null,
        hijriMonthContainer: null,
        hijriMonthName: null,
      };
      function build() {
        if (!fp.rContainer) return;
        self.hijriMonthContainer = createElement(
          "div",
          "flatpickr-hijri-month-container",
        );
        self.hijriMonthName = createElement(
          "span",
          "flatpickr-hijri-month-name",
        );
        self.hijriMonthName.innerHTML = "رمضان";
        self.hijriMonthContainer.appendChild(self.hijriMonthName);
        fp.monthNav.insertAdjacentElement("afterend", self.hijriMonthContainer);
        self.hijriMonthContainer.tabIndex = -1;
        buildMonth();
        buildActions();
        return;
      }
      function buildDay(_dObj, _dStr, _fp, dayElem) {
        if (!config.showHijriDates) {
          return;
        }
        var hijriDate = dateTime
          .fromJSDate(dayElem.dateObj)
          .reconfigure({ outputCalendar: "islamic-umalqura" })
          .toFormat("dd");
        var date = dayElem.innerText;
        var wrapper = createElement("span", "flatpickr-hijri-date-wrapper", "");
        var dateEl = createElement("span", "flatpickr-hijri-date-date", date);
        var className = "flatpickr-hijri-date-hijri";
        if (
          dayElem.classList.contains("nextMonthDay") ||
          dayElem.classList.contains("prevMonthDay")
        ) {
          className += " flatpickr-hijri-date-not-allowed";
        }
        if (dayElem.classList.contains("selected")) {
          className += " flatpickr-hijri-date-selected";
        }
        var hijriEl = createElement("span", className, hijriDate);
        wrapper.appendChild(dateEl);
        wrapper.appendChild(hijriEl);
        dayElem.innerHTML = wrapper.outerHTML;
      }
      function buildMonth() {
        if (!self.hijriMonthContainer || !self.hijriMonthName) {
          return;
        }
        var d = new Date(fp.currentYear, fp.currentMonth);
        var dt = dateTime.fromJSDate(d);
        // if (
        //   typeof fp.config.locale === "string" &&
        //   fp.config.locale.startsWith("ar")
        // ) {
          dt = dt.setLocale("ar");
        // }
        dt = dt.reconfigure({
          outputCalendar: "islamic-umalqura",
        });
        var monthBegin = dt.startOf("month").toFormat("LLLL");
        var monthEnd = dt.endOf("month").toFormat("LLLL");
        var yearBegin = dt.startOf("month").toFormat("y");
        var yearEnd = dt.endOf("month").toFormat("y");
        var month;
        if (yearBegin !== yearEnd) {
          if (monthBegin !== monthEnd) {
            month = ""
              .concat(monthBegin, " ")
              .concat(yearBegin, " / ")
              .concat(monthEnd, " ")
              .concat(yearEnd);
          } else {
            month = monthBegin;
          }
        } else {
          if (monthBegin !== monthEnd) {
            month = ""
              .concat(monthBegin, " / ")
              .concat(monthEnd, " ")
              .concat(yearBegin);
          } else {
            month = "".concat(monthBegin, " ").concat(yearBegin);
          }
        }
        self.hijriMonthName.innerHTML = month;
      }
      function buildActions() {
        var actionsContainer = createElement(
          "div",
          "flatpickr-hijri-actions "
            .concat(config.showHijriToggle ? "visible" : "", " ")
            .concat(config.theme, "Theme"),
          "ACTIONS",
        );
        actionsContainer.innerHTML =
          '\n        <label for="flatpickr-hijri-switch">'.concat(
            config.hijriToggleText,
            '</label>\n        <label class="flatpickr-hijri-switch">\n            <input id="flatpickr-hijri-switch" class="flatpickr-hijri-switch" type="checkbox">\n            <span class="flatpickr-hijri-slider"></span>\n        </label>\n      ',
          );
        actionsContainer.tabIndex = -1;
        var confirmDateContainer =
          fp.calendarContainer.querySelector(".flatpickr-confirm");
        fp.calendarContainer.appendChild(actionsContainer);
        fp.calendarContainer.insertBefore(
          actionsContainer,
          confirmDateContainer,
        );
        var switchInput = fp.calendarContainer.querySelector(
          "input.flatpickr-hijri-switch",
        );
        switchInput.checked = true;
        switchInput.addEventListener("change", function (event) {
          var _a;
          config.showHijriDates =
            (_a = event.target) === null || _a === void 0 ? void 0 : _a.checked;
          if (self.hijriMonthName) {
            self.hijriMonthName.innerHTML = "";
          }
          if (config.showHijriDates) {
            buildMonth();
          }
          fp.redraw();
        });
      }
      return {
        onMonthChange: [buildMonth],
        onDayCreate: [buildDay],
        onReady: [build],
      };
    };
  }
  if (typeof window !== "undefined") {
    window.hijriCalendarPlugin = hijriCalendarPlugin;
  }

  return hijriCalendarPlugin;
});
//# sourceMappingURL=flatpickr-hijri-calendar.js.map

// rangeFlatpickrPlugin
(function ($) {
  var predefinedRanges = function () {
    return function (fp) {
      const pluginData = {
        ranges: typeof fp.config.ranges !== "undefined" ? fp.config.ranges : {},
        rangesOnly:
          typeof fp.config.rangesOnly === "undefined" || fp.config.rangesOnly,
        rangesAllowCustom:
          typeof fp.config.rangesAllowCustom === "undefined" ||
          fp.config.rangesAllowCustom,
        rangesCustomLabel:
          typeof fp.config.rangesCustomLabel !== "undefined"
            ? fp.config.rangesCustomLabel
            : "Custom Range",
        rangesNav: $("<ul>").addClass(
          "nav flex-column flatpickr-predefined-ranges px-3",
        ),
        rangesButtons: {},
      };

      /**
       * @param {string} label
       * @returns {jQuery}
       */
      const addRangeButton = function (label) {
        pluginData.rangesButtons[label] = $("<button>")
          .addClass("nav-link btn btn-link text-start")
          .attr("type", "button")
          .text(label);
        pluginData.rangesNav.append(
          $("<li>")
            .addClass("nav-item d-grid")
            .append(pluginData.rangesButtons[label]),
        );
        return pluginData.rangesButtons[label];
      };

      /**
       * Loop the ranges and check for one that matches the selected dates, adding
       * an active class to its corresponding button.
       *
       * If there are selected dates and a range is not matched, check for a custom
       * range button and set it to active.
       *
       * If there are no selected dates or a range is not matched, check if the
       * rangeOnly option is true and if so hide the calendar.
       *
       * @param {Array} selectedDates
       */
      const selectActiveRangeButton = function (selectedDates) {
        let isPredefinedRange = false;
        pluginData.rangesNav.find(".active").removeClass("active");

        if (selectedDates.length > 0) {
          let startDate = DateTime.fromJSDate(selectedDates[0]);
          let endDate =
            selectedDates.length > 1 ? DateTime.fromJSDate(selectedDates[1]) : startDate;
          for (const [label, range] of Object.entries(pluginData.ranges)) {
            if (
              startDate.hasSame(DateTime.fromJSDate(range[0]), "day") &&
              endDate.hasSame(DateTime.fromJSDate(range[1]), "day")
            ) {
              fp.altInput.value=label;
              pluginData.rangesButtons[label].addClass("active");
              isPredefinedRange = true;
              break;
            }
          }
        }

        if (
          selectedDates.length > 0 &&
          !isPredefinedRange &&
          pluginData.rangesButtons.hasOwnProperty(pluginData.rangesCustomLabel)
        ) {
          pluginData.rangesButtons[pluginData.rangesCustomLabel].addClass(
            "active",
          );
          $(fp.calendarContainer).removeClass(
            "flatpickr-predefined-ranges-only",
          );
        } else if (pluginData.rangesOnly) {
          $(fp.calendarContainer).addClass("flatpickr-predefined-ranges-only");
        }
      };

      return {
        /**
         * Loop the ranges and add buttons for each range which a click handler to set the date.
         * Also adds a custom range button if the rangesAllowCustom option is set to true.
         */
        onReady(selectedDates) {
          for (const [label, range] of Object.entries(pluginData.ranges)) {
            addRangeButton(label).on("click", function () {
              $(this).blur();
              fp.setDate([range[0], range[1]], true);
              fp.close();
            });
          }

          if (pluginData.rangesNav.children().length > 0) {
            if (pluginData.rangesOnly && pluginData.rangesAllowCustom) {
              addRangeButton(pluginData.rangesCustomLabel).on(
                "click",
                function () {
                  $(this).blur();
                  pluginData.rangesNav.find(".active").removeClass("active");
                  $(this).addClass("active");
                  $(fp.calendarContainer).removeClass(
                    "flatpickr-predefined-ranges-only",
                  );
                },
              );
            }

            $(fp.calendarContainer).prepend(pluginData.rangesNav);
            $(fp.calendarContainer).addClass("flatpickr-has-predefined-ranges");
            // make sure the right range button is active for the default value
            selectActiveRangeButton(selectedDates);
          }
        },

        /**
         * Make sure the right range button is active when a value is manually entered
         *
         * @param {Array} selectedDates
         */
        onValueUpdate(selectedDates) {
          selectActiveRangeButton(selectedDates);
        },
      };
    };
  };

  window.rangeFlatpickrPlugin = new predefinedRanges();
})(jQuery);
