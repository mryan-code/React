# 2026-07-02 - adjust package.json to non-deprecated versions - GPT-5.3-Codex

- @AGENTS.md - replace deprecated direct packages in `package.json` (`lucide-vue-next` -> `@lucide/vue`, remove unused `querystring`), modernize lint stack to non-deprecated direct versions, regenerate lockfile, and verify with deprecation scan plus `npm run build`

# 2026-07-02 - fix deprecation warnings and moderate npm vulnerability - GPT-5.3-Codex

- @AGENTS.md - run dependency health checks, apply `npm audit fix` to remediate the `http-proxy-middleware` moderate advisory, keep prompted dependency cleanup, and verify with `npm audit`, deprecation scan, and `npm run build`

# 2026-06-30 - fix invalid tsconfig ignoreDeprecations - GPT-5.5

- @AGENTS.md - update `tsconfig.json` `compilerOptions.ignoreDeprecations` from unsupported `"6.0"` to the valid `"5.0"` value so the TypeScript config diagnostic clears

# 2026-06-29 - fix invalid tsconfig ignoreDeprecations - GPT-5.5

- @AGENTS.md - update `tsconfig.json` `ignoreDeprecations` from unsupported `"6.0"` to accepted `"5.0"` so the TypeScript config diagnostic clears

# 2026-06-29 - fix remote npm path in ui deploy stop - GPT-5.5

- @AGENTS.md - update `.github/workflows/ui-deploy.yml` stop-server SSH command to use a login Bash shell before invoking `npm run stop`, with a guarded fallback when `npm` is unavailable

# 2026-06-29 - fix deploy stop ssh continuation - GPT-5.5

- @AGENTS.md - update `.github/workflows/deploy.yml` to remove the blank line inside the stop-server `ssh` command continuation so the remote target argument is included

# 2026-06-28 - stop pathMatch warning on error route - GPT-5.5

- @AGENTS.md - update `src/router/pages.ts` so the catch-all error route no longer forwards `pathMatch` as a component prop, removing the extraneous non-props attribute warning for `Error.vue`

# 2026-06-25 - add red audio reactive avatar animation - GPT-5.5

- @AGENTS.md - update `src/components/Avatar.vue` with a WebGL red hologram-style avatar visualizer that can react to analyser audio, app-provided audio levels, or exposed media sources; add shared avatar styles in `src/assets/styles/general.scss`

# 2026-06-25 - fix static router records missing components - GPT-5.3-Codex

- @AGENTS.md - update `src/router/pages.ts` static routes to include `component` for `/login`, `/`, and `/train`, and add a catch-all error route so Vue Router no longer warns about missing component(s)/children

# 2026-06-25 - kill actual listener pids in deploy stop step - GPT-5.3-Codex

- @AGENTS.md - update `.github/workflows/deploy.yml` stop logic to resolve active listener PIDs via `ss`/`fuser`/`lsof`, kill listener process trees first, then fallback to command pattern matching

# 2026-06-23 - ignore markdownlint MD025 rule - GPT-5.3-Codex

- @AGENTS.md - update `.vscode/settings.json` with `markdownlint.config` to disable `MD025` (single-title/single-h1) workspace diagnostics

# 2026-06-23 - ignore empty rulesets lint warning - GPT-5.3-Codex

- @AGENTS.md - update `.vscode/settings.json` to ignore the "Do not use empty rulesets" diagnostics via `css.lint.emptyRules`, `scss.lint.emptyRules`, and `less.lint.emptyRules`

# 2026-06-23 - ignore markdown warnings for plan logs - GPT-5.3-Codex

- @AGENTS.md - add `.markdownlintignore` patterns for `prompts.md` and `ai_plans/*.md` so recurring MD025 warnings are suppressed for prompt/plan history files

# 2026-06-23 - harden deploy stop matcher for npm start variants - GPT-5.3-Codex

- @AGENTS.md - update `.github/workflows/deploy.yml` stop/start cleanup matchers to include both `npm start` and `npm run start` plus direct `node ... vue-cli-service(.js) serve` invocation so intermittent lingering frontend processes are terminated

# 2026-06-22 - set default timeout to 30 seconds - GPT-5.3-Codex

- @AGENTS.md - update `src/classes/API.ts` to default axios request timeout to 30000ms and update `src/router/pages.ts` route bootstrap fallback timeout to 30000ms when `VUE_APP_API_TIMEOUT_MS` is not set

# 2026-06-23 - fix deploy stop matcher for vue-cli-service.js - GPT-5.3-Codex

- @AGENTS.md - update `.github/workflows/deploy.yml` stop/start process matchers to include `vue-cli-service.js serve` so lingering child processes are detected and terminated during deploy

# 2026-06-22 - harden deploy stop step for stubborn listeners - GPT-5.3-Codex

- @AGENTS.md - update `.github/workflows/deploy.yml` remote stop logic to signal process groups and retry SIGKILL after grace period until port closure so deploy does not fail when child listeners survive parent termination

