function postAssessment(ps, gs, force) {
    if (force || needsUpdate()) {
        if (window.navigator.onLine) {
            log(new Date().getTime()); //3ms
            var assessment = prep();
            log(new Date().getTime());
            post(assessment);
            log(new Date().getTime());
        } else {
            Ext.Msg.alert(
                    "Internet Connection Required",
                    "You are not online, please get an internet connection working and try to post your results again"
                    );
        }

    }
}

function needsUpdate() {
    lastUpdatedTs = AppSettings.getLastUpdated();
    lastSyncedTs = AppSettings.getLastSynced();
    return (lastUpdatedTs === null || lastSyncedTs === null)
            ||
            (lastUpdatedTs > lastSyncedTs);
}
function prep() {
    responses = Ext.getStore('Responses');
    var assessmentResponses = [];
    responses.each(function(record) {
        var ar = Ext.create('adnat.model.AssessmentResponse', record.data);
        // remove id and any empty properties
        delete ar.data.id;
        for (i in ar.data) {
            if (ar.data[i] === null || ar.data[i] === '' || ar.data[i] === undefined) {
                delete ar.data[i];
            }
        }
        assessmentResponses.push(ar.data);
    });
    var assessment = new Object();
    assessment.responses = assessmentResponses;
    assessment.score = new Object();
    assessment.score.psych = getPsychScore();
    assessment.score.general = getGeneralScore();
    log(Ext.encode(assessment));
    return assessment;
}

function post(assessment) {
    // post it with json
    Ext.define("assessment", {extend: "Ext.data.Model",
        config: {
            fields: ['responses', 'score'],
            proxy: {
                type: 'rest',
                url: 'https://api.myadnat.co.uk:4443/v1/assessments.json'
            }
        }
    });
    Ext.ModelMgr.create(assessment, 'assessment').save();

    AppSettings.updateLastSynced();
}