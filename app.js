(function () {
  "use strict";

  if (!window.XState || !window.XState.createMachine) {
    throw new Error("XState library is required.");
  }

  var APP_NAME = "next-event";
  var RTL_LANGS = ["he", "ar", "fa", "ur"];
  var POLL_INTERVAL_MS = 3000;
  var POLL_MAX_ATTEMPTS = 40;
  var XState = window.XState;
  var createMachine = XState.createMachine;
  var assign = XState.assign;
  var interpret = XState.interpret;

  var i18n = {
    he: {
      title: "\u05d0\u05d9\u05e8\u05d5\u05e2 \u05d4\u05d1\u05d0",
      event: "\u05d0\u05d9\u05e8\u05d5\u05e2",
      actions: "\u05e4\u05e2\u05d5\u05dc\u05d5\u05ea",
      attachments: "\u05e7\u05d1\u05e6\u05d9\u05dd \u05de\u05e6\u05d5\u05e8\u05e4\u05d9\u05dd",
      items: "\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd",
      description: "\u05ea\u05d9\u05d0\u05d5\u05e8",
      rawEvent: "\u05d0\u05d9\u05e8\u05d5\u05e2 \u05d2\u05d5\u05dc\u05de\u05d9",
      report: "\u05d3\u05d5\u05d7",
      refresh: "\u05e8\u05e2\u05e0\u05d5\u05df",
      next: "\u05d4\u05d1\u05d0",
      prev: "\u05e7\u05d5\u05d3\u05dd",
      openInApp: "\u05e4\u05ea\u05d7 \u05d1\u05de\u05e2\u05e8\u05db\u05ea",
      createReport: "\u05e6\u05d5\u05e8 \u05d3\u05d5\u05d7 FullEvent",
      checkReport: "\u05d1\u05d3\u05d5\u05e7 \u05e1\u05d8\u05d8\u05d5\u05e1 \u05d3\u05d5\u05d7",
      openGeneratedReport: "\u05e4\u05ea\u05d7 \u05d3\u05d5\u05d7 \u05e9\u05e0\u05d5\u05e6\u05e8",
      noOpenEvents: "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05d0\u05d9\u05e8\u05d5\u05e2\u05d9\u05dd \u05e4\u05ea\u05d5\u05d7\u05d9\u05dd \u05d1\u05e9\u05e0\u05d4 \u05d4\u05d0\u05d7\u05e8\u05d5\u05e0\u05d4.",
      noData: "\u05d0\u05d9\u05df \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd.",
      noReport: "\u05e2\u05d3\u05d9\u05d9\u05df \u05dc\u05d0 \u05e0\u05d5\u05e6\u05e8\u05d4 \u05d1\u05e7\u05e9\u05ea \u05d3\u05d5\u05d7.",
      apiCommand: "\u05e4\u05e7\u05d5\u05d3\u05ea API:",
      loading: "\u05d8\u05d5\u05e2\u05df...",
      waitingHost: "\u05de\u05de\u05ea\u05d9\u05df \u05dc\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05de\u05d4\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05de\u05d0\u05e8\u05d7\u05ea...",
      reportRequested: "\u05d1\u05e7\u05e9\u05ea \u05d4\u05d3\u05d5\u05d7 \u05e0\u05d5\u05e6\u05e8\u05d4.",
      reportStatus: "\u05e1\u05d8\u05d8\u05d5\u05e1 \u05d3\u05d5\u05d7:",
      reportId: "\u05de\u05d6\u05d4\u05d4 \u05d1\u05e7\u05e9\u05ea \u05d3\u05d5\u05d7",
      openCount: "\u05d0\u05d9\u05e8\u05d5\u05e2\u05d9\u05dd \u05e4\u05ea\u05d5\u05d7\u05d9\u05dd",
      pollingInProgress: "\u05de\u05d1\u05e6\u05e2 \u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05e1\u05d8\u05d8\u05d5\u05e1 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05d5\u05ea...",
      pollingTimeout: "\u05ea\u05dd \u05d6\u05de\u05df \u05d4\u05d4\u05de\u05ea\u05e0\u05d4 \u05dc\u05e4\u05d5\u05dc\u05d9\u05e0\u05d2.",
      statusNames: {
        Created: "\u05e0\u05d5\u05e6\u05e8",
        Started: "\u05d4\u05ea\u05d7\u05d9\u05dc",
        QueryStarted: "\u05e9\u05d0\u05d9\u05dc\u05ea\u05d0 \u05d4\u05ea\u05d7\u05d9\u05dc\u05d4",
        QueryCompleted: "\u05e9\u05d0\u05d9\u05dc\u05ea\u05d0 \u05d4\u05d5\u05e9\u05dc\u05de\u05d4",
        RenderingStarted: "\u05d9\u05e6\u05d9\u05e8\u05ea \u05e7\u05d5\u05d1\u05e5 \u05d4\u05ea\u05d7\u05d9\u05dc\u05d4",
        RenderingCompleted: "\u05d9\u05e6\u05d9\u05e8\u05ea \u05e7\u05d5\u05d1\u05e5 \u05d4\u05d5\u05e9\u05dc\u05de\u05d4",
        UploadStarted: "\u05d4\u05e2\u05dc\u05d0\u05d4 \u05d4\u05ea\u05d7\u05d9\u05dc\u05d4",
        UploadCompleted: "\u05d4\u05e2\u05dc\u05d0\u05d4 \u05d4\u05d5\u05e9\u05dc\u05de\u05d4",
        ActionStarted: "\u05e4\u05e2\u05d5\u05dc\u05d4 \u05d4\u05ea\u05d7\u05d9\u05dc\u05d4",
        ActionCompleted: "\u05e4\u05e2\u05d5\u05dc\u05d4 \u05d4\u05d5\u05e9\u05dc\u05de\u05d4",
        Completed: "\u05d4\u05d5\u05e9\u05dc\u05dd",
        Error: "\u05e9\u05d2\u05d9\u05d0\u05d4",
        Failed: "\u05e0\u05db\u05e9\u05dc",
        Pending: "\u05de\u05de\u05ea\u05d9\u05df"
      }
    },
    en: {
      title: "Next Event",
      event: "Event",
      actions: "Actions",
      attachments: "Attachments",
      items: "Items",
      description: "Description",
      rawEvent: "Raw Event",
      report: "Report",
      refresh: "Refresh",
      next: "Next",
      prev: "Prev",
      openInApp: "Open In App",
      createReport: "Create FullEvent Report",
      checkReport: "Check Report Status",
      openGeneratedReport: "Open Generated Report",
      noOpenEvents: "No open events were found in the last year.",
      noData: "No data.",
      noReport: "No report request yet.",
      apiCommand: "API command:",
      loading: "Loading...",
      waitingHost: "Waiting for host configuration...",
      reportRequested: "Report requested.",
      reportStatus: "Report status:",
      reportId: "Report request ID",
      openCount: "Open events",
      pollingInProgress: "Polling report status...",
      pollingTimeout: "Polling timeout reached.",
      statusNames: {
        Created: "Created",
        Started: "Started",
        QueryStarted: "QueryStarted",
        QueryCompleted: "QueryCompleted",
        RenderingStarted: "RenderingStarted",
        RenderingCompleted: "RenderingCompleted",
        UploadStarted: "UploadStarted",
        UploadCompleted: "UploadCompleted",
        ActionStarted: "ActionStarted",
        ActionCompleted: "ActionCompleted",
        Completed: "Completed",
        Error: "Error",
        Failed: "Failed",
        Pending: "Pending"
      }
    }
  };

  var reportStatusByNumber = {
    0: "Created",
    1: "Started",
    2: "QueryStarted",
    3: "QueryCompleted",
    4: "RenderingStarted",
    5: "RenderingCompleted",
    6: "UploadStarted",
    7: "UploadCompleted",
    8: "ActionStarted",
    9: "ActionCompleted",
    10: "Completed",
    11: "Error",
    12: "Failed",
    13: "Pending"
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function toArray(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (value === null || value === undefined) {
      return [];
    }
    return [value];
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(value, language) {
    if (!value) {
      return "-";
    }
    var date = new Date(value);
    if (isNaN(date.getTime())) {
      return String(value);
    }
    try {
      return new Intl.DateTimeFormat(language || "he-IL", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(date);
    } catch (e) {
      return date.toISOString();
    }
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function parseAppConnections(configuration, appName) {
    var cfg = Array.isArray(configuration) ? configuration : [];
    var prefix = String(appName || "");
    var result = {};

    cfg.forEach(function (item) {
      if (!item || item.Group !== "Connections" || typeof item.Name !== "string") {
        return;
      }
      if (!item.Name.startsWith(prefix)) {
        return;
      }

      var subKey = item.Name.slice(prefix.length).replace(/^[._:-]+/, "") || item.Name;
      var value = item.Value;
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // keep raw string value
        }
      }
      result[subKey] = value;
    });

    return result;
  }

  function resolveLanguage(runtime) {
    var culture = String(runtime.CultureInfo || runtime.LanguageCode || "he-IL").toLowerCase();
    var shortCode = culture.split(/[-_]/)[0];
    var configuredDirection = String(runtime.LanguageDirection || "").toLowerCase();
    var direction = configuredDirection === "rtl" || configuredDirection === "ltr"
      ? configuredDirection
      : (RTL_LANGS.indexOf(shortCode) >= 0 ? "rtl" : "ltr");

    // Hebrew first; English fallback for explicit English locale.
    var dictionary = shortCode === "en" ? i18n.en : i18n.he;

    return {
      language: culture,
      shortCode: shortCode || "he",
      direction: direction,
      dictionary: dictionary
    };
  }

  function applyLanguage(languageModel) {
    var html = document.documentElement;
    html.lang = languageModel.shortCode || "he";
    html.dir = languageModel.direction;
    byId("language-chip").textContent = languageModel.direction.toUpperCase();
  }

  function readHostContext() {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        reject(new Error("Timed out while waiting for host postMessage context."));
      }, 15000);

      window.addEventListener("message", function (event) {
        try {
          var payload = typeof event.data === "string"
            ? JSON.parse(event.data || "{}")
            : (event.data || {});
          clearTimeout(timer);
          resolve(payload);
        } catch (error) {
          clearTimeout(timer);
          reject(error);
        }
      }, { once: true });
    });
  }

  function createApiClient(runtime) {
    var baseUrl = String(runtime.ApiAddress || "").replace(/\/+$/, "");
    var tokenType = (runtime.Token && runtime.Token.token_type) || "bearer";
    var accessToken = (runtime.Token && runtime.Token.access_token) || "";

    if (!baseUrl) {
      throw new Error("Missing ApiAddress in host runtime context.");
    }
    if (!accessToken) {
      throw new Error("Missing access token in host runtime context.");
    }

    async function request(path, options) {
      var opts = options || {};
      var method = opts.method || "GET";
      var headers = Object.assign({}, opts.headers || {}, {
        Authorization: tokenType + " " + accessToken
      });
      var body = opts.body;

      if (body && typeof body === "object" && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(body);
      }

      var response = await fetch(baseUrl + path, {
        method: method,
        headers: headers,
        body: body
      });

      if (!response.ok) {
        var errorText = await response.text();
        throw new Error("HTTP " + response.status + ": " + errorText);
      }

      var contentType = response.headers.get("content-type") || "";
      return contentType.indexOf("application/json") >= 0
        ? response.json()
        : response.text();
    }

    return {
      request: request,
      baseUrl: baseUrl,
      tokenType: tokenType
    };
  }

  function buildBaseEventLogFilter(predefinedFilter) {
    var now = new Date();
    var from = new Date(now);
    from.setFullYear(from.getFullYear() - 1);

    var base = {
      Status: 1,
      ItemStatus: 0,
      FilterDatesBy: 0,
      IncludeChildEvents: true,
      FromDate: from.toISOString(),
      ToDate: now.toISOString(),
      DatesRange: {
        From: from.toISOString(),
        To: now.toISOString()
      }
    };

    if (predefinedFilter && typeof predefinedFilter === "object") {
      return Object.assign({}, base, predefinedFilter);
    }
    return base;
  }

  function buildPagedEventLogFilter(baseFilter, pageIndex, pageSize) {
    var startIndex = (pageIndex - 1) * pageSize;
    return Object.assign({}, baseFilter, {
      PageSize: pageSize,
      PageIndex: pageIndex,
      StartIndex: startIndex
    });
  }

  function getReportRequestId(reportRequest) {
    return reportRequest && (reportRequest.UniqueId || reportRequest.uniqueId || reportRequest.Id || reportRequest.id);
  }

  function statusKey(statusValue) {
    if (typeof statusValue === "number") {
      return reportStatusByNumber[statusValue] || String(statusValue);
    }
    if (typeof statusValue === "string") {
      return statusValue;
    }
    return "Unknown";
  }

  function isTerminalReportStatus(statusValue) {
    var key = statusKey(statusValue);
    return key === "Completed" || key === "Error" || key === "Failed";
  }

  function localizeReportStatus(statusValue, dict) {
    var key = statusKey(statusValue);
    return (dict.statusNames && dict.statusNames[key]) || key;
  }

  function buildOpenEventLink(runtime, eventId) {
    var appRoot = String(runtime.ApplicationUrl || runtime.Url || "https://mnt.ylm.co.il").replace(/\/+$/, "");
    return appRoot + "/index.html#/Incidents/" + eventId + "/Details";
  }

  function buildReportCommand(ctx) {
    if (!ctx.currentEvent || !ctx.client) {
      return "";
    }
    var eventId = ctx.currentEvent.Id;
    var body = JSON.stringify({ EventId: eventId, Id: eventId, IgnoreCustomReport: true }, null, 2);
    return [
      "curl -X POST \\",
      "  '" + ctx.runtime.ApiAddress + "/api/Reports/Create?report=FullEvent&output=PDF' \\",
      "  -H 'Authorization: " + ctx.client.tokenType + " <access_token>' \\",
      "  -H 'Content-Type: application/json' \\",
      "  -d '" + body.replace(/\n/g, "") + "'"
    ].join("\n");
  }

  async function fetchEventBundle(client, event) {
    var eventId = event.Id;
    var results = await Promise.all([
      client.request("/api/Events/ById/" + eventId + "?includeActions=true&fullAttachmentUrl=true").catch(function () { return null; }),
      client.request("/api/EventLog/" + eventId + "/Actions").catch(function () { return []; }),
      client.request("/api/Attachments/Event/" + eventId).catch(function () { return []; }),
      client.request("/api/Events/" + eventId + "/Items").catch(function () { return []; })
    ]);

    var details = results[0] || event;
    var actions = toArray(results[1]);
    var attachments = toArray(results[2]);
    var items = toArray(results[3]);

    if (!actions.length && details.Actions) {
      actions = toArray(details.Actions);
    }
    if (!attachments.length && details.Attachments) {
      attachments = toArray(details.Attachments);
    }
    if (!items.length && details.Items) {
      items = toArray(details.Items);
    }

    return {
      currentEvent: Object.assign({}, event, details),
      details: details,
      actions: actions,
      attachments: attachments,
      items: items
    };
  }

  function render(state) {
    var ctx = state.context;
    var dict = ctx.language.dictionary;
    var event = ctx.currentEvent;
    var reportLinkEl = byId("report-link");

    byId("title").textContent = dict.title;
    byId("event-heading").textContent = dict.event;
    byId("actions-heading").textContent = dict.actions;
    byId("attachments-heading").textContent = dict.attachments;
    byId("items-heading").textContent = dict.items;
    byId("report-heading").textContent = dict.report;
    byId("raw-heading").textContent = dict.rawEvent;
    byId("btn-refresh").textContent = dict.refresh;
    byId("btn-prev").textContent = dict.prev;
    byId("btn-next").textContent = dict.next;
    byId("open-event-link").textContent = dict.openInApp;
    byId("btn-create-report").textContent = dict.createReport;
    byId("btn-check-report").textContent = dict.checkReport;
    reportLinkEl.textContent = dict.openGeneratedReport;
    byId("report-command").textContent = buildReportCommand(ctx);

    var totalCount = Number(ctx.totalCount || 0);
    byId("event-position").textContent = totalCount ? (ctx.pageIndex + " / " + totalCount) : "0 / 0";
    byId("event-count").textContent = totalCount ? ("(" + dict.openCount + ": " + totalCount + ")") : "";

    var isLoadingPage = state.matches("loadingPage");
    var isCreatingReport = state.matches("creatingReport");
    var isCheckingReport = state.matches("checkingReport");

    byId("btn-prev").disabled = isLoadingPage || isCreatingReport || isCheckingReport || ctx.pageIndex <= 1;
    byId("btn-next").disabled = isLoadingPage || isCreatingReport || isCheckingReport || !totalCount || ctx.pageIndex >= totalCount;
    byId("btn-refresh").disabled = isLoadingPage || isCreatingReport;
    byId("btn-create-report").disabled = !event || isCreatingReport || isLoadingPage;
    byId("btn-check-report").disabled = !ctx.reportRequestId || isCheckingReport || isCreatingReport;

    var errorBox = byId("error-box");
    if (ctx.error) {
      errorBox.classList.remove("hidden");
      errorBox.textContent = ctx.error;
    } else {
      errorBox.classList.add("hidden");
      errorBox.textContent = "";
    }

    if (!event) {
      byId("event-summary").innerHTML = "<div class='summary-item'><div class='label'>" + escapeHtml(dict.loading) + "</div><div class='value'>-</div></div>";
      byId("event-description").textContent = state.matches("bootstrapping") ? dict.waitingHost : dict.noData;
      byId("actions-list").innerHTML = "";
      byId("attachments-list").innerHTML = "";
      byId("items-body").innerHTML = "";
      byId("raw-json").textContent = "";
      byId("open-event-link").href = "#";
      byId("report-status").textContent = dict.noReport;
      reportLinkEl.classList.add("hidden");
      reportLinkEl.href = "#";
      return;
    }

    var summaryRows = [
      { label: "ID", value: event.Id },
      { label: "RunningIndex", value: event.RunningIndex },
      { label: "ReferenceId", value: event.ReferenceId },
      { label: "Status", value: (event.StatusName || event.Status || "-") },
      { label: "Severity", value: (event.SeverityName || event.Severity || "-") },
      { label: "Category", value: (event.CategoryName || event.CategoryFullName || "-") },
      { label: "Location", value: (event.LocationName || event.LocationPath || "-") },
      { label: "StartTime", value: formatDate(event.StartTime, ctx.language.language) },
      { label: "Updated", value: formatDate(event.Updated || event.LastModified, ctx.language.language) }
    ];

    byId("event-summary").innerHTML = summaryRows.map(function (row) {
      return "<div class='summary-item'><div class='label'>" + escapeHtml(row.label) + "</div><div class='value'>" + escapeHtml(row.value) + "</div></div>";
    }).join("");

    byId("event-description").textContent = event.Description || event.Remarks || dict.noData;
    byId("open-event-link").href = buildOpenEventLink(ctx.runtime, event.Id);

    byId("actions-list").innerHTML = toArray(ctx.actions).map(function (action) {
      var title = action.Description || action.Type || dict.noData;
      var when = formatDate(action.Started || action.Created || action.Time, ctx.language.language);
      var reportedBy = action.ReportedBy && (action.ReportedBy.Name || action.ReportedBy.Text || action.ReportedBy);
      return "<li><div class='item-header'><div class='item-title'>" + escapeHtml(title) + "</div><div class='muted'>" +
        escapeHtml(when) + "</div></div><div class='item-meta'>" + escapeHtml(reportedBy || "") +
        (action.Url ? (" | " + escapeHtml(action.Url)) : "") + "</div></li>";
    }).join("") || ("<li>" + escapeHtml(dict.noData) + "</li>");

    byId("attachments-list").innerHTML = toArray(ctx.attachments).map(function (attachment) {
      var title = attachment.Title || attachment.DefaultText || attachment.Url || ("Attachment #" + attachment.Id);
      var url = attachment.Url || "";
      var details = [
        attachment.Type ? ("Type: " + attachment.Type) : "",
        attachment.Username ? ("By: " + attachment.Username) : "",
        attachment.Created ? ("At: " + formatDate(attachment.Created, ctx.language.language)) : ""
      ].filter(Boolean).join(" | ");
      return "<li><div class='item-header'><div class='item-title'>" + escapeHtml(title) + "</div>" +
        (url ? ("<a class='btn btn-link' target='_blank' rel='noopener noreferrer' href='" + escapeHtml(url) + "'>Open</a>") : "") +
        "</div><div class='item-meta'>" + escapeHtml(details || "-") + "</div></li>";
    }).join("") || ("<li>" + escapeHtml(dict.noData) + "</li>");

    byId("items-body").innerHTML = toArray(ctx.items).map(function (item) {
      return "<tr><td>" + escapeHtml(item.Id) + "</td><td>" + escapeHtml(item.SKU || (item.Product && item.Product.SKU) || "-") +
        "</td><td>" + escapeHtml(item.Description || (item.Product && item.Product.Name) || "-") + "</td><td>" +
        escapeHtml(item.Quantity) + "</td><td>" + escapeHtml(item.WarehouseName || (item.Warehouse && item.Warehouse.Name) || "-") +
        "</td><td>" + escapeHtml(formatDate(item.UpdatedAt || item.CreatedAt, ctx.language.language)) + "</td></tr>";
    }).join("") || ("<tr><td colspan='6'>" + escapeHtml(dict.noData) + "</td></tr>");

    byId("raw-json").textContent = JSON.stringify(ctx.details || event, null, 2);

    if (!ctx.reportRequestId) {
      byId("report-status").textContent = dict.noReport;
      reportLinkEl.classList.add("hidden");
      reportLinkEl.href = "#";
    } else {
      var lines = [
        dict.reportRequested,
        dict.reportId + ": " + ctx.reportRequestId
      ];
      if (ctx.reportStatus) {
        lines.push(dict.reportStatus + " " + localizeReportStatus(ctx.reportStatus.Status, dict));
      }
      if (isCreatingReport) {
        lines.push(dict.pollingInProgress);
      }
      if (ctx.reportStatus && !ctx.reportPollingComplete && !isCreatingReport) {
        lines.push(dict.pollingTimeout);
      }
      byId("report-status").textContent = lines.join(" | ");

      if (ctx.reportStatus && ctx.reportStatus.Url) {
        reportLinkEl.classList.remove("hidden");
        reportLinkEl.href = ctx.reportStatus.Url;
      } else {
        reportLinkEl.classList.add("hidden");
        reportLinkEl.href = "#";
      }
    }
  }

  var machine = createMachine(
    {
      id: "nextEventApp",
      initial: "bootstrapping",
      context: {
        runtime: null,
        language: resolveLanguage({}),
        client: null,
        connections: {},
        baseFilter: null,
        pageIndex: 1,
        pageSize: 1,
        totalCount: 0,
        currentEvent: null,
        details: null,
        actions: [],
        attachments: [],
        items: [],
        reportRequest: null,
        reportRequestId: null,
        reportStatus: null,
        reportPollingComplete: false,
        error: ""
      },
      states: {
        bootstrapping: {
          invoke: {
            src: "bootstrap",
            onDone: {
              target: "loadingPage",
              actions: assign(function (_, event) {
                return {
                  runtime: event.data.runtime,
                  language: event.data.language,
                  client: event.data.client,
                  connections: event.data.connections,
                  baseFilter: event.data.baseFilter,
                  pageIndex: 1,
                  error: ""
                };
              })
            },
            onError: {
              target: "failure",
              actions: assign(function (_, event) {
                return { error: String(event.data && event.data.message || event.data || event) };
              })
            }
          }
        },
        loadingPage: {
          invoke: {
            src: "loadPage",
            onDone: {
              target: "ready",
              actions: assign(function (_, event) {
                return {
                  pageIndex: event.data.pageIndex,
                  totalCount: event.data.totalCount,
                  currentEvent: event.data.currentEvent,
                  details: event.data.details,
                  actions: event.data.actions,
                  attachments: event.data.attachments,
                  items: event.data.items,
                  error: ""
                };
              })
            },
            onError: {
              target: "failure",
              actions: assign(function (_, event) {
                return { error: String(event.data && event.data.message || event.data || event) };
              })
            }
          }
        },
        ready: {
          on: {
            REFRESH: "loadingPage",
            NEXT: {
              cond: "hasNext",
              target: "loadingPage",
              actions: assign(function (ctx) {
                return { pageIndex: ctx.pageIndex + 1 };
              })
            },
            PREV: {
              cond: "hasPrev",
              target: "loadingPage",
              actions: assign(function (ctx) {
                return { pageIndex: ctx.pageIndex - 1 };
              })
            },
            CREATE_REPORT: "creatingReport",
            CHECK_REPORT: {
              cond: "hasReportRequestId",
              target: "checkingReport"
            }
          }
        },
        creatingReport: {
          invoke: {
            src: "createReportAndPoll",
            onDone: {
              target: "ready",
              actions: assign(function (_, event) {
                return {
                  reportRequest: event.data.request,
                  reportRequestId: event.data.reportRequestId,
                  reportStatus: event.data.status,
                  reportPollingComplete: event.data.pollingComplete,
                  error: ""
                };
              })
            },
            onError: {
              target: "ready",
              actions: assign(function (_, event) {
                return { error: String(event.data && event.data.message || event.data || event) };
              })
            }
          }
        },
        checkingReport: {
          invoke: {
            src: "checkReport",
            onDone: {
              target: "ready",
              actions: assign(function (_, event) {
                return {
                  reportStatus: event.data.status,
                  reportRequestId: event.data.reportRequestId,
                  reportPollingComplete: isTerminalReportStatus(event.data.status && event.data.status.Status),
                  error: ""
                };
              })
            },
            onError: {
              target: "ready",
              actions: assign(function (_, event) {
                return { error: String(event.data && event.data.message || event.data || event) };
              })
            }
          }
        },
        failure: {
          on: {
            RETRY: "loadingPage"
          }
        }
      }
    },
    {
      guards: {
        hasNext: function (ctx) {
          return !!ctx.totalCount && ctx.pageIndex < ctx.totalCount;
        },
        hasPrev: function (ctx) {
          return ctx.pageIndex > 1;
        },
        hasReportRequestId: function (ctx) {
          return !!ctx.reportRequestId;
        }
      },
      services: {
        bootstrap: async function () {
          var runtime = await readHostContext();
          var language = resolveLanguage(runtime);
          applyLanguage(language);
          var client = createApiClient(runtime);
          var connections = parseAppConnections(runtime.Configuration, APP_NAME);
          var predefinedFilter = connections.filter || connections.eventLogFilter || null;
          var baseFilter = buildBaseEventLogFilter(predefinedFilter);
          return {
            runtime: runtime,
            language: language,
            client: client,
            connections: connections,
            baseFilter: baseFilter
          };
        },
        loadPage: async function (ctx) {
          var pageIndex = ctx.pageIndex;
          var pageSize = ctx.pageSize;

          async function fetchPage(index) {
            return ctx.client.request("/api/EventLog", {
              method: "POST",
              body: buildPagedEventLogFilter(ctx.baseFilter, index, pageSize)
            });
          }

          var result = await fetchPage(pageIndex);
          var totalCount = Number(result.Count || 0);
          var items = toArray(result.Items);

          if (!items.length && totalCount > 0 && pageIndex > totalCount) {
            pageIndex = totalCount;
            result = await fetchPage(pageIndex);
            totalCount = Number(result.Count || totalCount);
            items = toArray(result.Items);
          }

          if (!items.length) {
            throw new Error(ctx.language.dictionary.noOpenEvents);
          }

          var bundle = await fetchEventBundle(ctx.client, items[0]);
          return Object.assign({
            pageIndex: pageIndex,
            totalCount: totalCount || items.length
          }, bundle);
        },
        createReportAndPoll: async function (ctx) {
          var eventId = ctx.currentEvent && ctx.currentEvent.Id;
          if (!eventId) {
            throw new Error("No selected event.");
          }

          var request = await ctx.client.request("/api/Reports/Create?report=FullEvent&output=PDF", {
            method: "POST",
            body: {
              EventId: eventId,
              Id: eventId,
              IgnoreCustomReport: true
            }
          });

          var reportRequestId = getReportRequestId(request);
          if (!reportRequestId) {
            throw new Error("Report request ID is missing.");
          }

          var status = null;
          var pollingComplete = false;
          for (var i = 0; i < POLL_MAX_ATTEMPTS; i++) {
            status = await ctx.client.request("/api/Reports/Check/" + reportRequestId);
            if (isTerminalReportStatus(status && status.Status)) {
              pollingComplete = true;
              break;
            }
            if (i < POLL_MAX_ATTEMPTS - 1) {
              await sleep(POLL_INTERVAL_MS);
            }
          }

          return {
            request: request,
            reportRequestId: reportRequestId,
            status: status,
            pollingComplete: pollingComplete
          };
        },
        checkReport: async function (ctx) {
          var reportRequestId = ctx.reportRequestId || getReportRequestId(ctx.reportRequest);
          if (!reportRequestId) {
            throw new Error("No report request ID.");
          }
          var status = await ctx.client.request("/api/Reports/Check/" + reportRequestId);
          return { reportRequestId: reportRequestId, status: status };
        }
      }
    }
  );

  var service = interpret(machine);
  service.onTransition(function (state) {
    render(state);
  });
  service.start();

  byId("btn-refresh").addEventListener("click", function () {
    service.send("REFRESH");
  });
  byId("btn-next").addEventListener("click", function () {
    service.send("NEXT");
  });
  byId("btn-prev").addEventListener("click", function () {
    service.send("PREV");
  });
  byId("btn-create-report").addEventListener("click", function () {
    service.send("CREATE_REPORT");
  });
  byId("btn-check-report").addEventListener("click", function () {
    service.send("CHECK_REPORT");
  });
})();