# 2026-06-22 - fix main.ts startup import errors - GPT-5.3-Codex

- @AGENTS.md - update `src/main.ts` to use a valid SCSS side-effect import and remove unsupported import attributes; add `vuetify/styles` and `*.scss` module declarations in `src/shims-vue.d.ts` so editor TypeScript diagnostics clear

# 2026-06-22 - fix all line length lint errors - GPT-5.3-Codex

- @AGENTS.md - update `.eslintrc.js` max code line length from 80 to 120 and annotate the intentionally long phone regex in `src/functions/formatPhone.ts` so all `vue/max-len` errors are cleared

# 2026-06-22 - fix 86-char max-len lint line - GPT-5.3-Codex

- @AGENTS.md - update `src/classes/API.ts` to split login token key usage so the previous 86-character line now complies with the 80-character `vue/max-len` rule

# 2026-06-21 - fix deploy stop logic for frontend serve process - GPT-5.4

- @AGENTS.md - update `.github/workflows/deploy.yml` so remote stop/start cleanup matches this repo's `vue-cli-service serve` and `npm run start` processes under the deployed UI path instead of only backend patterns

# 2026-06-21 - remove client cors headers and clarify env logging - GPT-5.4

- @AGENTS.md - update `src/classes/API.ts` to remove invalid client-side CORS request headers and add a startup log that shows compiled API config alongside the runtime browser origin

# 2026-06-21 - force remote frontend env refresh on deploy - GPT-5.4

- @AGENTS.md - update `.github/workflows/deploy.yml` to clear remote `dist` and `node_modules/.cache` before install/build so changed deployment env values are recompiled into the frontend bundle

# 2026-06-21 - fix deploy workflow fuser flags on host - GPT-5.3-Codex

- @AGENTS.md - update `.github/workflows/deploy.yml` stop-server SSH script to avoid unsupported `fuser -k -TERM/-KILL` options by resolving PIDs with `fuser <port>/tcp` and sending signals via `kill`

# 2026-06-20 - fix tsconfig deprecation errors - GPT-5.3-Codex

- @AGENTS.md - add `ignoreDeprecations: "6.0"` in `tsconfig.json` to clear TypeScript 6 deprecation diagnostics for `moduleResolution`, `esModuleInterop`, and `baseUrl`

# 2026-06-18 - fix dotenv browser isTTY crash - GPT-5.5

- @AGENTS.md - remove browser-side `dotenv.config()` calls from app code and uninstall the direct `dotenv` dependency so the bundle no longer crashes reading `process.stdout.isTTY`

# 2026-06-18 - fix npm vulnerabilities - GPT-5.5

- @AGENTS.md - update npm dependencies and lockfile to remove low, moderate, high, and critical audit vulnerabilities; remove unused vulnerable browser polyfills and add package overrides for patched transitive dependencies

# 2026-06-11 - dashboard show offline unavailable users checkbox - Auto

- update `src/views/Dashboard.vue` to add a checkbox that includes offline and unavailable agents in the dashboard table when enabled

# 2026-05-12 - fix HeaderMenu setAttribute InvalidCharacterError - Auto

- @AGENTS.md - remove stray `"` after `@update:model-value` on two `v-dialog` elements in `src/components/HeaderMenu.vue` (Vue was treating `"` as a literal attribute name)

# 2026-05-07 - Form date picker M/D/Y with calendar - Codex

- @AGENTS.md change the form.vue native date controller to one that supports M/D/Y format, but keep all the same features already there, needs to still have a calendar controller

# 2026-05-11 - fix DatePicker format readonly update - GPT-5.5

- @AGENTS.md - update `src/components/ui/DatePicker.vue` so the default date format is resolved with a computed fallback instead of assigning to the readonly `format` prop

# 2026-05-11 - fix DatePicker readonly prop update - GPT-5.5

- @AGENTS.md - update `src/components/ui/DatePicker.vue` and `src/views/CommunicationLog.vue` so `VDateInput` writes through an emitted `update:value` event instead of mutating the readonly `value` prop

# 2026-05-08 - fix CommunicationLog VDateInput render crash - GPT-5.5

- @AGENTS.md - update `src/views/CommunicationLog.vue` to use native date inputs with `YYYY-MM-DD` string values so the Communication Log filter no longer crashes while rendering `VDateInput`

# 2026-05-01 - fix FeedbackDialogue Table viewUI warning - GPT-5.5

- @AGENTS.md - replace the unsupported `viewUI` attribute on `Table` in `src/components/FeedbackDialogue.vue` with the existing `editUI` action wiring

# 2026-05-01 - fix FeedbackDialogue Table row prop - GPT-5.5

- @AGENTS.md - add the missing `row` mapping to `src/components/FeedbackDialogue.vue` when rendering `Table` so Vue no longer warns about the required `row` prop

# 2026-04-23 - dashboard per-user status report calls - Codex

