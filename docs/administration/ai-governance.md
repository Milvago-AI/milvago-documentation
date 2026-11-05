---
sidebar_position: 8
title: AI authorizations and NIST
---

# AI authorizations and NIST

Use **Administration > Shadow AI > AI governance** to decide which observed software is permitted on which devices. Community and Enterprise support rules for the organization, a device group or one device. Enterprise also inherits organization rules from parents.

Milvago uses NIST AI RMF as a governance reference. Its inventory, authorization records and review dates support your process. They do not establish certification or assess every AI risk. Open **NIST coverage and limits** to distinguish partial support, manual assessment and topics that discovery does not assess, such as model fairness or accuracy.

## Declare a business use or AI system

In the same view, open **Declared AI uses and systems**. With `policy.manage`, choose **Declare a use**, or open an existing row. A panel on the right lets you enter its name, responsible owner, business purpose and organization, group or device scope.

You can link application identifiers from the inventory and declare providers and models, with up to 16 values per list. Select data categories, describe potential impacts and safeguards, and set a review date. Describe categories rather than copying actual records or conversations. The risk level is your organization's manual assessment; **Not assessed** records an assessment that remains to be done.

Choose the declared lifecycle: planned, under review, in service or retired. A declaration in service is a business record. It does not establish that the software was observed or permitted. Overdue reviews are highlighted. Use the search field to find a name, owner, purpose or related application.

Choose **Save registry** with a reason and recent MFA. The registry has its own revision: updating it preserves software authorization rules and their current exceptions. If another administrator saved first, reload the registry before applying your changes. Removing a declaration requires confirmation and leaves observations and authorization rules available. Each organization supports up to 128 declarations within 256 KiB.

## Publish a rule

With `policy.manage`, add a rule, enter the application identifier shown in the inventory, then choose **Presence** or **Execution**. A rule about execution requires an observed execution; a package name or container image alone is insufficient.

Choose the organization, a group or a device. For groups and devices, use the selection list. Choose **Permit** or **Prohibit**, name a responsible owner, describe the purpose and conditions, and set a review date. An optional validity date ends the rule automatically. Enter a reason and publish with recent MFA. Saving the collection settings does not publish these authorizations.

A more specific rule normally takes precedence: device, group, then organization. For example, prohibit `antigravity` for the organization and permit it for the engineering group. Other devices remain subject to the prohibition. Marking the prohibition **Mandatory** prevents a more specific permission from relaxing it. A mandatory parent restriction cannot be relaxed by a child organization.

In observation mode, rules evaluate evidence without blocking programs or communications. Configure executable blocking in Enterprise explicitly as described below. A missing rule means **No applicable rule**, never automatic permission. Insufficient evidence remains unknown. An overdue review is displayed even if the rule permits the activity.

Assessments correspond to the displayed evaluation time. Locations and device authorization refresh every 30 seconds while visible, and when you return to the view. Only one active exception is accepted for a device, rule and policy revision; revoke it before replacing it.

## Executable blocking in Enterprise

Observation remains the default, including for existing rules. With a compatible Enterprise server and agent, select **Execution**, **Prohibit**, then **Block future launches**. Publish with a reason and recent MFA. This decision is prospective: a program does not need to have run first. It does not terminate processes already running.

This mode targets Claude Desktop, Claude Code, Codex and Antigravity App, CLI and IDE through a qualified identity catalog. It requires a permanent rule without a validity deadline or temporary exceptions. Remove overlapping temporary rules before enabling it. A review date is a reminder and does not expire the restriction. More specific permanent permissions retain the normal precedence, except under a mandatory prohibition.

The device needs an administrator-provisioned catalog for its exact application versions and operating system. Windows uses AppLocker with Application Identity running. Linux uses fapolicyd and an administrator-approved integration with its existing policy. A missing catalog, unsupported version or unavailable system mechanism is shown as unavailable; selecting a blocking mode alone is insufficient. Existing GPO, MDM or other application-control policies require administrator integration. Milvago does not merge broad permissions into them automatically.

For Linux, the administrator must enable `allow_filesystem_mark = 1` in fapolicyd's configuration and restart that daemon after reviewing the existing policy for bind-mounted workloads. This mode also monitors access through isolated mount namespaces on watched file systems. Milvago does not change that configuration. It verifies the live refusal with an inert probe inside a private bind mount; if the configuration or the system permissions do not permit this verification, the device cannot report the restriction as applied.

