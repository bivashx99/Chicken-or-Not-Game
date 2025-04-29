// Game state variables
let currentLevel = 0;
let score = 0;
let gameData = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Sound effects
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');

    // Screens
    const startScreen = document.getElementById('start-screen');
    const playScreen = document.getElementById('play-screen');
    const resultScreen = document.getElementById('result-screen');
    const endScreen = document.getElementById('end-screen');

    // Game info elements
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const finalScoreElement = document.getElementById('final-score');
    const rankElement = document.getElementById('rank');
    const svgContainer = document.getElementById('svg-container');
    const fullImageContainer = document.getElementById('full-image-container');

    console.log("Checking SVG_IMAGES availability:", typeof SVG_IMAGES !== 'undefined');
    
    // Fallback SVG in case something goes wrong
    const fallbackSVG = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#ffcc80"/>
        <text x="150" y="150" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">Image Not Available</text>
    </svg>`;

    // Game data - array of levels
    const gameLevels = [
        {
            zoomedImage: SVG_IMAGES.chicken1_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.chicken1_full || fallbackSVG,
            isChicken: true,
            description: "This is a chicken!"
        },
        {
            zoomedImage: SVG_IMAGES.not_chicken1_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.not_chicken1_full || fallbackSVG,
            isChicken: false,
            description: "This is not a chicken, it's a squirrel!"
        },
        {
            zoomedImage: SVG_IMAGES.chicken2_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.chicken2_full || fallbackSVG,
            isChicken: true,
            description: "This is a chicken!"
        },
        {
            zoomedImage: SVG_IMAGES.not_chicken2_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.not_chicken2_full || fallbackSVG,
            isChicken: false,
            description: "This is not a chicken, it's an apple!"
        },
        {
            zoomedImage: SVG_IMAGES.chicken3_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.chicken3_full || fallbackSVG,
            isChicken: true,
            description: "This is a chicken!"
        },
        {
            zoomedImage: SVG_IMAGES.not_chicken3_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.not_chicken3_full || fallbackSVG,
            isChicken: false,
            description: "This is not a chicken, it's an orange!"
        },
        {
            zoomedImage: SVG_IMAGES.chicken4_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.chicken4_full || fallbackSVG,
            isChicken: true,
            description: "This is a chicken!"
        },
        {
            zoomedImage: SVG_IMAGES.not_chicken4_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.not_chicken4_full || fallbackSVG,
            isChicken: false,
            description: "This is not a chicken, it's a snowflake!"
        },
        {
            zoomedImage: SVG_IMAGES.chicken5_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.chicken5_full || fallbackSVG,
            isChicken: true,
            description: "This is a chicken!"
        },
        {
            zoomedImage: SVG_IMAGES.not_chicken5_zoomed || fallbackSVG,
            fullImage: SVG_IMAGES.not_chicken5_full || fallbackSVG,
            isChicken: false,
            description: "This is not a chicken, it's a lemon!"
        }
    ];

    // Check if all DOM elements are found
    console.log("DOM Elements loaded:", 
        !!startScreen && !!playScreen && !!resultScreen && !!endScreen &&
        !!scoreElement && !!levelElement && !!finalScoreElement && !!rankElement &&
        !!svgContainer && !!fullImageContainer
    );

    // Event listeners for buttons
    document.getElementById('start-button').addEventListener('click', function() {
        console.log("Start button clicked");
        startGame();
    });

    document.getElementById('chicken-button').addEventListener('click', function() {
        console.log("Chicken button clicked");
        makeGuess(true);
    });

    document.getElementById('not-chicken-button').addEventListener('click', function() {
        console.log("Not Chicken button clicked");
        makeGuess(false);
    });

    document.getElementById('next-button').addEventListener('click', function() {
        console.log("Next button clicked");
        nextLevel();
    });

    document.getElementById('play-again-button').addEventListener('click', function() {
        console.log("Play Again button clicked");
        resetGame();
    });

    // Function to set SVG content in container
    function setSVG(container, svgContent) {
        console.log("Setting SVG content");
        if (container && svgContent) {
            container.innerHTML = svgContent;
        } else {
            console.error("Container or SVG content missing", {container, svgContentLength: svgContent?.length});
            if (container) container.innerHTML = fallbackSVG;
        }
    }

    // Start the game
    function startGame() {
        console.log("Starting game");
        // Shuffle game data to randomize order
        gameData = shuffleArray([...gameLevels]);
        currentLevel = 0;
        score = 0;
        scoreElement.textContent = score;
        levelElement.textContent = currentLevel + 1;
        loadCurrentImage();
        showScreen(playScreen);
    }

    // Load current image
    function loadCurrentImage() {
        console.log("Loading image for level", currentLevel + 1);
        if (currentLevel < gameData.length) {
            setSVG(svgContainer, gameData[currentLevel].zoomedImage);
        }
    }

    // Handle player guess
    function makeGuess(isChickenGuess) {
        console.log("Player guessed:", isChickenGuess ? "Chicken" : "Not Chicken");
        const currentData = gameData[currentLevel];
        const isCorrect = isChickenGuess === currentData.isChicken;
        
        // Show result
        document.getElementById('result-message').textContent = 
            isCorrect ? "Correct!" : "Wrong!";
        document.getElementById('description').textContent = currentData.description;
        
        // Show full image
        setSVG(fullImageContainer, currentData.fullImage);
        
        // Update score
        if (isCorrect) {
            score++;
            scoreElement.textContent = score;
            try {
                correctSound.play();
            } catch (e) {
                console.warn("Could not play sound", e);
            }
        } else {
            try {
                wrongSound.play();
            } catch (e) {
                console.warn("Could not play sound", e);
            }
        }
        
        showScreen(resultScreen);
    }

    // Progress to next level
    function nextLevel() {
        console.log("Moving to next level");
        currentLevel++;
        
        // Check if game is over
        if (currentLevel >= gameData.length) {
            endGame();
            return;
        }
        
        // Update level and load next image
        levelElement.textContent = currentLevel + 1;
        loadCurrentImage();
        showScreen(playScreen);
    }

    // End the game and show final score
    function endGame() {
        console.log("Game ended, final score:", score);
        finalScoreElement.textContent = score;
        const rank = getChickenRank(score);
        rankElement.textContent = rank;
        showScreen(endScreen);
    }

    // Reset the game to start again
    function resetGame() {
        console.log("Resetting game");
        startGame();
    }

    // Helper function to show a specific screen and hide others
    function showScreen(screenToShow) {
        console.log("Showing screen:", screenToShow.id);
        [startScreen, playScreen, resultScreen, endScreen].forEach(screen => {
            screen.style.display = 'none';
        });
        screenToShow.style.display = 'block';
    }

    // Determine rank based on score
    function getChickenRank(score) {
        const totalLevels = gameLevels.length;
        const percentage = (score / totalLevels) * 100;
        
        if (percentage === 100) return "Chicken Master!";
        if (percentage >= 80) return "Chicken Expert";
        if (percentage >= 60) return "Chicken Enthusiast";
        if (percentage >= 40) return "Chicken Apprentice";
        if (percentage >= 20) return "Chicken Novice";
        return "Chicken Confused";
    }

    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Initialize the game
    console.log("Game initialized, showing start screen");
    showScreen(startScreen);
}); 