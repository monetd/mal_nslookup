$(document).ready(function() {
    var interval =  $("#interval").html();
    var soundFlag = $("#sound").html();

    setInterval(refreshData, interval, soundFlag);
});

function refreshData(soundFlag) {
    var isSend = $("#isSend").html();

    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : "/",
        success : function (data) {
            var numData = data.length;

            var numActive = 0;
            var numActSucc = 0;
            var numActFail = 0;

            var numStandby = 0;
            var numStdSucc = 0;
            var numStdFail = 0;

            for(i=0; i<numData; i++) {

                $("#td_1").parent().parent().children().eq(i).find("#td_1").text(data[i].id);

                if (data[i].dns_server == "Active") {
                    $("#td_2").parent().parent().children().eq(i).find("#active_img").attr('src', '/static/active.png');
                    numActive = numActive + 1;

                } else {
                    $("#td_2").parent().parent().children().eq(i).find("#standby_img").attr('src', '/static/standby.png');
                    numStandby = numStandby + 1;
                }

                $("#td_3").parent().parent().children().eq(i).find("#td_3").text(data[i].server);
                $("#td_4").parent().parent().children().eq(i).find("#td_4").text(data[i].reg_date);
                $("#td_5").parent().parent().children().eq(i).find("#td_5").text(data[i].resp_date);

                if (data[i].status == "true") {
                    $("#td_2").parent().parent().children().eq(i).find("#green_img").attr('src', '/static/green.png');
                    if (data[i].dns_server == "Active") {
                        numActSucc = numActSucc + 1;
                    } else {
                        numStdSucc = numStdSucc + 1;
                    }
                } else {
                    $("#td_2").parent().parent().children().eq(i).find("#red_img").attr('src', '/static/red.png');
                    if (data[i].dns_server == "Active") {
                        numActFail = numActFail + 1;
                    } else {
                        numStdFail = numStdFail + 1;
                    }
                }
            }

            $("#card_1").text(numActive);
            $("#card_2").text(numActSucc);
            $("#card_3").text(numActFail);
            $("#card_4").text(numStandby);
            $("#card_5").text(numStdSucc);
            $("#card_6").text(numStdFail);

            if (( numActFail > 0 || numStdFail > 0 ) && soundFlag == 1) {
                playAlert();
            }
        }
    });
}

function playAlert() {
    var audio = document.getElementById('audio_play');
    audio.play();
}
