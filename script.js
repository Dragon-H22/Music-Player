
const wrapper = document.querySelector('.wrapper');
const musicFileInput = wrapper.querySelector('#musicFile');
const musicImg = wrapper.querySelector('.img-area img');
const musicName = wrapper.querySelector('.song-details .name');
const musicArtist = wrapper.querySelector('.song-detail .artist');
const mainAudio = wrapper.querySelector('#main-audio');
const playPauseBtn = wrapper.querySelector('.play-pause');
const prevBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');
const progressBar = wrapper.querySelector('.progress-bar');
const progressArea = wrapper.querySelector('.progress-area');
const repeatBtn = wrapper.querySelector('#repeat-plist');
const showMoreBtn = wrapper.querySelector('#more-music');
const musicList = wrapper.querySelector('.music-list');
const hideMusicBtn = musicList.querySelector('#close');
const ulTag = wrapper.querySelector('ul');


let musicIndex = 0;
let allMusic = [];


// window.addEventListener('load', () => {
// });

function clacDuration(audio) {
    let duration = audio.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    totalSec < 10 ? `0${totalSec}` : totalSec;
    return `${totalMin}:${totalSec}`;
}

function loadMusic(index) {
    if (index < 0 || index >= allMusic.length || allMusic.length == 0) return;
    musicName.innerText = allMusic[index].name
    mainAudio.src = URL.createObjectURL(allMusic[index]);
    musicIndex = index;
}

function pauseMusic() {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow';
    mainAudio.pause();
}

function playMusic() {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause';
    mainAudio.play();
}

playPauseBtn.addEventListener('click', () => {
    (wrapper.classList.contains('paused')) ? pauseMusic() : playMusic();
});

function nextMusic() {
    musicIndex = (musicIndex + 1) % allMusic.length;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

nextBtn.addEventListener('click', () => {
    nextMusic();
});

function prevMusic() {
    musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

prevBtn.addEventListener('click', () => {
    prevMusic();
});

mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current');
    let musicDurationTime = wrapper.querySelector('.duration');

    mainAudio.addEventListener('loadeddata', () => {
        musicDurationTime.innerText = clacDuration(mainAudio);
    });

    // Currunt time of song
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    currentSec < 10 ? `0${currentSec}` : currentSec;
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener('click', (e) => {
    let progressWidthValue = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickOffsetX / progressWidthValue) * songDuration;
    playMusic();
});

repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute("title", "Song looped");
            break;

        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute("title", "Playlist shuffled");
            break;

        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
})

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case 'repeat':
            nextMusic();
            break;

        case 'repeat_one':
            mainAudio.curruntTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;

        case 'shuffle':
            let randIndex;
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex)
            loadMusic(randIndex);
            playMusic();
            playingNow();
            break;
    }
})

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
});

hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click();
});

function generateMusicList() {
    ulTag.innerHTML = "";
    for (let i = 0; i < allMusic.length; i++) {

        let id = `idTest${i * 2}`;

        let liTag = `
        <li li-index="${i}" onclick="clicked(this)">
            <div class="row">
                <span>${allMusic[i].name}</span>
            </div>
            <audio class="${id}" src="${URL.createObjectURL(allMusic[i])}"></audio>
            <span id="${id}" class="audio-duration">3:40</span>
        </li>`;

        ulTag.insertAdjacentHTML('beforeend', liTag);

        let liAudioDuration = ulTag.querySelector(`#${id}`);
        let liAudioTag = ulTag.querySelector(`.${id}`);

        liAudioTag.addEventListener('loadeddata', () => {
            let durationTime = clacDuration(liAudioTag);
            liAudioDuration.innerText = durationTime;
            liAudioDuration.setAttribute("t-duration", durationTime);
        });

    }
}

function playingNow() {
    const allLiTag = ulTag.querySelectorAll('li');
    allLiTag.forEach(element => {
        let audioDurationTag = element.querySelector('.audio-duration');
        if (element.classList.contains("playing")) {
            element.classList.remove('playing');
            audioDurationTag.innerText = audioDurationTag.getAttribute('t-duration');
        }
        if (element.getAttribute('li-index') == musicIndex) {
            element.classList.add('playing');
            audioDurationTag.innerText = "Playing";
        }
    });
}

function clicked(element) {
    let liIndex = element.getAttribute('li-index');
    loadMusic(liIndex);
    playMusic();
    playingNow();
}

function uploadFiles() {
    if (musicFileInput.files.length > 0) {
        for (let i = 0; i < musicFileInput.files.length; i++) {
            const file = musicFileInput.files[i];
            if (file) {
                allMusic.push(file);
            }
        }
    }
}

musicFileInput.addEventListener('change', () => {
    uploadFiles();
    generateMusicList();
    loadMusic(musicIndex);
    playingNow();
});