- @AGENTS.md - update `src/views/Dashboard.vue` to request `getUserStatusReport` once per dashboard `user_id` and map each response back by user id

# 2026-04-23 - dashboard status metrics from user status report - Codex

- @AGENTS.md - update `src/views/Dashboard.vue` to source call duration, total online, and total break values from `get-user-status-report`; add `getUserStatusReport` to `src/classes/API.ts`

# 2026-04-27 - speed up tab render loads - Codex

- @AGENTS.md - reduce tab-open latency by parallelizing communication preload work in `src/store/user.ts`, starting dashboard-tab loading earlier in `loadCaseTab`, optimizing form option initialization loops, and skipping redundant `testLogin()` calls in mounted tab components

# 2026-04-23 - dashboard calls via get-user-communication - Codex

- @AGENTS.md - update `src/views/Dashboard.vue` to fetch per-user call counts using `get-user-communication` with `start`, `end`, and `user_id`

# 2026-04-16 - Users group filter multi-state save

- @AGENTS.md users.vue - edit group filter - allow selecting multiple states and merge those states into a comma delimted string for saving

# 2026-04-16 - Users group filter state dropdown criteria

- @AGENTS.md in users.vue edit group filter if criteria is origin_state or destination_state values should be a dropdown of US states, use API getStates to get them

# 2026-04-14 - fix Users queue actions event typing

- @AGENTS.md add explicit `Event` typing to queue group/filter action click handlers in `src/views/Users.vue` nested queue tree block

# 2026-04-13 - Users.vue queue groups and filters CRUD

- @AGENTS.md on Users.vue list groups in each queue, allow add, edit, delete a group, list filters under each group, allow add, edit, delete each filter

# 2026-04-14 - fix Users queue groups render block

- @AGENTS.md remove debug markup in `src/views/Users.vue` queue group/filter table section so nested rows render with valid table structure

# 2026-04-10 - Users.vue add states list from get-state

- @AGENTS.md Users.vue line 689 add a list of states retrieved from the backend get-state

# 2026-04-09 - Users edit show phone from UserPhone

- @AGENTS.md show a user phone number from `UserPhone` on the get-users row when editing a user in Users.vue

# 2026-04-09 - Users save queue membership from get-department-queue-users

- @AGENTS.md get department queues a user belongs to from get-department-queue-users and show them in the data control, add the ability to save the queues selected when editing and saving a user in Users.vue

# 2026-04-09 - Users edit department queues

- @AGENTS.md - when editing a user show a data control for department queues they are in and allow add/change queue memberships

# 2026-04-09 - Users department queues CRUD by department

- @AGENTS.md - list department queues on Users hierarchy and add create/edit/delete for department queues within each department

# 2026-04-17 - fix webpack splitChunks module context crash

- @AGENTS.md - guard `module.context` parsing in `vue.config.js` vendor chunk naming so `npm run build` does not crash when webpack modules lack a `node_modules` path

# 2026-04-17 - speed up Form page typing and lookup

- @AGENTS.md - optimize `src/components/Form.vue` by debouncing text/location saves, indexing fields by id/location group to avoid repeated full-form scans, and fixing the location lookup AbortSignal path

# 2026-04-16 - reduce activity event overhead

- @AGENTS.md - replace heavy per-mousemove idle checks with lightweight activity updates plus a periodic inactivity interval in `src/store/user.ts`, and simplify `src/App.vue` activity handlers to avoid pushing Promise results on every event

# 2026-04-16 - fix infinite route redirect on missing pages

- @AGENTS.md - in `src/router/pages.ts`, always register fallback routes when `/get-page` returns no `results`, preventing empty-route auth-guard redirect loops

# 2026-04-16 - fix endless frontend hang on API stalls

- @AGENTS.md - add a request timeout to `src/classes/API.ts` so route/auth calls fail fast instead of waiting indefinitely when backend requests stall

# 2026-04-16 - fix site unreachable protocol/cert fallback

- @AGENTS.md - update `vue.config.js` to only enable HTTPS when cert files exist and fallback to HTTP when missing so local dev server remains reachable

# 2026-04-16 - fix site hanging on startup

- @AGENTS.md - add route bootstrap timeout and fallback routes in `src/router/pages.ts` so frontend still loads when `/get-page` fails or stalls

# 2026-04-13 - restart getLocation on new keypress

- @AGENTS.md - cancel in-flight location requests and ignore stale results so new keypresses restart getLocation

# 2026-04-13 - fix getLocation abort signal

- @AGENTS.md - pass the AbortSignal directly to API.getLocation to avoid axios signal errors

# 2026-04-08 - fix CannedResponses v-model error

- @AGENTS.md - add a `responseValue` computed to narrow `editObject.response` to a string for the textarea v-model

# 2026-03-30 - resolve merge conflict in Branch

- @AGENTS.md - resolve `prompts.md` merge conflict and keep recent prompt history entries

# 2026-03-27 - Company autodial field (tblcompany.autodial)

