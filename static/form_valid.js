$(function() {
    var pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
    x = 46;

    $("#ipaddress").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && e.which != x && (e.which < 48 || e.which > 57)) {
        console.log(e.which);
        return false;
    }
    }).keyup(function () {
        var this1 = $(this);
        if (!pattern.test(this1.val())) {
            $("#add_ip").attr('disabled', true);
            $('#validate_ip').text('IP 형식이 아닙니다.');
            while (this1.val().indexOf("..") !== -1) {
                this1.val(this1.val().replace('..', '.'));
            }
            x = 46;
        } else {
            x = 0;
            var lastChar = this1.val().substr(this1.val().length - 1);
            if (lastChar == '.') {
                this1.val(this1.val().slice(0, -1));
            }
            var ip = this1.val().split('.');
            if (ip.length == 4) {
                $('#validate_ip').text('Valid IP');
            }

            $("#add_ip").attr('disabled', false);
        }
    });
});




