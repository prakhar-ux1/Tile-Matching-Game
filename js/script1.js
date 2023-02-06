let game_started = false;
let matches = 0;
let moves = 0;
let openedCardIds = []
let stars = 3;
let seconds = 0
let minutes = 0;
let startTime, timer_interval;
let icons_class = ["fa-bus", "fa-tree", "fa-truck", "fa-fire", "fa-heart-o", "fa-gavel", "fa-gift", "fa-bolt"];
icons_class = [...icons_class, ...icons_class];
function setRestartButton() {
    document.getElementById("restart").addEventListener('click', () => {
        swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: 'Are you sure?',
            text: "Your progress will be Lost!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#82d8e7',
            cancelButtonColor: '#2bcf00',
            confirmButtonText: 'Yes, Restart !'
        }).then((result) => {
            console.log(result);
            if (result) {
                clearInterval(timer_interval);
                setInitial();
            }

        });
    });
}
function setTimer() {
    startTime = new Date().getTime();
    timer_interval = window.setInterval(() => {
        let currentTime = new Date().getTime();
        let total_second = parseInt((currentTime - startTime) / 1000);
        seconds = total_second % 60;
        minutes = parseInt(total_second / 60);
        document.getElementById("seconds").innerText = seconds;
        document.getElementById("minutes").innerText = minutes;
    }, 1000);


}
function shuffleIcons(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function setIcons(icons_list) {
    const i_tag = (document.querySelector('.container')).querySelectorAll('i.fa');
    console.log(i_tag);
    i_tag.forEach((element, index) => {

        element.classList.add(icons_list[index]);
    })
}

function starRating(moves) {
    if (moves > 12 && moves <= 18) {
        document.getElementById('star3').classList.remove("fa-star")
        document.getElementById('star3').classList.add("fa-star-o");
        stars = 2;
    }
    else if (moves > 18) {
        document.getElementById('star2').classList.remove("fa-star")
        document.getElementById('star2').classList.add("fa-star-o");
        stars = 1;
    }

}
function endGame(moves) {
    starRating(moves);
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Congratulations! You have Won!',
        text: 'With ' + moves + ' steps and ' + stars + ' Stars.\n Woooooo! \n Time Taken: ' + minutes + ' Minutes - ' + seconds + ' Seconds',
        type: 'success',
        confirmButtonColor: '#82d8e7',
        confirmButtonText: 'Play again!'
    }).then(function () {
        clearInterval(timer_interval);
        setInitial();
    })





}
function clearIcon() {

    //clear all className added in i tags to remove any icons setted before and add intial class

    let aLL_I_Tags = document.querySelectorAll('.container')[0].querySelectorAll('i.fa');
    aLL_I_Tags.forEach((element) => {
        element.className = "fa";
    })

}
function changeCardState(firstCard, secondCard) {
    // add matched class
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    // add confirm class to  change color of flipped side.
    firstCard.getElementsByClassName('back')[0].classList.add('confirm');
    secondCard.getElementsByClassName('back')[0].classList.add('confirm');
}
function setInitial() {
    game_started = false;
    moves = 0;
    starRating(moves);
    clearIcon();
    shuffleIcons(icons_class);
    setIcons(icons_class);

    seconds = 0;
    minutes = 0;
    document.getElementById('move_value').innerText = moves;
    document.getElementById('seconds').innerText = seconds;
    document.getElementById('minutes').innerText = minutes;
    let cards = document.querySelectorAll('.card');
    [...cards].forEach((card, index) => {
        card.setAttribute("id", index);
        card.className = ("card");

        let backCard = card.getElementsByClassName('back')[0];
        if (backCard.classList.contains("confirm"))
            backCard.classList.remove("confirm");

    });






}
function setCardClick() {
    let cards = document.querySelectorAll('.card');
    [...cards].forEach((card, index) => {
        card.addEventListener('click', function (event) {

            card.classList.add('is-flipped');
            //check if game is started or not
            if (game_started == false) {
                setTimer();
                openedCardIds.push(index);
                game_started = true;
                return;
            }
            //if clicked card is already card or not
            if (card.classList.contains("matched")) {
                return;
            }
            //if clciked card is first card.
            if (openedCardIds.length == 0) {
                openedCardIds.push(index);
                return;
            }
            //if clicked  card is already opened 
            if (openedCardIds[0] == index) {
                return;
            }
            // if its second card
            else {
                //set incremented values
                moves++;
                document.getElementById('move_value').innerText = moves;

                //set star on basis of moves
                starRating(moves);

                setTimeout(() => {
                    //index=card.getAttribute("id");
                    let firstCard = document.getElementById(openedCardIds[0]);
                    let firstCardIcon = firstCard.getElementsByTagName('i')[0].classList[1];
                    let secondCard = document.getElementById(index);
                    let SecondCardIcon = secondCard.getElementsByTagName('i')[0].classList[1];

                    if (firstCardIcon == SecondCardIcon) {
                        //its a matches
                        matches++;
                        changeCardState(firstCard, secondCard)
                        if (matches == 8) {
                            clearInterval(timer_interval);
                            endGame(moves);
                            return;

                        }
                    }
                    else {
                        card.classList.remove('is-flipped');
                        document.getElementById(openedCardIds[0]).classList.remove('is-flipped');
                    }

                    //empty the array
                    openedCardIds = [];
                }, 700);

            }

        });
    });
}
function startGame() {
    setInitial();
}

startGame();
//set_on_click for cards
setCardClick();
setRestartButton();