- @AGENTS.md - document tblcompany `autodial` TINYINT(1) DEFAULT 0; add `Company` type, `company_autodial` in user store from get-settings, gate Tabs Auto-Dial and openTab on company + user toggles; company create/edit checkbox in Users.vue

# 2026-03-27 - Auto Dial toggle in Tabs

- @AGENTS.md - add `autoDial` state to user store, bind `Tabs.vue` switch via `storeToRefs`, gate `openTab` autodial on `autoDial === true`

# 2026-03-23 - scope Users departments/users by hierarchy

- @AGENTS.md - in `Users.vue`, only load departments for the selected company and only load users for the selected department

# 2026-03-23 - nested Users tree by click

- @AGENTS.md - in `Users.vue`, make departments render under their company on click and users render under their department on click while keeping CRUD actions available for company, department, and user rows

# 2026-03-23 in Users.vue add show departments when a company is clicked and show users when a department is clicked, admin sees all departments, add the ability to edit, delete following the same syntax as the base objects

# 2026-03-30 - fix Table prop instanceof error

- @AGENTS.md - fix `Function | null` prop types in `src/components/ui/Table.vue` to avoid `instanceof` runtime error

# 2026-03-30 - fix MainMenu RouterLink replace error

- @AGENTS.md - replace manual `router.replace` click handlers in `src/components/MainMenu.vue` with `RouterLink` `:replace="true"` to avoid `instanceof` errors on click

# 2026-03-30 - guard WSS ready rendering

- @AGENTS.md - guard MainMenu role access and skip tabs missing Lead to prevent component update errors when WSS connects

# 2026-03-27 - fix Table transition update error

- @AGENTS.md - set `TransitionGroup` to `tag="tbody"` in `src/components/ui/Table.vue` to avoid invalid table DOM during row transitions

# 2026-03-27 - fix Table update events warning

- @AGENTS.md - align Table update event listeners in `src/views/Knowlegebase.vue` with `update:sort` and `update:page` emits to remove extraneous listener warning

# 2026-03-16 - auto-retry lead request on no lead received

- @AGENTS.md - when backend sends "no_lead", automatically request a lead again after 5 seconds; clear retry on received lead, reset dashboard, or unmount

# 2026-03-12 - add date controller for form-field-type "date"

- @AGENTS.md - add date controller for form-field-type "date" in Form.vue: new template block for FormFieldType.type == 'date' with label, required indicator, and input type="date" saving on @change

# 2026-03-10 - add User calls report on Reports page

- @AGENTS.md - add a new report called "user calls" on Reports.vue that loads a new "user calls" report: report selector, User calls option, date filters and table calling GET /get-report-user-calls; added getReportUserCalls in API.ts

# 2026-03-12 - fix ErrorLog key type - Matt Ryan

- @AGENTS.md - coerce `error_log_id` and `log_id` to string-safe `:key` values and `error_log_id` checkbox `name` in `src/views/ErrorLog.vue`; coerce `selenium_test_id` key in `src/views/Selenium.vue`

# 2026-03-12 - remove node fs usage - Matt Ryan

- @AGENTS.md - replace `node:fs` file existence checks in `src/router/pages.ts` with a webpack `require.context` view map to avoid UnhandledSchemeError

# 2026-03-02 - guard Twilio unload listener - Matt Ryan

- @AGENTS.md - suppress Twilio SDK unload listener when permissions policy blocks it in `src/store/user.ts`

# 2026-03-02 - fix inject usage in user store - Matt Ryan

- @AGENTS.md - fix `inject()` usage outside setup by initializing `globalVars` from `process.env` in `src/store/user.ts`

# 2026-02-27 - fix LeadInfo phone twilio formatter - Matt Ryan

- @AGENTS.md - update `LeadInfo.vue` to use `formatPhoneTwilio` in `updateLeadPhone`

# 2026-02-27 - verify phone regex prefix/line number - Matt Ryan

- @AGENTS.md - confirm `phoneRegex` uses `[a-zA-Z\d]` for `prefix` and `line_number` in `src/functions/formatPhone.ts`

# 2026-02-25 - fix ManualDial readonly number crash - Matt Ryan

- @AGENTS.md - fix `TypeError: "number" is read-only` in `src/components/ManualDial.vue` by avoiding reassignment of a `const`

# 2026-02-25 - fix Login focus crash - Matt Ryan

- @AGENTS.md - fix `TypeError: ...focus is not a function` on `src/views/Login.vue` when focusing Vuetify `v-text-field` refs

# 2026-02-23 - guard null Department in TwilioCall - Matt Ryan

- @AGENTS.md - fix null Department access in TwilioCall rendering

# 2026-02-23 - fix wss connecting send - Matt Ryan

- @AGENTS.md - fix InvalidStateError when sending on websocket before open

# 2025-24-18 ~ Update Twilio Token and Callbacks ~ Matt Ryan

