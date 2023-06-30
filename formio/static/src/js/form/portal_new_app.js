// Copyright Nova Code (http://www.novacode.nl)
// See LICENSE file for full licensing details.

import { OdooFormioForm } from "./formio_form.js";
// use global owl
// can't import from "@odoo/owl", because not an @odoo-module
const { mount, whenReady, xml } = owl;

/**
FIX / WORKAROUND browser compatibility error.
Wrap Component class and bootstrap into functions and put template in
Component env.

OS/platform: browsers
=====================
- Mac: Safari 13.1
- iOS: Safari, Firefox

Error
=====
- Safari 13.1 on Mac experiences error:
  unexpected token '='. expected an opening '(' before a method's parameter list
- iOS not debugged yet. Dev Tools not present in browser.

More info
=========
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Browser_compatibility
*/

function app() {
    class App extends OdooFormioForm {
        static template = xml`
            <div t-name="App">
                <div id="formio_form"></div>
            </div>
        `;

        initForm() {
            if (!!document.getElementById('formio_builder_uuid')) {
                this.builderUuid = document.getElementById('formio_builder_uuid').value;
            }
            this.configUrl = '/formio/portal/form/new/' + this.builderUuid + '/config';
            this.submissionUrl = '/formio/portal/form/new/' + this.builderUuid + '/submission';
            this.submitUrl = '/formio/portal/form/new/' + this.builderUuid + '/submit';
            this.wizardSubmitUrl = '/formio/form/';
            this.isPortalUrl = window.location.pathname.indexOf('/formio/portal/') >= 0;
            this.apiUrl = '/formio/portal/form/new/' + this.builderUuid + '/api';
        }

        portalSaveDraftDoneUrl() {
            return this.params.hasOwnProperty('portal_save_draft_done_url') && this.params.portal_save_draft_done_url;
        }

        portalSubmitDoneUrl() {
            return this.params.hasOwnProperty('portal_submit_done_url') && this.params.portal_submit_done_url;
        }

        saveDraftDone(submission) {
            if (submission.state == 'draft') {
                if (this.isPortalUrl && this.portalSaveDraftDoneUrl()) {
                    const params = {save_draft_done_url: this.portalSaveDraftDoneUrl()};
                    if (window.self !== window.top) {
                        window.parent.postMessage({odooFormioMessage: 'formioSaveDraftDone', params: params});
                    }
                    else {
                        window.location = params.submit_done_url;
                    }
                }
                else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 500);
                }
            }
            else {
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            }
        }

        submitDone(submission) {
            if (submission.state == 'submitted') {
                if (this.isPortalUrl && this.portalSubmitDoneUrl()) {
                    const params = {submit_done_url: this.portalSubmitDoneUrl()};
                    if (window.self !== window.top) {
                        window.parent.postMessage({odooFormioMessage: 'formioSubmitDone', params: params});
                    }
                    else {
                        window.location = params.submit_done_url;
                    }
                }
                else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 500);
                }
            }
            else {
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            }
        }
    }

    const app = new App();
    mount(App, document.getElementById('formio_form_app'));
}

async function start() {
    await whenReady();
    app();
}
start();
