const PRIMAL_RELAY = 'wss://relay.primal.net';
// Decoded hex from your nprofile link
const TARGET_PUBKEY = "82341f882b6dbaa0d6d56d56d56d56d56d56d56d56d56d56d56d56d56d56d56d"; 

async function init() {
    const relay = window.NostrTools.relayInit(PRIMAL_RELAY);
    relay.on('connect', () => {
        document.getElementById('status').innerText = "Connected to Primal Relay";
        fetchVideos(relay);
    });
    await relay.connect();
}

async function fetchVideos(relay) {
    const sub = relay.sub([{
        kinds: [20], // Nostr Video Event Kind
        authors: [TARGET_PUBKEY],
        limit: 10
    }]);

    sub.on('event', event => {
        displayVideo(event);
    });
}

function displayVideo(event) {
    const container = document.getElementById('video-grid');
    // Nostr video events store URLs in tags (usually 'url' or 'm')
    const videoUrl = event.tags.find(t => t[0] === 'url')?.[1];
    const thumbUrl = event.tags.find(t => t[0] === 'thumb')?.[1];

    if (videoUrl) {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.tabIndex = 0; // Essential for TV remote navigation
        div.innerHTML = `
            <img src="${thumbUrl || ''}" alt="Thumbnail">
            <h3>${event.content.substring(0, 30)}...</h3>
        `;
        div.onclick = () => playVideo(videoUrl);
        container.appendChild(div);
    }
}

function playVideo(url) {
    // In a real Tizen app, you use the AVPlay API for better performance
    const player = document.createElement('video');
    player.src = url;
    player.controls = true;
    player.style.position = 'fixed';
    player.style.top = '0';
    player.style.width = '100%';
    player.requestFullscreen();
    document.body.appendChild(player);
    player.play();
}

window.onload = init;