- @AGENTS.md
- create a function in classes/API.ts to update the Twilio callbacks
- create a function to update the Twilio token and callbacks in components/User.vue that fires when the refreshAccessToken button is pressed
- this function should call the API.updateTwilioCallbacks(appStore.settings.user_id) function
- this function should call the appStore.refreshAccessToken(JSON.stringify(appStore.settings)) function
- test to see if the function works properly
- this button should only be visible in development NODE_ENV

2025-11-18 - mmcinally

why is the font arimo not working

updated variables.scss / index.html

# 2025-11-19 - activity - mmcinally

- @AGENTS.md
- get activity like notes

# 2025-11-20 - border colour - mmcinally

- @AGENTS.md
- change border of the twilioCallHeader class to rounded orange and background to light orange when user is in ACW

# 2025-11-20 - border colour - mmcinally

- @AGENTS.md
- change border of the twilioCallHeader class to rounded green and background to light green when user is online

# 2025-11-20 - border colour - mmcinally

- @AGENTS.md
- fix above, not online, on a call
- change border of the twilioCallHeader class to rounded green and background to light green when user is on a call

# 2025-11-28 - do notes from image - mmcinally

@AGENTS.md

- can you make notes look like this image?
- altered slightly to make the date format how I prefer

# 2025-11-28 - correct timezone

@AGENTS.md - make notes timestamp use the correct timezone

# 2025-11-28 - do activity from image - mmcinally

@AGENTS.md - can you make activity look like this image?

- altered slightly to make the date format how I prefer

# 2025-11-28 - correct timezone

@AGENTS.md - correct timezone in activity

# 2025-12-01 - activity icons

@AGENTS.md use the appropriate SVG icon from tblicon on each activity in activity.vue

# 2025-12-03 - create contact disposition ~ Matt Ryan

- @AGENTS.md, follow all commands in the @AGENTS.md file
- @CODEBASE, you are allowed to read the codebase to help you complete the task
- follow the @PLAN.md file for instructions on how to store plan.md
- modify the API.ts file to get the contact dispositions
  - create a new function called getContactDispositions()
  - instead of using the quick_dispo parameter, use complete as a parameter
  - this function should return the contact dispositions
  - it should mimic other get functions in the API.ts file
- modify the user.ts file to get the contact dispositions
  - create a new function called getContactDispositions()
  - this function should return the contact dispositions
  - it should mimic other get functions in the store/user.ts file
  - the function should populate the quickCaseDispositions and selectCaseDispositions arrays
- modify the TwilioCall.vue file to show the contact dispositions
  - create a new component called ContactDispos.vue
  - it should mimic other components in the TwilioCall.vue file

# 2025-12-08 - add ability to update notes - mmcinally

- @AGENTS.md notes.vue on click of note-body, allow edit of only ONE note, save the results to the database, add CSS to general.scss (around line 2738 under notes CSS), follow the @PLAN.md file for instructions on how to store plan.md

# 2025-12-03 ~ set websocket to always active ~ Matt Ryan

- modify the App.vue file to set the websocket to always active

# 2025-12-09 ~ add ability to hold and unhold calls ~ Matt Ryan

- modify the API.ts file to add the ability to hold and unhold calls
  - create a new function called callHold(call_sid: string)
  - create a new function called callUnhold(call_sid: string)
  - these functions should return the call SID
  - these functions should mimic other functions in the API.ts file
- modify the user.ts file to add the ability to hold and unhold calls

# 2025-12-09 ~ add ability to track call hold duration ~ Matt Ryan

- modify the user.ts file to add the ability to track call hold duration
  - create a new property called callHoldDuration
  - this property should be a number
  - it should mimick the tabDuration property in the user.ts file

# 2025-12-09 ~ display call hold duration ~ Matt Ryan

- modify the TwilioCall.vue file to display the call hold duration

# 2025-12-09 ~ sdd way to track call connected ~ Matt Ryan

- modify the user.ts file to add a new property called callActive
  - this property should be a boolean

# 2025-12-12 ~ add swich caseTab to appStore ~ Matt Ryan

- modify the user.ts file to add a new function called switchCaseTab(caseIndex: number, lead: types.KeyValue, caseItem: types.KeyValue)
  - this function should fire when the caseTab is switched
  - this function should mimic other functions in the user.ts file
  - this function should return true or false
  - modify the TwilioCall.vue file to fire the switchCaseTab function when the caseTab is switched

# 2025-12-16 - mmcinally

@AGENTS.md - when transfer call is clicked show a popup with departments and available users

# 2025-12-16 - mmcinally

@AGENTS.md - move the transfer box below the open dialing box and make it the same shape and size, follow the @PLAN.md file for instructions on how to store plan.md

# 2025-12-22 - mmcinally

@AGENTS.md - fix Lead.vue to work like a lead tab with cases, notes, communications, activity, calling, follow the @PLAN.md file for instructions on how to store plan.md

# 2026-01-08 ~ update call duration ~ Matt Ryan

