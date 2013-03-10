Ext.define("adnat.view.Util", {
    extend: 'Ext.Panel',
    xtype: 'util',
    requires: [
        'Ext.TitleBar'
    ],
    config: {
        id: 'util',
        title: 'Utility',
        iconCls: 'info',
        styleHtmlContent: true,
        scrollable: true,
        listeners: {
            show: function() {
                adnat.app.getController('UtilController').update(event);
            },
            painted: function() {
                adnat.app.getController('UtilController').update(event);
            },
            hide: function() {
            }
        },
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: 'Utility'
            },
            {
                xtype: 'fieldset',
                title: 'ADNAT Information',
                items: [
                    {
                        xtype: 'label',
                        id: 'isOnline',
                        style: 'text-align: center',
                        html: ''
                    },
                    {
                        xtype: 'label',
                        id: 'lastSynced',
                        style: 'text-align: center',
                        html: ''
                    },
                    {
                        xtype: 'label',
                        id: 'lastUpdated',
                        style: 'text-align: center',
                        html: ''
                    }

                ]},
            {
                xtype: 'button',
                margin: '40px',
                text: 'Update',
                ui: 'normal',
                handler: function() {
                    Ext.getStore('Settings').load();
                    adnat.app.getController('UtilController').update(event);
                }
            },
            {
                xtype: 'button',
                margin: '40px',
                text: 'Sync to Server Now',
                ui: 'normal',
                handler: function() {
                    Ext.Viewport.mask({xtype: 'loadmask', message: 'Submitting...'});
                    score();
                    var task = Ext.create('Ext.util.DelayedTask', function() {
                        var gs = getGeneralScore();
                        var ps = getPsychScore();
                        postAssessment(ps, gs); // anytime after scoring is _really_ done
                        Ext.Viewport.unmask();
                    });
                    task.delay(1900);
                }
            }, {
                xtype: 'button',
                margin: '40px',
                text: 'Delete All of My Responses',
                ui: 'decline',
                handler: function() {
                    Ext.Msg.confirm(
                            "Confirmation", "Are you sure you want to delete all of your answers? <br><i>This action can not be undone</i>",
                            function(answer) {
                                if (answer === 'yes') {
                                    Ext.getStore('Responses').deleteAllRecords();
                                    location.reload();
                                }
                            }
                    );
                }
            },
            {
                xtype: 'button',
                margin: '40px',
                text: 'Reset Application',
                ui: 'decline',
                handler: function() {
                    Ext.Msg.confirm(
                            "Confirmation", "Are you sure you want to delete all of your data and logout? <br><i>This action can not be undone</i>",
                            function(answer) {
                                if (answer === 'yes') {
                                    window.localStorage.clear()
                                    location.reload();
                                }
                            }
                    );
                }
            },
            {
                xtype: 'button',
                margin: '40px',
                text: 'Logout',
                ui: 'normal',
                handler: function() {
                    Ext.Msg.confirm(
                            "Confirmation", "Would you like to logout of the ADNAT application?",
                            function(answer) {
                                if (answer === 'yes') {
                                    Ext.getStore('Responses').deleteAllRecords();
                                    location.reload();
                                }
                            }
                    );
                }
            }

        ]
    }
});
