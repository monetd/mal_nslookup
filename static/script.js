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

            var numHHActive = 0;
            var numHHActSucc = 0;
            var numHHActFail = 0;

            var numHHStandby = 0;
            var numHHStdSucc = 0;
            var numHHStdFail = 0;

            var numGRActive = 0;
            var numGRActSucc = 0;
            var numGRActFail = 0;

            var numGRStandby = 0;
            var numGRStdSucc = 0;
            var numGRStdFail = 0;

            for(i=0; i<numData; i++) {

                $("#td_1").parent().parent().children().eq(i).find("#td_1").text(data[i].id);

                $("#td_2").parent().parent().children().eq(i).find("#td_2").text(data[i].Node);

                if (data[i].dns_server == "Active") {
                    $("#td_3").parent().parent().children().eq(i).find("#active_img").attr('src', '/static/active.png');

                    // 혜화 일 경우
                    if (data[i].Node == "혜화") {
                        numHHActive = numHHActive + 1;
                    } else {    // 구로 일 경우
                        numGRActive = numGRActive + 1;
                    }
                } else {
                    $("#td_3").parent().parent().children().eq(i).find("#standby_img").attr('src', '/static/standby.png');

                    // 혜화 일 경우
                    if (data[i].Node == "혜화") {
                        numHHStandby = numHHStandby + 1;
                    } else {    // 구로 일 경우
                        numGRStandby = numGRStandby + 1;
                    }
                }

                $("#td_4").parent().parent().children().eq(i).find("#td_4").text(data[i].server);
                $("#td_5").parent().parent().children().eq(i).find("#td_5").text(data[i].reg_date);
                $("#td_6").parent().parent().children().eq(i).find("#td_6").text(data[i].resp_date);

                if (data[i].status == "true") {
                    $("#td_7").parent().parent().children().eq(i).find("#green_img").attr('src', '/static/green.png');
                    if (data[i].dns_server == "Active") {
                        if (data[i].Node == "혜화") {
                            numHHActSucc = numHHActSucc + 1;
                        } else {
                            numGRActSucc = numGRActSucc + 1;
                        }
                    } else {
                        if (data[i].Node == "혜화") {
                            numHHStdSucc = numHHStdSucc + 1;
                        } else {
                            numGRStdSucc = numGRStdSucc + 1;
                        }
                    }
                } else {
                    $("#td_7").parent().parent().children().eq(i).find("#red_img").attr('src', '/static/red.png');
                    if (data[i].dns_server == "Active") {
                        if (data[i].Node == "혜화") {
                            numHHActFail = numHHActFail + 1;
                        } else {
                            numGRActFail = numGRActFail + 1;
                        }
                    } else {
                        if (data[i].Node == "혜화") {
                            numHHStdFail = numHHStdFail + 1;
                        } else {
                            numGRStdFail = numGRStdFail + 1;
                        }
                    }
                }
            }

            $("#card_1").text(numHHActive);
            $("#card_2").text(numHHActSucc);
            $("#card_3").text(numHHActFail);
            $("#card_4").text(numHHStandby);
            $("#card_5").text(numHHStdSucc);
            $("#card_6").text(numHHStdFail);
            $("#card_7").text(numGRStandby);
            $("#card_8").text(numGRStdSucc);
            $("#card_9").text(numGRStdFail);


            if (( numHHActFail > 0 || numHHStdFail > 0 || numGRActFail > 0 || numGRStdFail ) && soundFlag == 1) {
                playAlert();
            }
        }
    });
}

function playAlert() {
    var audio = document.getElementById('audio_play');
    audio.play();
}