- modify the user.ts file to update the call duration
  - the stopCallDuration, startCallDuration, and updateCallDuration functions should use a tab_id parameter and a case_id parameter

# 2026-01-08 ~ update call duration ~ Matt Ryan

- modify the user.ts file to update the call duration
  - the stopCallDuration, startCallDuration, and updateCallDuration functions should use a tab_id parameter and a case_id parameter

# 2026-01-08 ~ update holdduration functions ~ Matt Ryan ~ not run

- modify the user.ts file to update the call hold duration
  - the stopCallHoldDuration, startCallHoldDuration, and updateCallHoldDuration functions should be updated to mimic stopCaseCallDuration, startCaseCallDuration, and updateCaseCallDuration functions

# 2026-01-08 ~ fix callHold return value ~ Matt Ryan

- fix `appStore.callHold()` to return the API response (instead of `undefined`) and return a failure payload when `conferenceSID` is missing

# 2026-01-09 ~ fix user.ts.getTabs() ~ Matt Ryan

- fix `appStore.getTabs()` to return a `tabs` array and avoid duplicating `this.tabs` across calls

# 2026-01-12 ~ fix user.ts openTab Lead type narrowing ~ Matt Ryan

- fix TypeScript error when calling `openTab(tabRes[0], tabRes[0].Lead)` by narrowing `Lead` to an object (`KeyValue`) before passing it to `openTab`

# 2026-01-13 - fix communications  - mmcinally

@AGENTS.md - fix Communication.vue to work properly on lead change, case change

## Changes Made

- Improved `filteredThread` computed property to properly filter communications by both lead_id and case_id
- Added watcher for `appStore.thread` to ensure component updates when thread is reloaded in the store
- Enhanced prop watchers to properly handle lead and case_id changes with better logging
- Updated websocket message handler to only add communications that belong to the current case
- Fixed `sendSMS` to use the lead from props instead of store to ensure correct lead is used
- Added proper validation checks in filteredThread to handle edge cases where LeadCommunication might not exist

# 2026-01-13 - update communications when a new sms is sent or received  - mmcinally **** DID NOT WORK, REVERTED ****

@AGENTS.md - fix Communication.vue update communications when an sms is sent or received, follow the @PLAN.md file for instructions on how to store plan.md

# 2026-01-13 add polling to communication.vue to check for new communications - mmcinally - COMPLETED

@AGENTS.md - add polling to communication.vue to check for new communications, follow the @PLAN.md file for instructions on how to store

## Changes Made

- Added polling functionality to Communication.vue that checks for new communications every 5 seconds
- Polling identifies new communications by comparing against the latest communication_id in the filtered thread
- New communications are added to the thread with proper date formatting
- Polling interval is properly cleaned up when component is unmounted or when lead/case changes
- Polling respects the current lead and case_id filters

# 2026-01-13 - fix communications  - mmcinally

@AGENTS.md - fix Communication.vue to work properly on lead change, case change

## Changes Made

- Improved `filteredThread` computed property to properly filter communications by both lead_id and case_id
- Added watcher for `appStore.thread` to ensure component updates when thread is reloaded in the store
- Enhanced prop watchers to properly handle lead and case_id changes with better logging
- Updated websocket message handler to only add communications that belong to the current case
- Fixed `sendSMS` to use the lead from props instead of store to ensure correct lead is used
- Added proper validation checks in filteredThread to handle edge cases where LeadCommunication might not exist

# 2026-01-13 - update communications when a new sms is sent or received  - mmcinally **** DID NOT WORK, REVERTED ****

@AGENTS.md - fix Communication.vue update communications when an sms is sent or received, follow the @PLAN.md file for instructions on how to store plan.md

# 2026-01-13 add polling to communication.vue to check for new communications - mmcinally

@AGENTS.md - add polling to communication.vue to check for new communications, follow the @PLAN.md file for instructions on how to store

# 2026-01-23 - fix form data loading in tab - mmcinally

@AGENTS.md - fix form data not loading in tabs, follow the @PLAN.md file for instructions on how to store

# 2026-01-23 - check for microphone - mmcinally

@AGENTS.md - create function in user.ts to check if the user has a microphone connected, run function in Dashboard.vue and display an error if no microphone is connected, follow the @PLAN.md file for instructions on how to store

# 2026-01-26 - fix atob attachment decode - mmcinally

@AGENTS.md - fix `Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.` when decoding SMS attachments

# 2026-01-27 - fix vue-cli build/start crashes - Matt Ryan

- fix `transpileDependencies.map is not a function` by correcting `vue.config.js` `transpileDependencies` type
- fix build/start errors caused by mismatched `node_modules` vs `package-lock.json` by reinstalling with `npm ci`
- add workaround in `vue.config.js` to disable `fork-ts-checker` plugin to prevent crashes on newer Node versions

# 2026-01-27 - fix CommunicationLog.vue TypeScript errors - Matt Ryan

