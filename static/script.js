$(document).ready(function() {
    var interval =  $("#interval").html();
    var soundFlag = $("#sound").html();
    var mailFlag = $("#mailing").html();

    setInterval(refreshData, interval, soundFlag, mailFlag);
});

function refreshData(soundFlag, mailFlag) {
    var isSend = $("#isSend").html();

    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : "/",
        success : function (data) {
            var numData = data.length;
            var numSuccess = 0;
            var numFailed = 0;

            for(i=0; i<numData; i++) {

                $("#td_1").parent().parent().children().eq(i).find("#td_1").text(data[i].id);
                $("#td_2").parent().parent().children().eq(i).find("#td_2").text(data[i].server);
                $("#td_3").parent().parent().children().eq(i).find("#td_3").text(data[i].reg_date);
                $("#td_4").parent().parent().children().eq(i).find("#td_4").text(data[i].resp_date);

                if ( data[i].status == "true") {
                    $("#td_1").parent().parent().children().eq(i).find(".rounded-circle").attr('src', '/static/green.png');
                    numSuccess = numSuccess + 1;

                } else {
                    $("#td_1").parent().parent().children().eq(i).find(".rounded-circle").attr('src', '/static/red.png');
                    numFailed = numFailed + 1;
                }
            }

            $("#card_1").text(numData);
            $("#card_2").text(numSuccess);
            $("#card_3").text(numFailed);

            if (numFailed > 0 && soundFlag == 1) {
                playAlert();
            }

            if (numFailed > 9 && mailFlag == 1 && isSend == 0) {
                sendMail();
            }
        }
    });
}

function playAlert() {
    var audio = document.getElementById('audio_play');
    audio.play();
}

function sendMail() {
     $.ajax({
        type : 'POST',
        url : "/send_mail",
        success : function (data) {
            console.log(data);
            $("#isSend").html("1")
            setTimeout(function() {
                $("#isSend").html("0")
            }, 3600000);
        }
    });
}