Open the application's device authorization to inspect **Executable blocking** and its qualified versions. **Applied to qualified identities** confirms the reported system mechanism for those identities. **Awaiting device confirmation**, **Partial**, **Unavailable**, **Administrator integration required**, **Policy conflict** and an out-of-date confirmation do not establish current full protection. Status is reported by the device, not remotely attested.

Existing signed denials remain during a server outage and across agent restarts. Restore server connectivity and publish a permanent permission or observation mode to withdraw a Milvago denial. For offline recovery or removal, an administrator must restore the managed system policy before deleting its protected state. A foreign policy conflict requires manual integration; do not delete the cache to bypass it.

Coverage concerns qualified executable hashes or exact package identities on the directly managed system. Matching qualified hashes cover identical and renamed executable copies. Package identities cover the exact package; unpackaged copies require separately qualified hashes. On Linux, access to the denied binary is also refused to prevent an explicit ELF loader from opening it. Modified or new unqualified binaries, shared Node/Python/Electron interpreters, and guests without their own agent are outside this coverage. No Milvago kernel driver is installed. Execution blocking, communication filtering and DLP are independent: a launch denial does not prove pre-send inspection, and the native service's **Block** communication setting does not prove that Claude Desktop, Claude Code or Codex cannot launch.

The supplied Windows catalog covers Claude Code 2.1.303, Codex 0.166.0 and Antigravity App 2.24.0, CLI 1.4.0 and IDE 2.5.5. It also includes Claude Desktop 4.16336.0.0 for its main MSIX launch and unpackaged main executable. The supplied Linux catalog covers Claude Code 2.1.303, Codex 0.166.0 and Antigravity CLI 1.4.0. Catalog import is a separate administrator operation; enabling a rule does not install it.

For Claude Desktop 4.16336.0.0, the local Windows integration also disables availability of the qualified package through Windows package management. This prevents future Cowork service starts without changing service permissions or startup settings. Existing instances are preserved. Full service blocking waits for package clients to exit naturally and is reported as Partial meanwhile. Quit Claude Desktop to complete it; AppLocker continues to refuse new main launches. Milvago records the original availability state before changing it and restores that state when the restriction is removed, without launching the application or service. A package that was already disabled remains disabled. A missing, changed or unqualified service prevents an applied status. On managed devices, integrate both the exported package availability requirement and AppLocker denials with your existing controls. A main-launch check alone does not establish service enforcement.

Hash coverage applies to unpackaged Windows executables and Linux ELF files, including identical and renamed copies. Windows packaged launches require a separately qualified package identity; repackaging is outside hash-only coverage.

On Linux, a qualified startup resource identifies a mandatory application file rather than its shared Electron runtime. Linux refuses access to that exact file, including identical and renamed copies, to prevent application startup. The shared runtime remains usable. Modified, extracted or repackaged startup files require separate qualification and are outside this coverage. The device status distinguishes startup resources from executable hashes.

The supplied Linux catalog also covers Claude Desktop 4.16336.0, Antigravity App 2.23.1 and Antigravity IDE 2.5.5 through their qualified startup resources. Their Electron runtimes are shared with other software: do not add those runtime hashes as application identities.

On Linux, coverage also depends on the file systems monitored by fapolicyd. Anonymous or memory-only execution and process injection are not covered.

## Review a device and approve an exception

In **Monitoring > AI inventory**, open a software entry and select **Locations**. Each row groups all observations for one device and shows separate presence and execution assessments. Select the device to open its evidence and current authorization. **Show evidence from all devices** clears that filter. VM and container relationships remain under **Environments**.

An exception applies to one device and one current rule that explicitly accepts exceptions. Approval requires `ai.governance.approve`, the relevant read permissions, a justification, an expiry within three months and recent MFA. This approval right belongs to the owner by default; it can be assigned explicitly to a custom role. Publishing a new policy invalidates earlier exceptions. Exceptions expire automatically or can be revoked with a reason. A child organization cannot approve an exception to a parent's restriction.

The existing **Inventory review** is a global annotation. Its Authorized or Unauthorized value does not replace the effective device rules. **Authorization decision history** retains published revisions and justified exception decisions. Current assessments use today's rules and do not rewrite older observations.

## Import and automate

You may validate a YAML or JSON document and use it as a draft before publishing. Validation does not save or activate it. Rules contain data only; they do not run scripts. Up to 256 rules are supported per organization, within the document size limit.

Use the discovery API and Enterprise MCP for automated reading. Enterprise MCP does not publish authorization rules or approve exceptions. See the [official NIST AI RMF](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) for the wider organizational framework.