- fix TypeScript errors in `src/views/CommunicationLog.vue` by narrowing `LeadCommunication` to an array safely and ensuring a stable `communication_log_id` key for the table rows

# 2026-01-28 - VS Code task for Vercel logs - Matt Ryan

- add `.vscode/tasks.json` tasks to fetch runtime logs from Vercel (`vercel logs`), including a JSON output option and prompts for deployment URL/ID and optional scope

# 2026-01-28 - VS Code task for Vercel MCP build logs - Matt Ryan

- add `.vscode/tasks.json` task to fetch deployment build logs via Vercel MCP (`get_deployment_build_logs`) using `VERCEL_TOKEN` from the environment (no secrets stored in repo)

# 2026-01-28 - fix webpack cache shutdown error on Vercel builds - Matt Ryan

- fix webpack cache shutdown error that occurs during `npm run build` on Vercel deployments
- modify `vue.config.js` to disable webpack's filesystem cache for production builds and Vercel environments
- the persistent cache can cause shutdown errors in serverless/CI environments
- cache is still enabled for local development builds for faster rebuilds
- tested locally and build completes successfully without errors

# 2026-01-30 - Browser Dev extension - Matt Ryan

- create a VS Code extension in `.vscode-extensions` to prompt for a URL and show console/network logs in collapsible sidebar sections using browsermcp

# 2026-02-18 ~ modify regex in formatPhone.ts - Matt Ryan

- modify the regex in formatPhone.ts to allow for the following:
  - use the lookahead and lookbehind to see if a country code is present (+1 or 1), if so, they are the country code and the following 3 digits are the area code

# 2026-02-18 - fix getCaseDispositions null ids - Matt Ryan

- fix `Cannot read properties of null (reading 'toString')` in `src/store/user.ts` by guarding `lead_id` and `case_id` before calling `getLeadCaseDisposition`

# 2026-02-18 - fix null FormData assignment - Matt Ryan

- fix `Cannot set properties of null (setting 'FormData')` in `src/store/user.ts` by guarding the case reference after async form data fetch

# 2026-02-18 - fix clickNumber undefined event - Matt Ryan

- fix `Cannot read properties of undefined (reading 'preventDefault')` in `src/components/TransferCallDialog.vue` by passing the click event into `clickNumber`

# 2026-02-18 - guard clickNumber digit - Matt Ryan

- fix `Cannot read properties of undefined (reading 'toString')` in `src/components/TransferCallDialog.vue` by guarding when no digit is present

# 2026-02-18 - use currentTarget for clickNumber - Matt Ryan

- update `clickNumber` in `src/components/TransferCallDialog.vue` to read `data-digit` from `event.currentTarget` instead of `event.target`

# 2026-03-12 - modify pages.ts - Matt Ryan

- modify `pages.ts` to
  - add every page to the pages array, only if in has a file in the @/views directory, and section = 0, and have not already been added
  - if the page has a section = 1, there will be a nested array of pages in an element called Page, and the nested pages will only be added if they have a file in the @/views directory, and section = 1, and have not already been added
  - make modifications after the //here comment

# 2026-03-12 - fix lint errors - Matt Ryan

- fix lint errors from `npm run lint` in `src/components/Communication.vue`, `src/components/Form.vue`, `src/components/LeadInfo.vue`, `src/components/ManualDial.vue`, `src/components/TransferCallDialog.vue`, `src/functions/formatPhone.ts`, `src/store/user.ts`, `src/views/ErrorLog.vue`, `src/views/Management.vue`, and `src/views/Selenium.vue`

# 2026-03-12 - modify pages.ts - Matt Ryan

- modify `pages.ts` to
  for each item in the rowTemp array, add the page to the pages array, only if in has a file in the @/views directory, and section = 0, and have not already been added

# 2026-03-12 - fix App.vue template error - Matt Ryan

- remove the invalid inline `if` template expression in `src/App.vue` that caused the parser error

# 2026-03-16 - fix Tabs websocket new tab handling - mmcinally

- @AGENTS.md - ensure that when a websocket `tab` message with a new `tab_id` arrives for the current user, `Tabs.vue` fetches that tab via `appStore.getTabs`, adds it to `appStore.tabs`, and opens it so the new contact appears in the Tabs list

# 2026-06-12 - guard missing form options - GPT-5.5

- update `src/components/Form.vue` so dependent form option loading does not iterate missing `originalFormOptions` entries

# 2026-06-12 - prevent verification style churn - GPT-5.5

- update `AGENTS.md` to require non-mutating lint, format, and test verification commands unless the user explicitly asks for formatting or broad style cleanup

# 2026-05-19 - add dashboard total ACW - mmcinally

- @AGENTS.md - add a `Total ACW` column to `src/views/Dashboard.vue` using the existing user status report duration mapping

# 2026-05-07 - guard LeadInfo Twilio call render - GPT-5.5

- update `src/components/LeadInfo.vue` so call controls do not index `appStore.twilioCall` before the Twilio call container exists

