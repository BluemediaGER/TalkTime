var isPaused = false;
var currentSpeakerTime = 0;

$('#body').load('create.html', function() {

    $('#createForm').submit(function (event) {
        event.preventDefault();
        
        var speakerCount = this[0].value;
        var plannedTime = this[1].value;

        var timePerSpeaker = plannedTime / speakerCount;

        $('#createElement').fadeOut("fast", function() {

            $('#body').load("main.html", function () {

                $('#totalTime').html(plannedTime + " Minuten");
                createCards(speakerCount, timePerSpeaker);
            });
        });
    });
});

function createCards(ammount, timePerCard) {
    for(i = 0; i < ammount; i++){
        $('#cards').append('<div class="ui raised card"><div class="content"><h2 contenteditable="true" class="card-title">Teilnehmer ' + (i + 1) + '</h2></div><div class="content"><h1 id="time-' + i + '">' + new Date(timePerCard * 60 * 1000).toISOString().substr(14, 5) + '</h1><br><span>Minute(n)</span></div></div>');
    }
}

function timer(timeId, callback) {

    var countDownTimer = setInterval(()=>{
        if (!isPaused) {
            if (currentSpeakerTime >= 1) {
                currentSpeakerTime--;
                $(timeId).html(new Date(currentSpeakerTime * 1000).toISOString().substr(14, 5));
            } else {
                callback();
                clearInterval(countDownTimer);
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

    var cards = $('.ui.raised.card').toArray();

    if(index != 0){
        cards[index-1].classList.remove('active');
    }

    if(index < cards.length){

        currentSpeakerTime = parseFloat($('#time-' + index).html()) * 60;

        cards[index].classList.add('active');

        timer("#time-" + index, ()=>{

            start(index+1);
    
        });

    } else {
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
    currentSpeakerTime = 0;
}