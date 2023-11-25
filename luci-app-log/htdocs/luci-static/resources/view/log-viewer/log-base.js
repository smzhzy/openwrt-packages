'use strict';
'require baseclass';
'require ui';
'require view';

document.head.append(E('style', {'type': 'text/css'},
`
:root {
	--app-log-dark-font-color: #2e2e2e;
	--app-log-light-font-color: #fff;
	--app-log-debug-font-color: #737373;
	--app-log-emerg-color: #a93734;
	--app-log-alert: #ff7968;
	--app-log-crit: #fcc3bf;
	--app-log-err: #ffe9e8;
	--app-log-warn: #fff7e2;
	--app-log-notice: #e3ffec;
	--app-log-info: rgba(0,0,0,0);
	--app-log-debug: #ebf6ff;
	--app-log-entries-count-border: #ccc;
}
:root[data-darkmode="true"] {
	--app-log-dark-font-color: #fff;
	--app-log-light-font-color: #fff;
	--app-log-debug-font-color: #e7e7e7;
	--app-log-emerg-color: #a93734;
	--app-log-alert: #eb5050;
	--app-log-crit: #dc7f79;
	--app-log-err: #c89593;
	--app-log-warn: #8d7000;
	--app-log-notice: #007627;
	--app-log-info: rgba(0,0,0,0);
	--app-log-debug: #5986b1;
	--app-log-entries-count-border: #555;
}
.log-empty {
}
.log-emerg {
	background-color: var(--app-log-emerg-color) !important;
	color: var(--app-log-light-font-color);
}
log-emerg .td {
	color: var(--app-log-light-font-color) !important;
}
log-emerg td {
	color: var(--app-log-light-font-color) !important;
}
.log-alert {
	background-color: var(--app-log-alert) !important;
	color: var(--app-log-light-font-color);
}
.log-alert .td {
	color: var(--app-log-light-font-color) !important;
}
.log-alert td {
	color: var(--app-log-light-font-color) !important;
}
.log-crit {
	background-color: var(--app-log-crit) !important;
	color: var(--app-log-dark-font-color) !important;
}
.log-crit .td {
	color: var(--app-log-dark-font-color) !important;
}
.log-crit td {
	color: var(--app-log-dark-font-color) !important;
}
.log-err {
	background-color: var(--app-log-err) !important;
	color: var(--app-log-dark-font-color) !important;
}
.log-err .td {
	color: var(--app-log-dark-font-color) !important;
}
.log-err td {
	color: var(--app-log-dark-font-color) !important;
}
.log-warn {
	background-color: var(--app-log-warn) !important;
	color: var(--app-log-dark-font-color) !important;
}
.log-warn .td {
	color: var(--app-log-dark-font-color) !important;
}
.log-warn td {
	color: var(--app-log-dark-font-color) !important;
}
.log-notice {
	background-color: var(--app-log-notice) !important;
	color: var(--app-log-dark-font-color) !important;
}
.log-notice .td {
	color: var(--app-log-dark-font-color) !important;
}
.log-notice td {
	color: var(--app-log-dark-font-color) !important;
}
.log-info {
	background-color: var(--app-log-info) !important;
	/*color: var(--app-log-dark-font-color) !important;*/
}
.log-debug {
	background-color: var(--app-log-debug) !important;
	color: var(--app-log-debug-font-color) !important;
}
.log-debug .td {
	color: var(--app-log-debug-font-color) !important;
}
.log-debug td {
	color: var(--app-log-debug-font-color) !important;
}
.log-highlight-item {
	background-color: #ffef00;
	color: #2e2e2e;
}
.log-entries-count {
	margin: 0 0 5px 5px;
	font-weight: bold;
	opacity: 0.7;
}
.log-entries-count-level {
	display: inline-block !important;
	margin: 0 0 0 5px;
	padding: 0 4px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	border-radius: 3px;
	border: 1px solid var(--app-log-entries-count-border);
	font-weight: normal;
}
.log-host-dropdown-item {
}
.log-facility-dropdown-item {
}
.log-side-block {
	position: fixed;
	z-index: 1 !important;
	opacity: 0.7;
}
.log-side-btn {
	position: relative;
	display: block;
	left: 1px;
	top: 1px;
	margin: 0 !important;
	min-width: 3.2em;
}
`));

return baseclass.extend({
	view: view.extend({
		/**
		 * View name (for local storage and downloads).
		 * Must be overridden by a subclass!
		*/
		viewName         : null,

		/**
		 * Page title.
		 * Must be overridden by a subclass!
		*/
		title            : null,

		logFacilities    : {
			'kern'    : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'kern')),
			'user'    : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'user')),
			'mail'    : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'mail')),
			'daemon'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'daemon')),
			'auth'    : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'auth')),
			'syslog'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'syslog')),
			'lpr'     : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'lpr')),
			'news'    : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'news')),
			'uucp'    : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'uucp')),
			'authpriv': E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'authpriv')),
			'ftp'     : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'ftp')),
			'ntp'     : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'ntp')),
			'log'     : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'log')),
			'clock'   : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'clock')),
			'local0'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local0')),
			'local1'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local1')),
			'local2'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local2')),
			'local3'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local3')),
			'local4'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local4')),
			'local5'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local5')),
			'local6'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local6')),
			'local7'  : E('span', { 'class': 'zonebadge log-facility-dropdown-item' }, E('strong', 'local7')),
		},

		logLevels        : {
			'emerg' : E('span', { 'class': 'zonebadge log-emerg' }, E('strong', _('Emergency'))),
			'alert' : E('span', { 'class': 'zonebadge log-alert' }, E('strong', _('Alert'))),
			'crit'  : E('span', { 'class': 'zonebadge log-crit' }, E('strong', _('Critical'))),
			'err'   : E('span', { 'class': 'zonebadge log-err' }, E('strong', _('Error'))),
			'warn'  : E('span', { 'class': 'zonebadge log-warn' }, E('strong', _('Warning'))),
			'notice': E('span', { 'class': 'zonebadge log-notice' }, E('strong', _('Notice'))),
			'info'  : E('span', { 'class': 'zonebadge log-info' }, E('strong', _('Info'))),
			'debug' : E('span', { 'class': 'zonebadge log-debug' }, E('strong', _('Debug'))),
		},

		tailValue            : 25,

		fastTailIncrement    : 50,

		fastTailValue        : null,

		logSortingValue      : 'asc',

		isHosts              : false,

		isFacilities         : false,

		isLevels             : false,

		logHosts             : {},

		logLevelsStat        : {},

		logHostsDropdown     : null,

		logFacilitiesDropdown: null,

		logLevelsDropdown    : null,

		totalLogLines        : 0,

		htmlEntities(str) {
			return String(str).replace(
				/&/g, '&#38;').replace(
				/</g, '&#60;').replace(
				/>/g, '&#62;').replace(
				/"/g, '&#34;').replace(
				/'/g, '&#39;');
		},

		makeLogHostsDropdownItem(host) {
			return E(
				'span',
				{ 'class': 'zonebadge log-host-dropdown-item' },
				E('strong', host)
			);
		},

		makeLogHostsDropdownSection() {
			this.logHostsDropdown = new ui.Dropdown(
				null,
				this.logHosts,
				{
					id                : 'logHostsDropdown',
					multiple          : true,
					select_placeholder: _('All'),
				}
			);
			return E(
				'div', { 'class': 'cbi-value' }, [
					E('label', {
						'class': 'cbi-value-title',
						'for'  : 'logHostsDropdown',
					}, _('Hosts')),
					E('div', { 'class': 'cbi-value-field' },
						this.logHostsDropdown.render()
					),
				]
			);
		},

		makeLogFacilitiesDropdownSection(){
			this.logFacilitiesDropdown = new ui.Dropdown(
				null,
				this.logFacilities,
				{
					id                : 'logFacilitiesDropdown',
					sort              : Object.keys(this.logFacilities),
					multiple          : true,
					select_placeholder: _('All'),
				}
			);
			return E(
				'div', { 'class': 'cbi-value' }, [
					E('label', {
						'class': 'cbi-value-title',
						'for'  : 'logFacilitiesDropdown',
					}, _('Facilities')),
					E('div', { 'class': 'cbi-value-field' },
						this.logFacilitiesDropdown.render()
					),
				]
			);
		},

		makeLogLevelsDropdownSection(){
			this.logLevelsDropdown = new ui.Dropdown(
				null,
				this.logLevels,
				{
					id                : 'logLevelsDropdown',
					sort              : Object.keys(this.logLevels),
					multiple          : true,
					select_placeholder: _('All'),
				}
			);
			return E(
				'div', { 'class': 'cbi-value' }, [
					E('label', {
						'class': 'cbi-value-title',
						'for'  : 'logLevelsDropdown',
					}, _('Logging levels')),
					E('div', { 'class': 'cbi-value-field' },
						this.logLevelsDropdown.render()
					),
				]
			);
		},

		/**
		* Receives raw log data.
		* Abstract method, must be overridden by a subclass!
		*
		* @param {number} tail
		* @returns {string}
		* Returns the raw content of the log.
		*/
		getLogData(tail) {
			throw new Error('getLogData must be overridden by a subclass');
		},

		/**
		* Parses log data.
		* Abstract method, must be overridden by a subclass!
		*
		* @param {string} logdata
		* @param {number} tail
		* @returns {Array<number, string|null, string|null, string|null, string|null, string|null>}
		* Returns an array of values: [ #, Timestamp, Host, Level, Facility, Message ].
		*/
		parseLogData(logdata, tail) {
			throw new Error('parseLogData must be overridden by a subclass');
		},

		/**
		* Highlight the result of a regular expression.
		* Abstract method, must be overridden by a subclass!
		*
		* @param {string} logdata
		* @returns {string}
		* Returns a string with the highlighted part.
		*/
		regexpFilterHighlightFunc(match) {
			throw new Error('regexpFilterHighlightFunc must be overridden by a subclass');
		},

		setRegexpFilter(entriesArray, fieldNum, pattern) {
			let fArr = [];
			try {
				let regExp = new RegExp(pattern, 'giu');
				entriesArray.forEach((e, i) => {
					if(e[fieldNum] !== null && regExp.test(e[fieldNum])) {
						if(this.regexpFilterHighlightFunc) {
							e[fieldNum] = e[fieldNum].replace(regExp, this.regexpFilterHighlightFunc);
						};
						fArr.push(e);
					};
					regExp.lastIndex = 0;
				});
			} catch(err) {
				if(err.name === 'SyntaxError') {
					ui.addNotification(null,
						E('p', {}, _('Invalid regular expression') + ': ' + err.message));
					return entriesArray;
				} else {
					throw err;
				};
			};
			return fArr;
		},

		setDateFilter(entriesArray) {
			let fPattern = this.timeFilter.value;
			if(!fPattern) {
				return entriesArray;
			};
			return this.setRegexpFilter(entriesArray, 1, fPattern);
		},

		setHostFilter(entriesArray) {
			let logHostsKeys = Object.keys(this.logHosts);
			if(logHostsKeys.length > 0 && this.logHostsDropdown) {
				let selectedHosts = this.logHostsDropdown.getValue();
				this.logHostsDropdown.addChoices(logHostsKeys, this.logHosts);
				if(selectedHosts.length === 0 || logHostsKeys.length === selectedHosts.length) {
					return entriesArray;
				};
				return entriesArray.filter(e => selectedHosts.includes(e[2]));
			};
			return entriesArray;
		},

		setFacilityFilter(entriesArray) {
			let logFacilitiesKeys = Object.keys(this.logFacilities);
			if(logFacilitiesKeys.length > 0 && this.logFacilitiesDropdown) {
				let selectedFacilities = this.logFacilitiesDropdown.getValue();
				if(selectedFacilities.length === 0 || logFacilitiesKeys.length === selectedFacilities.length) {
					return entriesArray;
				};
				return entriesArray.filter(e => selectedFacilities.includes(e[3]));
			};
			return entriesArray;
		},

		setLevelFilter(entriesArray) {
			let logLevelsKeys = Object.keys(this.logLevels);
			if(logLevelsKeys.length > 0 && this.logLevelsDropdown) {
				let selectedLevels = this.logLevelsDropdown.getValue();
				if(selectedLevels.length === 0 || logLevelsKeys.length === selectedLevels.length) {
					return entriesArray;
				};
				return entriesArray.filter(e => selectedLevels.includes(e[4]));
			};
			return entriesArray;
		},

		setMsgFilter(entriesArray) {
			let fPattern = this.msgFilter.value;
			if(!fPattern) {
				return entriesArray;
			};
			return this.setRegexpFilter(entriesArray, 5, fPattern);
		},

		/**
		* Creates the contents of the log area.
		* Abstract method, must be overridden by a subclass!
		*
		* @param {Array<number, string|null, string|null, string|null, string|null, string|null>} logdataArray
		* @returns {Node}
		* Returns a DOM node containing the log area.
		*/
		makeLogArea(logdataArray) {
			throw new Error('makeLogArea must be overridden by a subclass');
		},

		downloadLog(ev) {
			let formElems = Array.from(this.logForm.elements);
			formElems.forEach(e => e.disabled = true);

			return this.getLogData(0).then(logdata => {
				logdata = logdata || '';
				let link = E('a', {
					'download': this.viewName + '.log',
					'href'    : URL.createObjectURL(
						new Blob([ logdata ], { type: 'text/plain' })),
				});
				link.click();
				URL.revokeObjectURL(link.href);
			}).catch(() => {
				ui.addNotification(null,
					E('p', {}, _('Download error') + ': ' + err.message));
			}).finally(() => {
				formElems.forEach(e => e.disabled = false);
			});
		},

		restoreSettings() {
			let tailValueLocal = localStorage.getItem(`luci-app-${this.viewName}-tailValue`);
			if(tailValueLocal) {
				this.tailValue = Number(tailValueLocal);
			};
			let logSortingLocal = localStorage.getItem(`luci-app-${this.viewName}-logSorting`);
			if(logSortingLocal) {
				this.logSortingValue = logSortingLocal;
			};
		},

		saveSettings(tailValue, logSortingValue) {
			if(this.tailValue != tailValue) {
				this.tailValue = (/^[0-9]+$/.test(tailValue)) ? tailValue : 0;
				localStorage.setItem(
					`luci-app-${this.viewName}-tailValue`, String(this.tailValue));
			};
			if(this.logSortingValue != logSortingValue) {
				this.logSortingValue = logSortingValue;
				localStorage.setItem(
					`luci-app-${this.viewName}-logSorting`, this.logSortingValue);
			};
		},

		onSubmitForm(tail) {
			let formElems = Array.from(this.logForm.elements);
			formElems.forEach(e => e.disabled = true);
			this.logDownloadBtn.disabled = true;
			tail = (tail && tail > 0) ? tail : 0;
			this.logSortingValue = this.logSorting.value;

			return this.getLogData(tail).then(logdata => {
				logdata = logdata || '';
				this.logWrapper.innerHTML = '';
				this.logWrapper.append(
					this.makeLogArea(
						this.setMsgFilter(
							this.setFacilityFilter(
								this.setLevelFilter(
									this.setHostFilter(
										this.setDateFilter(
											this.parseLogData(logdata, tail)
										)
									)
								)
							)
						)
					)
				);

				if(logdata && logdata !== '') {
					if(this.isFacilities && !this.logFacilitiesDropdown) {
						this.logFacilitiesDropdownElem = this.makeLogFacilitiesDropdownSection();
					};
					if(this.isLevels && !this.logLevelsDropdown) {
						this.logLevelsDropdownElem = this.makeLogLevelsDropdownSection();
					};
					if(this.isHosts && !this.logHostsDropdown) {
						this.logHostsDropdownElem = this.makeLogHostsDropdownSection();
					};
				};
			}).finally(() => {
				formElems.forEach(e => e.disabled = false);
				this.logDownloadBtn.disabled = false;
				this.fastTailValue           = this.totalLogLines;
				ui.hideModal();
			});
		},

		filterSettingsModal() {
			return ui.showModal(_('Filter settings'), [
				E('div', { 'class': 'cbi-map' }, [
					E('div', { 'class': 'cbi-section' }, [
						E('div', { 'class': 'cbi-section-node' }, [
							E('div', { 'class': 'cbi-value' }, [
								E('label', {
									'class': 'cbi-value-title',
									'for'  : 'tailInput',
								}, _('Last entries')),
								E('div', { 'class': 'cbi-value-field' },
									this.tailInput
								),
							]),
							E('div', { 'class': 'cbi-value' }, [
								E('label', {
									'class': 'cbi-value-title',
									'for'  : 'timeFilter',
								}, _('Timestamp filter')),
								E('div', { 'class': 'cbi-value-field' }, this.timeFilter),
							]),

							this.logHostsDropdownElem,
							this.logFacilitiesDropdownElem,
							this.logLevelsDropdownElem,

							E('div', { 'class': 'cbi-value' }, [
								E('label', {
									'class': 'cbi-value-title',
									'for'  : 'msgFilter',
								}, _('Message filter')),
								E('div', { 'class': 'cbi-value-field' }, this.msgFilter),
							]),

							E('div', { 'class': 'cbi-value' }, [
								E('label', {
									'class': 'cbi-value-title',
									'for'  : 'logSorting',
								}, _('Sorting entries')),
								E('div', { 'class': 'cbi-value-field' }, this.logSorting),
							]),
						]),
					]),
				]),
				E('div', { 'class': 'right' }, [
					this.logForm,
					E('input', {
						'type' : 'submit',
						'form' : 'logForm',
						'class': 'btn cbi-button-positive important',
						'value': _('Apply'),
					}),
					' ',
					E('button', {
						'class': 'btn',
						'click': ui.hideModal,
					}, _('Close')),
				]),
			], 'cbi-modal');
		},

		load() {
			// Restoring settings from localStorage
			this.restoreSettings();
			return this.getLogData(this.tailValue);
		},

		render(logdata) {
			this.logWrapper = E('div', {
				'id'   : 'logWrapper',
				'style': 'width:100%; min-height:20em'
			}, this.makeLogArea(this.parseLogData(logdata, this.tailValue)));

			this.fastTailValue = this.totalLogLines;

			this.tailInput = E('input', {
				'id'       : 'tailInput',
				'name'     : 'tailInput',
				'type'     : 'text',
				'form'     : 'logForm',
				'class'    : 'cbi-input-text',
				'style'    : 'width:4em !important; min-width:4em !important',
				'maxlength': 5,
			});
			this.tailInput.value = (this.tailValue === 0) ? null : this.tailValue;
			ui.addValidator(this.tailInput, 'uinteger', true);

			this.logHostsDropdownElem      = '';
			this.logFacilitiesDropdownElem = '';
			this.logLevelsDropdownElem     = '';
			if(this.isLevels) {
				this.logLevelsDropdownElem = this.makeLogLevelsDropdownSection();
			};
			if(this.isFacilities) {
				this.logFacilitiesDropdownElem = this.makeLogFacilitiesDropdownSection();
			};
			if(this.isHosts) {
				this.logHostsDropdownElem = this.makeLogHostsDropdownSection();
			};

			this.timeFilter = E('input', {
				'id'         : 'timeFilter',
				'name'       : 'timeFilter',
				'type'       : 'text',
				'form'       : 'logForm',
				'class'      : 'cbi-input-text',
				'placeholder': _('Type an expression...'),
			});

			this.msgFilter = E('input', {
				'id'         : 'msgFilter',
				'name'       : 'msgFilter',
				'type'       : 'text',
				'form'       : 'logForm',
				'class'      : 'cbi-input-text',
				'placeholder': _('Type an expression...'),
			});

			this.logSorting = E('select', {
				'id'   : 'logSorting',
				'name' : 'logSorting',
				'form' : 'logForm',
				'class': "cbi-input-select",
			}, [
				E('option', { 'value': 'asc' }, _('ascending')),
				E('option', { 'value': 'desc' }, _('descending')),
			]);
			this.logSorting.value = this.logSortingValue;

			this.logDownloadBtn = E('button', {
				'id'   : 'logDownloadBtn',
				'name' : 'logDownloadBtn',
				'class': 'cbi-button btn',
				'click': ui.createHandlerFn(this, this.downloadLog),
			}, _('Download log'));

			this.logForm = E('form', {
				'id'    : 'logForm',
				'name'  : 'logForm',
				'style' : 'display:inline-block; margin-top:0.5em',
				'submit': ui.createHandlerFn(this, function(ev) {
					ev.preventDefault();
					// Saving settings to localStorage
					this.saveSettings(this.tailInput.value, this.logSorting.value);
					return this.onSubmitForm(Number(this.tailInput.value));
				}),
			}, E('span', {}, '&#160;'));

			document.body.append(
				E('div', {
					'align': 'right',
					'class': 'log-side-block',
					'style': `right:1px; top:${window.innerHeight / 2 - 60}px`,
				}, [
					E('button', {
						'title': _('Refresh log'),
						'class': 'btn log-side-btn',
						'click': ui.createHandlerFn(this, function(ev) {
							ev.target.blur();
							return this.onSubmitForm(
								Math.max(Number(this.tailValue), this.fastTailValue));
						}),
					}, '&#128472;'),
					E('button', {
						'title': _('Get more entries'),
						'class': 'btn log-side-btn',
						'style': 'margin-top:1px !important',
						'click': ui.createHandlerFn(this, function(ev) {
							ev.target.blur();
							if(this.fastTailValue === null) {
								this.fastTailValue = Number(this.tailValue);
							};
							this.fastTailValue += this.fastTailIncrement;
							return this.onSubmitForm(this.fastTailValue);
						}),
					}, `+${this.fastTailIncrement}`),
					E('button', {
						'title': _('Get all entries'),
						'class': 'btn log-side-btn',
						'style': 'margin-top:1px !important',
						'click': ui.createHandlerFn(this, function(ev) {
							ev.target.blur();
							return this.onSubmitForm(0);
						}),
					}, '&#119652;'),
					E('button', {
						'title': _('Filter settings'),
						'class': 'btn log-side-btn',
						'style': 'margin-top:10px !important',
						'click': ev => {
							ev.target.blur();
							this.filterSettingsModal();
						},
					}, '&#128468;'),

					E('button', {
						'class': 'btn log-side-btn',
						'style': 'margin-top:10px !important',
						'click': ev => {
							document.getElementById('logTitle').scrollIntoView(true);
							ev.target.blur();
						},
					}, '&#8593;'),
					E('button', {
						'class': 'btn log-side-btn',
						'style': 'margin-top:1px !important',
						'click': ev => {
							this.logWrapper.scrollIntoView(false);
							ev.target.blur();
						},
					}, '&#8595;'),
				])
			);

			return E([
				E('h2', { 'id': 'logTitle', 'class': 'fade-in' }, this.title),
				E('div', { 'class': 'cbi-section-descr fade-in' }),
				E('div', { 'class': 'cbi-section fade-in' },
					E('div', { 'class': 'cbi-section-node' }, [
						E('div', { 'class': 'cbi-value' }, [
							E('label', {
								'class': 'cbi-value-title',
								'for'  : 'filterSettings',
							}, _('Filter settings')),
							E('div', { 'class': 'cbi-value-field' }, [
								E('div', {},
									E('button', {
										'class': 'cbi-button btn cbi-button-action',
										'click': L.bind(this.filterSettingsModal, this),
									}, _('Edit'))
								),
								E('input', {
									'id'  : 'filterSettings',
									'type': 'hidden',
								}),
							]),
						]),
					])
				),
				E('div', { 'class': 'cbi-section fade-in' },
					E('div', { 'class': 'cbi-section-node' },
						this.logWrapper
					)
				),
				E('div', { 'class': 'cbi-section fade-in' },
					E('div', { 'class': 'cbi-section-node' },
						E('div', { 'class': 'cbi-value' },
							E('div', {
								'align': 'left',
								'style': 'width:100%',
							}, this.logDownloadBtn)
						),
					)
				),
			]);
		},

		handleSaveApply: null,
		handleSave     : null,
		handleReset    : null,
	}),
})