# 2026-05-07 - guard Twilio store containers - GPT-5.5

- update `src/store/user.ts` so Twilio setup and stop paths do not index `twilioDevice` or `twilioCall` before their per-company containers exist

# 2026-05-07 - guard missing case department form load - Codex

- update `src/store/user.ts` so `caseForm()` exits cleanly when the active case has no `Department` before assigning loaded forms

# 2026-04-27 - await browser geolocation callback - GPT-5.5

- update `src/classes/API.ts` so `getGeoLocation()` resolves from the `navigator.geolocation.getCurrentPosition()` callbacks instead of returning before the browser has a position or error

# 2026-04-23 - dashboard date range calendars - Codex

- update `src/views/Dashboard.vue` to add start and end date calendar inputs and use the selected date range when calculating per-agent communication call counts

# 2026-04-23 - dashboard date and time range filters - Codex

- update `src/views/Dashboard.vue` to add start/end time inputs and include both selected date and time values when building the communication query range

# 2026-06-08 - add dashboard user status dropdown - Auto

- @AGENTS.md - add a status dropdown to `src/views/Dashboard.vue` so administrators, managers, and supervisors can change an online agent's status; add `updateUserStatus` to `src/classes/API.ts`

# 2026-05-19 - add dashboard force logout button - GPT-5.5

- update `src/views/Dashboard.vue` and `src/classes/API.ts` to let dashboard users force logout an online agent with confirmation and refresh the dashboard after the logout succeeds

# 2026-06-12 - fix empty form select options - GPT-5.5

- normalize blank `option_key` values to `form_field_id` in `src/components/Form.vue` and `src/store/user.ts` so form select, radio, and checkbox options load from the populated option map

# 2026-04-21 - alternate dashboard row fallback colors - Codex

- update `src/views/Dashboard.vue` so rows without a resolved status color alternate white and light grey backgrounds

# 2026-04-21 - color dashboard user lines by status - Codex

- `src/views/Dashboard.vue` set online user row text color to green for Available status and blue for On Call status

# 2026-04-21 - restore missing Page wrapper component - Codex

- add `src/components/Page.vue` so existing `@/components/Page.vue` imports resolve again and dashboard page compilation succeeds

# 2026-04-21 - add dashboard online users table - Codex

- create `src/views/Dashboard.vue` to display online users with columns for current status, active call duration, total online time, total break time, and calls made today

# 2026-04-21 - add local presence phones for company and department - Codex

- update `src/views/Users.vue` and `src/classes/API.ts` to support viewing, adding, and deleting local presence phone numbers for company and department edit screens, matching the existing user phone workflow

# 2026-03-30 - guard Tabs Lead access - Matt Ryan

- fix `Cannot read properties of undefined (reading 'Lead')` in `src/components/Tabs.vue` by filtering tabs to those with a Lead and updating empty-state logic

# 2026-03-12 - guard focusField focus call - Matt Ryan

- guard `focusField` in `src/store/user.ts` to only call `focus()` when a focusable element exists

# 2026-03-12 - remove email input focus binding - Matt Ryan

- remove the `:focus` binding on the email input in `src/views/Login.vue` so `focus()` is not overridden

# 2026-03-12 - fix pages.ts non-null assertions - Matt Ryan

- remove non-null assertions in `src/router/pages.ts` by initializing `meta` before updates

# 2026-03-16 - fix Tabs websocket new tab handling - mmcinally

- @AGENTS.md - ensure that when a websocket `tab` message with a new `tab_id` arrives for the current user, `Tabs.vue` fetches that tab via `appStore.getTabs`, adds it to `appStore.tabs`, and opens it so the new contact appears in the Tabs list

# 2026-06-16 - enable Vercel deploy workflow on dev branch - michael.w

- add `.github/workflows/deploy-vercel.yml` to the `dev` branch (already on master) so pushes to `dev` deploy via the Vercel token and alias to `dev.crm.attorneylaunch.com`

# 2026-06-16 - disable PR preview deploys on dev (deploy only on merge) - michael.w

- mirror the master change: remove the `pull_request` trigger from `.github/workflows/deploy-vercel.yml` so dev deploys only on merge (gated by branch ruleset)

# 2026-06-25 - fix UserSelect lint errors - GPT-5.5

- update `src/components/ui/UserSelect.vue` so it no longer mutates the `editObject` prop and remove invalid directives from the item slot template

# 2026-06-25 - fix tsconfig ignoreDeprecations value - GPT-5.5

- update `tsconfig.json` so `compilerOptions.ignoreDeprecations` uses the valid `"5.0"` value instead of `"6.0"`

# 2026-06-27 - add npm stop script - GPT-5.5

- add `npm run stop` backed by `scripts/Stop.js` to terminate the local `vue-cli-service serve` process for this project

# 2026-06-27 - use npm stop in deploy workflow - GPT-5.5

- update `.github/workflows/deploy.yml` so deploy invokes `npm run stop` before falling back to existing port-based cleanup
