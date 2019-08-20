var isPaused = false;
var isJumped = false;
var currentSpeakerTime = 0;
var timePerSpeaker = 0;
var speakerArray = [];
var audio = new Audio('../audio/notify.mp3');

$('#body').load('create.html', function() {

    $('#createForm').submit(function (event) {
        event.preventDefault();
        
        var speakerCount = this[0].value;
        var plannedTime = this[1].value;

        timePerSpeaker = plannedTime / speakerCount;

        $('#createElement').fadeOut("fast", function() {

            $('#body').load("names.html", function () {

                createNameFields(speakerCount);

                $('#nameForm').submit(function (event) {
                    event.preventDefault();

                    for (i = 0; i < (this.length - 2); i++) {
                        speakerArray.push(this[i].value);
                    }

                    $('#nameElement').fadeOut("fast", function() {

                        $('#body').load('main.html', function () {
                            $('#totalTime').html(plannedTime + " Minuten");
                            prepareMain();
                        });
                    });
                });
            });
        });
    });
});

function createNameFields(ammount) {
    for(i = 0; i < ammount; i++){
        $('.ui.container').before('<div class="field"><div class="ui right labeled input"><input type="text" required="required" value="Teilnehmer ' + (i + 1) +'"><div class="ui basic label">Name</div></div></div>');
    }
}

function prepareMain() {

    $('#card-time').html(new Date(timePerSpeaker * 60 * 1000).toISOString().substr(14, 5));
    $('#card-title').html(speakerArray[0]);

    for(i = 1; i < speakerArray.length; i++){
        $('#buffer').append('<div class="ui raised card"><div class="content"><h2 class="buffer-title">' + speakerArray[i] + '</h2></div></div>');
    }
}

function timer(callback) {

    var isEnding = false;
    var isWaiting = false;

    var countDownTimer = setInterval(()=>{
        if (!isPaused) {
            if (currentSpeakerTime >= 1) {
		currentSpeakerTime--;
                if (currentSpeakerTime <= ((20 / 100) * (timePerSpeaker * 60)) && !isEnding) {
                    $('#maincard').removeClass('active');
                    $('#maincard').addClass('ending');
                    isEnding = true;
                }
                $('#card-time').html(new Date(currentSpeakerTime * 1000).toISOString().substr(14, 5));
            } else {
                if (!isJumped) {
                    if (currentSpeakerTime < 1 && !isWaiting) {
                        $('#maincard').removeClass('ending');
                        $('#maincard').addClass('ended');
                        $('#card-title').html('Warten...');
                        $('#buffer').children().eq(1).addClass('ending');
                        audio.play();
                        currentSpeakerTime = 11;
			$('#card-time').html('00:10');
                        isWaiting = true;
                    }
                    if (currentSpeakerTime <= 0) {
                        callback();
                        clearInterval(countDownTimer);
                    }
		    currentSpeakerTime--;
                } else {
                    isJumped = false;
                    callback();
                    clearInterval(countDownTimer);
                }
            }
        }
    }, 1000);
}

function start(index) {

    if (index == 0) {
        $('#startButton').removeClass("green");
        $('#startButton').addClass("orange");
        $('#startButtonText').html("Pausieren");
        $('#startButtonIcon').removeClass("play");
        $('#startButtonIcon').addClass("pause");
        $('#startButton').attr('onclick', 'pause();');
    }

    if (index != speakerArray.length) {
        currentSpeakerTime = timePerSpeaker * 60;
	$('#card-time').html(new Date(currentSpeakerTime * 1000).toISOString().substr(14, 5));        
	if (index != 0) {
	    currentSpeakerTime++;
	}

        if (index != 0) {
            $('#buffer').children().eq(1).remove();
	    $('#maincard').removeClass('ending');
            $('#maincard').removeClass('ended');
            $('#card-title').html(speakerArray[index]);
        }

        $('#maincard').addClass('active');

        timer(()=>{
    
            start(index+1);
            
        });
    } else {
        $('#maincard').removeClass('ending');

        $('#startButton').removeClass("orange");
        $('#startButton').addClass("red");
        $('#startButtonText').html("Beendet");
        $('#startButtonIcon').removeClass("pause");
        $('#startButtonIcon').addClass("times");
        $('#startButton').attr('onclick', '');
    }
}

function pause() {

    isPaused = true;

    $('#startButton').removeClass("orange");
    $('#startButton').addClass("blue");
    $('#startButtonText').html("Fortsetzen");
    $('#startButtonIcon').removeClass("pause");
    $('#startButtonIcon').addClass("play");
    $('#startButton').attr('onclick', 'resume();');
}

function resume() {

    isPaused = false;

    $('#startButton').removeClass("blue");
    $('#startButton').addClass("orange");
    $('#startButtonText').html("Pausieren");
    $('#startButtonIcon').removeClass("play");
    $('#startButtonIcon').addClass("pause");
    $('#startButton').attr('onclick', 'pause();');
}

function skip() {
    isJumped = true;
    currentSpeakerTime = 0;
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }
