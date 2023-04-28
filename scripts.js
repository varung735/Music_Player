import playlist  from "./playlist.js";

const musicImg = document.getElementById("music-img");
const musicName = document.getElementById("music-name");
const album = document.getElementById("album");
const releasedOn = document.getElementById("released-on");
const artist = document.getElementById("artist");
const label = document.getElementById("label");
const audio = document.getElementById("audio");
const progressDiv = document.getElementById("progress-div");
const progressBar = document.getElementById("progress-bar");
const prevBtn = document.getElementById("previous");
const playBtn = document.getElementById("play");
const playImg = document.getElementById("play-img");
const nextBtn = document.getElementById("next");
const volumeDiv = document.getElementById("volume-div");
const volumeBar = document.getElementById("volume-bar");
const playlistDiv = document.getElementById("playlist-box");

let playlistLength = playlist.length - 1;
let currentSong = 0; // To be used for playing the previous and next from the current song.

// add the songs from playlist in playlist box as play item
const createPlayItem = (id, songName, albumArtSrc, songArtist) => {
    const playItemDiv = document.createElement('div');
    const albumArtDiv = document.createElement('div');
    const piSongDetailsDiv = document.createElement('div');
    const albumArtImg = document.createElement('img');
    const songNameH4 = document.createElement('h4');
    const songArtistP = document.createElement('p');

    playItemDiv.classList.add('play-item');
    playItemDiv.classList.add(id);
    albumArtDiv.classList.add('pi-album-art-div');
    piSongDetailsDiv.classList.add('pi-song-details');
    songNameH4.classList.add('song-name');
    songNameH4.classList.add(id);
    songArtistP.classList.add('song-artist');
    songArtistP.classList.add(id);
    albumArtImg.classList.add('album-art');
    albumArtImg.classList.add(id);

    playItemDiv.setAttribute('id', "play-item");
    albumArtImg.setAttribute('src', albumArtSrc);
    songNameH4.innerText = songName;
    songArtistP.innerText = songArtist;

    playItemDiv.appendChild(albumArtDiv);
    playItemDiv.appendChild(piSongDetailsDiv);
    albumArtDiv.appendChild(albumArtImg);
    piSongDetailsDiv.appendChild(songNameH4);
    piSongDetailsDiv.appendChild(songArtistP);

    playlistDiv.appendChild(playItemDiv);
}

// Sweeps through the object array in playlist.js to populate the music list
playlist.map((song) => {
    createPlayItem(song.id, song.name, song.albumArt, song.artist);
});

const playItemDiv = document.querySelectorAll('#play-item');

// function for loading the song into the player.

const loadSong = (songId) => {
    musicImg.setAttribute('src', playlist[songId].albumArt);
    musicName.innerText = playlist[songId].name;
    album.innerText = "Album: " + playlist[songId].album;
    releasedOn.innerText = "Released On: " + playlist[songId]["released-on"];
    artist.innerText = "Artist: " + playlist[songId].artist;
    label.innerText = "Label: " + playlist[songId].label;
    audio.src = playlist[songId].audio;
    playSong()
}

// for attaching the click listeners to every play item div created through createPlayItem()
// the click listener is to select song from the list to be played on player.
playItemDiv.forEach((item) => {
    item.addEventListener('click', () => {
        let songId = event.target.classList[1];
        currentSong = songId;

        loadSong(songId);
    })
});

//function to play the song
const playSong = () => {
    playBtn.classList.add("play");
    playImg.setAttribute('src', "./assets/icons/pause.svg");
    audio.play();
}

//function to pause the song
const pauseSong = () => {
    playBtn.classList.remove("play");
    playImg.setAttribute('src', "./assets/icons/play.svg");
    audio.pause();
}

// click listener to play and pause song.
playBtn.addEventListener('click', () => {
    let isPlaying = playBtn.classList.contains("play");
    
    if(isPlaying){
        pauseSong();
    }else{
        playSong();
    }
});

//click listener to play the previous song
prevBtn.addEventListener('click', () => {
    if(currentSong == 0){
       currentSong = playlistLength;
       loadSong(currentSong);
    }
    else{
        currentSong = currentSong - 1;
        loadSong(currentSong);
    }
});

//click listener to play the next
nextBtn.addEventListener('click', () => {
    if(currentSong == playlistLength){
        currentSong = 0;
        loadSong(currentSong);
    }else{
        ++currentSong;
        loadSong(currentSong);
    }
});

//function to updating the progress bar;
const updateProgress = (e) => {
    const duration = e.srcElement.duration;
    const currentTime = e.srcElement.currentTime;

    const progressPercent = (currentTime/duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// function to set the progress bar on click
const setProgress = (e) => {
    const width = progressDiv.clientWidth;
    const clickWidth = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickWidth / width) * duration;
}

// timeupdate event for updating the progress bar 
audio.addEventListener('timeupdate', updateProgress);

// ended listener to play the next song automatically when the song ends.
audio.addEventListener('ended', () => {
    if(currentSong == playlistLength){
        currentSong = 0;
        loadSong(currentSong);
    }else{
        ++currentSong;
        loadSong(currentSong);
    }
});

// click event for setting the progress bar by clicking anywhere on progress bar
progressDiv.addEventListener('click', setProgress);

//function to set the volume (called in event listener below)
const setVolume = (e) => {
    const width = volumeDiv.clientWidth;
    const clickWidth = e.offsetX;

    const volume = (clickWidth/width);
    const barWidth = volume * 100;

    audio.volume = volume;
    volumeBar.style.width = `${barWidth}%`;
}

// click event to set the volume
volumeDiv.addEventListener('click', setVolume);